import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { normalizeLang } from "./i18n";

export default function LocaleRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const browserLang = normalizeLang(navigator.language || "en");
    navigate(`/${browserLang}`, { replace: true });
  }, [navigate]);

  return null;
}
