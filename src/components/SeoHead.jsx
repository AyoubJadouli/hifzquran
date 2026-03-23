import { useEffect } from "react";

export default function SeoHead({
  title,
  description,
  canonical,
  keywords,
  lang = "en",
  alternates = [],
  image,
  type = "website",
  siteName = "Hifd Quran",
  robots = "index, follow",
  schema,
}) {
  useEffect(() => {
    if (title) document.title = title;
    document.documentElement.setAttribute("lang", lang);

    const upsertMeta = (name, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[name='${name}']`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const upsertPropertyMeta = (property, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[property='${property}']`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    upsertMeta("description", description);
    upsertMeta("keywords", keywords);
    upsertMeta("robots", robots);
    upsertMeta("twitter:card", image ? "summary_large_image" : "summary");
    upsertMeta("twitter:title", title);
    upsertMeta("twitter:description", description);
    upsertMeta("twitter:image", image);

    upsertPropertyMeta("og:title", title);
    upsertPropertyMeta("og:description", description);
    upsertPropertyMeta("og:type", type);
    upsertPropertyMeta("og:url", canonical);
    upsertPropertyMeta("og:site_name", siteName);
    upsertPropertyMeta("og:locale", lang);
    upsertPropertyMeta("og:image", image);

    if (canonical) {
      let link = document.querySelector("link[rel='canonical']");
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }

    document.querySelectorAll("link[rel='alternate'][data-seo='true']").forEach((n) => n.remove());
    alternates.forEach(({ hrefLang, href }) => {
      if (!hrefLang || !href) return;
      const alt = document.createElement("link");
      alt.setAttribute("rel", "alternate");
      alt.setAttribute("hrefLang", hrefLang);
      alt.setAttribute("href", href);
      alt.setAttribute("data-seo", "true");
      document.head.appendChild(alt);
    });

    document.querySelectorAll("script[type='application/ld+json'][data-seo='true']").forEach((n) => n.remove());
    if (schema) {
      const script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("data-seo", "true");
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [title, description, canonical, keywords, lang, alternates]);

  return null;
}
