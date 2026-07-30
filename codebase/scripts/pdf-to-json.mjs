// Bước 1 (Node, script này): text từng trang + phát hiện trang có ảnh/diagram
// nhúng — cả hai đều deterministic, không AI, không render ảnh (đã thử dùng
// @napi-rs/canvas render trong Node -> CRASH cấp OS trên Windows do xung đột font
// nhúng trong PDF, xem ghi chú cuối file). KHÔNG cố render ảnh ở đây nữa.
//
// Bước 2 (trình duyệt, pdf-to-json.html): với các trang hasEmbeddedImage=true,
// mở output.json này trong pdf-to-json.html, tool sẽ tự render + hỏi Gemini cho
// đúng các trang đó (browser Canvas ổn định, không crash như Node).
//
// Chạy: node scripts/pdf-to-json.mjs <input.pdf> [output.json]
import { readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";

const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
const { OPS } = pdfjsLib;

const inputPath = process.argv[2];
const outputPath = process.argv[3] || "scripts/slide-data/output.json";
if (!inputPath) {
  console.error("Usage: node scripts/pdf-to-json.mjs <input.pdf> [output.json]");
  process.exit(1);
}

const data = new Uint8Array(await readFile(inputPath));
const doc = await pdfjsLib.getDocument({ data, useSystemFonts: true }).promise;

const IMAGE_OPS = new Set([OPS.paintImageXObject, OPS.paintInlineImageXObject, OPS.paintImageMaskXObject]);

async function pageHasEmbeddedImage(page) {
  const opList = await page.getOperatorList();
  return opList.fnArray.some((fn) => IMAGE_OPS.has(fn));
}

const pages = [];
for (let i = 1; i <= doc.numPages; i++) {
  const page = await doc.getPage(i);
  const textContent = await page.getTextContent();

  let content = "";
  for (const item of textContent.items) {
    content += item.str;
    content += item.hasEOL ? "\n" : " ";
  }
  content = content.replace(/[ \t]+/g, " ").replace(/\n{2,}/g, "\n").trim();

  const hasImage = await pageHasEmbeddedImage(page);

  pages.push({
    id: `P${String(i).padStart(2, "0")}`,
    page: i,
    content,
    charCount: content.length,
    hasTextLayer: content.length > 0,
    hasEmbeddedImage: hasImage,
    contentSource: content.length > 0 ? "text-layer" : "empty", // trình duyệt sẽ update lại field này nếu chạy vision
  });
}

// Phát hiện đầu chương KHÔNG dùng LLM — CHỈ khớp được các mẫu đã quan sát thấy
// thật trong slide của khoá này. KHÔNG tổng quát cho "mọi PDF bất kỳ" — deck nào
// không khớp mẫu nào dưới đây thì trả chapters rỗng, không tự bịa ranh giới.
const CHAPTER_PATTERNS = [
  (line, next) => {
    const m = line.match(/^(\d{2})\s+(.{3,60}?)\s*$/);
    return m ? { chapterNo: m[1], title: m[2].trim() } : null;
  },
  (line, next) => {
    const compact = line.replace(/\s+/g, "");
    const m = compact.match(/^SECTION(\d{1,2})/i);
    return m && next ? { chapterNo: m[1].padStart(2, "0"), title: next.trim().slice(0, 60) } : null;
  },
];

const markers = [];
for (const p of pages) {
  const lines = p.content.split("\n");
  let found = null;
  for (let li = 0; li < Math.min(lines.length, 3) && !found; li++) {
    for (const pattern of CHAPTER_PATTERNS) {
      const m = pattern(lines[li] || "", lines[li + 1]);
      if (m) { found = m; break; }
    }
  }
  if (found) markers.push({ chapterNo: found.chapterNo, title: found.title, startPage: p.page });
}

const chapters = markers.map((m, i) => {
  const endPage = i + 1 < markers.length ? markers[i + 1].startPage - 1 : doc.numPages;
  const chapterPages = pages.filter((p) => p.page >= m.startPage && p.page <= endPage);
  return {
    chapterId: `C${m.chapterNo}`,
    title: m.title,
    startPage: m.startPage,
    endPage,
    pageIds: chapterPages.map((p) => p.id),
    content: chapterPages.map((p) => p.content).join("\n\n"),
    hasVisionContent: chapterPages.some((p) => p.contentSource === "text-layer+vision"),
  };
});

const result = {
  source: basename(inputPath),
  pageCount: doc.numPages,
  extractedAt: new Date().toISOString(),
  visionEnabled: false, // trình duyệt (pdf-to-json.html) sẽ đổi thành true nếu chạy bước Gemini
  chapterDetection: chapters.length > 0 ? "marker-regex" : "none",
  chapters,
  pages,
};

await writeFile(outputPath, JSON.stringify(result, null, 2), "utf8");

const emptyPages = pages.filter((p) => !p.hasTextLayer && !p.hasEmbeddedImage).length;
const imagePages = pages.filter((p) => p.hasEmbeddedImage).length;
console.log(`OK: ${doc.numPages} trang | ${imagePages} trang có ảnh/diagram (cần mở bằng pdf-to-json.html để đọc bằng Gemini) | ${emptyPages} trang trống hoàn toàn.`);
console.log(chapters.length > 0
  ? `Phát hiện ${chapters.length} chương: ${chapters.map((c) => c.chapterId + " " + c.title).join(" | ")}`
  : `Không phát hiện được mẫu đầu chương nào — "chapters" để rỗng, chỉ dùng được scope "cả bài".`);
console.log(`Đã ghi: ${outputPath}. Nếu có trang có ảnh, chạy tiếp bằng trình duyệt: mở pdf-to-json.html, chọn lại file PDF gốc, bật "Gemini vision".`);
