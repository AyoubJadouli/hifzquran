import React, { useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useThemeColors } from "./useThemeColors";
import { getAppT, getAppDir, normalizeAppLang } from "./appI18n";
import { useSettings } from "./useSettings";
import { Home, BookOpen, ScrollText, BarChart3, Settings } from "lucide-react";

export default function AppLayout() {
  const location = useLocation();
  const t = useThemeColors();
  const { settings } = useSettings();
  const i18n = getAppT(settings.display_language);
  const dir = getAppDir(settings.display_language);
  const langAttr = normalizeAppLang(settings.display_language);

  useEffect(() => {
    const root = document.documentElement;
    root.dir = dir;
    root.lang = langAttr;

    document.body.dir = dir;
    document.body.lang = langAttr;
  }, [dir, langAttr]);

  const NAV_ITEMS = [
    { path: "/Home", icon: Home, label: i18n.navHome },
    { path: "/Reader", icon: ScrollText, label: i18n.navReader || "Reader" },
    { path: "/Surahs", icon: BookOpen, label: i18n.navSurahs },
    { path: "/Progress", icon: BarChart3, label: i18n.navProgress },
    { path: "/AppSettings", icon: Settings, label: i18n.navSettings },
  ];

  // Hide nav on immersive pages
  const hideNav =
    location.pathname.startsWith("/app/Record") ||
    location.pathname.startsWith("/app/recite/") ||
    location.pathname.startsWith("/Record") ||
    location.pathname.startsWith("/recite/");

  return (
    <div className="flex flex-col h-screen bg-background" dir={dir} lang={langAttr}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-amiri { font-family: 'Amiri', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>
      
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

      {!hideNav && (
        <nav
          className="pb-safe"
          style={{
            background: t.controlBg,
            borderTop: "1.5px solid #D4AF37",
            boxShadow: t.controlBgShadow,
          }}
        >
          <div
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              height: "64px",
              backgroundImage: t.pageBgPattern,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative flex justify-around items-center h-16 max-w-lg mx-auto px-2">
            {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
              const isActive =
                location.pathname === path ||
                (path === "/Home" && location.pathname === "/");
              return (
                <Link
                  key={path}
                  to={path}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 transition-all"
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`}
                    style={{ color: isActive ? "#F2D675" : "rgba(212,175,55,0.42)" }}
                  />
                  <span
                    className={`text-[10px] font-inter ${isActive ? "font-bold" : "font-medium"}`}
                    style={{ color: isActive ? "#F2D675" : "rgba(212,175,55,0.42)" }}
                  >
                    {label}
                  </span>
                  {isActive && (
                    <div
                      className="w-1 h-1 rounded-full -mt-0.5"
                      style={{ background: "#D4AF37" }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}