// Build the ui-craft Studio: one self-contained page at docs/index.html (served by GitHub Pages, also works by double-click).
// It inlines the palette engine, the direction data and the base tokens, so the Studio previews exactly what it exports.
// Run after changing the template, a direction, or the palette engine:   node tools/build-studio.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");
const stripExports = (src) => src.replace(/^export\s+(?=(const|function|let|class)\b)/gm, "").replace(/^export \*.*$/gm, "").replace(/^import .*$/gm, "");

const core = stripExports(read("skills/ui-craft/scripts/palette-core.mjs"));
const data = stripExports(read("tools/directions-data.mjs"));
const tokens = read("skills/ui-craft/assets/tokens.css");
const version = JSON.parse(read(".claude-plugin/plugin.json")).version;

// tokens.css = [comment] :root { colours ... /* ---- Type ---- */ extras } dark blocks /* ---- Base: rules
const extraStart = tokens.indexOf("  /* ---- Type ---- */");
const extraEnd = tokens.indexOf("}\n@media (prefers-color-scheme: dark)");
const rulesStart = tokens.indexOf("/* ---- Base:");
if (extraStart < 0 || extraEnd < 0 || rulesStart < 0) throw new Error("tokens.css layout changed: update build-studio.mjs markers");
const BASE_EXTRA = tokens.slice(extraStart, extraEnd);
const BASE_RULES = tokens.slice(rulesStart);

let html = read("tools/studio/template.html");
const put = (marker, value) => { if (!html.includes(marker)) throw new Error("marker missing: " + marker); html = html.split(marker).join(value); };
put("//__CORE__", core);          // split/join inserts text literally (no "$" replacement patterns)
put("//__DATA__", data);
put('"__BASE_EXTRA__"', JSON.stringify(BASE_EXTRA));
put('"__BASE_RULES__"', JSON.stringify(BASE_RULES));
put("__VERSION__", "v" + version);

mkdirSync(join(ROOT, "docs"), { recursive: true });
writeFileSync(join(ROOT, "docs/index.html"), html);
writeFileSync(join(ROOT, "docs/.nojekyll"), "");
console.log(`Built docs/index.html (${Math.round(html.length / 1024)} KB, v${version})`);
