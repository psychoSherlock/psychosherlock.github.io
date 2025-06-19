import React, { useState, useRef, useEffect, createContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Desktop.css";
import wallpaper from "../assets/images/arthur-wallpapper.jpg";
import FileManager from "../components/FileManager";

// Context for window management
export const DesktopContext = createContext(null);

// Window component that handles common window behaviors
const Window = ({
  id,
  title,
  initialPosition,
  initialSize,
  children,
  onFocus,
  onClose,
  isActive,
  zIndex,
}) => {
  const [position, setPosition] = useState(
    initialPosition || { x: 100, y: 100 }
  );
  const [size, setSize] = useState(initialSize || { width: 400, height: 300 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [previousPosition, setPreviousPosition] = useState(null);
  const [previousSize, setPreviousSize] = useState(null);
  const [dragConstraints, setDragConstraints] = useState({});
  const windowRef = useRef(null);
  const dragHandleRef = useRef(null);

  // Handle window maximize/restore
  const toggleMaximize = () => {
    if (!isMaximized) {
      // Save current position and size before maximizing
      setPreviousPosition({ ...position });
      setPreviousSize({ ...size });
      setIsMaximized(true);
    } else {
      setIsMaximized(false);
      // Restore previous position and size if available
      if (previousPosition) setPosition(previousPosition);
      if (previousSize) setSize(previousSize);
    }
  };

  // Handle window minimize
  const minimize = () => {
    setIsMinimized(true);
  };

  // Restore from minimized state
  const restore = () => {
    setIsMinimized(false);
  };

  useEffect(() => {
    // Set drag constraints to desktop bounds
    const updateConstraints = () => {
      if (windowRef.current && !isMaximized) {
        const desktop = windowRef.current.parentElement;
        if (desktop) {
          setDragConstraints({
            left: 0,
            right: desktop.offsetWidth - windowRef.current.offsetWidth,
            top: 0,
            bottom: desktop.offsetHeight - windowRef.current.offsetHeight,
          });
        }
      }
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, [isMaximized]);

  // Enhanced dragging functionality
  const onDragStart = () => {
    if (!isMaximized) {
      setIsDragging(true);
      onFocus(id);
    }
  };

  const onDragEnd = () => {
    setIsDragging(false);
  };

  // Animation variants for minimize/maximize
  const windowVariants = {
    maximized: {
      x: 0,
      y: 0,
      width: "100%",
      height: "100%",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    normal: {
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    minimized: {
      y: window.innerHeight,
      opacity: 0,
      scale: 0.5,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  // If window is minimized, render with minimized animation
  if (isMinimized) {
    return (
      <motion.div
        initial="normal"
        animate="minimized"
        variants={windowVariants}
        className="window"
        style={{ zIndex }}
      />
    );
  }

  return (
    <motion.div
      ref={windowRef}
      className={`window ${isActive ? "active" : ""} ${
        isMaximized ? "maximized" : ""
      }`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isMaximized ? "maximized" : "normal"}
      variants={windowVariants}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        zIndex,
        backgroundColor: "rgba(30, 30, 30, 0.95)",
        border: "1px solid #444",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        position: "absolute",
      }}
      onMouseDown={() => onFocus(id)}
      drag={!isMaximized}
      dragConstraints={dragConstraints}
      dragElastic={0}
      dragMomentum={false}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      dragListener={false}
      dragControls={null}
    >
      <motion.div
        className="window-titlebar"
        ref={dragHandleRef}
        onDoubleClick={toggleMaximize}
        onPointerDown={(e) => {
          // Only enable dragging from titlebar
          e.stopPropagation();
          if (!isMaximized) {
            const currentTarget = e.currentTarget;
            const windowElement = windowRef.current;

            const startPoint = { x: e.clientX, y: e.clientY };
            const startPosition = { ...position };

            const onPointerMove = (moveEvent) => {
              if (isMaximized) return;

              const delta = {
                x: moveEvent.clientX - startPoint.x,
                y: moveEvent.clientY - startPoint.y,
              };

              let newX = startPosition.x + delta.x;
              let newY = startPosition.y + delta.y;

              // Apply constraints if needed
              if (dragConstraints) {
                if (newX < dragConstraints.left) newX = dragConstraints.left;
                if (newX > dragConstraints.right) newX = dragConstraints.right;
                if (newY < dragConstraints.top) newY = dragConstraints.top;
                if (newY > dragConstraints.bottom)
                  newY = dragConstraints.bottom;
              }

              setPosition({ x: newX, y: newY });
            };

            const onPointerUp = () => {
              document.removeEventListener("pointermove", onPointerMove);
              document.removeEventListener("pointerup", onPointerUp);
              setIsDragging(false);
            };

            document.addEventListener("pointermove", onPointerMove);
            document.addEventListener("pointerup", onPointerUp);
            setIsDragging(true);
            onFocus(id);
          }
        }}
      >
        <div className="window-title">{title}</div>
        <div className="window-controls">
          <button className="window-control minimize" onClick={minimize}>
            −
          </button>
          <button className="window-control maximize" onClick={toggleMaximize}>
            {isMaximized ? "❐" : "□"}
          </button>
          <button className="window-control close" onClick={() => onClose(id)}>
            ×
          </button>
        </div>
      </motion.div>
      <div
        className="window-content"
        style={{
          overflow: "auto",
          height: "calc(100% - 30px)",
        }}
      >
        {children}
      </div>
      {!isMaximized && <div className="window-resize-handle" />}
    </motion.div>
  );
};

// Main Desktop component
export default function Desktop() {
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [highestZIndex, setHighestZIndex] = useState(100);
  const desktopRef = useRef(null);
  const windowIdRef = useRef(0);

  // Open file manager function
  const openFileManager = () => {
    const id = createWindow({
      title: "File Manager",
      component: <FileManager />,
      position: { x: 50, y: 50 },
      size: { width: 800, height: 500 },
    });
    return id;
  };

  // Create a new window
  const createWindow = (config) => {
    try {
      // Use a ref to generate unique IDs that won't conflict
      const windowId = `window-${Date.now()}-${windowIdRef.current}`;
      windowIdRef.current += 1;

      const newWindow = {
        id: windowId,
        title: config.title || "New Window",
        component: config.component,
        position: config.position || { x: 50, y: 50 },
        size: config.size || { width: 400, height: 300 },
        zIndex: highestZIndex + 1,
      };

      // Use function form to ensure we're working with the latest state
      setWindows((prevWindows) => {
        return [...prevWindows, newWindow];
      });

      setActiveWindowId(windowId);
      setHighestZIndex((prevZ) => prevZ + 1);

      return windowId;
    } catch (error) {
      console.error("Error creating window:", error);
      return null;
    }
  };

  // Close a window
  const closeWindow = (id) => {
    setWindows((prevWindows) => prevWindows.filter((w) => w.id !== id));

    if (activeWindowId === id) {
      // Set the highest z-index window as active
      const remainingWindows = windows.filter((w) => w.id !== id);
      if (remainingWindows.length > 0) {
        const highestWindow = remainingWindows.reduce((prev, current) =>
          prev.zIndex > current.zIndex ? prev : current
        );
        setActiveWindowId(highestWindow.id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  // Focus a window (bring to front)
  const focusWindow = (id) => {
    if (id === activeWindowId) return;

    const newZIndex = highestZIndex + 1;
    setWindows(
      windows.map((w) => (w.id === id ? { ...w, zIndex: newZIndex } : w))
    );
    setActiveWindowId(id);
    setHighestZIndex(newZIndex);
  };

  // Create only file manager on startup
  useEffect(() => {
    // Reset all state on mount
    setWindows([]);
    setActiveWindowId(null);
    setHighestZIndex(100);
    windowIdRef.current = 0;

    // Create only file manager window
    openFileManager();

    return () => {
      // Clean up logic if needed
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle icon click
  const handleFileManagerIconClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openFileManager();
  };

  return (
    <DesktopContext.Provider
      value={{ createWindow, closeWindow, focusWindow, openFileManager }}
    >
      <div className="desktop" ref={desktopRef}>
        {/* Desktop background */}
        <div
          className="desktop-background"
          style={{
            backgroundImage: `url(${wallpaper})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>

        {/* Desktop icons */}
        <div className="desktop-icons">
          <div className="desktop-icon" onClick={handleFileManagerIconClick}>
            <div className="icon-image">📁</div>
            <div className="icon-text">Files</div>
          </div>
        </div>

        {/* Windows */}
        <div className="windows-container">
          <AnimatePresence>
            {windows.map((window) => (
              <Window
                key={window.id}
                id={window.id}
                title={window.title}
                initialPosition={window.position}
                initialSize={window.size}
                isActive={window.id === activeWindowId}
                zIndex={window.zIndex}
                onFocus={focusWindow}
                onClose={closeWindow}
              >
                {window.component}
              </Window>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </DesktopContext.Provider>
  );
}
