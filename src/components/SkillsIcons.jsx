import React from "react";
import "../styles/SkillsIcons.css";

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

// Skills data array
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

const SkillsIcons = () => {
  const openExternalLink = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Desktop-like: vertical columns, wrap to next column when needed
  const iconsPerColumn = 6; // Number of icons per column
  const iconWidth = 100; // px, matches .desktop-skill-icon width
  const iconHeight = 100; // px, matches .desktop-skill-icon height
  const colSpacing = 10; // px
  const rowSpacing = 10; // px

  return (
    <div className="desktop-skills-icons">
      {skills.map((skill, index) => {
        const column = Math.floor(index / iconsPerColumn);
        const row = index % iconsPerColumn;
        return (
          <div
            className="desktop-skill-icon"
            key={index}
            onClick={() => openExternalLink(skill.url)}
            style={{
              left: `${column * (iconWidth + colSpacing)}px`,
              top: `${row * (iconHeight + rowSpacing)}px`,
            }}
          >
            <div className="skill-icon-wrapper">
              <img src={skill.icon} alt={skill.name} />
              <div className="skill-name">{skill.name}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SkillsIcons;
