# 🎯 Striver A2Z DSA Tracker

A **beautiful, persistent progress tracker** for [Striver's A2Z DSA Course](https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/) — covering all 17 steps and 400+ topic videos.

## ✨ Features

- ✅ **Persistent checkboxes** — progress saved in `localStorage`, survives page refresh
- 📊 **Live stats** — completion %, steps done, streak tracker
- 📅 **Daily log** — see how many videos you watched each day (last 14 days)
- 🔍 **Search & Filter** — quickly find any topic, filter by done/pending
- 🔔 **Toast notifications** — satisfying feedback on each completion
- 🏆 **Completion banner** — celebrate when you finish all 17 steps
- 🌙 **Dark glassmorphism UI** — premium, distraction-free design

## 🚀 Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: GitHub + Vercel Dashboard
1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repo → click **Deploy**

That's it! Vercel auto-detects Next.js.

## 🛠️ Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## 📁 Structure

```
src/
├── app/
│   ├── page.tsx        # Main tracker (all logic lives here)
│   ├── layout.tsx      # HTML shell + SEO metadata
│   └── globals.css     # Full design system
└── data/
    └── topics.ts       # All A2Z steps & video titles
```

## 📌 About Striver A2Z

Striver's A2Z DSA Course by [TakeUForward](https://takeuforward.org/) is one of the best free DSA resources covering everything from basics to advanced graphs and DP — perfect for coding interviews at top companies.
