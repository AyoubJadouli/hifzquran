import React from "react";
import { useSettings } from "../components/useSettings";
import {
  SUPPORTED_RIWAYAT,
  SUPPORTED_TRANSLITERATION_LANGUAGES,
  SUPPORTED_TRANSLITERATION_SOURCES,
} from "../components/quranData";
// No server needed — all data is stored locally in the browser
import { useTheme } from "../components/ThemeContext";
import { useThemeColors } from "../components/useThemeColors";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Moon, Sun } from "lucide-react";

const LANGUAGES = {
  en: "English", ar: "العربية", fr: "Français", es: "Español",
  de: "Deutsch", tr: "Türkçe", ur: "اردو", id: "Bahasa Indonesia",
};

const RIWAYAT = Object.fromEntries(
  Object.entries(SUPPORTED_RIWAYAT).map(([key, value]) => [key, value.label])
);

const TRANSLITERATION_LANGUAGES = Object.fromEntries(
  Object.entries(SUPPORTED_TRANSLITERATION_LANGUAGES).map(([key, value]) => [key, value.label])
);

const TRANSLITERATION_SOURCES = Object.fromEntries(
  Object.entries(SUPPORTED_TRANSLITERATION_SOURCES).map(([key, value]) => [key, value.label])
);

const HIFZ_ORDERS = {
  forward: "Forward (Al-Fatiha → An-Nas)",
  reverse: "Reverse (An-Nas → Al-Fatiha)",
  revelation_forward: "Revelation Order (Forward)",
  revelation_reverse: "Revelation Order (Reverse)",
};

