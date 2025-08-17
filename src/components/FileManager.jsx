import React, { useState, useEffect } from "react";
import "./FileManager.css"; // Import the CSS file
import { useImageViewer } from "../context/ImageViewerContext"; // Import the image context hook
import { usePdfViewer } from "../context/PDFViewerContext"; // Import the PDF context hook
// Import images from your project
import exploitXImage from "../assets/images/achievements/ExploitX_CIT_02_Aug_25.JPG";
import catRdrLogo from "../assets/images/cat_rdr_logo.png";
import kaliImage from "../assets/images/kali.jpg";
import arthurWallpaper from "../assets/images/arthur-wallpapper.jpg";
import arthurGun from "../assets/images/arthur-gun.png";
import meCowboy from "../assets/images/personal/me_cowboy.jpeg";
import meHacker from "../assets/images/personal/me-hacker.jpg";
import mePortrait from "../assets/images/personal/me.jpeg";

// Import PDF files from Documents folder
import appreciationPdf from "../assets/Documents/April 2023 - Note of Appreciation .pdf";
import resumePdf from "../assets/Documents/ATHULPRAKASHNJ_RESUME.pdf";
import appSecPdf from "../assets/Documents/AthulPrakashNj-CertifiedAppSecPractitioner.pdf";
import dmMeetupPdf from "../assets/Documents/DM_Meetup.pdf";
import freshmanFirewallPdf from "../assets/Documents/Freshman_Firewall.pdf";
import resumeNewPdf from "../assets/Documents/resume_new.pdf";

// Import wallpaper images from Wallpappers folder
import kali2Img from "../assets/images/Wallpappers/kali_2.png";
import aotImg from "../assets/images/Wallpappers/aot.jpg";
import masksImg from "../assets/images/Wallpappers/masks.jpg";
import kaliWallpapperImg from "../assets/images/Wallpappers/kali.jpg";
import fsocietyImg from "../assets/images/Wallpappers/fsociety_cards.jpg";
import tuxWindowsImg from "../assets/images/Wallpappers/tux_windows_sad.png";
import rdr3Img from "../assets/images/Wallpappers/rdr3.jpg";
import rdr2Img from "../assets/images/Wallpappers/rdr2.jpg";
import arthurGunWallpapperImg from "../assets/images/Wallpappers/arthur-gun.png";

// Import all skill icons
import msfIcon from "../assets/images/icons/skills/msf.png";
import nmapIcon from "../assets/images/icons/skills/nmap.png";
import ncatIcon from "../assets/images/icons/skills/ncat.png";
import burpIcon from "../assets/images/icons/skills/burp.png";
import hydraIcon from "../assets/images/icons/skills/hydra.png";
import wpscanIcon from "../assets/images/icons/skills/wpscan.png";
import sqlmapIcon from "../assets/images/icons/skills/sqlmap.png";
import johnIcon from "../assets/images/icons/skills/john.png";
import hashcatIcon from "../assets/images/icons/skills/hashcat-logo.png";
import gobusterIcon from "../assets/images/icons/skills/gobuster-logo.png";
import dirbusterIcon from "../assets/images/icons/skills/dirbuster-logo.png";
import ffufIcon from "../assets/images/icons/skills/ffuf-logo.png";
import wiresharkIcon from "../assets/images/icons/skills/wireshark-logo.png";
import mimikatzIcon from "../assets/images/icons/skills/mimikatz-logo.png";

// Import dock icons
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

