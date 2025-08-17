import React, { createContext, useState, useContext } from "react";
import PDFViewer from "../components/PDFViewer";

// Create the context
const PDFViewerContext = createContext();

// Provider component that will wrap the app
export const PDFViewerProvider = ({ children }) => {
  const [viewingPdf, setViewingPdf] = useState(null);

  // Function to open the PDF viewer with a specific PDF
  const openPdfViewer = (pdfPath) => {
    setViewingPdf(pdfPath);
  };

  // Function to close the PDF viewer
  const closePdfViewer = () => {
    setViewingPdf(null);
  };

  return (
    <PDFViewerContext.Provider
      value={{ viewingPdf, openPdfViewer, closePdfViewer }}
    >
      {children}
      {/* Render the PDFViewer outside of any component hierarchy */}
      {viewingPdf && <PDFViewer pdf={viewingPdf} onClose={closePdfViewer} />}
    </PDFViewerContext.Provider>
  );
};

// Custom hook for using the PDF viewer context
export const usePdfViewer = () => {
  const context = useContext(PDFViewerContext);
  if (!context) {
    throw new Error("usePdfViewer must be used within a PDFViewerProvider");
  }
  return context;
};
