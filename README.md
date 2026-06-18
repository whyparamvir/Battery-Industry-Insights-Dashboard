# 🔋 Battery Industry Insights Dashboard

> An interactive dashboard ranking the world's **top 100 battery manufacturers** (2024–2025) — explore market share, production capacity, revenue, R&D spend, chemistry and growth across the global battery industry.

<p align="center">
  <a href="https://whyparamvir.github.io/Battery-Industry-Insights-Dashboard/"><strong>🌐 View the live dashboard →</strong></a>
</p>

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Deployed on GitHub Pages](https://img.shields.io/badge/Deployed-GitHub_Pages-222?logo=github&logoColor=white)

---

## 📖 Overview

The **Battery Industry Insights Dashboard** compiles data on the **100 largest battery manufacturing companies worldwide** into a single, interactive web app. It turns dense industry data — sourced from SNE Research, company annual reports, BloombergNEF and the IEA — into sortable rankings, visual charts and side-by-side comparisons.

## 📊 Data highlights (2024–2025)

- **100 manufacturers** tracked across **20+ countries**
- **1,400+ GWh** of 2025 battery installations and **$430B+** combined 2024 revenue
- **CATL** leads with ~**39%** market share — the **top 3** (CATL, BYD, LG Energy Solution) hold ~**65%**
- **China** is home to **6 of the top 10** players (~70% of global share)
- Fastest-growing majors: **Gotion (+82%)** and **CALB (+45%)** year-over-year

## ✨ Features

- **📈 Overview & Charts** — KPI summary cards plus interactive charts: top companies by installations, breakdowns by region and country, a revenue-vs-capacity scatter, and a top-5 radar comparison (toggle Top 10 / 15 / 20 / 50).
- **🏆 Leaderboards** — rank companies by installations, market share, revenue, R&D spend, energy density or growth rate.
- **📋 Full Data Table** — search, sort every column, filter by region and chemistry, open company websites, and export to CSV.
- **⚖️ Compare** — pick any two companies for a head-to-head breakdown across all key metrics.

## 🗂️ Metrics tracked

Market share · 2025 installations (GWh) · production capacity · 2024 revenue · R&D spend · primary chemistry (LFP, NCM, sodium-ion, solid-state…) · energy density · YoY growth · market cap · workforce · founding year.

## 🛠️ Tech stack

- **React 19** + **TypeScript**
- **Vite** — build tooling & dev server
- **Tailwind CSS** + **shadcn/ui** components
- **Recharts** / **Chart.js** for data visualization

## 🚀 Run locally

```bash
# install dependencies
npm install

# start the dev server (http://localhost:3000)
npm run dev

# build for production
npm run build
```

## 🌐 Deployment

The site deploys automatically to **GitHub Pages** via GitHub Actions on every push to `main` (see [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)). Live at:

**https://whyparamvir.github.io/Battery-Industry-Insights-Dashboard/**

## 📚 Data sources

SNE Research (2025), company annual reports, BloombergNEF, IEA, and industry analysis. *Figures are compiled estimates for 2024–2025 and intended for informational purposes only.*

---

<p align="center"><sub>Built with React + Vite · Data current as of June 2025</sub></p>
