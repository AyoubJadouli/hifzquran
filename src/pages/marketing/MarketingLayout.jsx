import React from "react";
import { Link } from "react-router-dom";
import { MKT } from "./i18n";

export default function MarketingLayout({ children, lang = "en" }) {
  const t = MKT[lang] || MKT.en;
  return (
    <div className="min-h-screen bg-[#0A412B] text-[#F8F3E8]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <header className="border-b border-[#D4AF37]/30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to={`/${lang}/landing`} className="font-bold text-lg text-[#F2D675]">{t.name}</Link>
          <nav className="flex gap-4 text-sm">
            <Link to={`/${lang}/features`} className="hover:text-[#F2D675]">{t.features}</Link>
            <Link to={`/${lang}/about`} className="hover:text-[#F2D675]">{t.about}</Link>
            <a href="https://ai7sky.com/" target="_blank" rel="noreferrer" className="hover:text-[#F2D675]">{t.visitMakne}</a>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-10">{children}</main>
      <footer className="border-t border-[#D4AF37]/20 mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6 text-xs text-[#F8F3E8]/80">
          {t.footer.replace("{year}", String(new Date().getFullYear()))}
        </div>
      </footer>
    </div>
  );
}
