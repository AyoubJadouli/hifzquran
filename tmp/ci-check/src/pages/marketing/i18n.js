export const SUPPORTED_LANGS = ["en", "fr", "ar", "tr", "zh", "es", "de", "ur", "id", "pt"];

export function normalizeLang(input) {
  const raw = (input || "").toLowerCase();
  if (!raw) return "en";
  const short = raw.split("-")[0];
  return SUPPORTED_LANGS.includes(short) ? short : "en";
}

export const MKT = {
  en: {
    name: "Hifd Quran",
    hero: "Memorize Quran with your own voice",
    desc: "Hifz Quran is a Quran memorization app that uses your own recorded voice to help you memorize through recitation, repetition, and active recall.",
    openApp: "Open App",
    features: "Features",
    about: "About",
  },
  fr: { name: "Hifd Quran", hero: "Mémorisez le Coran intelligemment", desc: "Plateforme de mémorisation du Coran avec répétition, enregistrement et suivi de progression.", openApp: "Ouvrir l'app", features: "Fonctionnalités", about: "À propos" },
  ar: { name: "حفظ القرآن", hero: "احفظ القرآن بتكرار ذكي", desc: "منصة موجهة لحفظ القرآن بالتسجيل والتكرار وتتبع التقدم.", openApp: "فتح التطبيق", features: "المميزات", about: "حول" },
  tr: { name: "Hifd Quran", hero: "Akıllı tekrar ile Kur'an ezberi", desc: "Kayıt, tekrar ve ilerleme takibi ile yapılandırılmış ezber platformu.", openApp: "Uygulamayı Aç", features: "Özellikler", about: "Hakkında" },
  zh: { name: "Hifd Quran", hero: "智能重复辅助古兰经记忆", desc: "通过录音、重复和进度追踪进行系统化背诵。", openApp: "打开应用", features: "功能", about: "关于" },
  es: { name: "Hifd Quran", hero: "Memoriza el Corán con repetición inteligente", desc: "Plataforma para Hifz con grabación, repetición y seguimiento de progreso.", openApp: "Abrir App", features: "Funciones", about: "Acerca de" },
  de: { name: "Hifd Quran", hero: "Koran auswendig lernen mit smarter Wiederholung", desc: "Strukturierte Hifz-Plattform mit Aufnahme, Wiederholung und Fortschrittstracking.", openApp: "App öffnen", features: "Funktionen", about: "Über" },
  ur: { name: "حفظ قرآن", hero: "سمارٹ ریپیٹیشن کے ساتھ قرآن حفظ کریں", desc: "ریکارڈنگ، تکرار اور پروگریس ٹریکنگ کے ساتھ حفظ کا منظم نظام۔", openApp: "ایپ کھولیں", features: "خصوصیات", about: "تعارف" },
  id: { name: "Hifd Quran", hero: "Hafal Quran dengan pengulangan cerdas", desc: "Platform Hifz terstruktur dengan rekaman, pengulangan, dan pelacakan progres.", openApp: "Buka Aplikasi", features: "Fitur", about: "Tentang" },
  pt: { name: "Hifd Quran", hero: "Memorize o Alcorão com repetição inteligente", desc: "Plataforma de Hifz com gravação, repetição e acompanhamento de progresso.", openApp: "Abrir App", features: "Recursos", about: "Sobre" },
};
