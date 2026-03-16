import React from "react";
import { Link } from "react-router-dom";

export default function MarketingLayout({ children, lang = "en" }) {
  return (
    <div className="min-h-screen bg-[#0A412B] text-[#F8F3E8]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <header className="border-b border-[#D4AF37]/30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to={`/${lang}`} className="font-bold text-lg text-[#F2D675]">Hifd Quran</Link>
          <nav className="flex gap-4 text-sm">
            <Link to={`/${lang}/features`} className="hover:text-[#F2D675]">Features</Link>
            <Link to={`/${lang}/about`} className="hover:text-[#F2D675]">About</Link>
            <a href="https://makne.app" target="_blank" rel="noreferrer" className="hover:text-[#F2D675]">Makne.app</a>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-10">{children}</main>
      <footer className="border-t border-[#D4AF37]/20 mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6 text-xs text-[#F8F3E8]/80">
          © {new Date().getFullYear()} Hifd Quran · hifdquran.los.ma
        </div>
      </footer>
    </div>
  );
}
