import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import React from "react";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import About from "./pages/Settings";
import { Route, Routes, useLocation } from "react-router-dom";
import SideBar from "./components/SideBar";
import Links from "./pages/Links";
import PageTransition from "./components/PageTransition";
import { useRecoilState } from "recoil";
import { NAVOPEN } from "./recoil/recoil";

function App() {
  const location = useLocation();
  const [showNav, setShowNav] = useRecoilState(NAVOPEN);

  return (
    <div className="app">
      <SideBar />
      {showNav && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setShowNav(false)}
        />
      )}
      <div
        className={[
          "app-side",
          location.pathname === "/" && "app-side--home",
          (location.pathname === "/links" ||
            location.pathname === "/analytics") &&
            "app-side--toolbar",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Navbar />
        <PageTransition>
          <Routes location={location}>
            <Route path="/" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/links" element={<Links />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </div>
    </div>
  );
}

export default App;
