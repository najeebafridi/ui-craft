"""Turn metrics.json (from check.mjs) + the HTML source into grading.json for each run.
Usage: python evals/tools/grade.py evals/iteration-N
Each assertion is checked against every HTML file in the run; it passes only if all files pass.
"""
import json, re, sys
from pathlib import Path

GENERAL = [
    ("Visible text meets WCAG AA contrast (at most 2 failing text elements per screen)",
     lambda m, h: all(v["contrastFails"] <= 2 for v in m.values()),
     lambda m, h: "; ".join(f'{w}: {v["contrastFails"]} fails {[s["ratio"] for s in v["contrastFailSamples"][:3]]}' for w, v in m.items())),
    ("Keyboard focus styles are defined (:focus or :focus-visible)",
     lambda m, h: m["desktop"]["hasFocusStyle"], lambda m, h: f'hasFocusStyle={m["desktop"]["hasFocusStyle"]}'),
    ("Smallest visible text is at least 12px",
     lambda m, h: min(v["minFontSize"] for v in m.values()) >= 12, lambda m, h: f'min={min(v["minFontSize"] for v in m.values())}px'),
    ("No sideways scrolling at 390px phone width",
     lambda m, h: not m["phone"]["horizontalOverflow"], lambda m, h: f'overflow={m["phone"]["horizontalOverflow"]}'),
    ("Uses at most 7 distinct font sizes on the desktop screen",
     lambda m, h: len(m["desktop"]["fontSizes"]) <= 7, lambda m, h: f'sizes={m["desktop"]["fontSizes"]}'),
    ("Every form control has an accessible label",
     lambda m, h: not m["desktop"]["unlabelledControls"], lambda m, h: f'unlabelled={m["desktop"]["unlabelledControls"]}'),
    ("At least 80% of spacing values sit on the 4px grid",
     lambda m, h: m["desktop"]["spacingOn4pxGrid"] >= 0.8, lambda m, h: f'on-grid={m["desktop"]["spacingOn4pxGrid"]}'),
    ("Respects prefers-reduced-motion (or has no motion at all)",
     lambda m, h: m["desktop"]["hasReducedMotion"] or not m["desktop"]["hasTransitionOrAnimation"],
     lambda m, h: f'reducedMotion={m["desktop"]["hasReducedMotion"]} motion={m["desktop"]["hasTransitionOrAnimation"]}'),
    ("No emoji icons, lorem ipsum or placeholder-image services",
     lambda m, h: all(v["emojiCount"] == 0 and not v["lorem"] and v["placeholderImages"] == 0 for v in m.values()),
     lambda m, h: f'emoji={m["desktop"]["emojiCount"]} lorem={m["desktop"]["lorem"]} placeholderImgs={m["desktop"]["placeholderImages"]}'),
    ("Touch targets at phone width are at least 44px (at most 2 exceptions)",
     lambda m, h: len(m["phone"]["targetsUnder44"]) <= 2, lambda m, h: f'{len(m["phone"]["targetsUnder44"])} small: {m["phone"]["targetsUnder44"][:6]}'),
]

