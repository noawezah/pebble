// Vectorize the supplied brand artwork. No new mark is drawn or generated.
const sharp = require("sharp");
const fs = require("node:fs");
async function main() {
  const width = 250,
    height = 312;
  const pixels = await sharp("public/images/pebble-logo.png")
    .extract({ left: 300, top: 195, width, height })
    .greyscale()
    .raw()
    .toBuffer();
  const black = (x, y) =>
    x >= 0 && y >= 0 && x < width && y < height && pixels[y * width + x] < 90;
  const edges = new Map();
  const add = (x, y, a, b) => {
    const key = `${x},${y}`;
    const es = edges.get(key) || [];
    es.push([a, b]);
    edges.set(key, es);
  };
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
      if (black(x, y)) {
        if (!black(x, y - 1)) add(x, y, x + 1, y);
        if (!black(x + 1, y)) add(x + 1, y, x + 1, y + 1);
        if (!black(x, y + 1)) add(x + 1, y + 1, x, y + 1);
        if (!black(x - 1, y)) add(x, y + 1, x, y);
      }
  const paths = [];
  while (edges.size) {
    const start = edges.keys().next().value;
    let key = start;
    const points = [];
    do {
      points.push(key.split(",").map(Number));
      const es = edges.get(key);
      if (!es) break;
      const p = es.pop();
      if (!es.length) edges.delete(key);
      key = p.join(",");
    } while (key !== start);
    if (points.length < 20) continue;
    const reduced = points.filter((p, i) => {
      const a = points[(i + points.length - 1) % points.length],
        b = points[(i + 1) % points.length];
      return (p[0] - a[0]) * (b[1] - p[1]) !== (p[1] - a[1]) * (b[0] - p[0]);
    });
    paths.push("M" + reduced.map((p) => p.join(" ")).join("L") + "Z");
  }
  fs.writeFileSync(
    "public/images/snail.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path fill="#292929" fill-rule="evenodd" d="${paths.join("")}"/></svg>`,
  );
  console.log(`Traced ${paths.length} contours from supplied PEBBLE logo.`);
}
main();