// Desktop skills data - same as in SkillsIcons.jsx
const skills = [
  {
    name: "Metasploit",
    icon: msfIcon,
    url: "https://www.metasploit.com/",
  },
  {
    name: "Nmap",
    icon: nmapIcon,
    url: "https://nmap.org",
  },
  {
    name: "Netcat",
    icon: ncatIcon,
    url: "https://nmap.org/ncat/",
  },
  {
    name: "Burp Suite",
    icon: burpIcon,
    url: "https://portswigger.net/burp",
  },
  {
    name: "Hydra",
    icon: hydraIcon,
    url: "https://www.kali.org/tools/hydra/",
  },
  {
    name: "WP Scan",
    icon: wpscanIcon,
    url: "https://www.kali.org/tools/wpscan/",
  },
  {
    name: "SQLMap",
    icon: sqlmapIcon,
    url: "https://www.kali.org/tools/sqlmap/",
  },
  {
    name: "John",
    icon: johnIcon,
    url: "https://www.kali.org/tools/john/",
  },
  {
    name: "Hashcat",
    icon: hashcatIcon,
    url: "https://www.kali.org/tools/hashcat/",
  },
  {
    name: "GoBuster",
    icon: gobusterIcon,
    url: "https://www.kali.org/tools/gobuster/",
  },
  {
    name: "Dirbuster",
    icon: dirbusterIcon,
    url: "https://www.kali.org/tools/dirbuster/",
  },
  {
    name: "FFuf",
    icon: ffufIcon,
    url: "https://www.kali.org/tools/ffuf/",
  },
  {
    name: "Wireshark",
    icon: wiresharkIcon,
    url: "https://www.kali.org/tools/wireshark/",
  },
  {
    name: "Mimikatz",
    icon: mimikatzIcon,
    url: "https://www.kali.org/tools/mimikatz/",
  },
];

// Dock icons data
const dockIcons = [
  { name: "Finder", icon: finderIcon, action: "fileManager" },
  { name: "Siri", icon: siriIcon, action: "siri" },
  { name: "LaunchPad", icon: launchpadIcon, action: "launchpad" },
  { name: "Contacts", icon: contactsIcon, action: "contacts" },
  { name: "Notes", icon: notesIcon, action: "notes" },
  { name: "Reminders", icon: remindersIcon, action: "reminders" },
  { name: "Photos", icon: photosIcon, action: "photos" },
  { name: "Messages", icon: messagesIcon, action: "messages" },
  { name: "FaceTime", icon: facetimeIcon, action: "facetime" },
  { name: "Music", icon: musicIcon, action: "music" },
  { name: "Podcasts", icon: podcastsIcon, action: "podcasts" },
  { name: "TV", icon: tvIcon, action: "tv" },
  { name: "App Store", icon: appstoreIcon, action: "appstore" },
  { name: "Safari", icon: safariIcon, action: "safari" },
  { name: "Trash", icon: trashIcon, action: "trash" },
];

// Helper function to check if a file is an image
const isImageFile = (filename) => {
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".svg",
    ".webp",
    ".JPG",
  ];
  return imageExtensions.some((ext) =>
    filename.toLowerCase().endsWith(ext.toLowerCase())
  );
};

// Helper function to check if a file is a PDF
const isPdfFile = (filename) => {
  return filename.toLowerCase().endsWith(".pdf");
};

// Helper to get image path for thumbnails
const getImagePath = (path, filename) => {
  // Map filenames to imported assets
  const imageMap = {
    // General images
    "ExploitX_CIT_02_Aug_25.JPG": exploitXImage,
    "cat_rdr_logo.png": catRdrLogo,
    "kali.jpg": kaliImage,
    "arthur-wallpapper.jpg": arthurWallpaper,
    "arthur-gun.png": arthurGun,
    "me_cowboy.jpeg": meCowboy,
    "me-hacker.jpg": meHacker,
    "me.jpeg": mePortrait,

    // Wallpappers folder images
    "kali_2.png": kali2Img,
    "aot.jpg": aotImg,
    "masks.jpg": masksImg,
    "fsociety_cards.jpg": fsocietyImg,
    "tux_windows_sad.png": tuxWindowsImg,
    "rdr3.jpg": rdr3Img,
    "rdr2.jpg": rdr2Img,
  };

  // Check if we're in the Wallpappers path for special handling
  if (path === "/home/user/Pictures/Wallpappers") {
    // If this is a wallpaper from the Wallpappers folder
    if (filename === "arthur-gun.png") {
      return arthurGunWallpapperImg; // Use the wallpapper-specific import
    }
    if (filename === "kali.jpg") {
      return kaliWallpapperImg; // Use the wallpapper-specific import
    }
  }

  return imageMap[filename] || null;
};