SPECIFIC = {
    "ecommerce-dashboard": [
        ("KPI figures are given context (vs previous period or a target)",
         lambda m, h: bool(re.search(r"\bvs\.?\s|last (week|month|period)|previous|prior|target|goal", h, re.I)), lambda m, h: "regex on text"),
    ],
    "settings-form": [
        ("Email field uses type=email and password fields use current-password/new-password autocomplete",
         lambda m, h: 'type="email"' in h and "current-password" in h and "new-password" in h,
         lambda m, h: f'email={"type=\"email\"" in h} current={"current-password" in h} new={"new-password" in h}'),
    ],
    "mobile-booking": [
        ("Primary action is pinned to the bottom of the phone screen (fixed or sticky)",
         lambda m, h: bool(re.search(r"position:\s*(fixed|sticky)[^}]*bottom:|bottom:[^}]*position:\s*(fixed|sticky)", h)), lambda m, h: "regex on CSS"),
    ],
    "saas-landing-page": [
        ("No gradient text and no glassmorphism blur",
         lambda m, h: not re.search(r"background-clip:\s*text|backdrop-filter", h), lambda m, h: "regex on CSS"),
        ("No testimonials or customer quotes presented as real",
         lambda m, h: not re.search(r"testimonial|<blockquote", h, re.I), lambda m, h: "regex on HTML"),
    ],
    "luxury-hotel-booking": [
        ("Shows the total price for the whole stay before continuing",
         lambda m, h: bool(re.search(r"total", h, re.I)), lambda m, h: "regex on text"),
        ("No pressure tactics (fake scarcity, countdowns, 'only N left', 'hurry')",
         lambda m, h: not re.search(r"only \d+ (rooms? )?left|hurry|selling fast|countdown|\d+ people (are )?(viewing|looking)", h, re.I), lambda m, h: "regex on text"),
    ],
    "mac-writing-app": [
        ("Shows a daily word-count goal",
         lambda m, h: bool(re.search(r"goal", h, re.I)) and bool(re.search(r"words?", h, re.I)), lambda m, h: "regex on text"),
        ("Removes web habits from the app chrome (no text selection on chrome, or a window drag region)",
         lambda m, h: bool(re.search(r"user-select:\s*none|app-region:\s*drag", h)), lambda m, h: "regex on CSS"),
    ],
    "client-options-crm": [
        ("Delivers 2-3 design option files plus one page that shows them side by side",
         lambda m, h: 2 <= len([f for f in FILES if re.search(r"option", f, re.I) and not re.search(r"board|index|compare", f, re.I)]) <= 3 and bool(re.search(r"<iframe", h)),
         lambda m, h: f"files={FILES}"),
        ("Gives the client a built-in way to leave or copy feedback",
         lambda m, h: bool(re.search(r"<textarea|feedback|comment", h, re.I)), lambda m, h: "regex on HTML"),
    ],
}

FILES = []
for case in sorted(Path(sys.argv[1]).iterdir()):
    if not case.is_dir():
        continue
    for run in case.iterdir():
        mf = run / "metrics.json"
        if not mf.exists():
            continue
        metrics = json.loads(mf.read_text())
        FILES[:] = list(metrics)
        html = "\n".join((run / "outputs" / f).read_text(encoding="utf-8", errors="ignore") for f in metrics)
        results = []
        for text, check, ev in GENERAL + SPECIFIC.get(case.name, []):
            if text.startswith(("KPI", "Email", "Primary", "No gradient", "No testimonials", "Delivers", "Gives", "Shows", "No pressure", "Removes")):
                ok = check(None, html); evidence = ev(None, html)
            else:
                oks, evs = [], []
                for f, m in metrics.items():
                    oks.append(check(m, html)); evs.append(f"{f}: {ev(m, html)}")
                ok = all(oks); evidence = " | ".join(evs)
            results.append({"text": text, "passed": bool(ok), "evidence": evidence[:600]})
        audit = run / "audit.json"
        if audit.exists():
            pages = [p for p in json.loads(audit.read_text(encoding="utf-8"))["pages"] if "craft" in p]
            worst = max((len(p["craft"]) for p in pages), default=0)
            results.append({"text": "Looks finished: at most 2 craft problems per page (radii, shadows, heading tracking, hues, fonts, press states)",
                            "passed": worst <= 2, "evidence": " | ".join(f'{Path(p["target"]).name}: {len(p["craft"])} ({"; ".join(c.split(":")[0] for c in p["craft"][:4])})' for p in pages)[:600]})
        passed = sum(r["passed"] for r in results)
        (run / "grading.json").write_text(json.dumps({
            "expectations": results,
            "summary": {"passed": passed, "failed": len(results) - passed, "total": len(results), "pass_rate": round(passed / len(results), 3)},
        }, indent=2))
        print(f"{case.name:22} {run.name:14} {passed}/{len(results)}")
