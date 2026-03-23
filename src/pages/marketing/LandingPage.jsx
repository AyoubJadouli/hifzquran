import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import MarketingLayout from "./MarketingLayout";
import SeoHead from "@/components/SeoHead";
import { MKT, normalizeLang, SUPPORTED_LANGS } from "./i18n";

export default function LandingPage() {
  const { lang: rawLang } = useParams();
  const lang = normalizeLang(rawLang || "en");
  const t = MKT[lang] || MKT.en;
  const siteUrl = "https://hifzquran.los.ma";
  const pageUrl = `${siteUrl}/${lang}/landing`;
  const imageUrl = `${siteUrl}/assets/5811a2a1-a940-415f-aca8-78cbfc549bc9.png`;
  const alternates = SUPPORTED_LANGS.map((l) => ({ hrefLang: l, href: `https://hifdquran.los.ma/${l}` }));
  const isEn = lang === "en";
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: t.name,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description: t.desc,
    url: pageUrl,
    image: imageUrl,
    inLanguage: lang,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: "AI7SKY",
      url: "https://ai7sky.com/",
    },
  };

  return (
    <MarketingLayout lang={lang}>
      <SeoHead
        title={`${t.name} | ${t.hero}`}
        description={t.desc}
        canonical={pageUrl}
        keywords="hifz quran app, quran memorization app, memorize quran with your own voice, quran memorization by listening, record your recitation quran app, hifz app with repeat playback"
        lang={lang}
        image={imageUrl}
        alternates={alternates.map((item) => ({ ...item, href: `${siteUrl}/${item.hrefLang}/landing` }))}
        schema={schema}
      />

      <section className="text-center py-8">
        <h1 className="text-4xl font-bold text-[#F2D675]">{t.name}</h1>
        <h2 className="mt-2 text-2xl font-semibold text-[#F8F3E8]">{t.hero}</h2>
        <p className="mt-4 text-lg max-w-3xl mx-auto text-[#F8F3E8]/90">
          {t.desc}
        </p>
        {isEn && (
          <p className="mt-3 text-base max-w-3xl mx-auto text-[#F8F3E8]/85">
            Instead of only listening to a generic reciter, you recite, record, and replay each passage until it becomes natural in memory.
            This learning flow is based on memory research principles such as self-generation, vocal production, repetition, and active recall.
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/app/Home" className="px-5 py-3 rounded-xl bg-[#D4AF37] text-[#2B241B] font-semibold">{t.openApp}</Link>
          <Link to={`/${lang}/features`} className="px-5 py-3 rounded-xl border border-[#D4AF37] font-semibold">{t.features}</Link>
          <a href="https://ai7sky.com/" target="_blank" rel="noreferrer" className="px-5 py-3 rounded-xl border border-[#F2D675]/50">{t.visitMakne}</a>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4 mt-8">
        {[
          [t.smartChunking, t.smartChunkingDesc],
          [t.recitationRecording, t.recitationRecordingDesc],
          [t.progressIntelligence, t.progressIntelligenceDesc],
        ].map(([title, body]) => (
          <article key={title} className="rounded-2xl border border-[#D4AF37]/30 p-5 bg-[#0E5B3D]">
            <h2 className="text-xl font-semibold text-[#F2D675]">{title}</h2>
            <p className="mt-2 text-sm text-[#F8F3E8]/85">{body}</p>
          </article>
        ))}
      </section>

      {isEn && (
        <section className="mt-12 space-y-8">
          <article className="rounded-2xl border border-[#D4AF37]/30 p-6 bg-[#0E5B3D]">
            <h2 className="text-2xl font-semibold text-[#F2D675]">How this Hifz Quran app works</h2>
            <p className="mt-3 text-[#F8F3E8]/90">
              Hifz Quran uses your own voice as the center of memorization. You record recitation chunk by chunk,
              then replay your recordings through the day for review and reinforcement.
            </p>
            <p className="mt-2 text-[#F8F3E8]/85">
              This method makes Quran memorization more personal and more active than passive listening alone,
              and it aligns with evidence-based memory techniques used in modern learning science.
            </p>
          </article>

          <article className="rounded-2xl border border-[#D4AF37]/30 p-6 bg-[#0E5B3D]">
            <h2 className="text-2xl font-semibold text-[#F2D675]">FAQ — Quran memorization by listening and repetition</h2>
            <div className="mt-4 space-y-4 text-[#F8F3E8]/90">
              <div>
                <h3 className="font-semibold text-[#F2D675]">What makes Hifz Quran different?</h3>
                <p>Its key advantage is voice-based memorization: record your own recitation, replay it, and strengthen retention with active recall.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#F2D675]">Is this suitable for daily Hifz practice?</h3>
                <p>Yes. The app is designed for short, consistent sessions with chunk learning, repeat playback, and progress tracking.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#F2D675]">Can I use it as a Quran memorization app with recording?</h3>
                <p>Yes. You can record each verse, redo recitation, and save structured sessions for review.</p>
              </div>
            </div>
          </article>
        </section>
      )}
    </MarketingLayout>
  );
}
