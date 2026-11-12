"""Build AGENTS.md (for Codex, Cursor, Gemini CLI, Copilot, etc.) from skills/ui-craft/SKILL.md.
SKILL.md is the single source of truth. Run after every change to it:
    python tools/build-agents-md.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = ".agents/skills/ui-craft"  # shared skills folder read by Codex, Cursor, Gemini CLI, Copilot, Windsurf

skill = (ROOT / "skills/ui-craft/SKILL.md").read_text(encoding="utf-8")
body = re.sub(r"\A---.*?---\s*", "", skill, flags=re.S)          # drop frontmatter
body = re.sub(r"\A# ui-craft\s*", "", body)                         # drop title (re-added below)
body = re.sub(r"`(references|assets|scripts)/", rf"`{BASE}/\1/", body)  # point to the copied folder
body = body.replace("<skill-dir>/scripts/", f"{BASE}/scripts/")

header = f"""# UI design rules (ui-craft)

<!-- Generated from skills/ui-craft/SKILL.md by tools/build-agents-md.py. Edit SKILL.md, not this file. -->

Follow these rules whenever you design, build, restyle or review any user interface in this project:
pages, components, forms, tables, dashboards, charts, mobile screens, or quick HTML mockups for a client.

Detailed guides and templates live in `{BASE}/` (copy the `skills/ui-craft` folder from the ui-craft repo there).
Read a guide only when the task needs it; the table at the end says which.

"""
out = header + body.strip() + "\n"
(ROOT / "AGENTS.md").write_text(out, encoding="utf-8")
print(f"AGENTS.md written: {len(out.splitlines())} lines")
