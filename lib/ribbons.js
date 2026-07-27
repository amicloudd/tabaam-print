import fs from "fs";
import path from "path";

const FILENAME_RE = /^(\d+)\s+(.+)\.(jpe?g)$/i;

export function getRibbonColors() {
  const dir = path.join(process.cwd(), "public", "assets", "ribbons");
  const files = fs.readdirSync(dir);

  return files
    .map((filename) => {
      const m = filename.match(FILENAME_RE);
      if (!m) return null;
      const number = parseInt(m[1], 10);
      const rawName = m[2].trim();
      const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      return {
        id: "r" + number,
        number,
        name,
        src: "/assets/ribbons/" + encodeURIComponent(filename),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.number - b.number);
}