// Helper to get PDF path for the PDF viewer
const getPdfPath = (path, filename) => {
  // Map filenames to imported PDF assets
  const pdfMap = {
    "April 2023 - Note of Appreciation .pdf": appreciationPdf,
    "ATHULPRAKASHNJ_RESUME.pdf": resumePdf,
    "AthulPrakashNj-CertifiedAppSecPractitioner.pdf": appSecPdf,
    "DM_Meetup.pdf": dmMeetupPdf,
    "Freshman_Firewall.pdf": freshmanFirewallPdf,
    "resume_new.pdf": resumeNewPdf,
    "Resume.pdf": resumePdf, // For the one in the root Documents folder
  };

  return pdfMap[filename] || null;
};

const FileManager = () => {
  const [currentPath, setCurrentPath] = useState("/home/user");
  const [history, setHistory] = useState(["/home/user"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);

  // Use the image viewer context
  const { openImageViewer } = useImageViewer();

  // Use the PDF viewer context
  const { openPdfViewer } = usePdfViewer();

  // Mock file system data with your actual project images
  const [fileSystem, setFileSystem] = useState({
    "/home/user": {
      type: "folder",
      name: "Home",
      items: [
        { name: "Desktop", type: "folder" },
        { name: "Documents", type: "folder" },
        { name: "Pictures", type: "folder" },
        { name: "Downloads", type: "folder" },
        { name: "Projects", type: "folder" },
        { name: "Resume.pdf", type: "file" },
      ],
    },
    "/home/user/Desktop": {
      type: "folder",
      name: "Desktop",
      isDesktop: true, // Special flag for desktop folder
      items: [], // Items will be generated dynamically
    },
    "/home/user/Documents": {
      type: "folder",
      name: "Documents",
      items: [
        { name: "Resume.pdf", type: "file" },
        { name: "April 2023 - Note of Appreciation .pdf", type: "file" },
        { name: "ATHULPRAKASHNJ_RESUME.pdf", type: "file" },
        {
          name: "AthulPrakashNj-CertifiedAppSecPractitioner.pdf",
          type: "file",
        },
        { name: "DM_Meetup.pdf", type: "file" },
        { name: "Freshman_Firewall.pdf", type: "file" },
        { name: "resume_new.pdf", type: "file" },
      ],
    },
    "/home/user/Pictures": {
      type: "folder",
      name: "Pictures",
      items: [
        { name: "Wallpappers", type: "folder" },
        { name: "Personal", type: "folder" },
        { name: "Achievements", type: "folder" },
      ],
    },
    "/home/user/Pictures/Personal": {
      type: "folder",
      name: "Personal",
      items: [
        { name: "me_cowboy.jpeg", type: "file" },
        { name: "me-hacker.jpg", type: "file" },
        { name: "me.jpeg", type: "file" },
      ],
    },
    "/home/user/Pictures/Achievements": {
      type: "folder",
      name: "Achievements",
      items: [{ name: "ExploitX_CIT_02_Aug_25.JPG", type: "file" }],
    },
    "/home/user/Pictures/Wallpappers": {
      type: "folder",
      name: "Wallpappers",
      items: [
        { name: "arthur-wallpapper.jpg", type: "file" },
        { name: "kali.jpg", type: "file" },
        { name: "cat_rdr_logo.png", type: "file" },
        { name: "arthur-gun.png", type: "file" },
        { name: "aot.jpg", type: "file" },
        { name: "fsociety_cards.jpg", type: "file" },
        { name: "kali_2.png", type: "file" },
        { name: "masks.jpg", type: "file" },
        { name: "rdr2.jpg", type: "file" },
        { name: "rdr3.jpg", type: "file" },
        { name: "tux_windows_sad.png", type: "file" },
      ],
    },
    "/home/user/Projects": {
      type: "folder",
      name: "Projects",
      items: [
        { name: "WebDev", type: "folder" },
        { name: "README.md", type: "file" },
        { name: "todo-app", type: "folder" },
      ],
    },
  });

  // Open external link function
  const openExternalLink = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Generate desktop items by combining skills and dock icons
  const getDesktopItems = () => {
    // Create desktop items from skills
    const skillItems = skills.map((skill) => ({
      name: skill.name,
      type: "desktop-icon",
      icon: skill.icon,
      url: skill.url,
    }));

    // Create desktop items from dock icons
    const dockItems = dockIcons.map((dock) => ({
      name: dock.name,
      type: "desktop-icon",
      icon: dock.icon,
      action: dock.action,
    }));

    // Return combined items
    return [...skillItems, ...dockItems];
  };

  // Navigation functions
  const navigateTo = (path) => {
    if (!fileSystem[path]) {
      console.warn(`Path not found: ${path}`);
      return;
    }

    // If navigating to desktop folder, generate desktop items
    if (path === "/home/user/Desktop") {
      // Update desktop items
      const updatedFileSystem = { ...fileSystem };
      updatedFileSystem[path].items = getDesktopItems();
      setFileSystem(updatedFileSystem);
    }

    setCurrentPath(path);

    if (historyIndex < history.length - 1) {
      setHistory([...history.slice(0, historyIndex + 1), path]);
      setHistoryIndex(historyIndex + 1);
    } else {
      setHistory([...history, path]);
      setHistoryIndex(history.length);
    }
  };

  const navigateBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
    }
  };

  const navigateForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
    }
  };

  const navigateUp = () => {
    const pathParts = currentPath.split("/");
    if (pathParts.length > 2) {
      pathParts.pop();
      const parentPath = pathParts.join("/");
      navigateTo(parentPath);
    }
  };

  // File operations
  const createNewFolder = () => {
    const folderName = prompt("Enter folder name:");
    if (!folderName || folderName.trim() === "") return;

    const newFolderPath = `${currentPath}/${folderName}`;

    const updatedFileSystem = { ...fileSystem };
    if (
      !updatedFileSystem[currentPath].items.some(
        (item) => item.name === folderName
      )
    ) {
      updatedFileSystem[currentPath].items.push({
        name: folderName,
        type: "folder",
      });

      updatedFileSystem[newFolderPath] = {
        type: "folder",
        name: folderName,
        items: [],
      };

      setFileSystem(updatedFileSystem);
    } else {
      alert("A folder with this name already exists.");
    }
  };

  const createNewFile = () => {
    const fileName = prompt("Enter file name:");
    if (!fileName || fileName.trim() === "") return;

    const updatedFileSystem = { ...fileSystem };
    if (
      !updatedFileSystem[currentPath].items.some(
        (item) => item.name === fileName
      )
    ) {
      updatedFileSystem[currentPath].items.push({
        name: fileName,
        type: "file",
      });

      setFileSystem(updatedFileSystem);
    } else {
      alert("A file with this name already exists.");
    }
  };

  // Handle item click (navigate into folders)
  const handleItemClick = (item) => {
    if (item.type === "folder") {
      navigateTo(`${currentPath}/${item.name}`);
    } else if (item.type === "desktop-icon" && item.url) {
      // Handle desktop icon click with URL
      openExternalLink(item.url);
    } else if (item.type === "desktop-icon" && item.action) {
      // Handle dock icon action (would integrate with Desktop.jsx)
      console.log(`Action triggered: ${item.action}`);
      // In a real implementation, you would communicate with Desktop.jsx to trigger actions
    }
    setSelectedItem(item.name);
  };

  // Handle double click on items
  const handleItemDoubleClick = (item) => {
    if (item.type === "folder") {
      navigateTo(`${currentPath}/${item.name}`);
    } else if (item.type === "file" && isImageFile(item.name)) {
      // Open image viewer for image files using the context
      const imagePath = getImagePath(currentPath, item.name);
      if (imagePath) {
        openImageViewer(imagePath);
      }
    } else if (item.type === "file" && isPdfFile(item.name)) {
      // Open PDF viewer for PDF files using the context
      const pdfPath = getPdfPath(currentPath, item.name);
      if (pdfPath) {
        openPdfViewer(pdfPath);
      }
    } else if (item.type === "desktop-icon" && item.url) {
      // Open URL for desktop icons
      openExternalLink(item.url);
    } else if (item.type === "desktop-icon" && item.action) {
      // Handle dock icon actions
      console.log(`Action triggered: ${item.action}`);
      // In a real implementation, you would communicate with Desktop.jsx to trigger actions
    }
  };

  // Get current directory name for title
  const getCurrentDirectoryName = () => {
    const parts = currentPath.split("/");
    return parts[parts.length - 1] || "Root";
  };

  // Favorite locations
  const favorites = [
    { name: "Home", path: "/home/user" },
    { name: "Desktop", path: "/home/user/Desktop" },
    { name: "Documents", path: "/home/user/Documents" },
    { name: "Pictures", path: "/home/user/Pictures" },
    { name: "Projects", path: "/home/user/Projects" },
  ];

  // Render file item with thumbnail if it's an image or custom icon for desktop items
  const renderFileItem = (item) => {
    // Handle desktop icons specially
    if (item.type === "desktop-icon") {
      return (
        <div
          className={`file-item desktop-icon ${
            selectedItem === item.name ? "selected" : ""
          }`}
          onClick={() => handleItemClick(item)}
          onDoubleClick={() => handleItemDoubleClick(item)}
        >
          <div className="file-icon">
            <img
              src={item.icon}
              alt={item.name}
              className="desktop-icon-image"
              width="40"
              height="40"
            />
          </div>
          <div className="file-name">{item.name}</div>
        </div>
      );
    }

    // Handle regular files and folders
    const isImage = item.type === "file" && isImageFile(item.name);
    const isPdf = item.type === "file" && isPdfFile(item.name);
    const imagePath = isImage ? getImagePath(currentPath, item.name) : null;

    return (
      <div
        className={`file-item ${item.type} ${
          selectedItem === item.name ? "selected" : ""
        } ${isPdf ? "pdf-file" : ""}`}
        onClick={() => handleItemClick(item)}
        onDoubleClick={() => handleItemDoubleClick(item)}
      >
        <div className="file-icon">
          {isImage ? (
            <img
              src={imagePath}
              alt={item.name}
              className="file-thumbnail"
              width="40"
              height="40"
            />
          ) : isPdf ? (
            <span className="pdf-icon">📄</span>
          ) : item.type === "folder" ? (
            "📁"
          ) : (
            "📄"
          )}
        </div>
        <div className="file-name">{item.name}</div>
      </div>
    );
  };

  // Initialize desktop items when component mounts
  useEffect(() => {
    // Prepare desktop folder with its items
    const updatedFileSystem = { ...fileSystem };
    updatedFileSystem["/home/user/Desktop"].items = getDesktopItems();
    setFileSystem(updatedFileSystem);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="file-manager">
      <div className="file-manager-toolbar">
        <div className="navigation-controls">
          <button
            onClick={navigateBack}
            disabled={historyIndex <= 0}
            className="nav-button"
          >
            &#8592;
          </button>
          <button
            onClick={navigateForward}
            disabled={historyIndex >= history.length - 1}
            className="nav-button"
          >
            &#8594;
          </button>
          <button onClick={navigateUp} className="nav-button">
            &#8593;
          </button>
          <span className="current-path">{currentPath}</span>
        </div>
        <div className="file-controls">
          <button onClick={createNewFolder} className="file-control-button">
            New Folder
          </button>
          <button onClick={createNewFile} className="file-control-button">
            New File
          </button>
        </div>
      </div>

      <div className="file-manager-content">
        <div className="file-manager-sidebar">
          <div className="sidebar-section">
            <h3>Favorites</h3>
            <ul>
              {favorites.map((favorite) => (
                <li
                  key={favorite.path}
                  className={currentPath === favorite.path ? "active" : ""}
                  onClick={() =>
                    fileSystem[favorite.path] && navigateTo(favorite.path)
                  }
                >
                  {favorite.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="file-manager-main">
          <div className="directory-title">
            <h2>{getCurrentDirectoryName()}</h2>
          </div>

          <div
            className={`file-list ${
              currentPath === "/home/user/Desktop" ? "desktop-view" : ""
            }`}
          >
            {fileSystem[currentPath] &&
              fileSystem[currentPath].items.map((item, index) => (
                <React.Fragment key={index}>
                  {renderFileItem(item)}
                </React.Fragment>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManager;
