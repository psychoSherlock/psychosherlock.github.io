import React, { useState, useEffect, useRef, memo } from "react";
import "../styles/Plymouth.css";
import gunfireAudio from "../assets/other/gunfire_audio.m4a";
import gunfireVideo from "../assets/other/gunfire_video.webm";
import rdrLogo from "../assets/images/cat_rdr_logo.png";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

// Updated fire particle configuration for more realistic movement
const fireParticlesConfig = {
  fullScreen: false,
  fpsLimit: 60,
  particles: {
    number: {
      value: 70, // Increased for denser flame effect
      density: {
        enable: true,
        value_area: 700, // More concentrated
      },
    },
    color: {
      value: [
        "#ff2200", // Deep red
        "#ff4400",
        "#ff6600",
        "#ff8800",
        "#ffaa00",
        "#ffcc00", // Bright yellow
        "#ffdd70", // Light yellow for highlights
      ],
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: { min: 0.3, max: 0.8 }, // More varied opacity
      random: true,
      anim: {
        enable: true,
        speed: 0.5,
        opacity_min: 0.1,
        sync: false,
      },
    },
    size: {
      value: { min: 1, max: 3 }, // More varied sizes
      random: true,
      anim: {
        enable: true,
        speed: 3,
        size_min: 0.5,
        sync: false,
      },
    },
    move: {
      enable: true,
      speed: { min: 0.8, max: 3 }, // More varied speed
      direction: "top",
      random: true,
      straight: false,
      out_mode: "destroy",
      bounce: false,
      attract: {
        enable: true, // Adds swirling effect
        rotateX: 600,
        rotateY: 1200,
        factor: 0.1,
      },
      path: {
        enable: true, // Creates smooth paths
        delay: { value: 0, sync: false },
        options: {
          size: 5,
          draw: false,
          increment: 0.001,
        },
      },
      trail: {
        enable: true,
        length: 3, // Short trail for motion blur
        fill: { color: "#000000" },
      },
      vibrate: true,
    },
    rotate: {
      value: { min: 0, max: 45 },
      random: true,
      direction: "random",
      animation: {
        enable: true,
        speed: 1,
        sync: false,
      },
    },
    life: {
      duration: {
        value: { min: 8, max: 15 }, // Increased lifetime values
        random: true,
      },
      count: 1,
    },
    roll: {
      enable: true,
      speed: { min: 5, max: 10 },
    },
    tilt: {
      enable: true,
      value: { min: 0, max: 20 },
      animation: {
        enable: true,
        speed: 5,
        sync: false,
      },
      direction: "random",
    },
  },
  emitters: [
    {
      position: { x: 10, y: 100 },
      rate: { quantity: 5, delay: 0.1 },
      size: { width: 25, height: 0 },
      particles: {
        color: { value: ["#ff2200", "#ff4400"] }, // Deeper reds
        move: { direction: "top-right", angle: { offset: 0, value: 55 } },
        size: { value: { min: 1, max: 3 } },
        opacity: { value: { min: 0.3, max: 0.7 } },
        life: {
          duration: {
            value: { min: 7, max: 14 }, // Specific lifetime for this emitter
          },
        },
      },
    },
    {
      position: { x: 30, y: 100 },
      rate: { quantity: 4, delay: 0.12 },
      size: { width: 25, height: 0 },
      particles: {
        color: { value: ["#ff4400", "#ff6600", "#ff8800"] },
        move: { direction: "top", angle: { offset: 0, value: 25 } },
      },
    },
    {
      position: { x: 50, y: 100 },
      rate: { quantity: 5, delay: 0.08 },
      size: { width: 30, height: 0 },
      particles: {
        color: { value: ["#ff6600", "#ff8800", "#ffaa00"] }, // Orange-yellow
        move: { direction: "top" },
        size: { value: { min: 2, max: 5 } }, // Slightly larger
      },
    },
    {
      position: { x: 70, y: 100 },
      rate: { quantity: 4, delay: 0.12 },
      size: { width: 25, height: 0 },
      particles: {
        color: { value: ["#ff8800", "#ffaa00", "#ffcc00"] },
        move: { direction: "top", angle: { offset: 0, value: -25 } },
      },
    },
    {
      position: { x: 90, y: 100 },
      rate: { quantity: 5, delay: 0.1 },
      size: { width: 25, height: 0 },
      particles: {
        color: { value: ["#ffaa00", "#ffcc00", "#ffdd70"] }, // Yellows
        move: { direction: "top-left", angle: { offset: 0, value: -55 } },
        size: { value: { min: 1, max: 3 } },
        opacity: { value: { min: 0.3, max: 0.7 } },
      },
    },
  ],
  background: {
    color: "#000000",
  },
  detectRetina: true,
  interactions: {
    events: {
      onhover: { enable: false },
      onclick: { enable: false },
      resize: true,
    },
  },
};

