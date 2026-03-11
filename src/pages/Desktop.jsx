import React, { useState, useRef, useEffect, createContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Desktop.css";
import wallpaper from "../assets/images/kali.jpg";
import FileManager from "../components/FileManager";
import DockEffect from "../components/DockEffect";
import SkillsIcons from "../components/SkillsIcons";

// Import all dock icons
import finderIcon from "../assets/images/icons/finder.png";
import siriIcon from "../assets/images/icons/siri.png";
import launchpadIcon from "../assets/images/icons/launchpad.png";
import contactsIcon from "../assets/images/icons/contacts.png";
import notesIcon from "../assets/images/icons/notes.png";
import remindersIcon from "../assets/images/icons/reminders.png";
import photosIcon from "../assets/images/icons/photos.png";
import messagesIcon from "../assets/images/icons/messages.png";
import facetimeIcon from "../assets/images/icons/facetime.png";
import musicIcon from "../assets/images/icons/music.png";
import podcastsIcon from "../assets/images/icons/podcasts.png";
import tvIcon from "../assets/images/icons/tv.png";
import appstoreIcon from "../assets/images/icons/appstore.png";
import safariIcon from "../assets/images/icons/safari.png";
import trashIcon from "../assets/images/icons/trash.png";

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
  isClosing,
}) => {
  const initPos = initialPosition || { x: 100, y: 100 };
  const [position, setPosition] = useState(initPos);
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
      // Save current position before maximizing
      const el = windowRef.current;
      if (el) {
        // Read the actual rendered transform so we capture drag-moved positions
        const style = window.getComputedStyle(el);
        const matrix = new DOMMatrix(style.transform);
        setPreviousPosition({ x: matrix.m41, y: matrix.m42 });
      } else {
        setPreviousPosition({ ...position });
      }
      setPreviousSize({ ...size });
      setIsMaximized(true);
    } else {
      const restorePos = previousPosition || { ...position };
      setPosition(restorePos);
      if (previousSize) setSize(previousSize);
      setIsMaximized(false);
    }
  };

  // Handle window minimize
  const minimize = () => {
    onMinimize(id);
  };

  useEffect(() => {
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

  const onDragStart = () => {
    if (!isMaximized) {
      setIsDragging(true);
      onFocus(id);
    }
  };

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    // Sync position state with where framer-motion actually placed the element
    setPosition((prev) => ({
      x: prev.x + info.offset.x,
      y: prev.y + info.offset.y,
    }));
  };

  // Determine the current animation target
  const getAnimateState = () => {
    if (isClosing) return "exit";
    if (isMinimized) return "minimized";
    if (isMaximized) return "maximized";
    return "normal";
  };

  // Animation variants — position.x/y are always the source of truth for "normal"
  const windowVariants = {
    initial: {
      opacity: 0,
      scale: 0.75,
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height,
    },
    normal: {
      opacity: 1,
      scale: 1,
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.8,
      },
    },
    maximized: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      width: "100%",
      height: "100%",
      transition: {
        type: "spring",
        stiffness: 250,
        damping: 28,
      },
    },
    minimized: {
      opacity: 0,
      scale: 0.3,
      y: window.innerHeight - 80,
      x: window.innerWidth / 2 - 40,
      transition: {
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.7,
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 1, 1],
      },
    },
  };

  return (
    <motion.div
      ref={windowRef}
      className={`window ${isActive ? "active" : ""} ${
        isMaximized ? "maximized" : ""
      }`}
      variants={windowVariants}
      initial="initial"
      animate={getAnimateState()}
      exit="exit"
      onAnimationComplete={(definition) => {
        if (definition === "exit") {
          // Actual removal happens via onExitComplete on AnimatePresence
        }
      }}
      style={{
        zIndex,
        backgroundColor: "rgba(30, 30, 30, 0.95)",
        border: "1px solid #444",
        boxShadow: isActive
          ? "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(159,239,0,0.15)"
          : "0 4px 20px rgba(0,0,0,0.5)",
        position: "absolute",
        pointerEvents: isMinimized || isClosing ? "none" : "auto",
      }}
      onMouseDown={() => onFocus(id)}
      drag={!isMaximized && !isMinimized && !isClosing}
      dragConstraints={dragConstraints}
      dragElastic={0}
      dragMomentum={false}
      onDragStart={onDragStart}
      onDragEnd={handleDragEnd}
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
  const [minimizedWindows, setMinimizedWindows] = useState([]);
  const [closingWindows, setClosingWindows] = useState([]); // Track windows playing close animation
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

  // Close a window — mark as closing first, then remove after animation completes
  const closeWindow = (id) => {
    // If already closing, ignore
    if (closingWindows.includes(id)) return;

    // Mark the window as closing so the exit animation plays
    setClosingWindows((prev) => [...prev, id]);

    if (activeWindowId === id) {
      const remainingWindows = windows.filter(
        (w) => w.id !== id && !closingWindows.includes(w.id)
      );
      if (remainingWindows.length > 0) {
        const highestWindow = remainingWindows.reduce((prev, current) =>
          prev.zIndex > current.zIndex ? prev : current
        );
        setActiveWindowId(highestWindow.id);
      } else {
        setActiveWindowId(null);
      }
    }

    // Delay actual removal to let the exit animation play
    setTimeout(() => {
      setMinimizedWindows((prev) => prev.filter((windowId) => windowId !== id));
      setClosingWindows((prev) => prev.filter((windowId) => windowId !== id));
      setWindows((prevWindows) => prevWindows.filter((w) => w.id !== id));
    }, 300);
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

        {/* Desktop icons - adding skills section */}
        <div className="desktop-icons">
          {/* Security tools grid */}
          <SkillsIcons />
        </div>

        {/* Windows */}
        <div className="windows-container">
          <AnimatePresence mode="popLayout">
            {windows.map((win) => (
              <Window
                key={win.id}
                id={win.id}
                title={win.title}
                initialPosition={win.position}
                initialSize={win.size}
                isActive={win.id === activeWindowId}
                isMinimized={minimizedWindows.includes(win.id)}
                isClosing={closingWindows.includes(win.id)}
                zIndex={win.zIndex}
                onFocus={focusWindow}
                onClose={closeWindow}
                onMinimize={minimizeWindow}
                onRestore={restoreWindow}
              >
                {win.component}
              </Window>
            ))}
          </AnimatePresence>
        </div>

        {/* Version Number */}
        <div 
          className="desktop-version" 
          style={{ 
            position: "absolute", 
            bottom: "10px", 
            right: "20px", 
            color: "rgba(255, 255, 255, 0.3)", 
            fontSize: "12px",
            pointerEvents: "none",
            zIndex: 10
          }}
        >
          V03.11
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
              <img className="ico" src={finderIcon} alt="File Manager" />
            </li>
            <li
              className="li-2"
              onClick={() => handleDockItemClick({ action: "siri" })}
            >
              <div className="name">Siri</div>
              <img className="ico" src={siriIcon} alt="Siri" />
            </li>
            <li
              className="li-3"
              onClick={() => handleDockItemClick({ action: "launchpad" })}
            >
              <div className="name">LaunchPad</div>
              <img className="ico" src={launchpadIcon} alt="LaunchPad" />
            </li>
            <li
              className="li-4"
              onClick={() => handleDockItemClick({ action: "contacts" })}
            >
              <div className="name">Contacts</div>
              <img className="ico" src={contactsIcon} alt="Contacts" />
            </li>
            <li
              className="li-5"
              onClick={() => handleDockItemClick({ action: "notes" })}
            >
              <div className="name">Notes</div>
              <img className="ico" src={notesIcon} alt="Notes" />
            </li>
            <li
              className="li-6"
              onClick={() => handleDockItemClick({ action: "reminders" })}
            >
              <div className="name">Reminders</div>
              <img className="ico" src={remindersIcon} alt="Reminders" />
            </li>
            <li
              className="li-7"
              onClick={() => handleDockItemClick({ action: "photos" })}
            >
              <div className="name">Photos</div>
              <img className="ico" src={photosIcon} alt="Photos" />
            </li>
            <li
              className="li-8"
              onClick={() => handleDockItemClick({ action: "messages" })}
            >
              <div className="name">Messages</div>
              <img className="ico" src={messagesIcon} alt="Messages" />
            </li>
            <li
              className="li-9"
              onClick={() => handleDockItemClick({ action: "facetime" })}
            >
              <div className="name">FaceTime</div>
              <img className="ico" src={facetimeIcon} alt="FaceTime" />
            </li>
            <li
              className="li-10"
              onClick={() => handleDockItemClick({ action: "music" })}
            >
              <div className="name">Music</div>
              <img className="ico" src={musicIcon} alt="Music" />
            </li>
            <li
              className="li-11"
              onClick={() => handleDockItemClick({ action: "podcasts" })}
            >
              <div className="name">Podcasts</div>
              <img className="ico" src={podcastsIcon} alt="Podcasts" />
            </li>
            <li
              className="li-12"
              onClick={() => handleDockItemClick({ action: "tv" })}
            >
              <div className="name">TV</div>
              <img className="ico" src={tvIcon} alt="TV" />
            </li>
            <li
              className="li-13"
              onClick={() => handleDockItemClick({ action: "appstore" })}
            >
              <div className="name">App Store</div>
              <img className="ico" src={appstoreIcon} alt="App Store" />
            </li>
            <li
              className="li-14"
              onClick={() => handleDockItemClick({ action: "safari" })}
            >
              <div className="name">Safari</div>
              <img className="ico" src={safariIcon} alt="Safari" />
            </li>
            <li
              className="li-bin li-15"
              onClick={() => handleDockItemClick({ action: "trash" })}
            >
              <div className="name">Bin</div>
              <img className="ico ico-bin" src={trashIcon} alt="Bin" />
            </li>
          </div>
        </div>
      </div>
    </DesktopContext.Provider>
  );
}
