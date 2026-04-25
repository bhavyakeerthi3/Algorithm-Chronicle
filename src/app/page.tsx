"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { steps, TOTAL_VIDEOS } from "@/data/topics";

const STORAGE_KEY  = "a2z_progress";
const DAILY_KEY    = "a2z_daily";
const NOTES_KEY    = "a2z_notes";
const TASKS_KEY    = "a2z_tasks";

interface DailyEntry { date: string; count: number; }
interface Toast      { id: number; message: string; }
interface Task       { text: string; done: boolean; }

const DEFAULT_TASKS: Task[] = [
  { text: "Solve 2 Array problems",       done: false },
  { text: "Revise Recursion concepts",    done: false },
  { text: "Watch Graphs video",           done: false },
  { text: "Practice Daily Challenge",     done: false },
];

function getToday() { return new Date().toISOString().split("T")[0]; }

export default function Home() {
  const [checked,   setChecked]   = useState<Record<string, boolean>>({});
  const [daily,     setDaily]     = useState<DailyEntry[]>([]);
  const [openSteps, setOpenSteps] = useState<Record<string, boolean>>({});
  const [toasts,    setToasts]    = useState<Toast[]>([]);
  const [mounted,   setMounted]   = useState(false);
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState<"all"|"pending"|"done">("all");
  const [notes,     setNotes]     = useState("");
  const [tasks,     setTasks]     = useState<Task[]>(DEFAULT_TASKS);

  useEffect(() => {
    const raw      = localStorage.getItem(STORAGE_KEY);
    const rawDaily = localStorage.getItem(DAILY_KEY);
    const rawNotes = localStorage.getItem(NOTES_KEY);
    const rawTasks = localStorage.getItem(TASKS_KEY);
    if (raw)      setChecked(JSON.parse(raw));
    if (rawDaily) setDaily(JSON.parse(rawDaily));
    if (rawNotes) setNotes(rawNotes);
    if (rawTasks) setTasks(JSON.parse(rawTasks));
    setOpenSteps({ step1: true });
    setMounted(true);
  }, []);

  useEffect(() => { if (mounted) localStorage.setItem(STORAGE_KEY,  JSON.stringify(checked)); }, [checked,  mounted]);
  useEffect(() => { if (mounted) localStorage.setItem(DAILY_KEY,    JSON.stringify(daily));   }, [daily,    mounted]);
  useEffect(() => { if (mounted) localStorage.setItem(NOTES_KEY,    notes);                   }, [notes,    mounted]);
  useEffect(() => { if (mounted) localStorage.setItem(TASKS_KEY,    JSON.stringify(tasks));   }, [tasks,    mounted]);

  const totalDone         = Object.values(checked).filter(Boolean).length;
  const remaining         = TOTAL_VIDEOS - totalDone;
  const percentage        = Math.round((totalDone / TOTAL_VIDEOS) * 100);
  const chaptersCompleted = steps.filter(s => s.videos.every(v => checked[v.id])).length;

  const streak = useMemo(() => {
    let n = 0;
    for (let i = 0; i <= 365; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = d.toISOString().split("T")[0];
      const e = daily.find(x => x.date === ds);
      if (e && e.count > 0) n++;
      else if (i > 0) break;
    }
    return n;
  }, [daily]);

  const addToast = useCallback((msg: string) => {
    const id = Date.now();
    setToasts(p => [...p, { id, message: msg }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const toggleVideo = useCallback((videoId: string, title: string) => {
    const newVal = !checked[videoId];
    setChecked(p => ({ ...p, [videoId]: newVal }));
    const today = getToday();
    setDaily(d => {
      const idx = d.findIndex(e => e.date === today);
      if (idx === -1) return newVal ? [...d, { date: today, count: 1 }] : d;
      const u = [...d];
      u[idx] = { ...u[idx], count: Math.max(0, u[idx].count + (newVal ? 1 : -1)) };
      return u;
    });
    if (newVal) addToast(title.length > 38 ? title.slice(0, 38) + "…" : title);
  }, [addToast, checked]);

  const toggleTask = useCallback((i: number) => {
    setTasks(p => p.map((t, idx) => idx === i ? { ...t, done: !t.done } : t));
  }, []);

  const filteredSteps = useMemo(() => {
    return steps.map(s => ({
      ...s,
      videos: s.videos.filter(v => {
        const q = search.toLowerCase();
        const matchSearch = !q || v.title.toLowerCase().includes(q) || s.title.toLowerCase().includes(q);
        const isDone = !!checked[v.id];
        const matchFilter = filter === "all"
          || (filter === "done"    &&  isDone)
          || (filter === "pending" && !isDone);
        return matchSearch && matchFilter;
      })
    })).filter(s => s.videos.length > 0);
  }, [search, filter, checked]);

  if (!mounted) return null;

  const todayLabel = new Date().toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric"
  }).toUpperCase();

  return (
    <main>
      <div className="app-wrapper">

        {/* ── MASTHEAD ── */}
        <header className="masthead">
          <div className="m-dateline">
            <span>{todayLabel}</span>
            <span>A Daily Algorithm Journal</span>
            <span>Issue No. 01 &bull; Vol. I</span>
          </div>
          <hr className="m-rule m-rule-heavy" />
          <h1 className="m-title">
            <em>The Algorithm Chronicle</em>
          </h1>
          <hr className="m-rule m-rule-heavy" />
        </header>

        {/* ── 5 STATS ── */}
        <section className="stats-row" aria-label="Progress Statistics">
          <div className="stat-box">
            <div className="sb-label">Completed</div>
            <div className="sb-value">{totalDone}</div>
            <div className="sb-sub">of {TOTAL_VIDEOS} topics</div>
          </div>
          <div className="stat-box">
            <div className="sb-label">Progress</div>
            <div className="sb-value">{percentage}%</div>
            <div className="sb-sub">overall mastery</div>
          </div>
          <div className="stat-box">
            <div className="sb-label">Chapters</div>
            <div className="sb-value">{chaptersCompleted}</div>
            <div className="sb-sub">of {steps.length} done</div>
          </div>
          <div className="stat-box">
            <div className="sb-label">Streak</div>
            <div className="sb-value">{streak}</div>
            <div className="sb-sub">days in a row</div>
          </div>
          <div className="stat-box">
            <div className="sb-label">Remaining</div>
            <div className="sb-value">{remaining}</div>
            <div className="sb-sub">topics ahead</div>
          </div>
        </section>

        {/* ── SEARCH + FILTER ── */}
        <div className="search-filter-bar" role="search">
          <div className="search-box">
            <span className="search-icon">&#128269;</span>
            <input
              id="topic-search"
              type="text"
              className="search-input"
              placeholder="Search any topic or chapter..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search topics"
            />
          </div>
          <div className="filter-buttons" role="group" aria-label="Filter topics">
            <button id="filter-all"     className={`fb${filter==="all"     ? " active" : ""}`} onClick={() => setFilter("all")}>All</button>
            <button id="filter-pending" className={`fb${filter==="pending" ? " active" : ""}`} onClick={() => setFilter("pending")}>Pending</button>
            <button id="filter-done"    className={`fb${filter==="done"    ? " active" : ""}`} onClick={() => setFilter("done")}>Done</button>
            <button id="filter-reset"   className="fb reset" onClick={() => {
              if (confirm("Reset all progress? This cannot be undone.")) {
                setChecked({}); setDaily([]); addToast("Journal wiped.");
              }
            }}>Reset</button>
          </div>
        </div>

        {/* ── TOPICS + NOTES ── */}
        <div className="topics-notes-wrapper">

          {/* Chapters */}
          <section className="topics-section" aria-label="Topics and Chapters">
            <div className="ts-header">&#9670; Topics &amp; Chapters &#9670;</div>
            <div className="chapters-list">
              {filteredSteps.map(s => {
                const isOpen  = openSteps[s.id];
                const orig    = steps.find(x => x.id === s.id)!;
                const sDone   = orig.videos.filter(v => checked[v.id]).length;
                const sTotal  = orig.videos.length;
                const sPct    = Math.round((sDone / sTotal) * 100);
                const stepNum = steps.findIndex(x => x.id === s.id) + 1;

                return (
                  <div key={s.id} id={`chapter-${s.id}`} className="chapter-item">
                    <div
                      className="chapter-header"
                      onClick={() => setOpenSteps(p => ({ ...p, [s.id]: !isOpen }))}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isOpen}
                      onKeyDown={e => e.key === "Enter" && setOpenSteps(p => ({ ...p, [s.id]: !isOpen }))}
                    >
                      <div className="ch-left">
                        <span className="ch-num">{String(stepNum).padStart(2, "0")}</span>
                        <div className="ch-vline" />
                        <div className="ch-info">
                          <div className="ch-title">{s.title}</div>
                          <div className="ch-sub">{sDone} of {sTotal} completed</div>
                        </div>
                      </div>
                      <div className="ch-right">
                        <span className="ch-pct">{sPct}%</span>
                        <span className={`ch-arrow${isOpen ? " open" : ""}`}>&#9660;</span>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="chapter-topics">
                        {s.videos.map((v, vi) => {
                          const isDone = !!checked[v.id];
                          return (
                            <div
                              key={v.id}
                              id={`topic-${v.id}`}
                              className={`topic-entry${isDone ? " done" : ""}`}
                              onClick={() => toggleVideo(v.id, v.title)}
                              role="checkbox"
                              aria-checked={isDone}
                              tabIndex={0}
                              onKeyDown={e => e.key === "Enter" && toggleVideo(v.id, v.title)}
                            >
                              <div className="t-box">
                                <span className="t-check">&#10003;</span>
                              </div>
                              <span className="t-num">{vi + 1}.</span>
                              <span className="t-text">{v.title}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

        </div>

        <div className="challenge-banner">#100DaysOfCode &bull; Striver A2Z &bull; Keep Grinding</div>

      </div>

      {/* TOASTS */}
      <div className="ink-toast-container" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className="ink-toast">
            &bull; entry saved: {t.message}
          </div>
        ))}
      </div>
    </main>
  );
}
