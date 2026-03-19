import React, { useState, useEffect } from "react";
import { localEntities } from "../components/localData";
import { Loader2, Headphones, Flame, Zap, Trophy, Clock, BookOpen } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { useThemeColors } from "../components/useThemeColors";

const TOTAL_QURAN_VERSES = 6236;

const SURAH_SAMPLES = [
  { name: "Al-Fatihah", pct: 1.0 },
  { name: "Al-Baqarah", pct: 0.49 },
  { name: "Al-Imran", pct: 0.31 },
  { name: "An-Nisa", pct: 0.22 },
  { name: "Al-Maidah", pct: 0.15 },
  { name: "Al-Anam", pct: 0.08 },
];

const DAY_DATA = [
  { day: "M", val: 5 }, { day: "T", val: 12 }, { day: "W", val: 8 },
  { day: "T", val: 15 }, { day: "F", val: 10 }, { day: "S", val: 18 }, { day: "S", val: 7 },
];

const STREAK_DATA = [
  { label: "Wk 1", val: 3 }, { label: "Wk 2", val: 7 }, { label: "Wk 3", val: 12 }, { label: "Wk 4", val: 18 },
];

function SectionTitle({ children, t }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div style={{ height: "1.5px", width: "18px", background: t.gold }} />
      <span className="font-inter font-bold uppercase tracking-widest" style={{ fontSize: "10px", color: t.gold }}>
        {children}
      </span>
      <div style={{ flex: 1, height: "1.5px", background: `linear-gradient(to right, ${t.gold}, transparent)` }} />
    </div>
  );
}

