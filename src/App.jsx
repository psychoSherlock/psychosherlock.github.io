// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Boot from "./pages/Boot";
import Plymouth from "./pages/Plymouth";
import Desktop from "./pages/Desktop";
import { ImageViewerProvider } from "./context/ImageViewerContext";
import { PDFViewerProvider } from "./context/PDFViewerContext";

export default function App() {
  return (
    <ImageViewerProvider>
      <PDFViewerProvider>
        <Routes>
          <Route path="/" element={<Boot />} />
          <Route path="/plymouth" element={<Plymouth />} />
          <Route path="/desktop" element={<Desktop />} />
        </Routes>
      </PDFViewerProvider>
    </ImageViewerProvider>
  );
}
