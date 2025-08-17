import React, { useState, useEffect } from "react";
import "./ImageViewer.css";

const ImageViewer = ({ image, onClose }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

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

  const getImageName = () => {
    if (!image) return "Image Viewer";
    return image.split("/").pop();
  };

  return (
    <div className={`image-viewer-overlay ${isMinimized ? "minimizing" : ""}`}>
      <div className={`image-viewer ${isMaximized ? "maximized" : ""}`}>
        <div className="image-viewer-titlebar">
          <div className="window-title">{getImageName()}</div>
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
        <div className="image-viewer-content">
          <div className="image-container">
            <img src={image} alt={getImageName()} />
          </div>
        </div>
        <div className="image-viewer-statusbar">
          <div className="status-info">{getImageName()}</div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
