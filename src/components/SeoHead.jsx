import { useEffect } from "react";

export default function SeoHead({ title, description, canonical, keywords, lang = "en", alternates = [] }) {
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

    upsertMeta("description", description);
    upsertMeta("keywords", keywords);

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
  }, [title, description, canonical, keywords, lang, alternates]);

  return null;
}
