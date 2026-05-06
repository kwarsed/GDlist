import { useState, useEffect } from "react";

const ADMIN_USER = { username: "kwarsed", password: "5179678nAta", role: "admin", avatar: null };
const SK = "gdml_v6";
const SESSION_KEY = "gdml_current_user";
const APP_VERSION = "v1.2.0";

const UPDATE_HISTORY = [
  { version: "v1.2.0", date: "06.05.2026", changes: [
    "➕ Добавлена вкладка 'О проекте'",
    "➕ Добавлены настройки пользователя (смена ника и аватарки)",
    "➕ Аватарки пользователей отображаются в круге",
    "➕ Показ пароля (глазик) при вводе",
    "➕ Анимация переключения между входом и регистрацией",
    "➕ Ограничения на длину ника (3-20) и пароля (6-30)",
    "➕ Проверка уникальности ника при смене",
    "🔧 Исправлена ошибка входа в аккаунт",
    "🔧 Аккаунт теперь не слетает при перезагрузке"
  ]},
  { version: "v1.0.0", date: "04.05.2026", changes: ["➕ Первый релиз"] }
];

const DM = {
  ext: { label: "Extreme Demon", color: "#f87171", glow: "rgba(248,113,113,0.18)", pts: 150 },
  ins: { label: "Insane Demon", color: "#c084fc", glow: "rgba(192,132,252,0.18)", pts: 80 },
  hard: { label: "Hard Demon", color: "#fb923c", glow: "rgba(251,146,60,0.18)", pts: 30 },
  med: { label: "Medium Demon", color: "#38bdf8", glow: "rgba(56,189,248,0.18)", pts: 10 },
};

const DEMONS_DATA = {
  ext: [
    { id:"EX01", name:"Acheron", creator:"Silentium", color:"#1a0a2e", accent:"#7c3aed" },
    { id:"EX02", name:"Abyss of Darkness", creator:"Pennutoh", color:"#0a0a1a", accent:"#2563eb" },
    { id:"EX03", name:"Kyouki", creator:"xSmokes", color:"#1a0a0a", accent:"#dc2626" },
    { id:"EX04", name:"LIMBO", creator:"Doggie", color:"#0f0f0f", accent:"#6366f1" },
    { id:"EX05", name:"Kenos", creator:"Dudex", color:"#0a1a0a", accent:"#16a34a" },
    { id:"EX06", name:"The Golden", creator:"AeonAir", color:"#1a1200", accent:"#d97706" },
    { id:"EX07", name:"Zodiac", creator:"Xcy7", color:"#1a0a1a", accent:"#9333ea" },
    { id:"EX08", name:"Tartarus", creator:"Dolphy", color:"#0a0a0a", accent:"#ef4444" },
    { id:"EX09", name:"Slaughterhouse", creator:"Woeful", color:"#1a0505", accent:"#b91c1c" },
    { id:"EX10", name:"Genocide", creator:"Knobbelboy", color:"#050a1a", accent:"#3b82f6" },
  ],
  ins: [
    { id:"IN01", name:"Cataclysm", creator:"Ggb0y", color:"#0a0a1a", accent:"#6366f1" },
    { id:"IN02", name:"Sonic Wave Infinity", creator:"Riot", color:"#00101a", accent:"#0ea5e9" },
    { id:"IN03", name:"Artificial Ascent", creator:"Stilluzen", color:"#0a1a0a", accent:"#22c55e" },
    { id:"IN04", name:"Windy Landscape", creator:"Zobros", color:"#0a1210", accent:"#14b8a6" },
    { id:"IN05", name:"Yatagarasu", creator:"Woffy", color:"#1a0a00", accent:"#f59e0b" },
    { id:"IN06", name:"Phobos", creator:"Bl4zze", color:"#150005", accent:"#e11d48" },
    { id:"IN07", name:"Erebus", creator:"Temp", color:"#050510", accent:"#8b5cf6" },
    { id:"IN08", name:"Athanatos", creator:"Bianox", color:"#001010", accent:"#06b6d4" },
    { id:"IN09", name:"Supersonic", creator:"Roadbose", color:"#100a00", accent:"#ea580c" },
    { id:"IN10", name:"Poltergeist", creator:"Bianox", color:"#0a0010", accent:"#a855f7" },
  ],
  hard: [
    { id:"HD01", name:"Clubstep", creator:"RobTop", color:"#001a0a", accent:"#10b981" },
    { id:"HD02", name:"Theory of Everything 2", creator:"RobTop", color:"#0a001a", accent:"#7c3aed" },
    { id:"HD03", name:"Deadlocked", creator:"RobTop", color:"#1a0000", accent:"#dc2626" },
    { id:"HD04", name:"Blast Processing", creator:"TMB50", color:"#001020", accent:"#2563eb" },
    { id:"HD05", name:"Jawbreaker", creator:"TMB50", color:"#1a0a00", accent:"#f59e0b" },
    { id:"HD06", name:"Speed Racer", creator:"Ggb0y", color:"#1a1000", accent:"#eab308" },
    { id:"HD07", name:"Dark Rainbow", creator:"Xaro", color:"#0a001a", accent:"#ec4899" },
    { id:"HD08", name:"The Realistic", creator:"Jeyzor", color:"#001a10", accent:"#059669" },
    { id:"HD09", name:"Nine Circles", creator:"Zobros", color:"#00101a", accent:"#0284c7" },
    { id:"HD10", name:"Impulse", creator:"npesta", color:"#100020", accent:"#9333ea" },
  ],
  med: [
    { id:"MD01", name:"Hexagon Force", creator:"RobTop", color:"#001510", accent:"#34d399" },
    { id:"MD02", name:"Geometrical Dominator", creator:"RobTop", color:"#1a0a00", accent:"#fb923c" },
    { id:"MD03", name:"Ultra Violence", creator:"Viprin", color:"#0a0a1a", accent:"#818cf8" },
    { id:"MD04", name:"Crimson Planet", creator:"RealTriangle", color:"#1a0005", accent:"#f43f5e" },
    { id:"MD05", name:"Nine Circles", creator:"Zobros", color:"#00101a", accent:"#38bdf8" },
  ],
};

