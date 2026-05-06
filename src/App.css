import { useState, useEffect } from "react";

/* ════════════════════════════════════════════════
   CONSTANTS
════════════════════════════════════════════════ */
const ADMIN_USER = { username: "kwarsed", password: "5179678nAta", role: "admin" };
const SK = "gdml_v6";

const DM = {
  ext:  { label: "Extreme Demon", color: "#f87171", glow: "rgba(248,113,113,0.18)", pts: 150 },
  ins:  { label: "Insane Demon",  color: "#c084fc", glow: "rgba(192,132,252,0.18)", pts: 80  },
  hard: { label: "Hard Demon",    color: "#fb923c", glow: "rgba(251,146,60,0.18)",  pts: 30  },
  med:  { label: "Medium Demon",  color: "#38bdf8", glow: "rgba(56,189,248,0.18)",  pts: 10  },
};

const DEMONS_DATA = {
  ext: [
    { id:"EX01", name:"Acheron",              creator:"Silentium",     color:"#1a0a2e", accent:"#7c3aed" },
    { id:"EX02", name:"Abyss of Darkness",    creator:"Pennutoh",      color:"#0a0a1a", accent:"#2563eb" },
    { id:"EX03", name:"Kyouki",               creator:"xSmokes",       color:"#1a0a0a", accent:"#dc2626" },
    { id:"EX04", name:"LIMBO",                creator:"Doggie",        color:"#0f0f0f", accent:"#6366f1" },
    { id:"EX05", name:"Kenos",                creator:"Dudex",         color:"#0a1a0a", accent:"#16a34a" },
    { id:"EX06", name:"The Golden",           creator:"AeonAir",       color:"#1a1200", accent:"#d97706" },
    { id:"EX07", name:"Zodiac",               creator:"Xcy7",          color:"#1a0a1a", accent:"#9333ea" },
    { id:"EX08", name:"Tartarus",             creator:"Dolphy",        color:"#0a0a0a", accent:"#ef4444" },
    { id:"EX09", name:"Slaughterhouse",       creator:"Woeful",        color:"#1a0505", accent:"#b91c1c" },
    { id:"EX10", name:"Genocide",             creator:"Knobbelboy",    color:"#050a1a", accent:"#3b82f6" },
  ],
  ins: [
    { id:"IN01", name:"Cataclysm",            creator:"Ggb0y",         color:"#0a0a1a", accent:"#6366f1" },
    { id:"IN02", name:"Sonic Wave Infinity",  creator:"Riot",          color:"#00101a", accent:"#0ea5e9" },
    { id:"IN03", name:"Artificial Ascent",    creator:"Stilluzen",     color:"#0a1a0a", accent:"#22c55e" },
    { id:"IN04", name:"Windy Landscape",      creator:"Zobros",        color:"#0a1210", accent:"#14b8a6" },
    { id:"IN05", name:"Yatagarasu",           creator:"Woffy",         color:"#1a0a00", accent:"#f59e0b" },
    { id:"IN06", name:"Phobos",               creator:"Bl4zze",        color:"#150005", accent:"#e11d48" },
    { id:"IN07", name:"Erebus",               creator:"Temp",          color:"#050510", accent:"#8b5cf6" },
    { id:"IN08", name:"Athanatos",            creator:"Bianox",        color:"#001010", accent:"#06b6d4" },
    { id:"IN09", name:"Supersonic",           creator:"Roadbose",      color:"#100a00", accent:"#ea580c" },
    { id:"IN10", name:"Poltergeist",          creator:"Bianox",        color:"#0a0010", accent:"#a855f7" },
  ],
  hard: [
    { id:"HD01", name:"Clubstep",              creator:"RobTop",       color:"#001a0a", accent:"#10b981" },
    { id:"HD02", name:"Theory of Everything 2",creator:"RobTop",       color:"#0a001a", accent:"#7c3aed" },
    { id:"HD03", name:"Deadlocked",            creator:"RobTop",       color:"#1a0000", accent:"#dc2626" },
    { id:"HD04", name:"Blast Processing",      creator:"TMB50",        color:"#001020", accent:"#2563eb" },
    { id:"HD05", name:"Jawbreaker",            creator:"TMB50",        color:"#1a0a00", accent:"#f59e0b" },
    { id:"HD06", name:"Speed Racer",           creator:"Ggb0y",        color:"#1a1000", accent:"#eab308" },
    { id:"HD07", name:"Dark Rainbow",          creator:"Xaro",         color:"#0a001a", accent:"#ec4899" },
    { id:"HD08", name:"The Realistic",         creator:"Jeyzor",       color:"#001a10", accent:"#059669" },
    { id:"HD09", name:"Nine Circles",          creator:"Zobros",       color:"#00101a", accent:"#0284c7" },
    { id:"HD10", name:"Impulse",               creator:"npesta",       color:"#100020", accent:"#9333ea" },
  ],
  med: [
    { id:"MD01", name:"Hexagon Force",         creator:"RobTop",       color:"#001510", accent:"#34d399" },
    { id:"MD02", name:"Geometrical Dominator", creator:"RobTop",       color:"#1a0a00", accent:"#fb923c" },
    { id:"MD03", name:"Ultra Violence",        creator:"Viprin",       color:"#0a0a1a", accent:"#818cf8" },
    { id:"MD04", name:"Crimson Planet",        creator:"RealTriangle", color:"#1a0005", accent:"#f43f5e" },
    { id:"MD05", name:"Nine Circles",          creator:"Zobros",       color:"#00101a", accent:"#38bdf8" },
  ],
};

