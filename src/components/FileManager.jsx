import React, { useState } from "react";

const FileManager = () => {
  const [currentPath, setCurrentPath] = useState("/home/user");
  const [history, setHistory] = useState(["/home/user"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);

  // Mock file system data
  const [fileSystem, setFileSystem] = useState({
    "/home/user": {
      type: "folder",
      name: "Home",
      items: [
        { name: "Documents", type: "folder" },
        { name: "Pictures", type: "folder" },
        { name: "Downloads", type: "folder" },
        { name: "Projects", type: "folder" },
        { name: "notes.txt", type: "file" },
        { name: "todo.md", type: "file" },
      ],
    },
    "/home/user/Documents": {
      type: "folder",
      name: "Documents",
      items: [
        { name: "Resume.pdf", type: "file" },
        { name: "Work", type: "folder" },
        { name: "Personal", type: "folder" },
      ],
    },
    "/home/user/Pictures": {
      type: "folder",
      name: "Pictures",
      items: [
        { name: "vacation.jpg", type: "file" },
        { name: "profile.png", type: "file" },
        { name: "Wallpapers", type: "folder" },
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

  // Navigation functions
  const navigateTo = (path) => {
    if (!fileSystem[path]) {
      console.warn(`Path not found: ${path}`);
      return;
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
    }
    setSelectedItem(item.name);
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

  console.log("FileManager component rendered"); // Add debug log

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

          <div className="file-list">
            {fileSystem[currentPath] &&
              fileSystem[currentPath].items.map((item, index) => (
                <div
                  key={index}
                  className={`file-item ${item.type} ${
                    selectedItem === item.name ? "selected" : ""
                  }`}
                  onClick={() => handleItemClick(item)}
                  onDoubleClick={() =>
                    item.type === "folder" &&
                    navigateTo(`${currentPath}/${item.name}`)
                  }
                >
                  <div className="file-icon">
                    {item.type === "folder" ? "📁" : "📄"}
                  </div>
                  <div className="file-name">{item.name}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManager;