const ALL_DEMONS = Object.entries(DEMONS_DATA).flatMap(([diff, arr]) =>
  arr.map(d => ({ ...d, diff, diffPts: DM[diff].pts }))
);

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

const saveSession = (user) => {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ username: user.username }));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
};

const loadSession = (db) => {
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      const { username } = JSON.parse(saved);
      const user = db.users.find(u => u.username === username);
      if (user) return user;
    }
  } catch {}
  return null;
};

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

const Input = ({ label, type = "text", value, onChange, placeholder, style = {} }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "#6b6b88", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <input
          type={isPassword && showPassword ? "text" : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ width: "100%", background: "#13151e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#eaeaf4", fontFamily: "'Outfit',sans-serif", fontSize: 14, padding: "10px 12px", paddingRight: isPassword ? 40 : 12, outline: "none", ...style }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: "absolute", right: 12, background: "transparent", border: "none", color: "#6b6b88", cursor: "pointer", fontSize: 16 }}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        )}
      </div>
    </div>
  );
};

const UserAvatar = ({ user, size = 40 }) => {
  const [imgError, setImgError] = useState(false);
  
  if (user?.avatar && !imgError) {
    return (
      <img 
        src={user.avatar} 
        alt={user.username}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", background: "linear-gradient(135deg,#f87171,#c084fc)" }}
        onError={() => setImgError(true)}
      />
    );
  }
  
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "linear-gradient(135deg,#f87171,#c084fc)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: Math.floor(size * 0.4), color: "#0f1117", flexShrink: 0 }}>
      {user?.username?.[0]?.toUpperCase() || "?"}
    </div>
  );
};

const LevelArt = ({ demon, diff, size = 110 }) => {
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
        <circle cx="0" cy="0" r="35" fill={acc} fillOpacity="0.12" />
      </svg>
      <div style={{ position: "relative", zIndex: 1, fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 26, color: acc, textShadow: `0 0 18px ${acc}88`, userSelect: "none" }}>
        {initials.toUpperCase()}
      </div>
    </div>
  );
};

