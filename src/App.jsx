// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Boot from "./pages/Boot";
import Plymouth from "./pages/Plymouth";
import Desktop from "./pages/Desktop";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Boot />} />
      <Route path="/plymouth" element={<Plymouth />} />
      <Route path="/desktop" element={<Desktop />} />
    </Routes>
  );
}
