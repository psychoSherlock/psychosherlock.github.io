import React, { useState, useEffect, useRef } from "react";
import { FaLinux, FaCog, FaMicrochip } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/Boot.css";
import backgroundImage from "../assets/images/arthur-gun.png";

export default function Boot() {
  const [selectedOption, setSelectedOption] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading GRUB...");
  const totalOptions = 3;
  const backgroundImageRef = useRef(null);
  const navigate = useNavigate();

  // Simplified loading sequence
  useEffect(() => {
    // Create image element to detect when it's loaded
    const img = new Image();
    img.src = backgroundImage;

    // Add a typing effect for the loading text
    let charIndex = 0;
    const fullText = "Loading GRUB boot menu...";

    const typingInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        setLoadingText(fullText.substring(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    // When image is loaded, finish the loading sequence
    img.onload = () => {
      setTimeout(() => {
        setLoadingText((prev) => prev + " done!");
        setTimeout(() => setLoading(false), 600);
      }, 800);
    };

    return () => clearInterval(typingInterval);
  }, []);

  // Keyboard navigation for boot options
  useEffect(() => {
    if (loading) return; // Don't process keyboard input during loading

    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowUp":
          setSelectedOption((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "ArrowDown":
          setSelectedOption((prev) =>
            prev < totalOptions - 1 ? prev + 1 : prev
          );
          break;
        case "Enter":
          // Handle boot option selection
          if (selectedOption === 0) {
            navigate("/plymouth");
          } else {
            console.log(`Booting option: ${selectedOption}`);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedOption, totalOptions, loading, navigate]);

  // Handle option click
  const handleOptionClick = (index) => {
    setSelectedOption(index);
    if (index === 0) {
      navigate("/plymouth");
    }
  };

  return (
    <div className="boot-container">
      {loading ? (
        <div className="boot-loading">
          <pre className="boot-loading-text">{loadingText}</pre>
          <div className="boot-loading-cursor"></div>
        </div>
      ) : (
        <>
          <div className="boot-background"></div>

          <div className="boot-menu">
            <h2 className="boot-title">GRUB BOOTLOADER</h2>

            <div className="boot-options">
              <div
                className={`boot-option ${
                  selectedOption === 0 ? "selected" : ""
                }`}
                onClick={() => handleOptionClick(0)}
              >
                <FaLinux className="boot-icon" />
                <span>
                  Boot into psychoSherlock
                  {selectedOption === 0 && (
                    <span className="blinking-underscore">_</span>
                  )}
                </span>
              </div>

              <div
                className={`boot-option ${
                  selectedOption === 1 ? "selected" : ""
                }`}
                onClick={() => handleOptionClick(1)}
              >
                <FaCog className="boot-icon" />
                <span>
                  Advanced Options for psychoSherlock
                  {selectedOption === 1 && (
                    <span className="blinking-underscore">_</span>
                  )}
                </span>
              </div>

              <div
                className={`boot-option ${
                  selectedOption === 2 ? "selected" : ""
                }`}
                onClick={() => handleOptionClick(2)}
              >
                <FaMicrochip className="boot-icon" />
                <span>
                  Firmware Settings
                  {selectedOption === 2 && (
                    <span className="blinking-underscore">_</span>
                  )}
                </span>
              </div>
            </div>

            <div className="boot-footer">
              Use ↑ and ↓ keys to select, Enter to boot
            </div>
          </div>
        </>
      )}
    </div>
  );
}
