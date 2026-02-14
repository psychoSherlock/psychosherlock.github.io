import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./PDFViewer.css";
import {
  FaSearchPlus,
  FaSearchMinus,
  FaExpand,
  FaCompress,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaFilePdf,
} from "react-icons/fa";

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PDFViewer = ({ pdf, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isMaximized, setIsMaximized] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
    // Handle PDF input (Blob or URL)
    if (pdf instanceof Blob) {
      const url = URL.createObjectURL(pdf);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPdfUrl(pdf);
    }
  }, [pdf]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setError(null);
  };

  const onDocumentLoadError = (err) => {
    console.error("PDF Load Error:", err);
    setError("Failed to load PDF document.");
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 250);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") changePage(-1);
      if (e.key === "ArrowRight") changePage(1);
      if (e.key === "+" || e.key === "=") setScale((s) => Math.min(s + 0.25, 3));
      if (e.key === "-" || e.key === "_") setScale((s) => Math.max(s - 0.25, 0.5));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pageNumber, numPages]);

  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => {
      const newPage = prevPageNumber + offset;
      return Math.max(1, Math.min(newPage, numPages || 1));
    });
  };

  const jumpToPage = (e) => {
    const page = parseInt(e.target.value);
    if (page >= 1 && page <= numPages) {
      setPageNumber(page);
    }
  };

  const getPdfName = () => {
    if (!pdf) return "Document";
    if (typeof pdf === "string") {
      try {
        return decodeURIComponent(pdf).split("/").pop();
      } catch {
        return "Document.pdf";
      }
    }
    return "Document.pdf";
  };

  const downloadPdf = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = getPdfName();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <div className={`pdf-viewer-overlay ${isClosing ? "clothing" : ""}`}>
      <div className={`pdf-viewer-window ${isMaximized ? "maximized" : ""}`}>
        {/* Toolbar */}
        <div className="pdf-toolbar">
          <div className="toolbar-left">
            <FaFilePdf className="pdf-icon" />
            <span className="file-name">{getPdfName()}</span>
          </div>

          <div className="toolbar-center">
            <button
              disabled={pageNumber <= 1}
              onClick={() => changePage(-1)}
              className="page-btn"
            >
              <FaChevronLeft />
            </button>
            <div className="page-input">
              <input
                type="number"
                min="1"
                max={numPages || 1}
                value={pageNumber}
                onChange={jumpToPage}
                onClick={(e) => e.target.select()}
              />
              <span>/ {numPages || "--"}</span>
            </div>
            <button
              disabled={pageNumber >= numPages}
              onClick={() => changePage(1)}
              className="page-btn"
            >
              <FaChevronRight />
            </button>
            <div className="divider" />
            <button onClick={() => setScale((s) => Math.max(s - 0.25, 0.5))}>
              <FaSearchMinus />
            </button>
            <span className="zoom-val">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale((s) => Math.min(s + 0.25, 3))}>
              <FaSearchPlus />
            </button>
          </div>

          <div className="toolbar-right">
            <button onClick={downloadPdf} title="Download">
              <FaDownload />
            </button>
            <button onClick={toggleMaximize} title="Maximize">
              {isMaximized ? <FaCompress /> : <FaExpand />}
            </button>
            <button onClick={handleClose} className="close-btn" title="Close">
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="pdf-content" ref={containerRef}>
          {pdfUrl && (
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div className="pdf-loading">Loading PDF...</div>}
              error={<div className="pdf-error">{error || "Error loading PDF"}</div>}
              className="pdf-document"
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderAnnotationLayer={true}
                renderTextLayer={true}
                className="pdf-page-shadow"
              />
            </Document>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
