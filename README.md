# 🛡️ PROJECT VYUHA: Global Cyber Defense & Threat Intelligence Grid

![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)
![React](https://img.shields.io/badge/Frontend-React_18_|_Vite-blue)
![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38bdf8)
![Leaflet](https://img.shields.io/badge/Map_Engine-Leaflet_GIS-10b981)
![Python](https://img.shields.io/badge/Backend-Python_|_FastAPI-3776ab)

**Project Vyuha** is a next-generation real-time Cyber Warfare Command & Control (C2) matrix designed to give Security Operations Center (SOC) teams instant situational awareness over global cyber threat vectors targeting critical infrastructure.

---

## 🚀 Key Features

* 🌍 **Geospatial GIS Threat Visualization:** Real-time trajectory mapping from origin threat vectors (e.g., Moscow, Beijing, Frankfurt) to target infrastructure nodes (e.g., Washington D.C., Tokyo, London) using **Leaflet**.
* 🔍 **Heuristic Vulnerability Scanner:** Automated scan engine that interrogates grid endpoints, identifies CVSS severity ratings, CVE signatures, and calculates real-time **Impact Scores**.
* 🔬 **Deep Packet Payload Inspector:** Raw hex-dump inspection with entropy analysis for zero-day threat payload verification.
* ⚡ **Automated AI Remediation:** One-click countermeasure script compilation and deployment to isolate compromised nodes instantly.
* 📡 **Live Event Telemetry Stream:** Real-time system diagnostic feeds via WebSockets / REST API streams.
* ⌨️ **Command Deck:** Low-latency hotkey (`Ctrl + K`) terminal launcher for tactical operator controls.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React.js (Vite) |
| **Geospatial Mapping** | Leaflet.js / React-Leaflet |
| **Styling & UI** | Tailwind CSS (Dark Defense Grid Aesthetics) + Lucide Icons |
| **Backend API** | Python (FastAPI / Uvicorn) & Node.js (Express) |
| **Audio Synthesizer** | Web Audio API (Synthesized Cyber SFX) |

---

## 📂 Repository Structure

```text
Project-Vyuha/
├── frontend/             # React + Vite Frontend Application
│   ├── src/
│   │   ├── App.jsx       # Main Tactical Defense Grid Component
│   │   ├── main.jsx      # React Entry Point
│   │   └── index.css     # Tailwind Imports & Global Styles
│   ├── index.html        # HTML Template with Leaflet Resources
│   └── package.json
└── server/               # Python (FastAPI) Backend Server
    ├── main.py           # REST Endpoints & Threat Telemetry
    └── requirements.txt  # Python Dependencies
