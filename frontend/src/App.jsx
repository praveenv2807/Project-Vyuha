import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Cpu,
  Terminal,
  Activity,
  Globe,
  Server,
  AlertTriangle,
  Volume2,
  VolumeX,
  Eye,
  Key,
  X,
  Code2,
  Play,
  Pause,
  ChevronRight,
  Radio,
} from "lucide-react";

// Fix Leaflet Default Icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Helper component to smoothly center/fly map when threat selection changes
function MapFlyTo({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, map.getZoom(), { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

// Custom Cyber Glowing Leaflet Icons with Permanent City Labels
const createCustomMarker = (city, severity, isSelected) => {
  const colorClass = severity === "CRITICAL" ? "bg-rose-500" : "bg-amber-400";
  const borderClass = severity === "CRITICAL" ? "bg-rose-600" : "bg-amber-500";
  const ringClass = isSelected ? "ring-4 ring-emerald-400 scale-125" : "";

  return L.divIcon({
    className: "custom-cyber-icon",
    html: `
      <div class="flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2">
        <div class="relative flex h-5 w-5 items-center justify-center">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colorClass}"></span>
          <span class="relative inline-flex rounded-full h-4 w-4 border-2 border-white ${borderClass} ${ringClass}"></span>
        </div>
        <div class="mt-1 bg-slate-950/90 border border-emerald-500/50 text-emerald-400 font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow-[0_0_10px_rgba(0,0,0,0.9)] whitespace-nowrap">
          ${city}
        </div>
      </div>
    `,
    iconSize: [0, 0],
  });
};

// --- AUDIO SYNTHESIZER ---
class CyberSoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playBeep(freq = 800, type = "sine", duration = 0.05, vol = 0.1) {
    if (this.muted) return;
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + duration,
      );
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playAlarm() {
    if (this.muted) return;
    this.playBeep(440, "sawtooth", 0.15, 0.2);
    setTimeout(() => this.playBeep(880, "sawtooth", 0.2, 0.2), 100);
  }

  playClick() {
    this.playBeep(1200, "sine", 0.02, 0.05);
  }

  playTyping() {
    this.playBeep(600 + Math.random() * 400, "square", 0.015, 0.03);
  }
}

const soundFX = new CyberSoundFX();

// REAL CITIES WITH REAL GEOGRAPHIC LAT/LNG COORDINATES
const INITIAL_THREATS = [
  {
    id: "TH-9021",
    cve: "CVE-2026-4410",
    title: "DARK_RIVER_APT",
    severity: "CRITICAL",
    cvss: "9.8",
    category: "Zero-Day Exploit",
    location: "SCADA Grid Node :: Port 502",
    originCity: "Moscow, Russia",
    originCoords: [55.7558, 37.6173],
    targetCity: "Washington D.C., USA",
    targetCoords: [38.9072, -77.0369],
    status: "ACTIVE",
    timestamp: "21:14:02 UTC",
    impactScore: 94,
    description:
      "Remote code execution targeting electrical power transmission SCADA gateways.",
    code_snippet:
      "00000000: 48 89 5c 24 08 48 89 74 24 10 57 48 83 ec 20\n00000010: 48 8b 01 48 8b d9 ff 50 20 48 8b d8 48 85 c0",
  },
  {
    id: "TH-9022",
    cve: "CVE-2026-1189",
    title: "SQLi Auth Bypass",
    severity: "HIGH",
    cvss: "8.4",
    category: "SQL Injection",
    location: "backend/auth.py:42",
    originCity: "Beijing, China",
    originCoords: [39.9042, 116.4074],
    targetCity: "Tokyo, Japan",
    targetCoords: [35.6762, 139.6503],
    status: "MITIGATED",
    timestamp: "21:10:45 UTC",
    impactScore: 78,
    description:
      "Raw SQL interpolation allows authentication bypass on financial database core.",
    code_snippet:
      "query = f\"SELECT * FROM users WHERE user='{input}' AND pass='{pwd}'\"\ncursor.execute(query)",
  },
  {
    id: "TH-9023",
    cve: "CVE-2025-9921",
    title: "Heap Overflow TLS",
    severity: "CRITICAL",
    cvss: "9.1",
    category: "Memory Corruption",
    location: "sys/net/tls_core.c:309",
    originCity: "Frankfurt, Germany",
    originCoords: [50.1109, 8.6821],
    targetCity: "London, UK",
    targetCoords: [51.5074, -0.1278],
    status: "ACTIVE",
    timestamp: "21:05:11 UTC",
    impactScore: 91,
    description:
      "Malformed TLS ClientHello packet triggers out-of-bounds heap write.",
    code_snippet:
      "memcpy(session_key, packet_data + offset, user_supplied_len);",
  },
  {
    id: "TH-9024",
    cve: "CVE-2025-7801",
    title: "XSS Injection Payload",
    severity: "MEDIUM",
    cvss: "6.1",
    category: "Client-Side Exploit",
    location: "frontend/src/Analytics.jsx:102",
    originCity: "Sao Paulo, Brazil",
    originCoords: [-23.5505, -46.6333],
    targetCity: "New York, USA",
    targetCoords: [40.7128, -74.006],
    status: "UNPATCHED",
    timestamp: "20:58:30 UTC",
    impactScore: 52,
    description:
      "Unsanitized user comments rendered directly into DOM analytics dashboard.",
    code_snippet:
      "<div dangerouslySetInnerHTML={{ __html: commentPayload }} />",
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("map");
  const [defconLevel] = useState(1);
  const [crtEffect, setCrtEffect] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [showCmdDeck, setShowCmdDeck] = useState(false);
  const [showPatchModal, setShowPatchModal] = useState(false);

  const [threats] = useState(INITIAL_THREATS);
  const [selectedThreat, setSelectedThreat] = useState(INITIAL_THREATS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const [logs, setLogs] = useState([
    {
      id: 1,
      time: "21:15:00",
      type: "INFO",
      msg: "VYUHA GRID ENGINE initialized. Leaflet maps active.",
    },
    {
      id: 2,
      time: "21:15:02",
      type: "CRITICAL",
      msg: "DARK_RIVER_APT vector detected from Moscow to Washington D.C.",
    },
    {
      id: 3,
      time: "21:15:05",
      type: "WARN",
      msg: "Anomaly in Frankfurt -> London TLS packet stream.",
    },
  ]);
  const [logsPaused, setLogsPaused] = useState(false);

  useEffect(() => {
    soundFX.muted = !soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCmdDeck((prev) => !prev);
        soundFX.playClick();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (logsPaused) return;
    const interval = setInterval(() => {
      const types = ["INFO", "WARN", "CRITICAL", "SUCCESS"];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomMsgs = [
        "Inbound telemetry sweep from Tokyo node clear.",
        "Packet inspection throughput: 4.2 GB/s.",
        "Suspicious payload signature intercepted in Frankfurt.",
        "Quantum encryption key rotated automatically.",
        "London edge-gateway ping latency stable at 11ms.",
      ];
      setLogs((prev) => [
        {
          id: Date.now(),
          time: new Date().toISOString().substring(11, 19),
          type: randomType,
          msg: randomMsgs[Math.floor(Math.random() * randomMsgs.length)],
        },
        ...prev.slice(0, 25),
      ]);
    }, 4000);
    return () => clearInterval(interval);
  }, [logsPaused]);

  const startScanner = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    soundFX.playAlarm();

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setScanProgress(current);
      soundFX.playTyping();
      if (current >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        soundFX.playBeep(1500, "sine", 0.3, 0.2);
      }
    }, 300);
  };

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-[#030712] text-emerald-400 font-mono flex flex-col items-center justify-center z-50 p-4">
        <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-md border border-emerald-500/30 p-6 rounded-lg shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col items-center text-center">
          <ShieldAlert className="w-16 h-16 text-emerald-400 animate-pulse mb-4" />
          <h1 className="text-xl font-bold tracking-widest text-white mb-1">
            PROJECT VYUHA
          </h1>
          <p className="text-xs text-slate-400 mb-6">
            GLOBAL DEFENSE GRID v8.4.1
          </p>

          <div className="w-full bg-slate-950/80 border border-slate-800 p-4 rounded mb-6 text-left space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>BIOMETRIC LOCK:</span>
              <span className="text-emerald-400 font-bold">VERIFIED</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>LEAFLET ENGINE:</span>
              <span className="text-emerald-400 font-bold">
                OPENSTREETMAP TILE LAYER
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>CLEARANCE LEVEL:</span>
              <span className="text-emerald-400 font-bold">
                LEVEL 5 TOP SECRET
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              setShowSplash(false);
            }}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2.5 rounded transition shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Key className="w-4 h-4" />
            <span>INITIALIZE COMMAND DECK</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-[#030712] text-slate-200 font-mono text-xs flex flex-col relative overflow-hidden ${
        crtEffect
          ? "before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] before:bg-[length:100%_4px] before:z-40"
          : ""
      }`}
    >
      {/* HEADER */}
      <header className="bg-slate-900/40 backdrop-blur-md border-b border-emerald-500/20 px-4 py-2.5 flex items-center justify-between z-30">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-emerald-400 animate-pulse" />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm font-black tracking-widest text-white">
                  PROJECT VYUHA
                </h1>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] rounded font-bold">
                  GLOBAL DEFENSE GRID
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                CYBER WARFARE COMMAND CENTER V8.4.1
              </p>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-[11px]">
          <div className="bg-slate-950/60 border border-slate-800 px-3 py-1 rounded flex items-center space-x-2">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">SYSTEM STATUS:</span>
            <span className="text-emerald-400 font-bold">
              SYSTEMS OPERATIONAL
            </span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 px-3 py-1 rounded flex items-center space-x-2">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-slate-400">ALERT LEVEL:</span>
            <span className="text-rose-400 font-bold">
              DEFCON {defconLevel} - MAXIMUM LOCKDOWN
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              soundFX.playClick();
              setShowCmdDeck(true);
            }}
            className="bg-slate-950 border border-slate-800 hover:border-emerald-500/50 px-2.5 py-1 rounded text-slate-300 flex items-center space-x-2 transition cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>COMMAND DECK</span>
            <kbd className="bg-slate-900 border border-slate-700 text-[9px] px-1 rounded text-emerald-400">
              Ctrl+K
            </kbd>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded transition cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-600" />
            )}
          </button>

          <button
            onClick={() => setCrtEffect(!crtEffect)}
            className={`p-1.5 bg-slate-950 border rounded transition cursor-pointer ${
              crtEffect
                ? "border-emerald-500/50 text-emerald-400"
                : "border-slate-800 text-slate-600"
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 p-2 relative z-20">
        {/* LEFT SIDEBAR */}
        <aside className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md border border-emerald-500/20 rounded-lg p-3 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">
              Tactical Views
            </div>
            <nav className="space-y-1">
              {[
                { id: "map", label: "GLOBAL MAP", icon: Globe },
                { id: "scanner", label: "VULN SCANNER", icon: ShieldCheck },
                { id: "payload", label: "PAYLOAD INSPECTOR", icon: Terminal },
                { id: "stream", label: "EVENT STREAM", icon: Activity },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      soundFX.playClick();
                      setActiveTab(tab.id);
                    }}
                    className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded transition cursor-pointer ${
                      active
                        ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                        : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${active ? "text-emerald-400" : "text-slate-500"}`}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg space-y-2">
            <div className="text-[10px] text-slate-500 font-bold uppercase">
              Defense Subnet
            </div>
            <div className="flex items-center space-x-2">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-slate-200 font-bold text-[11px]">
                SEC-GRID-ALPHA
              </span>
            </div>
            <div className="text-[9px] text-slate-400 space-y-0.5">
              <div>Latency: 12ms | Encryption: AES-GCM</div>
              <div className="text-emerald-400">Threat Matrix: Operational</div>
            </div>

            <button
              onClick={() => {
                soundFX.playAlarm();
                alert("EMERGENCY DEFENSE LOCKDOWN TRIGGERED");
              }}
              className="w-full mt-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 py-1.5 rounded text-[10px] font-bold flex items-center justify-center space-x-1 cursor-pointer transition"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>LOCKDOWN</span>
            </button>
          </div>
        </aside>

        {/* CENTER MAIN CONTENT: REAL LEAFLET MAP */}
        <main className="lg:col-span-7 bg-slate-900/40 backdrop-blur-md border border-emerald-500/20 rounded-lg p-3 flex flex-col justify-between relative overflow-hidden">
          {activeTab === "map" && (
            <div className="flex-1 flex flex-col h-full space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 uppercase flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>TACTICAL DEFENSE REAL MAP</span>
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                  OPENSTREETMAP INTERACTIVE
                </span>
              </div>

              {/* REAL LEAFLET MAP CONTAINER */}
              <div className="flex-1 rounded border border-slate-800 overflow-hidden min-h-[420px] relative z-10">
                <MapContainer
                  center={selectedThreat.originCoords}
                  zoom={2}
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#020617",
                  }}
                  zoomControl={false}
                >
                  <MapFlyTo center={selectedThreat.originCoords} />

                  {/* FREE OPENSTREETMAP TILE LAYER (NO API KEY REQUIRED) */}
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                    attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
                    maxZoom={16}
                  />

                  {/* Render Origin & Target Markers for all Threats */}
                  {threats.map((t) => {
                    const isSelected = selectedThreat.id === t.id;
                    return (
                      <React.Fragment key={t.id}>
                        {/* Origin City Marker */}
                        <Marker
                          position={t.originCoords}
                          icon={createCustomMarker(
                            t.originCity,
                            t.severity,
                            isSelected,
                          )}
                          eventHandlers={{
                            click: () => {
                              soundFX.playClick();
                              setSelectedThreat(t);
                            },
                          }}
                        >
                          <Popup className="cyber-popup">
                            <div className="p-1 font-mono text-xs text-slate-900">
                              <strong>Origin:</strong> {t.originCity}
                              <br />
                              <strong>Threat:</strong> {t.title} ({t.severity})
                            </div>
                          </Popup>
                        </Marker>

                        {/* Target City Marker */}
                        <Marker
                          position={t.targetCoords}
                          icon={createCustomMarker(
                            t.targetCity,
                            "MEDIUM",
                            isSelected,
                          )}
                          eventHandlers={{
                            click: () => {
                              soundFX.playClick();
                              setSelectedThreat(t);
                            },
                          }}
                        />

                        {/* Trajectory Polyline from Origin to Target */}
                        <Polyline
                          positions={[t.originCoords, t.targetCoords]}
                          pathOptions={{
                            color:
                              t.severity === "CRITICAL" ? "#f43f5e" : "#fbbf24",
                            weight: isSelected ? 3 : 1.5,
                            dashArray: "6, 8",
                            opacity: isSelected ? 0.9 : 0.4,
                          }}
                        />
                      </React.Fragment>
                    );
                  })}
                </MapContainer>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 bg-slate-950/80 p-2 rounded border border-slate-800">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                    <span>Critical Origin</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                    <span>Warning Vector</span>
                  </span>
                </div>
                <div>Pan / Zoom enabled | Real Coordinates Active</div>
              </div>
            </div>
          )}

          {activeTab === "scanner" && (
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 uppercase flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>VULNERABILITY SCANNER</span>
                </span>
                <button
                  onClick={startScanner}
                  disabled={isScanning}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-1.5 rounded transition disabled:opacity-50 flex items-center space-x-2 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>
                    {isScanning ? "SCANNING..." : "EXECUTE HEURISTIC SCAN"}
                  </span>
                </button>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-6 rounded flex flex-col items-center justify-center space-y-4 min-h-[220px]">
                <div className="relative flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full border-4 border-slate-800 border-t-emerald-400 animate-spin"></div>
                  <span className="absolute text-lg font-bold text-white">
                    {scanProgress}%
                  </span>
                </div>
                <p className="text-slate-400 text-xs">
                  {isScanning
                    ? "Interrogating global city endpoints..."
                    : "System Scan Ready."}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] text-slate-500 font-bold uppercase">
                  Active Vulnerability Vectors
                </div>
                <div className="space-y-1.5">
                  {threats.map((t) => (
                    <div
                      key={t.id}
                      className="bg-slate-950/80 border border-slate-800 p-2.5 rounded flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-1.5 py-0.2 text-[9px] font-bold rounded ${
                              t.severity === "CRITICAL"
                                ? "bg-rose-500/20 text-rose-400"
                                : "bg-amber-500/20 text-amber-400"
                            }`}
                          >
                            {t.severity}
                          </span>
                          <span className="text-white font-bold">
                            {t.title}
                          </span>
                          <span className="text-slate-500">
                            • {t.originCity} → {t.targetCity}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {t.location}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedThreat(t);
                          setShowPatchModal(true);
                        }}
                        className="bg-slate-900 hover:bg-emerald-500 hover:text-black border border-slate-700 text-emerald-400 px-3 py-1 rounded text-[10px] font-bold transition cursor-pointer"
                      >
                        REMEDIATE
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "payload" && (
            <div className="flex-1 flex flex-col space-y-3">
              <div className="font-bold text-slate-200 uppercase flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>DEEP PACKET PAYLOAD INSPECTOR</span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase mb-2">
                    Raw Stream Hex Dump ({selectedThreat.originCity})
                  </div>
                  <pre className="bg-[#010409] p-3 border border-slate-900 rounded text-emerald-400 text-[11px] font-mono leading-relaxed overflow-x-auto">
                    {selectedThreat.code_snippet}
                  </pre>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-900 grid grid-cols-2 gap-4 text-[10px]">
                  <div>
                    <span className="text-slate-500 block">ENTROPY SCORE</span>
                    <span className="text-amber-400 font-bold text-sm">
                      7.882 / 8.0
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">
                      SIGNATURE MATCH
                    </span>
                    <span className="text-rose-400 font-bold text-sm">
                      MATCHED [{selectedThreat.cve}]
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "stream" && (
            <div className="flex-1 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 uppercase flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>REAL-TIME SYSTEM EVENT STREAM</span>
                </span>
                <button
                  onClick={() => setLogsPaused(!logsPaused)}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 px-2.5 py-1 rounded text-slate-300 flex items-center space-x-1 cursor-pointer"
                >
                  {logsPaused ? (
                    <Play className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Pause className="w-3 h-3 text-amber-400" />
                  )}
                  <span>{logsPaused ? "RESUME FEED" : "PAUSE FEED"}</span>
                </button>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded flex-1 overflow-y-auto space-y-1.5 font-mono text-[11px]">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start space-x-2 border-b border-slate-900/60 pb-1"
                  >
                    <span className="text-slate-500">[{log.time}]</span>
                    <span
                      className={`font-bold ${
                        log.type === "CRITICAL"
                          ? "text-rose-400"
                          : log.type === "WARN"
                            ? "text-amber-400"
                            : log.type === "SUCCESS"
                              ? "text-emerald-400"
                              : "text-sky-400"
                      }`}
                    >
                      [{log.type}]
                    </span>
                    <span className="text-slate-300 flex-1">{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* RIGHT INTELLIGENCE SIDEBAR */}
        <aside className="lg:col-span-3 bg-slate-900/40 backdrop-blur-md border border-emerald-500/20 rounded-lg p-3 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-200 uppercase">
                THREAT INTELLIGENCE
              </span>
              <span className="text-slate-500 text-[10px]">
                {selectedThreat.id}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">
                  {selectedThreat.title}
                </h3>
                <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1.5 py-0.2 rounded font-bold text-[9px]">
                  {selectedThreat.severity}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {selectedThreat.description}
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded space-y-2 text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-500">VECTOR TYPE:</span>
                <span className="text-slate-200 font-bold">
                  {selectedThreat.category}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ORIGIN CITY:</span>
                <span className="text-emerald-400 font-bold">
                  {selectedThreat.originCity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">TARGET CITY:</span>
                <span className="text-rose-400 font-bold">
                  {selectedThreat.targetCity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">STATUS:</span>
                <span
                  className={
                    selectedThreat.status === "ACTIVE"
                      ? "text-rose-400 font-bold"
                      : "text-emerald-400 font-bold"
                  }
                >
                  {selectedThreat.status}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">Impact Assessment</span>
                <span className="text-rose-400 font-bold">
                  {selectedThreat.impactScore} / 100
                </span>
              </div>
              <div className="w-full bg-slate-950 border border-slate-800 h-2 rounded overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded transition-all duration-500"
                  style={{ width: `${selectedThreat.impactScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              setShowPatchModal(true);
            }}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2 rounded transition shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Cpu className="w-4 h-4" />
            <span>DEPLOY COUNTERMEASURE</span>
          </button>
        </aside>
      </div>

      {/* COMMAND DECK MODAL */}
      {showCmdDeck && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-lg w-full max-w-xl shadow-2xl p-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-emerald-400 font-bold flex items-center space-x-2">
                <Terminal className="w-4 h-4" />
                <span>COMMAND DECK LAUNCHER</span>
              </span>
              <button
                onClick={() => setShowCmdDeck(false)}
                className="text-slate-500 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Type command (e.g. 'lockdown', 'scan', 'switch map')..."
              className="w-full bg-slate-950 border border-slate-800 p-2.5 text-white rounded text-xs mb-3 focus:outline-none focus:border-emerald-500"
              autoFocus
            />

            <div className="space-y-1 text-[11px]">
              <div
                onClick={() => {
                  setActiveTab("scanner");
                  startScanner();
                  setShowCmdDeck(false);
                }}
                className="p-2 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded flex justify-between items-center cursor-pointer"
              >
                <span>Execute Deep Subnet Vulnerability Sweep</span>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PATCH REMEDIATION MODAL */}
      {showPatchModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-lg w-full max-w-lg p-5 font-mono text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-bold text-white flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>AI REMEDIATION PATCH ENGINE</span>
              </span>
              <button
                onClick={() => setShowPatchModal(false)}
                className="text-slate-500 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-3 rounded space-y-2">
              <div className="text-emerald-400 font-bold">
                Countermeasure script compiled for {selectedThreat.cve}:
              </div>
              <pre className="text-slate-300 text-[10px] bg-black p-2.5 rounded overflow-x-auto border border-slate-900">
                {`# VYUHA AUTOMATED PATCH DEPLOYER\n# Target City: ${selectedThreat.targetCity}\n\nfrom security.defense import FirewallRule\n\nrule = FirewallRule.block_ip("${selectedThreat.originCity}")\nrule.apply_immediate(level="CRITICAL")`}
              </pre>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowPatchModal(false)}
                className="px-3 py-1.5 bg-slate-950 text-slate-400 hover:text-white rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  soundFX.playBeep(1000, "sine", 0.2, 0.2);
                  alert(
                    `Countermeasure patch successfully applied for ${selectedThreat.cve}`,
                  );
                  setShowPatchModal(false);
                }}
                className="px-4 py-1.5 bg-emerald-500 text-black font-bold rounded hover:bg-emerald-400 cursor-pointer"
              >
                APPLY COUNTERMEASURE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
