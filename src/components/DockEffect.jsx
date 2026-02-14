// Dock animation script for macOS-like dock
import React, { useEffect } from "react";

const DockEffect = () => {
  useEffect(() => {
    // Function to initialize dock animations
    const initDockAnimations = () => {
      const icons = document.querySelectorAll(".ico");

      const resetIcons = () => {
        icons.forEach((item) => {
          item.style.transform = "scale(1) translateY(0px)";
        });
      };

      icons.forEach((item, index) => {
        item.addEventListener("mouseover", () => focus(index));
        item.addEventListener("mouseleave", resetIcons);
      });

      const focus = (index) => {
        resetIcons();
        const transformations = [
          { idx: index - 2, scale: 1.1, translateY: 0 },
          { idx: index - 1, scale: 1.2, translateY: -6 },
          { idx: index, scale: 1.5, translateY: -10 },
          { idx: index + 1, scale: 1.2, translateY: -6 },
          { idx: index + 2, scale: 1.1, translateY: 0 },
        ];

        transformations.forEach(({ idx, scale, translateY }) => {
          if (icons[idx]) {
            icons[
              idx
            ].style.transform = `scale(${scale}) translateY(${translateY}px)`;
          }
        });
      };

      // Store minimized windows for restoration
      const minimizedWindows = new Map();

      // Add click animation
      const dockItems = document.querySelectorAll(".dock-container li");
      dockItems.forEach((item, index) => {
        item.addEventListener("click", () => {
          // Get the icon inside the dock item
          const icon = item.querySelector(".ico");

          // Check if this dock item has a minimized window
          const windowId = item.dataset.windowId;
          if (windowId && minimizedWindows.has(windowId)) {
            // Restore the window with genie effect
            const windowEl = minimizedWindows.get(windowId);

            // Make window visible again
            windowEl.style.display = "flex";

            // Apply restoring animation
            windowEl.classList.add("restoring");

            // Remove from minimized windows map
            minimizedWindows.delete(windowId);

            // Remove the data-window-id attribute from dock item
            item.removeAttribute("data-window-id");

            // Remove animation class after animation completes
            setTimeout(() => {
              windowEl.classList.remove("restoring");
            }, 400);
          } else {
            // Regular dock icon click animation
            // Reset any existing animations
            icon.style.animation = "none";

            // Force reflow to ensure the animation restart
            void icon.offsetWidth;

            // Add jump animation
            icon.style.animation = "dockItemJump 0.5s ease forwards";

            // Remove animation after it completes
            setTimeout(() => {
              icon.style.animation = "";
            }, 500);
          }
        });
      });

      // Add window minimize animation (genie effect)
      const setupMinimizeAnimation = () => {
        // Get all minimize buttons
        const minimizeButtons = document.querySelectorAll(
          ".window-control.minimize"
        );

        minimizeButtons.forEach((button) => {
          button.addEventListener("click", (e) => {
            // Find the window that contains this button
            const window = button.closest(".window");
            if (!window) return;

            // Generate a unique ID for this window if it doesn't have one
            if (!window.id) {
              window.id = "window-" + Date.now();
            }

            // Find the corresponding dock item (for this example, use the first dock item)
            // In a real app, you'd map each window to its specific dock item
            const dockItems = document.querySelectorAll(".dock-container li");
            let targetDockItem = dockItems[0]; // Default to first dock item

            // Find a suitable dock item based on app type or icon
            // For example, if the window has a data attribute for app type:
            const appType = window.dataset.appType;
            if (appType) {
              // Find dock item with matching app type
              const matchingItem = Array.from(dockItems).find(
                (item) => item.dataset.appType === appType
              );
              if (matchingItem) {
                targetDockItem = matchingItem;
              }
            }

            if (targetDockItem) {
              // Store window reference for later restoration
              minimizedWindows.set(window.id, window);

              // Set data attribute on dock item to know which window it contains
              targetDockItem.dataset.windowId = window.id;

              // Apply the genie minimizing effect
              window.classList.add("minimizing");

              // Add receiving animation to the dock item
              targetDockItem.classList.add("receiving");

              // After animation completes, hide the window and reset classes
              setTimeout(() => {
                window.style.display = "none";
                window.classList.remove("minimizing");
                targetDockItem.classList.remove("receiving");
              }, 400); // Match this to the CSS animation duration
            }
          });
        });
      };

      // Initialize minimize animation after a short delay
      setTimeout(setupMinimizeAnimation, 500);
    };

    // Initialize animations after a short delay to ensure DOM is ready
    setTimeout(initDockAnimations, 500);

    // Cleanup event listeners on unmount
    return () => {
      const icons = document.querySelectorAll(".ico");
      const dockItems = document.querySelectorAll(".dock-container li");
      const minimizeButtons = document.querySelectorAll(
        ".window-control.minimize"
      );

      icons.forEach((item) => {
        item.removeEventListener("mouseover", () => {});
        item.removeEventListener("mouseleave", () => {});
      });

      dockItems.forEach((item) => {
        item.removeEventListener("click", () => {});
      });

      minimizeButtons.forEach((button) => {
        button.removeEventListener("click", () => {});
      });
    };
  }, []);

  return null;
};

export default DockEffect;
