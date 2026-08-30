import { mkdir, readFile, writeFile } from "node:fs/promises";

const assets = [
  ["media/photo-1.jpg", "image/jpeg"],
  ["media/photo-2.jpg", "image/jpeg"],
  ["media/photo-3.jpg", "image/jpeg"],
  ["media/photo-4.jpg", "image/jpeg"],
  ["media/photo-5.jpg", "image/jpeg"],
  ["media/song.mp3", "audio/mpeg"]
];
let html = await readFile(new URL("./index.html", import.meta.url), "utf8");

for (const [asset, mimeType] of assets) {
  const file = await readFile(new URL(`./${asset}`, import.meta.url));
  const dataUrl = `data:${mimeType};base64,${file.toString("base64")}`;
  html = html.replaceAll(asset, dataUrl);
}

const worker = `const html = ${JSON.stringify(html)};

export default {
  async fetch() {
    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300"
      }
    });
  }
};
`;

await mkdir(new URL("./dist/server/", import.meta.url), { recursive: true });
await writeFile(new URL("./dist/server/index.js", import.meta.url), worker);
