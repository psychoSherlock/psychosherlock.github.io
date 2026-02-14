import React, { createContext, useState, useContext } from "react";
import ImageViewer from "../components/ImageViewer";

// Create the context
const ImageViewerContext = createContext();

// Provider component that will wrap the app
export const ImageViewerProvider = ({ children }) => {
  const [viewingImage, setViewingImage] = useState(null);
  const [siblingImages, setSiblingImages] = useState([]);

  // Function to open the image viewer with a specific image and optional siblings
  const openImageViewer = (imagePath, siblings = []) => {
    setViewingImage(imagePath);
    setSiblingImages(siblings);
  };

  // Function to close the image viewer
  const closeImageViewer = () => {
    setViewingImage(null);
    setSiblingImages([]);
  };

  return (
    <ImageViewerContext.Provider
      value={{
        viewingImage,
        siblingImages,
        openImageViewer,
        closeImageViewer,
      }}
    >
      {children}
      {/* Render the ImageViewer outside of any component hierarchy */}
      {viewingImage && (
        <ImageViewer
          image={viewingImage}
          siblings={siblingImages}
          onClose={closeImageViewer}
        />
      )}
    </ImageViewerContext.Provider>
  );
};

// Custom hook for using the image viewer context
export const useImageViewer = () => {
  const context = useContext(ImageViewerContext);
  if (!context) {
    throw new Error(
      "useImageViewer must be used within an ImageViewerProvider"
    );
  }
  return context;
};
