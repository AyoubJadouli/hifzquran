import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import { ThemeProvider } from "./components/ThemeContext";
import LocaleRedirect from "./pages/marketing/LocaleRedirect";
import LandingPage from "./pages/marketing/LandingPage";
import FeaturesPage from "./pages/marketing/FeaturesPage";
import AboutPage from "./pages/marketing/AboutPage";
import Home from "./pages/Home";
import Surahs from "./pages/Surahs";
import SurahDetail from "./pages/SurahDetail";
import Progress from "./pages/Progress";
import AppSettings from "./pages/AppSettings";
import Record from "./pages/Record";
import Recite from "./pages/Recite";
import PageNotFound from "./lib/PageNotFound";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LocaleRedirect />} />
          <Route path="/:lang" element={<LandingPage />} />
          <Route path="/:lang/features" element={<FeaturesPage />} />
          <Route path="/:lang/about" element={<AboutPage />} />
          <Route path="/features" element={<Navigate to="/en/features" replace />} />
          <Route path="/about" element={<Navigate to="/en/about" replace />} />
          <Route path="/download" element={<Navigate to="/en" replace />} />

          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="Home" replace />} />
            <Route path="Home" element={<Home />} />
            <Route path="Surahs" element={<Surahs />} />
            <Route path="SurahDetail" element={<SurahDetail />} />
            <Route path="Progress" element={<Progress />} />
            <Route path="AppSettings" element={<AppSettings />} />
            <Route path="Record" element={<Record />} />
            <Route path="recite/:chunkId" element={<Recite />} />
          </Route>

          {/* Backward compatibility for old routes */}
          <Route path="/Home" element={<Navigate to="/app/Home" replace />} />
          <Route path="/Surahs" element={<Navigate to="/app/Surahs" replace />} />
          <Route path="/SurahDetail" element={<Navigate to="/app/SurahDetail" replace />} />
          <Route path="/Progress" element={<Navigate to="/app/Progress" replace />} />
          <Route path="/AppSettings" element={<Navigate to="/app/AppSettings" replace />} />
          <Route path="/Record" element={<Navigate to="/app/Record" replace />} />
          <Route path="/recite/:chunkId" element={<Navigate to="/app/recite/:chunkId" replace />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
