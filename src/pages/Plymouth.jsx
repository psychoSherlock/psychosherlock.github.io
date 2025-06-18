import React, { useState, useEffect, useRef } from "react";
import "../styles/Plymouth.css";
import gunfireAudio from "../assets/other/gunfire_audio.m4a";
import gunfireVideo from "../assets/other/gunfire_video.webm";
import rdrLogo from "../assets/images/cat_rdr_logo.png";

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
    // Force preload of video
    const videoElement = document.createElement("video");
    videoElement.src = gunfireVideo;
    videoElement.preload = "auto";
    videoElement.muted = true;
    videoElement.style.display = "none";
    document.body.appendChild(videoElement);

    videoElement.addEventListener("canplaythrough", () => {
      setResourcesLoaded((prev) => ({ ...prev, video: true }));
      document.body.removeChild(videoElement);
    });

    // Force preload of audio
    const audioElement = document.createElement("audio");
    audioElement.src = gunfireAudio;
    audioElement.preload = "auto";
    audioElement.style.display = "none";
    document.body.appendChild(audioElement);

    audioElement.addEventListener("canplaythrough", () => {
      setResourcesLoaded((prev) => ({ ...prev, audio: true }));
      document.body.removeChild(audioElement);
    });

    return () => {
      if (document.body.contains(videoElement)) {
        document.body.removeChild(videoElement);
      }
      if (document.body.contains(audioElement)) {
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