// Fix the FireParticles component cleanup
const FireParticles = () => {
  const [initialized, setInitialized] = useState(false);
  const particlesRef = useRef(null);
  const containerId = "fire-particles";

  useEffect(() => {
    const initParticles = async () => {
      try {
        if (!particlesRef.current) {
          await loadSlim(window.tsParticles);
          particlesRef.current = await window.tsParticles.load(
            containerId,
            fireParticlesConfig
          );
          setInitialized(true);
        }
      } catch (error) {
        console.error("Failed to initialize particles:", error);
      }
    };

    initParticles();

    // Proper cleanup for tsParticles
    return () => {
      try {
        // Get the container and destroy it directly if it exists
        const container = window.tsParticles.dom().findById(containerId);
        if (container) {
          container.destroy();
        }
      } catch (error) {
        console.error("Error cleaning up particles:", error);
      }
    };
  }, []);

  // Return a static div that will be the container for particles
  return <div id={containerId} className="fire-particles" />;
};

export default function Plymouth() {
  const [loading, setLoading] = useState(true);
  const [bootMessages, setBootMessages] = useState([]);
  const [resourcesLoaded, setResourcesLoaded] = useState({
    audio: false,
    video: false,
  });
  const [allMessagesDisplayed, setAllMessagesDisplayed] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  const audioRef = useRef(null);
  const videoRef = useRef(null);

  // Boot screen sequence
  useEffect(() => {
    const bootSequence = [
      { message: "Starting system initialization...", delay: 600 },
      { message: "Loading kernel modules...", delay: 700 },
      { message: "Starting udev...", delay: 500 },
      { message: "Loading system resources...", delay: 600 },
      { message: "Mounting filesystems...", delay: 600 },
      { message: "Loading audio driver...", delay: 700 },
      { message: "Loading video driver...", delay: 600 },
      {
        message: "Loading gunfire_audio.m4a...",
        delay: 800,
        resource: "audio",
      },
      {
        message: "Loading gunfire_video.mp4...",
        delay: 1000,
        resource: "video",
      },
      { message: "Initializing playback...", delay: 800 },
    ];

    let timeoutIds = [];

    const displayBootSequence = () => {
      // Display first message
      setBootMessages([
        { text: bootSequence[0].message, completed: false, id: `msg-0` },
      ]);

      // Display remaining messages and mark each as completed sequentially
      bootSequence.forEach((item, index) => {
        if (index === 0) return; // Skip first message (already displayed)

        // Cumulative delay for this message (sum of all previous delays)
        const cumulativeDelay = bootSequence
          .slice(0, index)
          .reduce((sum, seq) => sum + seq.delay, 0);

        // Schedule display of this message
        const displayTimeoutId = setTimeout(() => {
          setBootMessages((prev) => [
            ...prev,
            { text: item.message, completed: false, id: `msg-${index}` },
          ]);
        }, cumulativeDelay);

        timeoutIds.push(displayTimeoutId);

        // Schedule marking previous message as completed
        const completeTimeoutId = setTimeout(() => {
          setBootMessages((prev) =>
            prev.map((msg) =>
              msg.id === `msg-${index - 1}` ? { ...msg, completed: true } : msg
            )
          );
        }, cumulativeDelay);

        timeoutIds.push(completeTimeoutId);
      });

      // Mark the last message as completed
      const finalDelay = bootSequence.reduce((sum, seq) => sum + seq.delay, 0);
      const finalTimeoutId = setTimeout(() => {
        setBootMessages((prev) =>
          prev.map((msg) =>
            msg.id === `msg-${bootSequence.length - 1}`
              ? { ...msg, completed: true }
              : msg
          )
        );
        setAllMessagesDisplayed(true);
      }, finalDelay);

      timeoutIds.push(finalTimeoutId);
    };

    displayBootSequence();

    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, []);

  // Preload the media files
  useEffect(() => {
    // Video element variables
    let videoElement = null;
    let videoAttached = false;

    // Audio element variables
    let audioElement = null;
    let audioAttached = false;

    try {
      // Force preload of video
      videoElement = document.createElement("video");
      videoElement.src = gunfireVideo;
      videoElement.preload = "auto";
      videoElement.muted = true;
      videoElement.style.display = "none";
      document.body.appendChild(videoElement);
      videoAttached = true;

      videoElement.addEventListener("canplaythrough", () => {
        setResourcesLoaded((prev) => ({ ...prev, video: true }));
        if (videoAttached && document.body.contains(videoElement)) {
          document.body.removeChild(videoElement);
          videoAttached = false;
        }
      });

      // Force preload of audio
      audioElement = document.createElement("audio");
      audioElement.src = gunfireAudio;
      audioElement.preload = "auto";
      audioElement.style.display = "none";
      document.body.appendChild(audioElement);
      audioAttached = true;

      audioElement.addEventListener("canplaythrough", () => {
        setResourcesLoaded((prev) => ({ ...prev, audio: true }));
        if (audioAttached && document.body.contains(audioElement)) {
          document.body.removeChild(audioElement);
          audioAttached = false;
        }
      });
    } catch (error) {
      console.error("Error in media preloading:", error);
    }

    return () => {
      // Safe cleanup for video element
      if (
        videoAttached &&
        videoElement &&
        document.body.contains(videoElement)
      ) {
        document.body.removeChild(videoElement);
      }

      // Safe cleanup for audio element
      if (
        audioAttached &&
        audioElement &&
        document.body.contains(audioElement)
      ) {
        document.body.removeChild(audioElement);
      }
    };
  }, []);

  // Check if all resources are loaded and boot sequence is complete
  useEffect(() => {
    if (
      resourcesLoaded.audio &&
      resourcesLoaded.video &&
      allMessagesDisplayed
    ) {
      setTimeout(() => {
        setLoading(false);
        // Use a slight delay to ensure DOM is ready
        setTimeout(startPlayback, 100);
      }, 1000);
    }
  }, [resourcesLoaded, allMessagesDisplayed]);

  // Add video end event listener
  useEffect(() => {
    const video = videoRef.current;

    const handleVideoEnd = () => {
      console.log("Video ended");
      setVideoEnded(true);
      // Don't stop audio when video ends
    };

    if (video) {
      video.addEventListener("ended", handleVideoEnd);
    }

    return () => {
      if (video) {
        video.removeEventListener("ended", handleVideoEnd);
      }
    };
  }, [loading]); // Only run when loading state changes

  // Start synchronized playback
  const startPlayback = () => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (video && audio) {
      console.log("Starting playback");

      // Reset media to beginning
      video.currentTime = 0;
      audio.currentTime = 0;

      // Ensure both start at the same time
      const videoPromise = video.play().catch((error) => {
        console.error("Video playback failed:", error);
      });

      const audioPromise = audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
    }
  };

  return (
    <div className="plymouth-container">
      {loading ? (
        <div className="boot-screen">
          {/* Force stable rendering with permanent key */}
          <FireParticles key="static-fire-particles" />

          <div className="boot-messages">
            {bootMessages.map((msg) => (
              <div key={msg.id} className="boot-message">
                <span className="boot-bracket">[</span>
                <span
                  className={`boot-status ${msg.completed ? "status-ok" : ""}`}
                >
                  {msg.completed ? " OK " : "..."}
                </span>
                <span className="boot-bracket">]</span>
                <span className="boot-text">{msg.text}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="media-container">
          {!videoEnded ? (
            <>
              <video
                ref={videoRef}
                className="gunfire-video"
                preload="auto"
                muted
              >
                <source src={gunfireVideo} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </>
          ) : (
            <div className="logo-container">
              <img
                src={rdrLogo}
                alt="RDR Logo"
                className="rdr-logo animate-logo"
              />
            </div>
          )}
          {/* Keep audio outside of conditional rendering to prevent it from stopping */}
          <audio ref={audioRef} preload="auto">
            <source src={gunfireAudio} type="audio/mp4" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      )}
    </div>
  );
}
