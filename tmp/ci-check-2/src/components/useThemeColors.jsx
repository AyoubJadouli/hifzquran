import { useTheme } from "./ThemeContext";

const LIGHT = {
  // Backgrounds
  pageBg: "#F8F3E8",
  pageBgPattern: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cpath d='M24 3 L26 22 L45 24 L26 26 L24 45 L22 26 L3 24 L22 22 Z' fill='%23D4AF37' fill-opacity='0.055'/%3E%3C/svg%3E")`,

  // Header
  headerBg: "linear-gradient(180deg, #0B5B3B 0%, #0F6B45 55%, #137A4E 100%)",
  headerTitle: "#F2D675",
  headerSubtext: "rgba(240,230,200,0.6)",

  // Cards
  cardBg: "linear-gradient(160deg, #FFFBF2 0%, #F8F0DC 100%)",
  cardBorder: "rgba(212,175,55,0.28)",
  cardShadow: "0 2px 10px rgba(0,0,0,0.08)",

  // Text
  textPrimary: "#1A3828",
  textMuted: "#6E6252",
  textOnDark: "#F0E6C8",

  // Gold (same in both themes)
  gold: "#D4AF37",
  goldLight: "#F2D675",
  goldDark: "#8B6A1F",
  goldGradient: "linear-gradient(145deg, #F2D675 0%, #D4AF37 55%, #8B6A1F 100%)",
  goldShadow: "0 2px 8px rgba(139,106,31,0.4)",

  // Control bar / nav
  controlBg: "linear-gradient(180deg, #0C5A39 0%, #0A4D31 100%)",
  controlBgShadow: "0 -4px 20px rgba(0,0,0,0.28)",

  // Active verse card
  activeCardBg: "linear-gradient(160deg, #0A4E31 0%, #0E6A43 35%, #13784C 55%, #0E6A43 78%, #0A4E31 100%)",
  activeCardText: "#F5EDD0",

  // Preview verse card
  previewCardBg: "linear-gradient(160deg, #F3EEE3 0%, #EFE7D8 100%)",
  previewCardBorder: "#D8CCB4",
  previewCardText: "#4A3F33",

  // Buttons
  greenBtnBg: "linear-gradient(160deg, #136B47 0%, #0E5B3D 55%, #0A412B 100%)",
  greenBtnShadow: "0 3px 12px rgba(10,65,43,0.45)",

  // Section title color
  sectionTitleColor: "#B98218",

  // Tip card
  tipBg: "linear-gradient(145deg, #F8E8C2 0%, #F0D9A8 100%)",
  tipText: "#006400",

  // Stat card override
  statCardBg: "linear-gradient(145deg, #F1C40F 0%, #D4AF37 60%, #B8920F 100%)",
  statCardText: "#004d20",

  // Chart bg
  chartBg: "rgba(0,0,0,0.06)",
  chartBorder: "rgba(212,175,55,0.2)",
  chartTextColor: "#1A3828",
};

const DARK = {
  // Backgrounds
  pageBg: "#0A0812",
  pageBgPattern: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cpath d='M24 3 L26 22 L45 24 L26 26 L24 45 L22 26 L3 24 L22 22 Z' fill='%238B5CF6' fill-opacity='0.06'/%3E%3C/svg%3E")`,

  // Header — deep purple
  headerBg: "linear-gradient(180deg, #150D2E 0%, #1E1040 55%, #261450 100%)",
  headerTitle: "#F2D675",
  headerSubtext: "rgba(240,220,170,0.55)",

  // Cards — dark purple surface
  cardBg: "linear-gradient(160deg, #1A1330 0%, #211840 100%)",
  cardBorder: "rgba(212,175,55,0.22)",
  cardShadow: "0 2px 12px rgba(0,0,0,0.45)",

  // Text
  textPrimary: "#E8DDB8",
  textMuted: "#9A8B70",
  textOnDark: "#F0E6C8",

  // Gold (unchanged)
  gold: "#D4AF37",
  goldLight: "#F2D675",
  goldDark: "#8B6A1F",
  goldGradient: "linear-gradient(145deg, #F2D675 0%, #D4AF37 55%, #8B6A1F 100%)",
  goldShadow: "0 2px 8px rgba(139,106,31,0.4)",

  // Control bar / nav — deep purple
  controlBg: "linear-gradient(180deg, #150D2E 0%, #0E0820 100%)",
  controlBgShadow: "0 -4px 20px rgba(0,0,0,0.55)",

  // Active verse card — royal purple
  activeCardBg: "linear-gradient(160deg, #150D2E 0%, #2B1659 35%, #3D1F7A 55%, #2B1659 78%, #150D2E 100%)",
  activeCardText: "#F5EDD0",

  // Preview verse card
  previewCardBg: "linear-gradient(160deg, #1A1330 0%, #211840 100%)",
  previewCardBorder: "rgba(139,92,246,0.25)",
  previewCardText: "#C8BEA0",

  // Buttons
  greenBtnBg: "linear-gradient(160deg, #2D1B69 0%, #1E1040 55%, #150D2E 100%)",
  greenBtnShadow: "0 3px 12px rgba(45,27,105,0.55)",

  // Section title color
  sectionTitleColor: "#B98218",

  // Tip card
  tipBg: "linear-gradient(145deg, #1E1636 0%, #281C4A 100%)",
  tipText: "#C9971E",

  // Stat card
  statCardBg: "linear-gradient(145deg, #F1C40F 0%, #D4AF37 60%, #B8920F 100%)",
  statCardText: "#150D2E",

  // Chart bg
  chartBg: "rgba(255,255,255,0.04)",
  chartBorder: "rgba(212,175,55,0.18)",
  chartTextColor: "#D4AF37",
};

export function useThemeColors() {
  const { theme } = useTheme();
  return theme === "dark" ? DARK : LIGHT;
}