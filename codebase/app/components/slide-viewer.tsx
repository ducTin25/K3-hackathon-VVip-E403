"use client";

import { useEffect, useRef, useState } from "react";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import type {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  RenderTask,
} from "pdfjs-dist";

type SlideViewerProps = {
  pdfPath: string;
  pageNumber: number;
  label: string;
};

export function SlideViewer({
  pdfPath,
  pageNumber,
  label,
}: SlideViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const documentRef = useRef<PDFDocumentProxy | null>(null);
  const loadingTaskRef = useRef<PDFDocumentLoadingTask | null>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [documentRevision, setDocumentRevision] = useState(0);
  const [renderedPage, setRenderedPage] = useState<number | null>(null);
  const [documentError, setDocumentError] = useState("");
  const [renderError, setRenderError] = useState<{
    pageNumber: number;
    message: string;
  } | null>(null);
  const status =
    documentError || renderError?.pageNumber === pageNumber
      ? "error"
      : renderedPage === pageNumber
        ? "ready"
        : "loading";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const updateWidth = () => setContainerWidth(container.clientWidth);
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;

    void import("pdfjs-dist").then((pdfjs) => {
      if (!active) return;
      pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
      const loadingTask = pdfjs.getDocument({ url: pdfPath });
      loadingTaskRef.current = loadingTask;
      return loadingTask.promise.then((document) => {
        if (!active) {
          void document.destroy();
          return;
        }
        documentRef.current = document;
        setDocumentRevision((revision) => revision + 1);
      });
    }).catch((cause) => {
      if (!active) return;
      setDocumentError(
        cause instanceof Error ? cause.message : "Không thể tải tài liệu slide",
      );
    });

    return () => {
      active = false;
      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;
      documentRef.current = null;
      void loadingTaskRef.current?.destroy();
      loadingTaskRef.current = null;
    };
  }, [pdfPath]);

  useEffect(() => {
    const document = documentRef.current;
    const canvas = canvasRef.current;
    if (!document || !canvas || containerWidth === 0) return;

    let active = true;
    renderTaskRef.current?.cancel();

    void document.getPage(pageNumber).then((page) => {
      if (!active) return;
      const baseViewport = page.getViewport({ scale: 1 });
      const availableWidth = Math.max(containerWidth - 32, 280);
      const cssScale = availableWidth / baseViewport.width;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = page.getViewport({ scale: cssScale * pixelRatio });

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${Math.floor(viewport.width / pixelRatio)}px`;
      canvas.style.height = `${Math.floor(viewport.height / pixelRatio)}px`;

      const renderTask = page.render({ canvas, viewport });
      renderTaskRef.current = renderTask;
      return renderTask.promise.then(() => {
        if (active) {
          setRenderedPage(pageNumber);
          setRenderError(null);
        }
      });
    }).catch((cause) => {
      if (!active || cause?.name === "RenderingCancelledException") return;
      setRenderError({
        pageNumber,
        message:
          cause instanceof Error ? cause.message : "Không thể hiển thị slide",
      });
    });

    return () => {
      active = false;
      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;
    };
  }, [containerWidth, documentRevision, pageNumber]);

  return (
    <div className="custom-slide-viewer" ref={containerRef}>
      {status === "loading" && (
        <div className="slide-viewer-status" role="status">
          Đang tải slide…
        </div>
      )}
      {status === "error" && (
        <div className="slide-viewer-error" role="alert">
          <b>Không thể hiển thị slide.</b>
          <span>{documentError || renderError?.message}</span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        aria-label={label}
        className={status === "ready" ? "ready" : ""}
      />
    </div>
  );
}