const ALL_DEMONS = Object.entries(DEMONS_DATA).flatMap(([diff, arr]) =>
  arr.map(d => ({ ...d, diff, diffPts: DM[diff].pts }))
);

const getDemonDiff = id => ALL_DEMONS.find(d => d.id === id)?.diff;

/* ════════════════════════════════════════════════
   STORAGE HELPERS
════════════════════════════════════════════════ */
const load = () => {
  try {
    const raw = localStorage.getItem(SK);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    users: [{ ...ADMIN_USER, points: 0, completions: {}, displayName: "kwarsed" }],
    pending: [],
    approved: [],
  };
};
const save = (state) => {
  try { localStorage.setItem(SK, JSON.stringify(state)); } catch {}
};

/* ════════════════════════════════════════════════
   LEVEL ART
════════════════════════════════════════════════ */
function LevelArt({ demon, diff, size = 110 }) {
  const m = DM[diff];
  const acc = demon.accent || m.color;
  const words = demon.name.split(" ");
  const initials = words.length >= 2 ? words[0][0] + words[1][0] : demon.name.slice(0, 2);
  return (
    <div style={{ width: size, flexShrink: 0, position: "relative", overflow: "hidden", background: demon.color || "#0a0a15", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.3 }} viewBox={`0 0 ${size} 80`} preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`rg-${demon.id}`} cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor={acc} stopOpacity="0.9" />
            <stop offset="100%" stopColor={acc} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={size} height="80" fill={`url(#rg-${demon.id})`} />
        {[20, 40, 60, 80, 100].map(x => <line key={x} x1={x} y1="0" x2={x} y2="80" stroke={acc} strokeOpacity="0.12" strokeWidth="0.5" />)}
        {[20, 40, 60].map(y => <line key={y} x1="0" y1={y} x2={size} y2={y} stroke={acc} strokeOpacity="0.12" strokeWidth="0.5" />)}
        <circle cx="0" cy="0" r="35" fill={acc} fillOpacity="0.12" />
      </svg>
      <div style={{ position: "relative", zIndex: 1, fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 26, color: acc, textShadow: `0 0 18px ${acc}88`, userSelect: "none" }}>
        {initials.toUpperCase()}
      </div>
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 36, background: "linear-gradient(to right,transparent,#181b27)", pointerEvents: "none" }} />
    </div>
  );
}

/* ════════════════════════════════════════════════
   UI PRIMITIVES
════════════════════════════════════════════════ */
const Bar = ({ value, color }) => (
  <div style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.07)", overflow: "hidden", minWidth: 0 }}>
    <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 2, transition: "width 0.4s" }} />
  </div>
);

const DiffBadge = ({ diff }) => {
  const m = DM[diff];
  return (
    <span style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 600, letterSpacing: 1, padding: "3px 7px", borderRadius: 5, whiteSpace: "nowrap", background: m.glow, color: m.color, border: `1px solid ${m.color}44` }}>
      {m.label}
    </span>
  );
};

const Btn = ({ children, onClick, color = "#f87171", outline, style = {}, small }) => (
  <button onClick={onClick} style={{
    fontFamily: "'Outfit',sans-serif", fontWeight: 600,
    fontSize: small ? 11 : 13, padding: small ? "5px 10px" : "8px 16px",
    border: outline ? `1px solid ${color}55` : "none", borderRadius: 8,
    background: outline ? `${color}12` : color,
    color: outline ? color : "#0f1117", cursor: "pointer",
    transition: "opacity 0.15s", ...style,
  }}
    onMouseEnter={e => e.currentTarget.style.opacity = "0.82"}
    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
  >{children}</button>
);

