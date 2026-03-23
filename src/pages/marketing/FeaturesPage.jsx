import React from "react";
import { useParams } from "react-router-dom";
import MarketingLayout from "./MarketingLayout";
import SeoHead from "@/components/SeoHead";
import { MKT, SUPPORTED_LANGS, normalizeLang } from "./i18n";

export default function FeaturesPage() {
  const { lang: rawLang } = useParams();
  const lang = normalizeLang(rawLang || "en");
  const t = MKT[lang] || MKT.en;
  const siteUrl = "https://hifzquran.los.ma";
  const pageUrl = `${siteUrl}/${lang}/features`;
  const imageUrl = `${siteUrl}/assets/5811a2a1-a940-415f-aca8-78cbfc549bc9.png`;
  const alternates = SUPPORTED_LANGS.map((l) => ({ hrefLang: l, href: `${siteUrl}/${l}/features` }));
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${t.name} ${t.features}`,
    description: t.desc,
    url: pageUrl,
    inLanguage: lang,
    image: imageUrl,
  };

  return (
    <MarketingLayout lang={lang}>
      <SeoHead
        title={`${t.name} | ${t.features}`}
        description={t.featuresMetaDescription || t.desc}
        canonical={pageUrl}
        keywords="quran memorization features, hifz workflow, quran recording app"
        lang={lang}
        alternates={alternates}
        image={imageUrl}
        schema={schema}
      />
      <h1 className="text-3xl font-bold text-[#F2D675]">{t.features}</h1>
      <div className="mt-6 space-y-4">
        {(t.featuresItems || []).map(([title, desc]) => (
          <article key={title} className="rounded-xl border border-[#D4AF37]/30 p-4 bg-[#0E5B3D]">
            <h2 className="text-lg font-semibold text-[#F2D675]">{title}</h2>
            <p className="mt-1 text-sm text-[#F8F3E8]/85">{desc}</p>
          </article>
        ))}
      </div>
    </MarketingLayout>
  );
}
