import React from "react";
import { useParams } from "react-router-dom";
import MarketingLayout from "./MarketingLayout";
import SeoHead from "@/components/SeoHead";
import { MKT, SUPPORTED_LANGS, normalizeLang } from "./i18n";

export default function AboutPage() {
  const { lang: rawLang } = useParams();
  const lang = normalizeLang(rawLang || "en");
  const t = MKT[lang] || MKT.en;
  const siteUrl = "https://hifzquran.los.ma";
  const pageUrl = `${siteUrl}/${lang}/about`;
  const imageUrl = `${siteUrl}/assets/5811a2a1-a940-415f-aca8-78cbfc549bc9.png`;
  const alternates = SUPPORTED_LANGS.map((l) => ({ hrefLang: l, href: `${siteUrl}/${l}/about` }));
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `${t.name} ${t.about}`,
    description: t.aboutMetaDescription || t.desc,
    url: pageUrl,
    inLanguage: lang,
    image: imageUrl,
  };

  return (
    <MarketingLayout lang={lang}>
      <SeoHead
        title={`${t.name} | ${t.about}`}
        description={t.aboutMetaDescription || t.desc}
        canonical={pageUrl}
        keywords="about hifd quran, quran memorization method, islamic learning app"
        lang={lang}
        alternates={alternates}
        image={imageUrl}
        schema={schema}
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