export default function AppSettings() {
  const { settings, updateSettings, loading } = useSettings();
  const { theme, setTheme } = useTheme();
  const t = useThemeColors();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full" style={{ background: t.pageBg }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: t.gold }} />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: t.pageBg, backgroundImage: t.pageBgPattern, backgroundSize: "48px 48px" }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 pt-5 pb-6 relative overflow-hidden"
        style={{ background: t.headerBg, boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: t.pageBgPattern, backgroundSize: "48px 48px" }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: "1.5px", background: `linear-gradient(to right, transparent, ${t.goldLight} 20%, ${t.gold} 50%, ${t.goldLight} 80%, transparent)` }} />
        <div className="relative z-10 text-center">
          <p className="font-amiri" style={{ fontSize: "22px", color: t.goldLight, textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>الإعدادات</p>
          <p className="font-inter font-bold" style={{ fontSize: "15px", color: t.textOnDark, marginTop: "2px" }}>Settings</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 pb-8">

        {/* Appearance */}
        <LuxSection title="Appearance" t={t}>
          <div className="flex items-center justify-between">
            <span className="font-inter font-medium text-sm" style={{ color: t.textPrimary }}>Theme</span>
            <div className="flex gap-2">
              {[
                { val: "light", icon: Sun, label: "Light" },
                { val: "dark", icon: Moon, label: "Dark" },
              ].map(({ val, icon: Icon, label }) => (
                <button key={val} onClick={() => setTheme(val)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-inter text-xs font-semibold transition-all relative overflow-hidden"
                  style={theme === val ? {
                    background: t.goldGradient, color: "#2B241B",
                    boxShadow: t.goldShadow, border: `1px solid ${t.goldDark}`,
                  } : {
                    background: "rgba(212,175,55,0.08)", color: t.gold,
                    border: `1px solid ${t.cardBorder}`,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </LuxSection>

        {/* Chunk Configuration */}
        <LuxSection title="Chunk Configuration" t={t}>
          <LuxRow label="Chunk Size" t={t}>
            <LuxSelect value={String(settings.chunk_size)} onChange={v => updateSettings({ chunk_size: parseInt(v) })} t={t}>
              {[3, 5, 7, 10, 15].map(n => <SelectItem key={n} value={String(n)}>{n} verses</SelectItem>)}
            </LuxSelect>
          </LuxRow>
          <LuxRow label="Overlap" t={t}>
            <LuxSelect value={String(settings.chunk_overlap)} onChange={v => updateSettings({ chunk_overlap: parseInt(v) })} t={t}>
              {[0, 1, 2, 3, 5].map(n => <SelectItem key={n} value={String(n)}>{n} verses</SelectItem>)}
            </LuxSelect>
          </LuxRow>
        </LuxSection>

        {/* Hifz Order */}
        <LuxSection title="Hifz Order" t={t}>
          <div className="space-y-2">
            {Object.entries(HIFZ_ORDERS).map(([key, label]) => (
              <button key={key} onClick={() => updateSettings({ hifz_order: key })}
                className="w-full text-left px-4 py-3 rounded-xl font-inter text-sm transition-all relative overflow-hidden"
                style={settings.hifz_order === key ? {
                  background: t.greenBtnBg, color: t.textOnDark,
                  border: `1px solid ${t.cardBorder}`, boxShadow: t.greenBtnShadow,
                } : {
                  background: "rgba(212,175,55,0.06)", color: t.textPrimary,
                  border: `1px solid ${t.cardBorder}`,
                }}
              >
                {settings.hifz_order === key && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: t.gold }}>✦</span>
                )}
                {label}
              </button>
            ))}
          </div>
        </LuxSection>

        {/* Display */}
        <LuxSection title="Display" t={t}>
          <LuxRow label="Riwaya" t={t}>
            <LuxSelect value={settings.quran_riwaya} onChange={v => updateSettings({ quran_riwaya: v })} t={t} wide>
              {Object.entries(RIWAYAT).map(([code, name]) => <SelectItem key={code} value={code}>{name}</SelectItem>)}
            </LuxSelect>
          </LuxRow>
          <LuxRow label="Language" t={t}>
            <LuxSelect value={settings.display_language} onChange={v => updateSettings({ display_language: v })} t={t} wide>
              {Object.entries(LANGUAGES).map(([code, name]) => <SelectItem key={code} value={code}>{name}</SelectItem>)}
            </LuxSelect>
          </LuxRow>
          <LuxRow label="Translit. Language" t={t}>
            <LuxSelect value={settings.transliteration_language} onChange={v => updateSettings({ transliteration_language: v })} t={t} wide>
              {Object.entries(TRANSLITERATION_LANGUAGES).map(([code, name]) => <SelectItem key={code} value={code}>{name}</SelectItem>)}
            </LuxSelect>
          </LuxRow>
          <LuxRow label="Translit. Source" t={t}>
            <LuxSelect value={settings.transliteration_source} onChange={v => updateSettings({ transliteration_source: v })} t={t} wide>
              {Object.entries(TRANSLITERATION_SOURCES).map(([code, name]) => <SelectItem key={code} value={code}>{name}</SelectItem>)}
            </LuxSelect>
          </LuxRow>
          <LuxSwitchRow
            label="Offline Transliteration Packs"
            checked={settings.offline_download_transliteration}
            onChange={v => updateSettings({ offline_download_transliteration: v })}
            t={t}
          />
          <LuxSwitchRow label="Show Arabic" checked={settings.show_arabic} onChange={v => updateSettings({ show_arabic: v })} t={t} />
          <LuxSwitchRow label="Show Transliteration" checked={settings.show_transliteration} onChange={v => updateSettings({ show_transliteration: v })} t={t} />
          <LuxSwitchRow label="Show Translation" checked={settings.show_translation} onChange={v => updateSettings({ show_translation: v })} t={t} />
        </LuxSection>

        {/* Default Playback */}
        <LuxSection title="Default Playback" t={t}>
          <LuxRow label="Speed" t={t}>
            <LuxSelect value={String(settings.default_speed)} onChange={v => updateSettings({ default_speed: parseFloat(v) })} t={t}>
              {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(s => <SelectItem key={s} value={String(s)}>{s}x</SelectItem>)}
            </LuxSelect>
          </LuxRow>
          <LuxRow label="Verse Repetition" t={t}>
            <LuxSelect value={String(settings.default_verse_repetition)} onChange={v => updateSettings({ default_verse_repetition: parseInt(v) })} t={t}>
              {[1, 2, 3, 10].map(n => <SelectItem key={n} value={String(n)}>{n}x</SelectItem>)}
            </LuxSelect>
          </LuxRow>
          <LuxRow label="Chunk Repetition" t={t}>
            <LuxSelect value={String(settings.default_chunk_repetition)} onChange={v => updateSettings({ default_chunk_repetition: parseInt(v) })} t={t}>
              {[1, 2, 3, 0].map(n => <SelectItem key={n} value={String(n)}>{n === 0 ? "∞" : `${n}x`}</SelectItem>)}
            </LuxSelect>
          </LuxRow>
        </LuxSection>

        {/* Tip */}
        <div className="rounded-2xl px-5 py-4 relative overflow-hidden"
          style={{ background: t.tipBg, border: `1.5px solid ${t.gold}`, boxShadow: t.cardShadow }}>
          <div className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{ height: "40%", background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)", borderRadius: "14px 14px 0 0" }} />
          <p className="font-inter italic relative z-10" style={{ fontSize: "12.5px", color: t.tipText, lineHeight: 1.65 }}>
            ✨ "Consistency is the key to Hifz. Keep going, and Allah will guide you!"
          </p>
        </div>

      </div>
    </div>
  );
}

function GoldDivider({ t }) {
  return <div style={{ height: "1px", background: `linear-gradient(to right, transparent, ${t.cardBorder}, transparent)`, margin: "0 -16px" }} />;
}

function LuxSection({ title, children, t }) {
  const childArray = React.Children.toArray(children);
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 px-1">
        <div style={{ height: "1.5px", width: "14px", background: t.gold, borderRadius: "2px" }} />
        <span className="font-inter font-bold uppercase tracking-widest" style={{ fontSize: "9px", color: t.sectionTitleColor }}>{title}</span>
        <div style={{ flex: 1, height: "1.5px", background: `linear-gradient(to right, ${t.gold}, transparent)`, borderRadius: "2px" }} />
      </div>
      <div className="rounded-2xl px-4 py-3 space-y-3 relative overflow-hidden"
        style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, boxShadow: t.cardShadow }}>
        <span className="absolute top-1.5 right-2.5 select-none pointer-events-none" style={{ color: t.gold, fontSize: "8px", opacity: 0.3 }}>◆</span>
        {childArray.map((child, i) => (
          <React.Fragment key={i}>
            {i > 0 && <GoldDivider t={t} />}
            {child}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function LuxRow({ label, children, t }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="font-inter font-medium text-sm" style={{ color: t.textPrimary }}>{label}</span>
      {children}
    </div>
  );
}

function LuxSwitchRow({ label, checked, onChange, t }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="font-inter font-medium text-sm" style={{ color: t.textPrimary }}>{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function LuxSelect({ value, onChange, children, t, wide }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`${wide ? "w-36" : "w-28"} font-inter text-sm`}
        style={{ background: "rgba(212,175,55,0.06)", border: `1px solid ${t.cardBorder}`, color: t.textPrimary }}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {children}
      </SelectContent>
    </Select>
  );
}