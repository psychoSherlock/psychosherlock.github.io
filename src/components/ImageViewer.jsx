import React, { useState, useEffect, useRef } from "react";
import "./ImageViewer.css";
import {
  FaSearchPlus,
  FaSearchMinus,
  FaCompress,
  FaDownload,
  FaArrowLeft,
  FaArrowRight,
  FaUndo,
  FaTimes,
} from "react-icons/fa";
import { useImageViewer } from "../context/ImageViewerContext";

const ImageViewer = ({ image, siblings = [], onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(true); // Default to maximized/fullscreen feel
  const [isClosing, setIsClosing] = useState(false);
  
  const { openImageViewer } = useImageViewer();
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Reset state when image changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  }, [image]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") handleClose();
      if (event.key === "ArrowRight") handleNext();
      if (event.key === "ArrowLeft") handlePrev();
      if (event.key === "+" || event.key === "=") handleZoomIn();
      if (event.key === "-" || event.key === "_") handleZoomOut();
      if (event.key === "0") handleReset();
      if (event.key.toLowerCase() === "r") handleRotate();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [image, siblings, scale, rotation]); // Re-bind when deps change

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 250); // Match CSS animation duration
  };

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.5, 4));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.5, 0.5));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  const handleNext = () => {
    if (siblings.length <= 1) return;
    const currentIndex = siblings.indexOf(image);
    const nextIndex = (currentIndex + 1) % siblings.length;
    openImageViewer(siblings[nextIndex], siblings);
  };

  const handlePrev = () => {
    if (siblings.length <= 1) return;
    const currentIndex = siblings.indexOf(image);
    const prevIndex = (currentIndex - 1 + siblings.length) % siblings.length;
    openImageViewer(siblings[prevIndex], siblings);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      if (e.deltaY < 0) handleZoomIn();
      else handleZoomOut();
    }
  };

  const onMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const onMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const onMouseUp = () => setIsDragging(false);

  const getImageName = () => {
    if (!image) return "Image";
    try {
      // Decode URL to handle %20 etc, then get basename
      const decoded = decodeURIComponent(image);
      return decoded.split("/").pop().split("?")[0];
    } catch (e) {
      return "Image";
    }
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = image;
    link.download = getImageName();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentIndex = siblings.indexOf(image);
  const statusText =
    siblings.length > 0
      ? `${currentIndex + 1} / ${siblings.length}`
      : "";

  return (
    <div 
      className={`image-viewer-overlay ${isClosing ? "clothing" : ""}`}
      onWheel={handleWheel}
    >
      <div className="image-viewer-toolbar">
        <div className="toolbar-group">
          <span className="file-name">{getImageName()}</span>
          <span className="file-counter">{statusText}</span>
        </div>
        
        <div className="toolbar-group controls">
          <button onClick={handleZoomOut} title="Zoom Out (-)">
            <FaSearchMinus />
          </button>
          <span className="zoom-level">{Math.round(scale * 100)}%</span>
          <button onClick={handleZoomIn} title="Zoom In (+)">
            <FaSearchPlus />
          </button>
          <button onClick={handleReset} title="Reset (0)">
            <FaCompress />
          </button>
          <button onClick={handleRotate} title="Rotate (R)">
            <FaUndo />
          </button>
        </div>

        <div className="toolbar-group actions">
          <button onClick={downloadImage} title="Download">
            <FaDownload />
          </button>
          <button className="close-btn" onClick={handleClose} title="Close (Esc)">
            <FaTimes />
          </button>
        </div>
      </div>

      <div
        className="image-viewer-content"
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{ cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
      >
        <img
          ref={imageRef}
          src={image}
          alt="Preview"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
          draggable={false}
        />
      </div>

      {siblings.length > 1 && (
        <>
          <button className="nav-btn prev" onClick={handlePrev} title="Previous">
            <FaArrowLeft />
          </button>
          <button className="nav-btn next" onClick={handleNext} title="Next">
            <FaArrowRight />
          </button>
        </>
      )}
    </div>
  );
};

export default ImageViewer;
