import React, { useState, useEffect } from "react";
import "./PDFViewer.css";
import { FaFileDownload } from "react-icons/fa";

const PDFViewer = ({ pdf, onClose }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    // If pdf is a string URL, use it directly
    if (typeof pdf === "string") {
      setPdfUrl(pdf);
    } else if (pdf && pdf instanceof Blob) {
      // If it's a blob, create an object URL
      setPdfUrl(URL.createObjectURL(pdf));
    }

    // Clean up URL on component unmount
    return () => {
      if (pdfUrl && pdfUrl.startsWith("blob:")) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdf]);

  // Handle keyboard events (Esc to close)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleMinimize = () => {
    setIsMinimized(true);
    // Simulate minimize effect
    setTimeout(() => {
      setIsMinimized(false);
      onClose();
    }, 300);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleDownload = () => {
    // Open PDF in a new tab
    window.open(pdfUrl, "_blank");
  };

  const getPdfName = () => {
    if (!pdf) return "PDF Viewer";
    if (typeof pdf === "string") {
      return pdf.split("/").pop();
    }
    return "Document.pdf";
  };

  return (
    <div className={`pdf-viewer-overlay ${isMinimized ? "minimizing" : ""}`}>
      <div className={`pdf-viewer ${isMaximized ? "maximized" : ""}`}>
        <div className="pdf-viewer-titlebar">
          <div className="window-title">{getPdfName()}</div>
          <div className="window-controls">
            <button
              className="window-button minimize"
              onClick={handleMinimize}
              title="Minimize"
            >
              ─
            </button>
            <button
              className="window-button maximize"
              onClick={handleMaximize}
              title={isMaximized ? "Restore" : "Maximize"}
            >
              □
            </button>
            <button
              className="window-button close"
              onClick={onClose}
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="pdf-viewer-content">
          {pdfUrl ? (
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0`}
              title="PDF Viewer"
              className="pdf-iframe"
            />
          ) : (
            <div className="pdf-loading">Loading PDF...</div>
          )}
        </div>
        <div className="pdf-viewer-statusbar">
          <div className="status-info">{getPdfName()}</div>
          <button
            className="pdf-download-button"
            onClick={handleDownload}
            title="Open in new tab"
          >
            <FaFileDownload /> Open in new tab
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
