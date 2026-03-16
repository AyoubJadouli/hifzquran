import React from "react";
import { useParams } from "react-router-dom";
import MarketingLayout from "./MarketingLayout";
import SeoHead from "@/components/SeoHead";
import { MKT, SUPPORTED_LANGS, normalizeLang } from "./i18n";

export default function FeaturesPage() {
  const { lang: rawLang } = useParams();
  const lang = normalizeLang(rawLang || "en");
  const t = MKT[lang] || MKT.en;
  const alternates = SUPPORTED_LANGS.map((l) => ({ hrefLang: l, href: `https://hifdquran.los.ma/${l}/features` }));

  return (
    <MarketingLayout lang={lang}>
      <SeoHead
        title={`${t.name} | ${t.features}`}
        description={t.desc}
        canonical={`https://hifdquran.los.ma/${lang}/features`}
        keywords="quran memorization features, hifz workflow, quran recording app"
        lang={lang}
        alternates={alternates}
      />
      <h1 className="text-3xl font-bold text-[#F2D675]">{t.features}</h1>
      <div className="mt-6 space-y-4">
        {[
          ["Chunk Learning Engine", "Automatic chunk generation with overlap to reinforce memorization continuity."],
          ["Verse-by-Verse Recording", "Record, redo, and save each verse with clear progress steps."],
          ["Adaptive Repetition", "Control verse repetition, chunk repetition, and playback speed."],
          ["Surah Navigation", "Browse surahs, inspect chunk status, and jump directly to practice sessions."],
          ["Progress Insights", "Monitor streaks, completed chunks, and listening totals for accountability."],
          ["Language & Display Controls", "Choose translation language and customize text visibility settings."],
        ].map(([t, d]) => (
          <article key={t} className="rounded-xl border border-[#D4AF37]/30 p-4 bg-[#0E5B3D]">
            <h2 className="text-lg font-semibold text-[#F2D675]">{t}</h2>
            <p className="mt-1 text-sm text-[#F8F3E8]/85">{d}</p>
          </article>
        ))}
      </div>
    </MarketingLayout>
  );
}