export default function Progress() {
  const t = useThemeColors();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  async function loadStats() {
    const [chunks, recordings] = await Promise.all([
      localEntities.Chunk.list("-updated_date", 500),
      localEntities.Recording.list("-created_date", 500),
    ]);

    const completedChunks = chunks.filter(c => c.status === "completed");
    const inProgressChunks = chunks.filter(c => c.status === "in_progress");
    const verseSet = new Set();
    [...completedChunks, ...inProgressChunks].forEach(c => {
      for (let v = c.start_verse; v <= c.end_verse; v++) verseSet.add(`${c.surah_number}-${v}`);
    });

    const totalListening = recordings.reduce((sum, r) => sum + (r.total_duration_ms || 0), 0);
    const activeDays = new Set();
    recordings.forEach(r => { if (r.created_date) activeDays.add(new Date(r.created_date).toDateString()); });
    chunks.forEach(c => { if (c.last_accessed) activeDays.add(new Date(c.last_accessed).toDateString()); });

    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today); d.setDate(d.getDate() - i);
      if (activeDays.has(d.toDateString())) streak++; else break;
    }

    setStats({ versesLearned: verseSet.size, totalRecordings: recordings.length, totalListeningMs: totalListening, streak, totalChunks: chunks.length, completedChunks: completedChunks.length, inProgressChunks: inProgressChunks.length });
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full" style={{ background: t.pageBg }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: t.gold }} />
      </div>
    );
  }

  const progress = stats.versesLearned / TOTAL_QURAN_VERSES;
  const R = 70;
  const circ = 2 * Math.PI * R;
  const offset = circ * (1 - progress);

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: t.pageBg, backgroundImage: t.pageBgPattern, backgroundSize: "48px 48px" }}
    >
      <div className="px-4 pt-6 pb-24 space-y-6">

        {/* Header */}
        <div className="text-center pt-2 pb-2">
          <p className="font-amiri" style={{ fontSize: "22px", color: t.goldLight, textShadow: `0 0 18px rgba(212,175,55,0.35)` }}>
            Your Quran Progress
          </p>
          <p className="font-inter" style={{ fontSize: "12px", color: t.textMuted, marginTop: "2px" }}>
            Consistency is the key to Hifz
          </p>
        </div>

        {/* Progress Ring */}
        <div className="flex flex-col items-center">
          <div className="relative" style={{ width: 168, height: 168 }}>
            <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: `0 0 40px rgba(212,175,55,0.12)` }} />
            <svg className="-rotate-90" width={168} height={168} viewBox="0 0 168 168">
              <circle cx={84} cy={84} r={R} fill="none" stroke={`rgba(212,175,55,0.15)`} strokeWidth={10} />
              <circle cx={84} cy={84} r={R} fill="none" stroke="url(#goldArc)" strokeWidth={10} strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 1s ease-out" }} />
              <defs>
                <linearGradient id="goldArc" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F1C40F" />
                  <stop offset="100%" stopColor="#D4AF37" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-inter font-bold" style={{ fontSize: "26px", color: t.goldLight }}>{(progress * 100).toFixed(1)}%</span>
              <span className="font-inter" style={{ fontSize: "10px", color: t.textMuted }}>Complete</span>
              <span className="font-inter" style={{ fontSize: "9px", color: t.textMuted, marginTop: "1px" }}>{stats.versesLearned}/{TOTAL_QURAN_VERSES}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div>
          <SectionTitle t={t}>Progress Stats</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Clock, label: "Total Listening", value: formatDuration(stats.totalListeningMs) },
              { icon: Flame, label: "Current Streak", value: `${stats.streak} days` },
              { icon: Zap, label: "Recordings", value: String(stats.totalRecordings) },
              { icon: Trophy, label: "Completed", value: `${stats.completedChunks} chunks` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl p-4 relative overflow-hidden"
                style={{ background: t.statCardBg, boxShadow: `0 4px 18px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.2)` }}>
                <div className="absolute top-0 left-0 right-0 pointer-events-none rounded-t-2xl"
                  style={{ height: "40%", background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)" }} />
                <Icon className="w-5 h-5 mb-2" style={{ color: t.statCardText }} />
                <p className="font-inter font-bold" style={{ fontSize: "18px", color: t.statCardText }}>{value}</p>
                <p className="font-inter" style={{ fontSize: "10px", color: `${t.statCardText}99` }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Surah Progress */}
        <div>
          <SectionTitle t={t}>Surah Progress</SectionTitle>
          <div className="rounded-2xl p-4 space-y-3" style={{ background: t.chartBg, border: `1px solid ${t.chartBorder}`, boxShadow: t.cardShadow }}>
            {SURAH_SAMPLES.map(({ name, pct }) => (
              <div key={name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" style={{ color: t.gold }} />
                    <span className="font-inter font-semibold" style={{ fontSize: "12px", color: t.textPrimary }}>{name}</span>
                  </div>
                  <span className="font-inter font-bold" style={{ fontSize: "11px", color: t.goldLight }}>{Math.round(pct * 100)}%</span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: "8px", background: "rgba(255,255,255,0.08)", border: `1px solid ${t.chartBorder}` }}>
                  <div className="h-full rounded-full" style={{
                    width: `${pct * 100}%`,
                    background: pct >= 1 ? "linear-gradient(90deg, #1a8c4e, #2ecc71)" : `linear-gradient(90deg, ${t.gold}, ${t.goldLight})`,
                    transition: "width 0.8s ease-out",
                    boxShadow: `0 0 6px rgba(212,175,55,0.4)`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div>
          <SectionTitle t={t}>Daily Recitations</SectionTitle>
          <div className="rounded-2xl p-4" style={{ background: t.chartBg, border: `1px solid ${t.chartBorder}`, boxShadow: t.cardShadow }}>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={DAY_DATA} barSize={22}>
                <XAxis dataKey="day" tick={{ fill: t.chartTextColor, fontSize: 11, fontFamily: "Inter" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: t.pageBg, border: `1px solid ${t.gold}`, borderRadius: "10px", color: t.gold }} cursor={{ fill: "rgba(212,175,55,0.06)" }} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F1C40F" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <Bar dataKey="val" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div>
          <SectionTitle t={t}>Streak Over Time</SectionTitle>
          <div className="rounded-2xl p-4" style={{ background: t.chartBg, border: `1px solid ${t.chartBorder}`, boxShadow: t.cardShadow }}>
            <ResponsiveContainer width="100%" height={130}>
              <LineChart data={STREAK_DATA}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                <XAxis dataKey="label" tick={{ fill: t.chartTextColor, fontSize: 11, fontFamily: "Inter" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: t.pageBg, border: `1px solid ${t.gold}`, borderRadius: "10px", color: t.gold }} />
                <Line type="monotone" dataKey="val" stroke={t.gold} strokeWidth={2.5}
                  dot={{ fill: t.gold, r: 5, stroke: t.goldDark, strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: t.goldLight }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Summary */}
        <div>
          <SectionTitle t={t}>Activity Summary</SectionTitle>
          <div className="rounded-2xl p-4 space-y-3" style={{ background: t.chartBg, border: `1px solid ${t.chartBorder}` }}>
            {[
              { label: "In Progress", value: `${stats.inProgressChunks} chunks`, color: t.goldLight },
              { label: "Completed", value: `${stats.completedChunks} chunks`, color: "#2ecc71" },
              { label: "Total Recordings", value: `${stats.totalRecordings}`, color: t.textPrimary },
            ].map(({ label, value, color }, i, arr) => (
              <React.Fragment key={label}>
                <div className="flex justify-between items-center">
                  <span className="font-inter text-sm" style={{ color: t.textMuted }}>{label}</span>
                  <span className="font-inter font-bold text-sm" style={{ color }}>{value}</span>
                </div>
                {i < arr.length - 1 && <div style={{ height: "1px", background: t.chartBorder }} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className="rounded-2xl px-5 py-4 relative overflow-hidden"
          style={{ background: t.tipBg, boxShadow: t.cardShadow, border: `1.5px solid ${t.gold}` }}>
          <div className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{ height: "40%", background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)", borderRadius: "14px 14px 0 0" }} />
          <p className="font-inter italic relative z-10" style={{ fontSize: "13px", color: t.tipText, lineHeight: 1.65 }}>
            ✨ "Consistency is the key to Hifz. Keep going, and Allah will guide you!"
          </p>
        </div>

      </div>
    </div>
  );
}

function formatDuration(ms) {
  if (!ms) return "0m";
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}