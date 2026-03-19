import React from "react";
import { useParams } from "react-router-dom";
import MarketingLayout from "./MarketingLayout";
import SeoHead from "@/components/SeoHead";
import { MKT, SUPPORTED_LANGS, normalizeLang } from "./i18n";

export default function AboutPage() {
  const { lang: rawLang } = useParams();
  const lang = normalizeLang(rawLang || "en");
  const t = MKT[lang] || MKT.en;
  const alternates = SUPPORTED_LANGS.map((l) => ({ hrefLang: l, href: `https://hifdquran.los.ma/${l}/about` }));

  return (
    <MarketingLayout lang={lang}>
      <SeoHead
        title={`${t.name} | ${t.about}`}
        description={t.desc}
        canonical={`https://hifdquran.los.ma/${lang}/about`}
        keywords="about hifd quran, quran memorization method, islamic learning app"
        lang={lang}
        alternates={alternates}
      />
      <h1 className="text-3xl font-bold text-[#F2D675]">{t.about}</h1>
      <div className="mt-6 space-y-4 text-[#F8F3E8]/90">
        {(t.aboutParagraphs || []).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </MarketingLayout>
  );
}
