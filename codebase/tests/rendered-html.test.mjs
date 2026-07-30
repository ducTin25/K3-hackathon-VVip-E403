import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import test from "node:test";

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

function env() {
  return {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  };
}

function context() {
  return { waitUntil() {}, passThroughOnException() {} };
}

test("renders the VLearn MVP shell", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    env(),
    context(),
  );
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.match(await response.text(), /VLearn Knowledge Pulse/i);
});

test("returns the approved lesson catalog without source text", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/api/lesson"),
    env(),
    context(),
  );
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.ok, true);
  assert.equal(payload.catalog.lesson.lessonId, "DAY03");
  assert.equal(payload.catalog.lesson.totalSlides, 78);
  assert.equal(payload.catalog.chapters.length, 12);
  assert.equal(payload.catalog.slides.length, 78);
  assert.equal(
    payload.catalog.slides.filter(
      (slide) => slide.quizEligible && slide.reviewStatus === "approved",
    ).length,
    49,
  );
  assert.equal(
    payload.catalog.pdfPath,
    "/slides/day03-tu-chatbot-den-agentic-agent-react-v7.pdf",
  );
  assert.equal("sourceText" in payload.catalog.slides[0], false);
  assert.equal("rawText" in payload.catalog.slides[0], false);

  const shiftedSlide = payload.catalog.slides.find(
    (slide) => slide.slideId === "DAY03-S007",
  );
  assert.equal(shiftedSlide.displaySlideNumber, "5");
  assert.equal(shiftedSlide.pdfPage, 7);
});

test("packages the approved Day 03 PDF as a public asset", async () => {
  const pdf = await stat(
    new URL(
      "../public/slides/day03-tu-chatbot-den-agentic-agent-react-v7.pdf",
      import.meta.url,
    ),
  );
  assert.ok(pdf.isFile());
  assert.ok(pdf.size > 1_000_000);
});
