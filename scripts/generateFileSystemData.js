import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsPath = path.join(__dirname, "../src/assets");
const outputPath = path.join(__dirname, "../src/data/fileSystemData.js");

// Folders to scan and their virtual paths
const folderMappings = [
  {
    realPath: "Documents",
    virtualPath: "/home/user/Documents",
    name: "Documents",
  },
  {
    realPath: "images/Wallpappers",
    virtualPath: "/home/user/Pictures/Wallpappers",
    name: "Wallpappers",
  },
  {
  realPath: "images/personal",
  virtualPath: "/home/user/Pictures/Personal",
  name: "Personal",
  },
  {
  realPath: "images/achievements",
  virtualPath: "/home/user/Pictures/Achievements",
  name: "Achievements",
  },
  ];

  function scanDirectory(dirPath, virtualBasePath) {
  const result = {};

  function scan(currentPath, currentVirtualPath) {
  if (!fs.existsSync(currentPath)) {
    console.warn(`Path does not exist: ${currentPath}`);
    return;
  }

  const items = fs.readdirSync(currentPath, { withFileTypes: true });
  const folderItems = [];

  items.forEach((item) => {
    if (item.name.startsWith(".")) return; // Skip hidden files

    const itemPath = path.join(currentPath, item.name);
    const itemVirtualPath = `${currentVirtualPath}/${item.name}`;

    if (item.isDirectory()) {
      folderItems.push({ name: item.name, type: "folder" });
      // Recursively scan subdirectories and merge their results
      const subResults = scan(itemPath, itemVirtualPath);
      Object.assign(result, subResults);
    } else {
      folderItems.push({ name: item.name, type: "file" });
    }
  });

  result[currentVirtualPath] = {
    type: "folder",
    name: path.basename(currentVirtualPath),
    items: folderItems,
  };

  return result;
  }

  return scan(dirPath, virtualBasePath);
  }
// Build the complete file system
const fileSystem = {
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
    isDesktop: true,
    items: [],
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
  "/home/user/Downloads": {
    type: "folder",
    name: "Downloads",
    items: [],
  },
  "/home/user/Projects": {
    type: "folder",
    name: "Projects",
    items: [
      { name: "NoProjectsForNowComeBackLater", type: "folder" },
    ],
  },
};

// Scan each mapped folder
folderMappings.forEach((mapping) => {
  const realPath = path.join(assetsPath, mapping.realPath);
  const scanned = scanDirectory(realPath, mapping.virtualPath);
  Object.assign(fileSystem, scanned);
});

// Generate the output file
const output = `// Auto-generated file - DO NOT EDIT MANUALLY
// Run: npm run generate-fs to regenerate this file

const fileSystemData = ${JSON.stringify(fileSystem, null, 2)};

export default fileSystemData;
`;

fs.writeFileSync(outputPath, output, "utf-8");
console.log("✅ fileSystemData.js generated successfully!");
console.log(`📁 Output: ${outputPath}`);