const Input = ({ label, type = "text", value, onChange, placeholder, style = {} }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "#6b6b88", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>}
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", background: "#13151e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#eaeaf4", fontFamily: "'Outfit',sans-serif", fontSize: 14, padding: "10px 12px", outline: "none", ...style }}
    />
  </div>
);

/* ════════════════════════════════════════════════
   AUTH PAGE
════════════════════════════════════════════════ */
function AuthPage({ onAuth, db }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handle = () => {
    setErr("");
    const u = username.trim();
    if (!u || !password) { setErr("Заполните все поля"); return; }
    if (mode === "login") {
      const found = db.users.find(x => x.username === u && x.password === password);
      if (!found) { setErr("Неверный логин или пароль"); return; }
      onAuth(found);
    } else {
      if (u.length < 3) { setErr("Ник минимум 3 символа"); return; }
      if (password.length < 6) { setErr("Пароль минимум 6 символов"); return; }
      if (db.users.find(x => x.username === u)) { setErr("Такой ник уже занят"); return; }
      const newUser = { username: u, password, role: "user", points: 0, completions: {}, displayName: u };
      onAuth(newUser, true);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#181b27", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "36px 32px", width: "100%", maxWidth: 380 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 4, color: "#eaeaf4" }}>
          GD<span style={{ color: "#f87171" }}>·</span>Demons
        </div>
        <div style={{ fontSize: 13, color: "#6b6b88", marginBottom: 28 }}>
          {mode === "login" ? "Войдите в свой аккаунт" : "Создайте новый аккаунт"}
        </div>
        <Input label="Ник (GD username)" value={username} onChange={setUsername} placeholder="username" />
        <Input label="Пароль" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
        {err && <div style={{ fontSize: 12, color: "#f87171", marginBottom: 12, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8, padding: "8px 12px" }}>{err}</div>}
        <Btn onClick={handle} color="#f87171" style={{ width: "100%", padding: "11px" }}>
          {mode === "login" ? "Войти" : "Зарегистрироваться"}
        </Btn>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#6b6b88" }}>
          {mode === "login" ? "Нет аккаунта? " : "Уже есть аккаунт? "}
          <span onClick={() => { setMode(mode === "login" ? "reg" : "login"); setErr(""); }} style={{ color: "#c084fc", cursor: "pointer", fontWeight: 600 }}>
            {mode === "login" ? "Регистрация" : "Войти"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   SUBMIT MODAL (с формой и созданием заявки)
════════════════════════════════════════════════ */
function SubmitModal({ open, onClose, user, demon, db, onUpdate }) {
  const [tgUsername, setTgUsername] = useState("");
  const [percent, setPercent] = useState(50);
  const [videoLink, setVideoLink] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleSubmit = () => {
    setError("");
    if (!tgUsername.trim()) {
      setError("Укажите ваш Telegram username");
      return;
    }
    if (!demon) {
      setError("Демон не выбран");
      return;
    }
    const pct = Math.min(100, Math.max(1, parseInt(percent) || 0));
    const newPending = {
      id: Date.now(),
      username: user.username,
      demonId: demon.id,
      percent: pct,
      note: `Telegram: @${tgUsername.trim()} | Видео: ${videoLink.trim() || "не указано"}`,
      submittedAt: new Date().toISOString()
    };
    const newDb = {
      ...db,
      pending: [...db.pending, newPending]
    };
    onUpdate(newDb);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
      setTgUsername("");
      setPercent(50);
      setVideoLink("");
    }, 1500);
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.78)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#1e2131", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "28px 26px 24px", maxWidth: 500, width: "100%", position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", color: "#8888aa", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 4, color: "#eaeaf4" }}>Подача прогресса</div>
        <div style={{ fontSize: 13, color: "#6b6b88", marginBottom: 20 }}>Уровень: <span style={{ color: "#f87171" }}>{demon?.name || "не выбран"}</span></div>

        {success ? (
          <div style={{ background: "rgba(74,222,128,0.15)", border: "1px solid #4ade80", borderRadius: 12, padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
            <div style={{ color: "#4ade80", fontWeight: 600 }}>Заявка отправлена!</div>
            <div style={{ fontSize: 12, marginTop: 6, color: "#8888aa" }}>Администратор проверит её в ближайшее время</div>
          </div>
        ) : (
          <>
            <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: "#f87171", marginBottom: 2 }}>📌 Требования</div>
              <div style={{ fontSize: 12, color: "#c8c8e0" }}>Только видео, полная попытка, видимый HUD. Укажите ваш Telegram username для связи.</div>
            </div>

            <Input label="Telegram username" value={tgUsername} onChange={setTgUsername} placeholder="@username" />
            
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "#6b6b88", textTransform: "uppercase", marginBottom: 6 }}>Прогресс (%)</div>
              <input type="range" min="1" max="100" value={percent} onChange={e => setPercent(e.target.value)} style={{ width: "100%", background: "#13151e", accentColor: "#f87171" }} />
              <div style={{ fontFamily: "monospace", fontSize: 14, marginTop: 4, color: "#fbbf24" }}>{percent}%</div>
            </div>

            <Input label="Ссылка на видео (необязательно)" value={videoLink} onChange={setVideoLink} placeholder="https://youtu.be/..." />

            {error && <div style={{ fontSize: 12, color: "#f87171", marginBottom: 12, background: "rgba(248,113,113,0.08)", borderRadius: 8, padding: "8px 12px" }}>{error}</div>}

            <Btn onClick={handleSubmit} color="#4ade80" style={{ width: "100%", padding: "11px" }}>✈ Отправить заявку</Btn>
          </>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   DEMON CARD (с передачей onSubmit и id демона)
════════════════════════════════════════════════ */
function DemonCard({ demon, diff, rank, user, approved, onSubmit }) {
  const [open, setOpen] = useState(false);
  const meta = DM[diff];
  const rankColor = rank === 0 ? "#fbbf24" : rank === 1 ? "#94a3b8" : rank === 2 ? "#c47a3a" : "#44445a";

  const myApproved = approved.filter(a => a.username === user.username && a.demonId === demon.id);
  const beaten = myApproved.some(a => a.percent >= 100);
  const bestPct = myApproved.length ? Math.max(...myApproved.map(a => a.percent)) : 0;

  return (
    <div style={{ background: "#181b27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden", transition: "border-color 0.2s, transform 0.15s", }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "none"; }}
    >
      <div onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "stretch", minHeight: 78, cursor: "pointer", userSelect: "none" }}>
        <div style={{ width: 44, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: rankColor, borderRight: "1px solid rgba(255,255,255,0.06)" }}>{rank + 1}</div>
        <LevelArt demon={demon} diff={diff} />
        <div style={{ flex: 1, minWidth: 0, padding: "10px 12px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: "#eaeaf4", wordBreak: "break-word" }}>{demon.name}</div>
          <div style={{ fontSize: 12, color: "#6b6b88", display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ opacity: 0.5, flexShrink: 0 }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            <span>{demon.creator}</span>
            <span style={{ opacity: 0.4, fontFamily: "monospace", fontSize: 10 }}>· {meta.pts} pts</span>
          </div>
          {bestPct > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 2 }}>
              <Bar value={bestPct} color={meta.color} />
              <span style={{ fontFamily: "monospace", fontSize: 10, color: "#6b6b88", whiteSpace: "nowrap" }}>{bestPct}%</span>
            </div>
          )}
        </div>
        <div style={{ width: 120, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", padding: "10px 12px", gap: 5 }}>
          <DiffBadge diff={diff} />
          {beaten && <span style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 600, letterSpacing: 1, padding: "3px 7px", borderRadius: 5, background: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.28)" }}>✓ Beaten</span>}
          <span style={{ color: "#3a3a55", fontSize: 10, transition: "transform 0.25s", transform: open ? "rotate(180deg)" : "none" }}>▾</span>
        </div>
      </div>

      {open && (
        <div onClick={e => e.stopPropagation()} style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#13151e", padding: "14px 16px" }}>
          <div style={{ fontSize: 13, color: "#6b6b88", marginBottom: 12, lineHeight: 1.55 }}>
            Прогресс подтверждается через видео. Заполните форму и отправьте заявку — её проверит администратор.
          </div>
          <Btn onClick={() => onSubmit(demon)} color="#229ED9" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
            Подать прогресс
          </Btn>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════
   LIST PAGE (передаем onSubmit как функцию, принимающую демона)
════════════════════════════════════════════════ */
function ListPage({ user, approved, onSubmit }) {
  const keys = ["ext", "ins", "hard", "med"];
  return (
    <div>
      {keys.map((k, i, arr) => {
        const meta = DM[k];
        const demons = DEMONS_DATA[k];
        return (
          <div key={k}>
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 3, height: 22, borderRadius: 2, background: meta.color, boxShadow: `0 0 14px ${meta.glow}`, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: meta.color }}>{meta.label}</span>
                <span style={{ fontFamily: "monospace", fontSize: 10, color: "#44445a", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 20 }}>{demons.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {demons.map((d, idx) => (
                  <DemonCard key={d.id} demon={d} diff={k} rank={idx} user={user} approved={approved} onSubmit={onSubmit} />
                ))}
              </div>
            </div>
            {i < arr.length - 1 && <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.05)", margin: "4px 0 36px" }} />}
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════
   MY PROFILE PAGE
════════════════════════════════════════════════ */
function ProfilePage({ user, approved }) {
  const myRecs = approved.filter(a => a.username === user.username);
  const beaten = myRecs.filter(a => a.percent >= 100);
  const progress = myRecs.filter(a => a.percent < 100);

  const StatBox = ({ val, label, color }) => (
    <div style={{ background: "#181b27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "18px 14px", textAlign: "center" }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 34, lineHeight: 1, letterSpacing: -1, color }}>{val}</div>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.5, color: "#6b6b88", textTransform: "uppercase", marginTop: 5 }}>{label}</div>
    </div>
  );

  const RecRow = ({ rec }) => {
    const demon = ALL_DEMONS.find(d => d.id === rec.demonId);
    if (!demon) return null;
    const diff = demon.diff; const meta = DM[diff];
    return (
      <div style={{ background: "#181b27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden", display: "flex", alignItems: "stretch", minHeight: 64 }}>
        <LevelArt demon={demon} diff={diff} size={90} />
        <div style={{ flex: 1, minWidth: 0, padding: "8px 12px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 3 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: "#eaeaf4", wordBreak: "break-word" }}>{demon.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 2 }}>
            <Bar value={rec.percent} color={meta.color} />
            <span style={{ fontFamily: "monospace", fontSize: 10, color: "#6b6b88" }}>{rec.percent}%</span>
          </div>
          <div style={{ fontSize: 10, color: "#44445a" }}>подтверждено {new Date(rec.approvedAt).toLocaleDateString("ru")}</div>
        </div>
        <div style={{ flexShrink: 0, padding: "8px 10px", display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", gap: 4 }}>
          <DiffBadge diff={diff} />
          {rec.percent >= 100 && <span style={{ fontFamily: "monospace", fontSize: 9, color: "#4ade80", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 5, padding: "2px 6px" }}>✓ Beaten</span>}
          <span style={{ fontFamily: "monospace", fontSize: 9, color: "#c084fc" }}>+{rec.ptsAwarded} pts</span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ background: "#181b27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#f87171,#c084fc)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: "#0f1117", flexShrink: 0 }}>
          {user.username[0].toUpperCase()}
        </div>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: "#eaeaf4" }}>{user.username}</div>
          <div style={{ fontSize: 12, color: "#6b6b88", marginTop: 2 }}>{user.role === "admin" ? "👑 Администратор" : "Игрок"}</div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 26, color: "#fbbf24", letterSpacing: -1 }}>{user.points}</div>
          <div style={{ fontSize: 10, color: "#6b6b88", letterSpacing: 1, textTransform: "uppercase" }}>баллов</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10, marginBottom: 20 }}>
        <StatBox val={user.points} label="Баллы" color="#fbbf24" />
        <StatBox val={beaten.length} label="Пройдено" color="#4ade80" />
        <StatBox val={progress.length} label="Прогресс" color="#fb923c" />
      </div>

      {beaten.length > 0 && <>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#6b6b88", textTransform: "uppercase", marginBottom: 9 }}>✓ Пройденные уровни</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 20 }}>
          {beaten.map((r, i) => <RecRow key={i} rec={r} />)}
        </div>
      </>}
      {progress.length > 0 && <>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#6b6b88", textTransform: "uppercase", marginBottom: 9 }}>⏳ Прогрессы</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {progress.map((r, i) => <RecRow key={i} rec={r} />)}
        </div>
      </>}
      {myRecs.length === 0 && (
        <div style={{ background: "#181b27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "40px 20px", textAlign: "center", color: "#6b6b88" }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>🎮</div>
          <p style={{ fontSize: 13 }}>Подтверждённых прогрессов пока нет.<br />Отправьте заявку через форму на карточке уровня!</p>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════
   LEADERBOARD PAGE
════════════════════════════════════════════════ */
function LeaderboardPage({ db, approved }) {
  const ranked = [...db.users]
    .map(u => ({ ...u, approvedList: approved.filter(a => a.username === u.username) }))
    .sort((a, b) => b.points - a.points);

  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#6b6b88", textTransform: "uppercase", marginBottom: 14 }}>Таблица лидеров</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ranked.map((u, i) => {
          const beaten = u.approvedList.filter(a => a.percent >= 100).length;
          const rc = i === 0 ? "#fbbf24" : i === 1 ? "#94a3b8" : i === 2 ? "#c47a3a" : "#44445a";
          return (
            <div key={u.username} style={{ background: "#181b27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 16, color: rc, width: 28, textAlign: "center", flexShrink: 0 }}>#{i + 1}</div>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#f87171,#c084fc)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: "#0f1117", flexShrink: 0 }}>
                {u.username[0].toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: "#eaeaf4" }}>
                  {u.username} {u.role === "admin" && <span style={{ fontSize: 10, color: "#fbbf24" }}>👑</span>}
                </div>
                <div style={{ fontSize: 11, color: "#6b6b88" }}>{beaten} пройдено · {u.approvedList.length} подтверждений</div>
              </div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: "#fbbf24", letterSpacing: -1 }}>{u.points}</div>
              <div style={{ fontSize: 10, color: "#6b6b88", letterSpacing: 1 }}>pts</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   ADMIN PANEL (с вкладкой заявок)
════════════════════════════════════════════════ */
function AdminPanel({ db, onUpdate, currentUser }) {
  const [activeTab, setActiveTab] = useState("pending");
  const [ptUser, setPtUser] = useState("");
  const [ptAmt, setPtAmt] = useState("");
  const [ptNote, setPtNote] = useState("");
  const [flash, setFlash] = useState("");

  const [selUser, setSelUser] = useState("");
  const [selDemon, setSelDemon] = useState("");
  const [selPct, setSelPct] = useState("100");

  const doApprove = (pending) => {
    const demon = ALL_DEMONS.find(d => d.id === pending.demonId);
    if (!demon) return;
    const pts = pending.percent >= 100 ? demon.diffPts : Math.floor(demon.diffPts * pending.percent / 100 * 0.3);
    const rec = { id: Date.now(), username: pending.username, demonId: pending.demonId, percent: pending.percent, approvedAt: new Date().toISOString(), approvedBy: currentUser.username, ptsAwarded: pts };
    const newDb = {
      ...db,
      pending: db.pending.filter(p => p.id !== pending.id),
      approved: [...db.approved, rec],
      users: db.users.map(u => u.username === pending.username ? { ...u, points: u.points + pts } : u),
    };
    onUpdate(newDb);
    setFlash(`✓ Одобрено: ${pending.username} +${pts} pts`);
    setTimeout(() => setFlash(""), 3000);
  };

  const doReject = (pending) => {
    onUpdate({ ...db, pending: db.pending.filter(p => p.id !== pending.id) });
    setFlash(`✗ Отклонено: ${pending.username}`);
    setTimeout(() => setFlash(""), 3000);
  };

  const doAddManual = () => {
    if (!selUser || !selDemon || !selPct) return;
    const pct = Math.min(100, Math.max(1, parseInt(selPct) || 0));
    const demon = ALL_DEMONS.find(d => d.id === selDemon);
    if (!demon) return;
    const pts = pct >= 100 ? demon.diffPts : Math.floor(demon.diffPts * pct / 100 * 0.3);
    const rec = { id: Date.now(), username: selUser, demonId: selDemon, percent: pct, approvedAt: new Date().toISOString(), approvedBy: currentUser.username, ptsAwarded: pts };
    const newDb = {
      ...db,
      approved: [...db.approved, rec],
      users: db.users.map(u => u.username === selUser ? { ...u, points: u.points + pts } : u),
    };
    onUpdate(newDb);
    setFlash(`✓ Добавлено: ${selUser} ${pct}% → +${pts} pts`);
    setTimeout(() => setFlash(""), 3000);
  };

  const doPoints = (plus) => {
    const amt = parseInt(ptAmt) || 0;
    if (!ptUser || !amt) return;
    const delta = plus ? amt : -amt;
    onUpdate({ ...db, users: db.users.map(u => u.username === ptUser ? { ...u, points: Math.max(0, u.points + delta) } : u) });
    setFlash(`${delta > 0 ? "+" : ""}${delta} pts → ${ptUser}`);
    setTimeout(() => setFlash(""), 3000);
    setPtAmt(""); setPtNote("");
  };

  const adminTabs = [
    { k: "pending", l: `Заявки (${db.pending.length})` },
    { k: "manual", l: "Добавить вручную" },
    { k: "users", l: "Пользователи" },
    { k: "points", l: "Баллы" },
  ];

  const tabStyle = (k) => ({
    fontFamily: "'Outfit',sans-serif", fontWeight: 500, fontSize: 12,
    padding: "6px 12px", border: "none", borderRadius: 8,
    background: activeTab === k ? "rgba(251,191,36,0.15)" : "transparent",
    color: activeTab === k ? "#fbbf24" : "#6b6b88",
    cursor: "pointer", whiteSpace: "nowrap",
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <span style={{ fontSize: 16 }}>👑</span>
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: "#fbbf24" }}>Панель администратора</span>
      </div>

      {flash && <div style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#4ade80" }}>{flash}</div>}

      <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap", background: "#181b27", borderRadius: 10, padding: 4 }}>
        {adminTabs.map(t => <button key={t.k} onClick={() => setActiveTab(t.k)} style={tabStyle(t.k)}>{t.l}</button>)}
      </div>

      {/* PENDING */}
      {activeTab === "pending" && (
        <div>
          {db.pending.length === 0 ? (
            <div style={{ textAlign: "center", color: "#6b6b88", padding: "40px 20px", background: "#181b27", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
              <p style={{ fontSize: 13 }}>Нет ожидающих заявок</p>
            </div>
          ) : db.pending.map(p => {
            const demon = ALL_DEMONS.find(d => d.id === p.demonId);
            const diff = demon?.diff;
            return (
              <div key={p.id} style={{ background: "#181b27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 16px", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: "#eaeaf4" }}>{p.username}</span>
                  <span style={{ color: "#6b6b88" }}>→</span>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 13, color: diff ? DM[diff].color : "#eaeaf4" }}>{demon?.name}</span>
                  {diff && <DiffBadge diff={diff} />}
                  <span style={{ fontFamily: "monospace", fontSize: 12, color: "#fbbf24" }}>{p.percent}%</span>
                  <span style={{ marginLeft: "auto", fontSize: 10, color: "#44445a" }}>{new Date(p.submittedAt).toLocaleString("ru")}</span>
                </div>
                {p.note && <div style={{ fontSize: 12, color: "#8888aa", marginBottom: 10, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "8px 10px", wordBreak: "break-all" }}>{p.note}</div>}
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn onClick={() => doApprove(p)} color="#4ade80" small>✓ Одобрить</Btn>
                  <Btn onClick={() => doReject(p)} color="#f87171" outline small>✗ Отклонить</Btn>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MANUAL ADD */}
      {activeTab === "manual" && (
        <div style={{ background: "#181b27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "18px 16px" }}>
          <div style={{ fontSize: 13, color: "#6b6b88", marginBottom: 16 }}>Добавить подтверждённый прогресс вручную (без заявки)</div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "#6b6b88", textTransform: "uppercase", marginBottom: 6 }}>Игрок</div>
            <select value={selUser} onChange={e => setSelUser(e.target.value)} style={{ width: "100%", background: "#13151e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#eaeaf4", fontFamily: "'Outfit',sans-serif", fontSize: 14, padding: "10px 12px", outline: "none" }}>
              <option value="">Выберите игрока</option>
              {db.users.map(u => <option key={u.username} value={u.username}>{u.username}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "#6b6b88", textTransform: "uppercase", marginBottom: 6 }}>Уровень</div>
            <select value={selDemon} onChange={e => setSelDemon(e.target.value)} style={{ width: "100%", background: "#13151e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#eaeaf4", fontFamily: "'Outfit',sans-serif", fontSize: 14, padding: "10px 12px", outline: "none" }}>
              <option value="">Выберите уровень</option>
              {Object.entries(DEMONS_DATA).flatMap(([diff, arr]) => arr.map(d => <option key={d.id} value={d.id}>[{DM[diff].label.split(" ")[0]}] {d.name}</option>))}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "#6b6b88", textTransform: "uppercase", marginBottom: 6 }}>Процент</div>
            <input type="number" min="1" max="100" value={selPct} onChange={e => setSelPct(e.target.value)} style={{ width: "100%", background: "#13151e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#eaeaf4", fontFamily: "monospace", fontSize: 14, padding: "10px 12px", outline: "none" }} />
          </div>
          <Btn onClick={doAddManual} color="#4ade80">Добавить прогресс</Btn>
        </div>
      )}

      {/* USERS */}
      {activeTab === "users" && (
        <div>
          {db.users.map(u => {
            const recs = db.approved.filter(a => a.username === u.username);
            const beaten = recs.filter(a => a.percent >= 100).length;
            return (
              <div key={u.username} style={{ background: "#181b27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#f87171,#c084fc)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, color: "#0f1117", flexShrink: 0 }}>
                  {u.username[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: "#eaeaf4" }}>
                    {u.username} {u.role === "admin" && <span style={{ fontSize: 10, color: "#fbbf24" }}>👑</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "#6b6b88" }}>{beaten} пройдено · {recs.length} записей</div>
                </div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: "#fbbf24" }}>{u.points} pts</div>
              </div>
            );
          })}
        </div>
      )}

      {/* POINTS */}
      {activeTab === "points" && (
        <div style={{ background: "#181b27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "18px 16px" }}>
          <div style={{ fontSize: 13, color: "#6b6b88", marginBottom: 16 }}>Вручную изменить баллы игрока</div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "#6b6b88", textTransform: "uppercase", marginBottom: 6 }}>Игрок</div>
            <select value={ptUser} onChange={e => setPtUser(e.target.value)} style={{ width: "100%", background: "#13151e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#eaeaf4", fontFamily: "'Outfit',sans-serif", fontSize: 14, padding: "10px 12px", outline: "none" }}>
              <option value="">Выберите игрока</option>
              {db.users.map(u => <option key={u.username} value={u.username}>{u.username} ({u.points} pts)</option>)}
            </select>
          </div>
          <Input label="Количество баллов" type="number" value={ptAmt} onChange={setPtAmt} placeholder="например: 50" />
          <Input label="Причина (необязательно)" value={ptNote} onChange={setPtNote} placeholder="за что начислено/снято" />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={() => doPoints(true)} color="#4ade80">+ Начислить</Btn>
            <Btn onClick={() => doPoints(false)} color="#f87171" outline>− Снять</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════
   APP
════════════════════════════════════════════════ */
export default function App() {
  const [db, setDb] = useState(load);
  const [currentUser, setCurrentUser] = useState(null);
  const [tab, setTab] = useState("list");
  const [submitModal, setSubmitModal] = useState(false);
  const [selectedDemon, setSelectedDemon] = useState(null);

  const updateDb = (newDb) => { setDb(newDb); save(newDb); };

  const handleAuth = (user, isNew = false) => {
    if (isNew) {
      const newDb = { ...db, users: [...db.users, user] };
      updateDb(newDb);
      setCurrentUser(user);
    } else {
      const fresh = db.users.find(u => u.username === user.username) || user;
      setCurrentUser(fresh);
    }
    setTab("list");
  };

  const handleLogout = () => { setCurrentUser(null); setTab("list"); };

  const openSubmitModal = (demon) => {
    setSelectedDemon(demon);
    setSubmitModal(true);
  };

  useEffect(() => {
    if (currentUser) {
      const fresh = db.users.find(u => u.username === currentUser.username);
      if (fresh) setCurrentUser(fresh);
    }
  }, [db]);

  if (!currentUser) return <AuthPage onAuth={handleAuth} db={db} />;

  const isAdmin = currentUser.role === "admin";
  const TABS = [
    { k: "list", l: "Список" },
    { k: "profile", l: "Мой профиль" },
    { k: "leaderboard", l: "Лидеры" },
    ...(isAdmin ? [{ k: "admin", l: "👑 Админ" }] : []),
  ];

  return (
    <div style={{ background: "#0f1117", minHeight: "100vh", color: "#eaeaf4", fontFamily: "'Outfit',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        input, select { -webkit-appearance: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0f1117; }
        ::-webkit-scrollbar-thumb { background: #1e2131; border-radius: 4px; }
      `}</style>

      {/* HEADER */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(15,17,23,0.92)", backdropFilter: "blur(22px)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 58, gap: 10 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: -0.5, whiteSpace: "nowrap", display: "flex", alignItems: "baseline", gap: 2 }}>
          GD<span style={{ color: "#f87171" }}>·</span>Demons
        </div>
        <nav style={{ display: "flex", gap: 2, overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 500, fontSize: 12, padding: "6px 12px", border: "none", borderRadius: 8, background: tab === t.k ? (t.k === "admin" ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.08)") : "transparent", color: tab === t.k ? (t.k === "admin" ? "#fbbf24" : "#eaeaf4") : "#6b6b88", cursor: "pointer", whiteSpace: "nowrap" }}>
              {t.l}
            </button>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: "#fbbf24", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 6, padding: "3px 8px" }}>
            {currentUser.points} pts
          </div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, color: "#eaeaf4" }}>{currentUser.username}</div>
          <button onClick={handleLogout} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, padding: "5px 10px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, background: "transparent", color: "#6b6b88", cursor: "pointer" }}>Выйти</button>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 940, margin: "0 auto", padding: "24px 14px 80px" }}>
        {tab === "list" && <ListPage user={currentUser} approved={db.approved} onSubmit={openSubmitModal} />}
        {tab === "profile" && <ProfilePage user={currentUser} approved={db.approved} />}
        {tab === "leaderboard" && <LeaderboardPage db={db} approved={db.approved} />}
        {tab === "admin" && isAdmin && <AdminPanel db={db} onUpdate={updateDb} currentUser={currentUser} />}
      </div>

      <SubmitModal 
        open={submitModal} 
        onClose={() => { setSubmitModal(false); setSelectedDemon(null); }} 
        user={currentUser}
        demon={selectedDemon}
        db={db}
        onUpdate={updateDb}
      />
    </div>
  );
}