const AuthPage = ({ onAuth, db }) => {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [animating, setAnimating] = useState(false);

  const switchMode = (newMode) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setMode(newMode);
      setErr("");
      setUsername("");
      setPassword("");
      setTimeout(() => setAnimating(false), 50);
    }, 150);
  };

  const validateUsername = (u) => u.length >= 3 && u.length <= 20 && /^[a-zA-Z0-9_]+$/.test(u);
  const validatePassword = (p) => p.length >= 6 && p.length <= 30;

  const handle = () => {
    setErr("");
    const u = username.trim();
    const p = password.trim();
    
    if (!u || !p) { setErr("Заполните все поля"); return; }
    
    if (mode === "login") {
      const found = db.users.find(x => x.username === u && x.password === p);
      if (!found) { setErr("Неверный логин или пароль"); return; }
      onAuth(found);
    } else {
      if (!validateUsername(u)) { setErr("Ник от 3 до 20 символов (буквы, цифры, _)"); return; }
      if (!validatePassword(p)) { setErr("Пароль от 6 до 30 символов"); return; }
      if (db.users.find(x => x.username === u)) { setErr("Такой ник уже занят"); return; }
      const newUser = { username: u, password: p, role: "user", points: 0, completions: {}, displayName: u, avatar: null };
      onAuth(newUser, true);
    }
  };

  const formStyle = {
    transition: "opacity 0.15s ease-in-out, transform 0.15s ease-in-out",
    opacity: animating ? 0 : 1,
    transform: animating ? "translateX(8px)" : "translateX(0)"
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
        
        <div style={formStyle}>
          <Input label="Ник (GD username)" value={username} onChange={setUsername} placeholder="username" />
          <Input label="Пароль" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
        </div>
        
        {err && <div style={{ fontSize: 12, color: "#f87171", marginBottom: 12, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8, padding: "8px 12px" }}>{err}</div>}
        
        <Btn onClick={handle} color="#f87171" style={{ width: "100%", padding: "11px" }}>
          {mode === "login" ? "Войти" : "Зарегистрироваться"}
        </Btn>
        
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#6b6b88" }}>
          {mode === "login" ? "Нет аккаунта? " : "Уже есть аккаунт? "}
          <span onClick={() => switchMode(mode === "login" ? "reg" : "login")} style={{ color: "#c084fc", cursor: "pointer", fontWeight: 600 }}>
            {mode === "login" ? "Регистрация" : "Войти"}
          </span>
        </div>
      </div>
    </div>
  );
};

const SubmitModal = ({ open, onClose, user, demon, db, onUpdate }) => {
  const [tgUsername, setTgUsername] = useState("");
  const [percent, setPercent] = useState(50);
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
      note: `Telegram: @${tgUsername.trim()} | Прогресс: ${pct}%`,
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
    }, 1500);
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.78)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#1e2131", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "28px 26px 24px", maxWidth: 500, width: "100%", position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", color: "#8888aa" }}>✕</button>
        
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
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: "#f87171", marginBottom: 2 }}>📌 Как подать заявку</div>
              <div style={{ fontSize: 12, color: "#c8c8e0" }}>
                1. Снимите видео вашего прогресса<br/>
                2. Отправьте видео в Telegram-группу<br/>
                3. Укажите ваш Telegram username и процент ниже<br/>
                4. Администратор проверит видео и одобрит заявку
              </div>
            </div>

            <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
              <a href="https://t.me/+rxTdIyv5aeUzOTUy" target="_blank" rel="noopener noreferrer" style={{ background: "#229ED9", color: "#fff", padding: "10px 20px", borderRadius: 40, textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8 }}>
                📱 Перейти в Telegram-группу
              </a>
            </div>

            <Input label="Telegram username" value={tgUsername} onChange={setTgUsername} placeholder="@username" />
            
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "#6b6b88", textTransform: "uppercase", marginBottom: 6 }}>Прогресс (%)</div>
              <input type="range" min="1" max="100" value={percent} onChange={e => setPercent(e.target.value)} style={{ width: "100%", background: "#13151e", accentColor: "#f87171" }} />
              <div style={{ fontFamily: "monospace", fontSize: 14, marginTop: 4, color: "#fbbf24" }}>{percent}%</div>
            </div>

            {error && <div style={{ fontSize: 12, color: "#f87171", marginBottom: 12, background: "rgba(248,113,113,0.08)", borderRadius: 8, padding: "8px 12px" }}>{error}</div>}

            <Btn onClick={handleSubmit} color="#4ade80" style={{ width: "100%", padding: "11px" }}>✈ Отправить заявку</Btn>
          </>
        )}
      </div>
    </div>
  );
};

