/**
 * Generates favicon.ico (16/32/48) and apple-icon.png (180) from src/app/icon.svg.
 * Re-run after changing the logo:  pnpm icons
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const appDir = path.resolve(process.cwd(), "src/app");
const svg = readFileSync(path.join(appDir, "icon.svg"));

/**
 * Tiny sizes (16/32 px) get a simplified mark: bigger, bolder wrench and no accent dot,
 * so it stays legible in browser tabs.
 */
const smallSvg = Buffer.from(
  svg
    .toString()
    .replace(/<circle[^>]*\/>/, "")
    .replace('transform="translate(12 12) scale(1.6667)"', 'transform="translate(7 7) scale(2.0833)"')
    .replace('stroke-width="2.4"', 'stroke-width="3"'),
);

const png = (size: number) =>
  sharp(size <= 32 ? smallSvg : svg, { density: 384 })
    .resize(size, size)
    .png()
    .toBuffer();

/** Pack PNG images into an .ico container (PNG-in-ICO, supported by all modern browsers). */
function toIco(images: { size: number; data: Buffer }[]) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  const entries: Buffer[] = [];
  let offset = 6 + images.length * 16;
  for (const { size, data } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // color planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

async function main() {
  const sizes = [16, 32, 48];
  const images = await Promise.all(sizes.map(async (size) => ({ size, data: await png(size) })));
  writeFileSync(path.join(appDir, "favicon.ico"), toIco(images));

  // iOS applies its own rounded mask, so the touch icon is full-bleed (no transparent corners).
  const apple = await sharp(svg, { density: 384 })
    .resize(180, 180)
    .flatten({ background: "#1e4eac" })
    .png()
    .toBuffer();
  writeFileSync(path.join(appDir, "apple-icon.png"), apple);

  console.log("Wrote src/app/favicon.ico (16, 32, 48) and src/app/apple-icon.png (180)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
