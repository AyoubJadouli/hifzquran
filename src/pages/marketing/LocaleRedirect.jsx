import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { normalizeLang } from "./i18n";

const FIRST_VISIT_KEY = "hifz_marketing_seen";

function isCrawler() {
  if (typeof navigator === "undefined") return true;
  const ua = navigator.userAgent || "";
  return /bot|crawler|spider|crawling|google|bing|yandex|baidu|duckduckbot|facebookexternalhit|twitterbot|slurp/i.test(ua);
}

export default function LocaleRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const browserLang = normalizeLang(navigator.language || "en");
    if (isCrawler()) {
      navigate(`/${browserLang}`, { replace: true });
      return;
    }

    const hasSeenMarketing = localStorage.getItem(FIRST_VISIT_KEY) === "1";
    if (!hasSeenMarketing) {
      localStorage.setItem(FIRST_VISIT_KEY, "1");
      navigate(`/${browserLang}`, { replace: true });
      return;
    }

    navigate("/app/Home", { replace: true });
  }, [navigate]);

  return null;
}