const DemonCard = ({ demon, diff, rank, user, approved, onSubmit }) => {
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
            Прогресс подтверждается только через видео в Telegram-группе.<br />
            После проверки администратором — баллы начислятся автоматически.
          </div>
          <Btn onClick={() => onSubmit(demon)} color="#229ED9" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            Подать прогресс в Telegram
          </Btn>
        </div>
      )}
    </div>
  );
};

const ListPage = ({ user, approved, onSubmit }) => {
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
};

const ProfilePage = ({ user, approved }) => {
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
        <UserAvatar user={user} size={52} />
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: "#eaeaf4" }}>{user.displayName || user.username}</div>
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
          <p style={{ fontSize: 13 }}>Подтверждённых прогрессов пока нет.<br />Отправьте видео в Telegram-группу!</p>
        </div>
      )}
    </div>
  );
};

const AboutPage = () => {
  return (
    <div>
      <div style={{ background: "#181b27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "24px 20px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24, color: "#f87171" }}>GD·Demons</div>
          <div style={{ background: "rgba(248,113,113,0.15)", padding: "4px 10px", borderRadius: 20, fontSize: 12, color: "#f87171" }}>{APP_VERSION}</div>
        </div>
        <p style={{ fontSize: 14, color: "#b8b8d0", lineHeight: 1.6, marginBottom: 20 }}>
          Трекер прогресса для прохождения демонов в Geometry Dash.
        </p>
        
        <div style={{ fontSize: 13, fontWeight: 600, color: "#6b6b88", marginBottom: 12, letterSpacing: 1 }}>🔗 ССЫЛКИ</div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
          <a href="#" style={{ color: "#f87171", textDecoration: "none", background: "rgba(255,255,255,0.05)", padding: "8px 16px", borderRadius: 30 }}>📺 YouTube</a>
          <a href="#" style={{ color: "#818cf8", textDecoration: "none", background: "rgba(255,255,255,0.05)", padding: "8px 16px", borderRadius: 30 }}>💬 Discord</a>
          <a href="https://t.me/+rxTdIyv5aeUzOTUy" target="_blank" style={{ color: "#229ED9", textDecoration: "none", background: "rgba(255,255,255,0.05)", padding: "8px 16px", borderRadius: 30 }}>📱 Telegram</a>
        </div>
      </div>

      <div style={{ background: "#181b27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px" }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 16, color: "#eaeaf4" }}>📋 История обновлений</div>
        {UPDATE_HISTORY.map((update, idx) => (
          <div key={idx} style={{ marginBottom: 20, borderLeft: "2px solid rgba(248,113,113,0.5)", paddingLeft: 16 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 14, color: "#f87171" }}>{update.version}</span>
              <span style={{ fontSize: 11, color: "#6b6b88" }}>{update.date}</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: "#b8b8d0", lineHeight: 1.7 }}>
              {update.changes.map((change, i) => <li key={i}>{change}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsPage = ({ user, db, onUpdate, onLogout }) => {
  const [newUsername, setNewUsername] = useState(user.displayName || user.username);
  const [newAvatar, setNewAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangeUsername = () => {
    setError("");
    setSuccess("");
    const username = newUsername.trim();
    
    if (!username || username.length < 3 || username.length > 20) {
      setError("Ник должен быть от 3 до 20 символов");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Ник может содержать только буквы, цифры и _");
      return;
    }
    if (db.users.find(u => u.username === username && u.username !== user.username)) {
      setError("Этот ник уже занят");
      return;
    }
    
    const newDb = {
      ...db,
      users: db.users.map(u => {
        if (u.username === user.username) {
          return { ...u, username: username, displayName: username };
        }
        return u;
      }),
      approved: db.approved.map(a => {
        if (a.username === user.username) return { ...a, username: username };
        return a;
      }),
      pending: db.pending.map(p => {
        if (p.username === user.username) return { ...p, username: username };
        return p;
      })
    };
    
    onUpdate(newDb);
    saveSession({ username: username });
    setSuccess("Ник успешно изменён! Перезайдите для применения.");
    setTimeout(() => { setSuccess(""); onLogout(); }, 2000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Можно загружать только изображения");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Размер изображения не должен превышать 2MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const newDb = {
        ...db,
        users: db.users.map(u => {
          if (u.username === user.username) {
            return { ...u, avatar: reader.result };
          }
          return u;
        })
      };
      onUpdate(newDb);
      setAvatarPreview(reader.result);
      setSuccess("Аватарка обновлена!");
      setTimeout(() => setSuccess(""), 2000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    const newDb = {
      ...db,
      users: db.users.map(u => {
        if (u.username === user.username) {
          return { ...u, avatar: null };
        }
        return u;
      })
    };
    onUpdate(newDb);
    setAvatarPreview(null);
    setSuccess("Аватарка удалена!");
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <div>
      <div style={{ background: "#181b27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "24px 20px", marginBottom: 20 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 20, color: "#eaeaf4" }}>⚙️ Настройки аккаунта</div>
        
        {error && <div style={{ fontSize: 12, color: "#f87171", marginBottom: 16, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8, padding: "8px 12px" }}>{error}</div>}
        {success && <div style={{ fontSize: 12, color: "#4ade80", marginBottom: 16, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 8, padding: "8px 12px" }}>{success}</div>}
        
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "#6b6b88", textTransform: "uppercase", marginBottom: 12 }}>Аватар</div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <UserAvatar user={user} size={80} />
            <div>
              <label style={{ background: "#f87171", color: "#0f1117", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-block" }}>
                Загрузить новое фото
                <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
              </label>
              {avatarPreview && (
                <button onClick={handleRemoveAvatar} style={{ marginLeft: 12, background: "transparent", border: "1px solid rgba(248,113,113,0.5)", color: "#f87171", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Удалить
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "#6b6b88", textTransform: "uppercase", marginBottom: 6 }}>Никнейм</div>
          <input 
            type="text" 
            value={newUsername} 
            onChange={e => setNewUsername(e.target.value)} 
            placeholder="Новый ник" 
            style={{ width: "100%", background: "#13151e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#eaeaf4", fontFamily: "'Outfit',sans-serif", fontSize: 14, padding: "10px 12px", outline: "none", marginBottom: 12 }}
          />
          <Btn onClick={handleChangeUsername} color="#f87171" small>Изменить ник</Btn>
          <p style={{ fontSize: 11, color: "#6b6b88", marginTop: 8 }}>* После смены ника нужно будет войти заново</p>
        </div>
      </div>
    </div>
  );
};

const LeaderboardPage = ({ db, approved }) => {
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
              <UserAvatar user={u} size={38} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: "#eaeaf4" }}>
                  {u.displayName || u.username} {u.role === "admin" && <span style={{ fontSize: 10, color: "#fbbf24" }}>👑</span>}
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
};

const AdminPanel = ({ db, onUpdate, currentUser }) => {
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

  return (
    <div>
      <div style={{ background: "#181b27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 10 }}>
          <button onClick={() => setActiveTab("pending")} style={{ background: activeTab === "pending" ? "#f87171" : "transparent", color: activeTab === "pending" ? "#0f1117" : "#6b6b88", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}>Заявки ({db.pending.length})</button>
          <button onClick={() => setActiveTab("manual")} style={{ background: activeTab === "manual" ? "#f87171" : "transparent", color: activeTab === "manual" ? "#0f1117" : "#6b6b88", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}>Добавить вручную</button>
          <button onClick={() => setActiveTab("users")} style={{ background: activeTab === "users" ? "#f87171" : "transparent", color: activeTab === "users" ? "#0f1117" : "#6b6b88", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}>Пользователи</button>
          <button onClick={() => setActiveTab("points")} style={{ background: activeTab === "points" ? "#f87171" : "transparent", color: activeTab === "points" ? "#0f1117" : "#6b6b88", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}>Баллы</button>
        </div>

        {flash && <div style={{ background: "#4ade8022", border: "1px solid #4ade80", borderRadius: 8, padding: "8px 12px", marginBottom: 12, fontSize: 12, color: "#4ade80" }}>{flash}</div>}

        {activeTab === "pending" && (
          <div>
            {db.pending.length === 0 ? <div style={{ textAlign: "center", color: "#6b6b88", padding: 20 }}>Нет заявок</div> : db.pending.map(p => {
              const demon = ALL_DEMONS.find(d => d.id === p.demonId);
              return (
                <div key={p.id} style={{ background: "#13151e", borderRadius: 8, padding: 12, marginBottom: 8 }}>
                  <div><b>{p.username}</b> → {demon?.name} ({p.percent}%)</div>
                  <div style={{ fontSize: 11, color: "#6b6b88", marginTop: 4 }}>{p.note}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <Btn onClick={() => doApprove(p)} color="#4ade80" small>✓ Одобрить</Btn>
                    <Btn onClick={() => doReject(p)} color="#f87171" outline small>✗ Отклонить</Btn>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "manual" && (
          <div>
            <select value={selUser} onChange={e => setSelUser(e.target.value)} style={{ width: "100%", background: "#13151e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 8, marginBottom: 8, color: "#eaeaf4" }}>
              <option value="">Выберите игрока</option>
              {db.users.map(u => <option key={u.username} value={u.username}>{u.displayName || u.username}</option>)}
            </select>
            <select value={selDemon} onChange={e => setSelDemon(e.target.value)} style={{ width: "100%", background: "#13151e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 8, marginBottom: 8, color: "#eaeaf4" }}>
              <option value="">Выберите уровень</option>
              {ALL_DEMONS.map(d => <option key={d.id} value={d.id}>[{DM[d.diff].label}] {d.name}</option>)}
            </select>
            <input type="number" value={selPct} onChange={e => setSelPct(e.target.value)} placeholder="100" style={{ width: "100%", background: "#13151e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 8, marginBottom: 8, color: "#eaeaf4" }} />
            <Btn onClick={doAddManual} color="#4ade80">Добавить</Btn>
          </div>
        )}

        {activeTab === "users" && (
          <div>
            {db.users.map(u => (
              <div key={u.username} style={{ display: "flex", alignItems: "center", gap: 8, padding: 8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <UserAvatar user={u} size={30} />
                <div style={{ flex: 1 }}>{u.displayName || u.username}</div>
                <div>{u.points} pts</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "points" && (
          <div>
            <select value={ptUser} onChange={e => setPtUser(e.target.value)} style={{ width: "100%", background: "#13151e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 8, marginBottom: 8, color: "#eaeaf4" }}>
              <option value="">Выберите игрока</option>
              {db.users.map(u => <option key={u.username} value={u.username}>{u.displayName || u.username} ({u.points} pts)</option>)}
            </select>
            <input type="number" value={ptAmt} onChange={e => setPtAmt(e.target.value)} placeholder="Количество" style={{ width: "100%", background: "#13151e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 8, marginBottom: 8, color: "#eaeaf4" }} />
            <div style={{ display: "flex", gap: 8 }}>
              <Btn onClick={() => doPoints(true)} color="#4ade80">+ Начислить</Btn>
              <Btn onClick={() => doPoints(false)} color="#f87171" outline>− Снять</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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
      saveSession(user);
    } else {
      const fresh = db.users.find(u => u.username === user.username) || user;
      setCurrentUser(fresh);
      saveSession(fresh);
    }
    setTab("list");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveSession(null);
    setTab("list");
  };

  const openSubmitModal = (demon) => {
    setSelectedDemon(demon);
    setSubmitModal(true);
  };

  useEffect(() => {
    const savedUser = loadSession(db);
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, [db]);

  useEffect(() => {
    if (currentUser) {
      const fresh = db.users.find(u => u.username === currentUser.username);
      if (fresh) setCurrentUser(fresh);
    }
  }, [db]);

  if (!currentUser) return <AuthPage onAuth={handleAuth} db={db} />;

  const isAdmin = currentUser.role === "admin";

  return (
    <div style={{ background: "#0f1117", minHeight: "100vh", color: "#eaeaf4" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; padding: 0; background: #0f1117; }
        #root { margin: 0; padding: 0; width: 100%; min-height: 100vh; }
      `}</style>

      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(15,17,23,0.92)", backdropFilter: "blur(22px)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 58 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18 }}>GD<span style={{ color: "#f87171" }}>·</span>Demons</div>
        <nav style={{ display: "flex", gap: 4 }}>
          <button onClick={() => setTab("list")} style={{ background: tab === "list" ? "rgba(255,255,255,0.08)" : "transparent", border: "none", padding: "6px 12px", borderRadius: 8, color: tab === "list" ? "#eaeaf4" : "#6b6b88", cursor: "pointer" }}>Список</button>
          <button onClick={() => setTab("profile")} style={{ background: tab === "profile" ? "rgba(255,255,255,0.08)" : "transparent", border: "none", padding: "6px 12px", borderRadius: 8, color: tab === "profile" ? "#eaeaf4" : "#6b6b88", cursor: "pointer" }}>Профиль</button>
          <button onClick={() => setTab("leaderboard")} style={{ background: tab === "leaderboard" ? "rgba(255,255,255,0.08)" : "transparent", border: "none", padding: "6px 12px", borderRadius: 8, color: tab === "leaderboard" ? "#eaeaf4" : "#6b6b88", cursor: "pointer" }}>Лидеры</button>
          <button onClick={() => setTab("about")} style={{ background: tab === "about" ? "rgba(255,255,255,0.08)" : "transparent", border: "none", padding: "6px 12px", borderRadius: 8, color: tab === "about" ? "#eaeaf4" : "#6b6b88", cursor: "pointer" }}>О проекте</button>
          <button onClick={() => setTab("settings")} style={{ background: tab === "settings" ? "rgba(255,255,255,0.08)" : "transparent", border: "none", padding: "6px 12px", borderRadius: 8, color: tab === "settings" ? "#eaeaf4" : "#6b6b88", cursor: "pointer" }}>Настройки</button>
          {isAdmin && <button onClick={() => setTab("admin")} style={{ background: tab === "admin" ? "rgba(251,191,36,0.15)" : "transparent", border: "none", padding: "6px 12px", borderRadius: 8, color: tab === "admin" ? "#fbbf24" : "#6b6b88", cursor: "pointer" }}>Админ</button>}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 12, color: "#fbbf24" }}>{currentUser.points} pts</div>
          <UserAvatar user={currentUser} size={32} />
          <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "4px 10px", color: "#6b6b88", cursor: "pointer" }}>Выйти</button>
        </div>
      </div>

      <div style={{ maxWidth: 940, margin: "0 auto", padding: "24px 16px 80px" }}>
        {tab === "list" && <ListPage user={currentUser} approved={db.approved} onSubmit={openSubmitModal} />}
        {tab === "profile" && <ProfilePage user={currentUser} approved={db.approved} />}
        {tab === "leaderboard" && <LeaderboardPage db={db} approved={db.approved} />}
        {tab === "about" && <AboutPage />}
        {tab === "settings" && <SettingsPage user={currentUser} db={db} onUpdate={updateDb} onLogout={handleLogout} />}
        {tab === "admin" && isAdmin && <AdminPanel db={db} onUpdate={updateDb} currentUser={currentUser} />}
      </div>

      <SubmitModal open={submitModal} onClose={() => { setSubmitModal(false); setSelectedDemon(null); }} user={currentUser} demon={selectedDemon} db={db} onUpdate={updateDb} />
    </div>
  );
}