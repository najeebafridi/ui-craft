// Build the immersive-web starter: one self-contained page at skills/immersive-web/assets/starter.html.
// It inlines the ui-craft base tokens, theme-bridge.js and scene-shell.js, so the starter opens by double-click
// and always matches the assets the skill ships. Run after changing any of them:   node tools/build-immersive.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");
const inline = (src) => src.replace(/^export\s+(?=(const|function|let|class)\b)/gm, "").replace(/^\/\/.*\n/gm, "");   // drop exports and the file-header comments

const tokens = read("skills/ui-craft/assets/tokens.css").replace(/^\/\*[\s\S]*?\*\/\n/, "");
let html = read("tools/immersive/starter.template.html");
const put = (marker, value) => { if (!html.includes(marker)) throw new Error("marker missing: " + marker); html = html.split(marker).join(value); };
put("/*__TOKENS__*/", tokens.trim());
put("//__BRIDGE__", "// ---------------- theme-bridge.js (inlined) ----------------\n" + inline(read("skills/immersive-web/assets/theme-bridge.js")).trim());
put("//__SHELL__", "// ---------------- scene-shell.js (inlined) ----------------\n" + inline(read("skills/immersive-web/assets/scene-shell.js")).trim());
if (/<\/script/i.test(html.slice(html.indexOf('<script type="module">') + 22, html.lastIndexOf("</script>")))) throw new Error("inlined code would close the script tag");

writeFileSync(join(ROOT, "skills/immersive-web/assets/starter.html"), html);
console.log(`Built skills/immersive-web/assets/starter.html (${Math.round(html.length / 1024)} KB)`);
