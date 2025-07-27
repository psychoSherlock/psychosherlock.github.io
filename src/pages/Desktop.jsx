import React, { useState, useRef, useEffect, createContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Desktop.css";
import wallpaper from "../assets/images/arthur-wallpapper.jpg";
import FileManager from "../components/FileManager";
import DockEffect from "../components/DockEffect";

// Context for window management
export const DesktopContext = createContext(null);

// Dock component for macOS-like dock
const Dock = ({ activeWindows, onDockItemClick }) => {
  // Reference to keep track of which icon is currently jumping
  const jumpingIconRef = useRef(null);

  // Default dock items
  const dockItems = [
    { id: "finder", name: "File Manager", icon: "📁", action: "fileManager" },
    { id: "terminal", name: "Terminal", icon: "🖥️", action: "terminal" },
    { id: "browser", name: "Web Browser", icon: "🌐", action: "browser" },
    { id: "code", name: "Code Editor", icon: "📝", action: "code" },
    { id: "music", name: "Music Player", icon: "🎵", action: "music" },
    { id: "photos", name: "Photo Gallery", icon: "🖼️", action: "photos" },
    { id: "settings", name: "Settings", icon: "⚙️", action: "settings" },
  ];

  // Check if a window is active
  const isWindowActive = (action) => {
    return activeWindows.some((window) => window.appType === action);
  };

  // Handle dock item click with jump animation
  const handleDockItemClick = (item) => {
    // Set the jumping reference to animate the clicked item
    if (jumpingIconRef.current) {
      jumpingIconRef.current.classList.remove("jumping");
    }

    // Trigger the jump animation
    const iconElement = document.getElementById(`dock-item-${item.id}`);
    if (iconElement) {
      iconElement.classList.add("jumping");
      jumpingIconRef.current = iconElement;

      // Remove the jumping class after animation completes
      setTimeout(() => {
        if (iconElement) {
          iconElement.classList.remove("jumping");
        }
      }, 500);
    }

    // Call the provided click handler
    onDockItemClick(item);
  };

  return (
    <div className="dock-container">
      <div className="dock">
        {dockItems.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && index % 3 === 0 && <div className="dock-separator" />}
            <div
              id={`dock-item-${item.id}`}
              className={`dock-item ${
                isWindowActive(item.action) ? "active" : ""
              }`}
              onClick={() => handleDockItemClick(item)}
            >
              <div className="dock-item-icon">{item.icon}</div>
              <div className="dock-tooltip">{item.name}</div>
              <div className="dock-item-indicator"></div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Window component that handles common window behaviors
const Window = ({
  id,
  title,
  initialPosition,
  initialSize,
  children,
  onFocus,
  onClose,
  onMinimize,
  onRestore,
  isActive,
  zIndex,
  isMinimized,
}) => {
  const [position, setPosition] = useState(
    initialPosition || { x: 100, y: 100 }
  );
  const [size, setSize] = useState(initialSize || { width: 400, height: 300 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
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
    onMinimize(id);
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
      dragListener={true}
      dragPropagation={false}
    >
      <div
        className="window-titlebar"
        ref={dragHandleRef}
        onDoubleClick={toggleMaximize}
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
      </div>
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
  const [minimizedWindows, setMinimizedWindows] = useState([]); // Track minimized windows
  const desktopRef = useRef(null);
  const windowIdRef = useRef(0);

  // Open file manager function
  const openFileManager = () => {
    // Check if a file manager is already open
    const existingFileManager = windows.find(
      (w) => w.appType === "fileManager" && !minimizedWindows.includes(w.id)
    );

    if (existingFileManager) {
      // If already open and not minimized, just focus it
      focusWindow(existingFileManager.id);
      return existingFileManager.id;
    }

    // Check if there's a minimized file manager
    const minimizedFileManager = windows.find(
      (w) => w.appType === "fileManager" && minimizedWindows.includes(w.id)
    );

    if (minimizedFileManager) {
      // If minimized, restore it
      restoreWindow(minimizedFileManager.id);
      return minimizedFileManager.id;
    }

    // Otherwise create a new file manager
    const id = createWindow({
      title: "File Manager",
      component: <FileManager />,
      position: { x: 50, y: 50 },
      size: { width: 800, height: 500 },
      appType: "fileManager",
    });
    return id;
  };

  // Generic function to handle app opening with minimized window restoration
  const openApp = (appType, title, component, position, size) => {
    // Check if the app is already open and not minimized
    const existingApp = windows.find(
      (w) => w.appType === appType && !minimizedWindows.includes(w.id)
    );

    if (existingApp) {
      // If already open and not minimized, just focus it
      focusWindow(existingApp.id);
      return existingApp.id;
    }

    // Check if there's a minimized instance of this app
    const minimizedApp = windows.find(
      (w) => w.appType === appType && minimizedWindows.includes(w.id)
    );

    if (minimizedApp) {
      // If minimized, restore it
      restoreWindow(minimizedApp.id);
      return minimizedApp.id;
    }

    // Otherwise create a new instance
    return createWindow({
      title,
      component,
      position,
      size,
      appType,
    });
  };

  // Handle dock item click
  const handleDockItemClick = (item) => {
    switch (item.action) {
      case "fileManager":
        openFileManager();
        break;
      case "terminal":
        openTerminal();
        break;
      case "browser":
        openBrowser();
        break;
      case "code":
        openCodeEditor();
        break;
      case "music":
        openMusicPlayer();
        break;
      case "photos":
        openPhotoGallery();
        break;
      case "settings":
        openSettings();
        break;
      default:
        console.log("No handler for this dock item:", item);
    }
  };

  // Placeholder app openers (to be implemented)
  const openTerminal = () => {
    return openApp(
      "terminal",
      "Terminal",
      <div className="terminal-app">Terminal app placeholder</div>,
      { x: 80, y: 80 },
      { width: 600, height: 400 }
    );
  };

  const openBrowser = () => {
    return openApp(
      "browser",
      "Web Browser",
      <div className="browser-app">Browser app placeholder</div>,
      { x: 100, y: 100 },
      { width: 900, height: 600 }
    );
  };

  const openCodeEditor = () => {
    return openApp(
      "code",
      "Code Editor",
      <div className="code-app">Code editor placeholder</div>,
      { x: 120, y: 120 },
      { width: 800, height: 500 }
    );
  };

  const openMusicPlayer = () => {
    return openApp(
      "music",
      "Music Player",
      <div className="music-app">Music player placeholder</div>,
      { x: 140, y: 140 },
      { width: 500, height: 400 }
    );
  };

  const openPhotoGallery = () => {
    return openApp(
      "photos",
      "Photo Gallery",
      <div className="photos-app">Photo gallery placeholder</div>,
      { x: 160, y: 160 },
      { width: 750, height: 500 }
    );
  };

  const openSettings = () => {
    return openApp(
      "settings",
      "Settings",
      <div className="settings-app">Settings app placeholder</div>,
      { x: 180, y: 180 },
      { width: 600, height: 450 }
    );
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
        appType: config.appType || "generic",
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
    // Also remove from minimized windows if it was minimized
    setMinimizedWindows((prev) => prev.filter((windowId) => windowId !== id));

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

  // Minimize a window
  const minimizeWindow = (id) => {
    setMinimizedWindows((prev) => [...prev, id]);
    // No need to remove from windows array, just mark as minimized
  };

  // Restore a minimized window
  const restoreWindow = (id) => {
    setMinimizedWindows((prev) => prev.filter((windowId) => windowId !== id));
    focusWindow(id);
  };

  // Create only file manager on startup
  useEffect(() => {
    // Reset all state on mount
    setWindows([]);
    setActiveWindowId(null);
    setHighestZIndex(100);
    setMinimizedWindows([]);
    windowIdRef.current = 0;

    // Create only file manager window
    openFileManager();

    return () => {
      // Clean up logic if needed
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

        {/* Apply the dock animation effect */}
        <DockEffect />

        {/* Desktop icons - file manager icon removed, only accessible from dock */}
        <div className="desktop-icons">
          {/* File manager icon has been removed from here */}
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
                isMinimized={minimizedWindows.includes(window.id)}
                zIndex={window.zIndex}
                onFocus={focusWindow}
                onClose={closeWindow}
                onMinimize={minimizeWindow}
                onRestore={restoreWindow}
              >
                {window.component}
              </Window>
            ))}
          </AnimatePresence>
        </div>

        {/* macOS Dock */}
        <div className="dock">
          <div className="dock-container">
            <li
              className="li-1"
              onClick={() => handleDockItemClick({ action: "fileManager" })}
              data-app-type="fileManager"
            >
              <div className="name">File Manager</div>
              <img
                className="ico"
                src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853981255cc36b3a37af_finder.png"
                alt="File Manager"
              />
            </li>
            <li
              className="li-2"
              onClick={() => handleDockItemClick({ action: "siri" })}
            >
              <div className="name">Siri</div>
              <img
                className="ico"
                src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853ff3bafbac60495771_siri.png"
                alt="Siri"
              />
            </li>
            <li
              className="li-3"
              onClick={() => handleDockItemClick({ action: "launchpad" })}
            >
              <div className="name">LaunchPad</div>
              <img
                className="ico"
                src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853943597517f128b9b4_launchpad.png"
                alt="LaunchPad"
              />
            </li>
            <li
              className="li-4"
              onClick={() => handleDockItemClick({ action: "contacts" })}
            >
              <div className="name">Contacts</div>
              <img
                className="ico"
                src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853743597518c528b9b3_contacts.png"
                alt="Contacts"
              />
            </li>
            <li
              className="li-5"
              onClick={() => handleDockItemClick({ action: "notes" })}
            >
              <div className="name">Notes</div>
              <img
                className="ico"
                src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853c849ec3735b52cef9_notes.png"
                alt="Notes"
              />
            </li>
            <li
              className="li-6"
              onClick={() => handleDockItemClick({ action: "reminders" })}
            >
              <div className="name">Reminders</div>
              <img
                className="ico"
                src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853d44d99641ce69afeb_reminders.png"
                alt="Reminders"
              />
            </li>
            <li
              className="li-7"
              onClick={() => handleDockItemClick({ action: "photos" })}
            >
              <div className="name">Photos</div>
              <img
                className="ico"
                src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853c55558a2e1192ee09_photos.png"
                alt="Photos"
              />
            </li>
            <li
              className="li-8"
              onClick={() => handleDockItemClick({ action: "messages" })}
            >
              <div className="name">Messages</div>
              <img
                className="ico"
                src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853a55558a68e192ee08_messages.png"
                alt="Messages"
              />
            </li>
            <li
              className="li-9"
              onClick={() => handleDockItemClick({ action: "facetime" })}
            >
              <div className="name">FaceTime</div>
              <img
                className="ico"
                src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f708537f18e2cb27247c904_facetime.png"
                alt="FaceTime"
              />
            </li>
            <li
              className="li-10"
              onClick={() => handleDockItemClick({ action: "music" })}
            >
              <div className="name">Music</div>
              <img
                className="ico"
                src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853ba0782d6ff2aca6b3_music.png"
                alt="Music"
              />
            </li>
            <li
              className="li-11"
              onClick={() => handleDockItemClick({ action: "podcasts" })}
            >
              <div className="name">Podcasts</div>
              <img
                className="ico"
                src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853cc718ba9ede6888f9_podcasts.png"
                alt="Podcasts"
              />
            </li>
            <li
              className="li-12"
              onClick={() => handleDockItemClick({ action: "tv" })}
            >
              <div className="name">TV</div>
              <img
                className="ico"
                src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f708540dd82638d7b8eda70_tv.png"
                alt="TV"
              />
            </li>
            <li
              className="li-13"
              onClick={() => handleDockItemClick({ action: "appstore" })}
            >
              <div className="name">App Store</div>
              <img
                className="ico"
                src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853270b5e2ccfd795b49_appstore.png"
                alt="App Store"
              />
            </li>
            <li
              className="li-14"
              onClick={() => handleDockItemClick({ action: "safari" })}
            >
              <div className="name">Safari</div>
              <img
                className="ico"
                src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853ddd826358438eda6d_safari.png"
                alt="Safari"
              />
            </li>
            <li
              className="li-bin li-15"
              onClick={() => handleDockItemClick({ action: "trash" })}
            >
              <div className="name">Bin</div>
              <img
                className="ico ico-bin"
                src="https://findicons.com/files/icons/569/longhorn_objects/128/trash.png"
                alt="Bin"
              />
            </li>
          </div>
        </div>
      </div>
    </DesktopContext.Provider>
  );
}
