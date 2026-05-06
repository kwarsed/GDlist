import { useState, useEffect, useCallback, useRef } from "react";

/* ══════════════════════════════════════════════
   CONSTANTS & META
══════════════════════════════════════════════ */
const SK        = "gdml_v7";
const SESSION_K = "gdml_session_v7";
const APP_VER   = "v1.3.0";

const UPDATE_HISTORY = [
  { version: "v1.3.0", date: "06.05.2026", changes: [
    "✨ Полностью обновлён дизайн — мягкая палитра, анимации",
    "🔐 Сессия сохраняется после перезагрузки страницы",
    "⌨️ Вход по нажатию Enter",
    "🔑 Добавлена смена пароля в настройках",
    "🎨 Декоративный фон с мягкими узорами",
    "⚡ Улучшены анимации переходов и микро-интеракции",
    "🐛 Исправлены все найденные баги",
  ]},
  { version: "v1.2.0", date: "05.05.2026", changes: [
    "➕ Вкладка 'О проекте', аватарки, показ пароля",
    "➕ Анимация переключения между входом и регистрацией",
    "🔧 Ограничения на длину ника и пароля",
  ]},
  { version: "v1.0.0", date: "04.05.2026", changes: ["➕ Первый релиз"] },
];

const DM = {
  ext:  { label:"Extreme Demon", color:"#f87171", glow:"rgba(248,113,113,0.15)", pts:150 },
  ins:  { label:"Insane Demon",  color:"#a78bfa", glow:"rgba(167,139,250,0.15)", pts:80  },
  hard: { label:"Hard Demon",    color:"#fb923c", glow:"rgba(251,146,60,0.15)",  pts:30  },
  med:  { label:"Medium Demon",  color:"#38bdf8", glow:"rgba(56,189,248,0.15)",  pts:10  },
};

const DEMONS_DATA = {
  ext: [
    { id:"EX01", name:"Acheron",              creator:"Silentium",    color:"#12082a", accent:"#7c3aed" },
    { id:"EX02", name:"Abyss of Darkness",    creator:"Pennutoh",     color:"#080818", accent:"#3b82f6" },
    { id:"EX03", name:"Kyouki",               creator:"xSmokes",      color:"#180a0a", accent:"#ef4444" },
    { id:"EX04", name:"LIMBO",                creator:"Doggie",       color:"#0d0d18", accent:"#6366f1" },
    { id:"EX05", name:"Kenos",                creator:"Dudex",        color:"#081808", accent:"#22c55e" },
    { id:"EX06", name:"The Golden",           creator:"AeonAir",      color:"#181000", accent:"#f59e0b" },
    { id:"EX07", name:"Zodiac",               creator:"Xcy7",         color:"#150818", accent:"#a855f7" },
    { id:"EX08", name:"Tartarus",             creator:"Dolphy",       color:"#080808", accent:"#f43f5e" },
    { id:"EX09", name:"Slaughterhouse",       creator:"Woeful",       color:"#180404", accent:"#dc2626" },
    { id:"EX10", name:"Genocide",             creator:"Knobbelboy",   color:"#040818", accent:"#60a5fa" },
  ],
  ins: [
    { id:"IN01", name:"Cataclysm",            creator:"Ggb0y",        color:"#08081a", accent:"#818cf8" },
    { id:"IN02", name:"Sonic Wave Infinity",  creator:"Riot",         color:"#000e1a", accent:"#0ea5e9" },
    { id:"IN03", name:"Artificial Ascent",    creator:"Stilluzen",    color:"#08180a", accent:"#4ade80" },
    { id:"IN04", name:"Windy Landscape",      creator:"Zobros",       color:"#081210", accent:"#2dd4bf" },
    { id:"IN05", name:"Yatagarasu",           creator:"Woffy",        color:"#180a00", accent:"#fbbf24" },
    { id:"IN06", name:"Phobos",               creator:"Bl4zze",       color:"#120004", accent:"#fb7185" },
    { id:"IN07", name:"Erebus",               creator:"Temp",         color:"#040410", accent:"#8b5cf6" },
    { id:"IN08", name:"Athanatos",            creator:"Bianox",       color:"#000e10", accent:"#22d3ee" },
    { id:"IN09", name:"Supersonic",           creator:"Roadbose",     color:"#100800", accent:"#f97316" },
    { id:"IN10", name:"Poltergeist",          creator:"Bianox",       color:"#080012", accent:"#c084fc" },
  ],
  hard: [
    { id:"HD01", name:"Clubstep",              creator:"RobTop",      color:"#001808", accent:"#34d399" },
    { id:"HD02", name:"Theory of Everything 2",creator:"RobTop",      color:"#080018", accent:"#818cf8" },
    { id:"HD03", name:"Deadlocked",            creator:"RobTop",      color:"#180000", accent:"#f87171" },
    { id:"HD04", name:"Blast Processing",      creator:"TMB50",       color:"#000e1e", accent:"#60a5fa" },
    { id:"HD05", name:"Jawbreaker",            creator:"TMB50",       color:"#180a00", accent:"#fcd34d" },
    { id:"HD06", name:"Speed Racer",           creator:"Ggb0y",       color:"#181000", accent:"#facc15" },
    { id:"HD07", name:"Dark Rainbow",          creator:"Xaro",        color:"#080018", accent:"#f472b6" },
    { id:"HD08", name:"The Realistic",         creator:"Jeyzor",      color:"#001810", accent:"#6ee7b7" },
    { id:"HD09", name:"Nine Circles",          creator:"Zobros",      color:"#000e18", accent:"#38bdf8" },
    { id:"HD10", name:"Impulse",               creator:"npesta",      color:"#0e001e", accent:"#c084fc" },
  ],
  med: [
    { id:"MD01", name:"Hexagon Force",         creator:"RobTop",      color:"#001410", accent:"#6ee7b7" },
    { id:"MD02", name:"Geometrical Dominator", creator:"RobTop",      color:"#180a00", accent:"#fdba74" },
    { id:"MD03", name:"Ultra Violence",        creator:"Viprin",      color:"#080818", accent:"#a5b4fc" },
    { id:"MD04", name:"Crimson Planet",        creator:"RealTriangle",color:"#180004", accent:"#fb7185" },
    { id:"MD05", name:"Nine Circles",          creator:"Zobros",      color:"#000e18", accent:"#7dd3fc" },
  ],
};

const ALL_DEMONS = Object.entries(DEMONS_DATA).flatMap(([diff, arr]) =>
  arr.map(d => ({ ...d, diff, diffPts: DM[diff].pts }))
);

/* ══════════════════════════════════════════════
   STORAGE
══════════════════════════════════════════════ */
const defaultDb = () => ({
  users: [{ username:"kwarsed", password:"5179678nAta", role:"admin", points:0, displayName:"kwarsed", avatar:null }],
  pending: [],
  approved: [],
});

const loadDb = () => {
  try { const r = localStorage.getItem(SK); return r ? JSON.parse(r) : defaultDb(); }
  catch { return defaultDb(); }
};
const saveDb = (s) => { try { localStorage.setItem(SK, JSON.stringify(s)); } catch {} };
const saveSession = (u) => { try { if (u) localStorage.setItem(SESSION_K, u.username); else localStorage.removeItem(SESSION_K); } catch {} };
const loadSession = (db) => { try { const un = localStorage.getItem(SESSION_K); return un ? db.users.find(u => u.username === un) || null : null; } catch { return null; } };

/* ══════════════════════════════════════════════
   BACKGROUND PATTERN SVG
══════════════════════════════════════════════ */
const BgPattern = () => (
  <svg style={{ position:"fixed", inset:0, width:"100%", height:"100%", zIndex:0, pointerEvents:"none", opacity:1 }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Soft radial glow blobs */}
      <radialGradient id="blob1" cx="20%" cy="15%" r="40%">
        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.07"/>
        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="blob2" cx="80%" cy="70%" r="40%">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.06"/>
        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="blob3" cx="50%" cy="45%" r="35%">
        <stop offset="0%" stopColor="#f87171" stopOpacity="0.04"/>
        <stop offset="100%" stopColor="#f87171" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="blob4" cx="10%" cy="80%" r="30%">
        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.05"/>
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0"/>
      </radialGradient>
      {/* Fine dot grid */}
      <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.8" fill="#ffffff" opacity="0.025"/>
      </pattern>
      {/* Diagonal lines */}
      <pattern id="diag" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <line x1="0" y1="40" x2="40" y2="0" stroke="#ffffff" strokeWidth="0.4" opacity="0.018"/>
      </pattern>
    </defs>
    {/* Blobs */}
    <rect width="100%" height="100%" fill="url(#blob1)"/>
    <rect width="100%" height="100%" fill="url(#blob2)"/>
    <rect width="100%" height="100%" fill="url(#blob3)"/>
    <rect width="100%" height="100%" fill="url(#blob4)"/>
    {/* Texture layers */}
    <rect width="100%" height="100%" fill="url(#dots)"/>
    <rect width="100%" height="100%" fill="url(#diag)"/>
    {/* Subtle corner accents */}
    <circle cx="0" cy="0" r="300" fill="none" stroke="#7c3aed" strokeWidth="0.5" opacity="0.06"/>
    <circle cx="0" cy="0" r="500" fill="none" stroke="#7c3aed" strokeWidth="0.3" opacity="0.04"/>
    <circle cx="100%" cy="100%" r="400" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.05"/>
    <circle cx="100%" cy="0" r="250" fill="none" stroke="#f87171" strokeWidth="0.4" opacity="0.04"/>
    {/* Geometric line accents */}
    <line x1="0" y1="40%" x2="15%" y2="40%" stroke="#7c3aed" strokeWidth="0.5" opacity="0.08"/>
    <line x1="85%" y1="60%" x2="100%" y2="60%" stroke="#3b82f6" strokeWidth="0.5" opacity="0.08"/>
  </svg>
);

/* ══════════════════════════════════════════════
   SHARED UI
══════════════════════════════════════════════ */
const Bar = ({ value, color, h = 4 }) => (
  <div style={{ flex:1, height:h, borderRadius:h, background:"rgba(255,255,255,0.07)", overflow:"hidden", minWidth:0 }}>
    <div style={{ width:`${Math.max(0,Math.min(100,value))}%`, height:"100%", background:color, borderRadius:h, transition:"width 0.5s cubic-bezier(.4,0,.2,1)" }}/>
  </div>
);

const DiffBadge = ({ diff }) => {
  const m = DM[diff];
  return <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:600, letterSpacing:1, padding:"3px 8px", borderRadius:6, whiteSpace:"nowrap", background:m.glow, color:m.color, border:`1px solid ${m.color}33` }}>{m.label}</span>;
};

// Soft button — no harsh red defaults
const Btn = ({ children, onClick, color="#a78bfa", outline, style={}, small, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      fontFamily:"'Outfit',sans-serif", fontWeight:600,
      fontSize: small ? 11 : 13,
      padding: small ? "5px 11px" : "9px 18px",
      border: outline ? `1px solid ${color}55` : "none",
      borderRadius: 9,
      background: outline ? `${color}14` : color,
      color: outline ? color : "#0d0d14",
      cursor: disabled ? "default" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "opacity 0.18s, transform 0.12s",
      ...style,
    }}
    onMouseEnter={e => !disabled && (e.currentTarget.style.opacity="0.8")}
    onMouseLeave={e => !disabled && (e.currentTarget.style.opacity="1")}
    onMouseDown={e => !disabled && (e.currentTarget.style.transform="scale(0.97)")}
    onMouseUp={e => !disabled && (e.currentTarget.style.transform="scale(1)")}
  >{children}</button>
);

const FieldLabel = ({ children }) => (
  <div style={{ fontSize:11, fontWeight:600, letterSpacing:1.2, color:"#6b6b8a", textTransform:"uppercase", marginBottom:7 }}>{children}</div>
);

const TextInput = ({ label, type="text", value, onChange, placeholder, onKeyDown, autoFocus }) => {
  const [show, setShow] = useState(false);
  const isPwd = type === "password";
  return (
    <div style={{ marginBottom:16 }}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div style={{ position:"relative" }}>
        <input
          autoFocus={autoFocus}
          type={isPwd && !show ? "password" : "text"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
          style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#e8e8f8", fontFamily:"'Outfit',sans-serif", fontSize:14, padding:`10px ${isPwd?40:14}px 10px 14px`, outline:"none", transition:"border-color 0.2s" }}
          onFocus={e => e.target.style.borderColor="rgba(167,139,250,0.5)"}
          onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.1)"}
        />
        {isPwd && (
          <button type="button" onClick={() => setShow(s=>!s)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"transparent", border:"none", color:"#6b6b8a", cursor:"pointer", fontSize:15, lineHeight:1, padding:0 }}>
            {show ? "🙈" : "👁️"}
          </button>
        )}
      </div>
    </div>
  );
};

const SelectInput = ({ label, value, onChange, children }) => (
  <div style={{ marginBottom:12 }}>
    {label && <FieldLabel>{label}</FieldLabel>}
    <select value={value} onChange={e => onChange(e.target.value)} style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#e8e8f8", fontFamily:"'Outfit',sans-serif", fontSize:14, padding:"10px 14px", outline:"none" }}>
      {children}
    </select>
  </div>
);

const FlashMsg = ({ msg, type="success" }) => {
  if (!msg) return null;
  const isErr = type === "error";
  return (
    <div style={{ fontSize:13, color: isErr ? "#f87171" : "#4ade80", background: isErr ? "rgba(248,113,113,0.08)" : "rgba(74,222,128,0.08)", border: `1px solid ${isErr?"rgba(248,113,113,0.22)":"rgba(74,222,128,0.22)"}`, borderRadius:10, padding:"9px 14px", marginBottom:14, animation:"fadeSlide 0.25s ease" }}>
      {msg}
    </div>
  );
};

const UserAvatar = ({ user, size=40 }) => {
  const [err, setErr] = useState(false);
  if (user?.avatar && !err) return (
    <img src={user.avatar} alt="" onError={()=>setErr(true)} style={{ width:size, height:size, borderRadius:"50%", objectFit:"cover", flexShrink:0 }}/>
  );
  const colors = ["#a78bfa","#f87171","#38bdf8","#fb923c","#4ade80","#f472b6"];
  const c = colors[(user?.username?.charCodeAt(0)||0) % colors.length];
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:`linear-gradient(135deg,${c},${c}88)`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:size*0.38, color:"#0d0d14", flexShrink:0, userSelect:"none" }}>
      {user?.username?.[0]?.toUpperCase()||"?"}
    </div>
  );
};

/* ══════════════════════════════════════════════
   LEVEL ART
══════════════════════════════════════════════ */
const LevelArt = ({ demon, diff, w=118 }) => {
  const m = DM[diff];
  const acc = demon.accent || m.color;
  const words = demon.name.split(" ");
  const init = words.length>=2 ? words[0][0]+words[1][0] : demon.name.slice(0,2);
  return (
    <div style={{ width:w, flexShrink:0, position:"relative", overflow:"hidden", background:demon.color||"#0a0a15", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.35 }} viewBox={`0 0 ${w} 80`} preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`rg${demon.id}`} cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor={acc} stopOpacity="1"/>
            <stop offset="100%" stopColor={acc} stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width={w} height="80" fill={`url(#rg${demon.id})`}/>
        {[0.22,0.44,0.66,0.88].map((f,i)=>(
          <line key={i} x1={w*f} y1="0" x2={w*f} y2="80" stroke={acc} strokeOpacity="0.1" strokeWidth="0.5"/>
        ))}
        {[20,40,60].map(y=>(
          <line key={y} x1="0" y1={y} x2={w} y2={y} stroke={acc} strokeOpacity="0.1" strokeWidth="0.5"/>
        ))}
        <circle cx="0" cy="0" r="40" fill={acc} fillOpacity="0.12"/>
        <circle cx={w} cy="80" r="30" fill={acc} fillOpacity="0.08"/>
      </svg>
      <div style={{ position:"relative", zIndex:1, fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:27, color:acc, textShadow:`0 0 20px ${acc}99`, userSelect:"none" }}>{init.toUpperCase()}</div>
      <div style={{ position:"absolute", top:0, right:0, bottom:0, width:44, background:"linear-gradient(to right,transparent,#181b27)", pointerEvents:"none" }}/>
    </div>
  );
};

/* ══════════════════════════════════════════════
   AUTH PAGE
══════════════════════════════════════════════ */
const AuthPage = ({ onAuth, db }) => {
  const [mode, setMode] = useState("login");
  const [un, setUn]     = useState("");
  const [pw, setPw]     = useState("");
  const [err, setErr]   = useState("");
  const [slide, setSlide] = useState(false);

  const switchMode = (m) => {
    setSlide(true);
    setTimeout(()=>{ setMode(m); setErr(""); setUn(""); setPw(""); setSlide(false); }, 180);
  };

  const submit = useCallback(() => {
    setErr("");
    const u = un.trim(), p = pw;
    if (!u || !p) { setErr("Заполните все поля"); return; }
    if (mode === "login") {
      const found = db.users.find(x => x.username === u && x.password === p);
      if (!found) { setErr("Неверный логин или пароль"); return; }
      onAuth(found);
    } else {
      if (u.length < 3 || u.length > 20 || !/^[a-zA-Z0-9_]+$/.test(u)) { setErr("Ник: 3-20 символов (буквы, цифры, _)"); return; }
      if (p.length < 6 || p.length > 30) { setErr("Пароль: 6-30 символов"); return; }
      if (db.users.find(x => x.username === u)) { setErr("Этот ник уже занят"); return; }
      onAuth({ username:u, password:p, role:"user", points:0, displayName:u, avatar:null }, true);
    }
  }, [un, pw, mode, db]);

  const onKey = useCallback((e) => { if (e.key === "Enter") submit(); }, [submit]);

  return (
    <div style={{ minHeight:"100vh", background:"#0d0d14", display:"flex", alignItems:"center", justifyContent:"center", padding:16, position:"relative" }}>
      <BgPattern/>
      <div style={{
        position:"relative", zIndex:1, background:"rgba(20,20,34,0.85)", backdropFilter:"blur(24px)",
        border:"1px solid rgba(255,255,255,0.08)", borderRadius:22, padding:"38px 34px 32px",
        width:"100%", maxWidth:400,
        animation:"authIn 0.4s cubic-bezier(.4,0,.2,1)",
      }}>
        {/* Logo */}
        <div style={{ marginBottom:28, textAlign:"center" }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:28, letterSpacing:-1, color:"#e8e8f8", marginBottom:4 }}>
            GD<span style={{ color:"#a78bfa" }}>·</span>Demons
          </div>
          <div style={{ fontSize:12, color:"#6b6b8a", letterSpacing:2, textTransform:"uppercase" }}>
            {mode==="login" ? "Войти в аккаунт" : "Создать аккаунт"}
          </div>
        </div>

        {/* Form */}
        <div style={{ opacity: slide?0:1, transform: slide?"translateX(10px)":"none", transition:"opacity 0.18s, transform 0.18s" }}>
          <TextInput label="Nickname" value={un} onChange={setUn} placeholder="username" onKeyDown={onKey} autoFocus />
          <TextInput label="Пароль" type="password" value={pw} onChange={setPw} placeholder="••••••••" onKeyDown={onKey} />
          <FlashMsg msg={err} type="error"/>
          <Btn onClick={submit} color="#a78bfa" style={{ width:"100%", padding:12, fontSize:14, marginTop:4 }}>
            {mode==="login" ? "Войти →" : "Зарегистрироваться →"}
          </Btn>
          <div style={{ textAlign:"center", marginTop:18, fontSize:13, color:"#6b6b8a" }}>
            {mode==="login" ? "Нет аккаунта? " : "Уже есть аккаунт? "}
            <span onClick={()=>switchMode(mode==="login"?"reg":"login")} style={{ color:"#a78bfa", cursor:"pointer", fontWeight:600 }}>
              {mode==="login" ? "Регистрация" : "Войти"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   SUBMIT MODAL
══════════════════════════════════════════════ */
const SubmitModal = ({ open, onClose, user, demon, db, onUpdate }) => {
  const [tgUser,   setTgUser]   = useState("");
  const [pct,      setPct]      = useState("50");
  const [err,      setErr]      = useState("");
  const [success,  setSuccess]  = useState(false);

  const handleClose = () => { setTgUser(""); setPct("50"); setErr(""); setSuccess(false); onClose(); };

  const submit = () => {
    setErr("");
    if (!tgUser.trim()) { setErr("Укажите ваш Telegram username"); return; }
    if (!demon) { setErr("Демон не выбран"); return; }
    const p = Math.min(100, Math.max(1, parseInt(pct)||0));
    const newDb = { ...db, pending: [...db.pending, { id:Date.now(), username:user.username, demonId:demon.id, percent:p, note:`TG: @${tgUser.trim()} | ${p}%`, submittedAt:new Date().toISOString() }] };
    onUpdate(newDb);
    setSuccess(true);
    setTimeout(handleClose, 1800);
  };

  if (!open) return null;

  const rules = [
    { icon:"🎬", t:"Только видео — скриншоты не принимаются." },
    { icon:"📱", t:"Желательно хендкам — ускорит проверку." },
    { icon:"✂️", t:"Полная запись попытки без обрезок." },
    { icon:"👁️", t:"HUD с процентом должен быть виден." },
    { icon:"🚫", t:"Speedhack, читы — бан без предупреждения." },
    { icon:"📋", t:"Укажите название уровня, ник GD и платформу." },
  ];

  return (
    <div onClick={handleClose} style={{ position:"fixed", inset:0, zIndex:500, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(14px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16, animation:"fadeIn 0.2s" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#14141f", border:"1px solid rgba(255,255,255,0.1)", borderRadius:22, padding:"28px 26px 24px", maxWidth:500, width:"100%", position:"relative", maxHeight:"92vh", overflowY:"auto", animation:"slideUp 0.25s cubic-bezier(.4,0,.2,1)" }}>
        <button onClick={handleClose} style={{ position:"absolute", top:14, right:14, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"50%", width:30, height:30, cursor:"pointer", color:"#6b6b8a", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>

        {success ? (
          <div style={{ textAlign:"center", padding:"30px 0" }}>
            <div style={{ fontSize:48, marginBottom:14 }}>✅</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, color:"#4ade80", marginBottom:8 }}>Заявка отправлена!</div>
            <div style={{ fontSize:13, color:"#6b6b8a" }}>Администратор проверит её в ближайшее время</div>
          </div>
        ) : (
          <>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:"#e8e8f8", marginBottom:4 }}>Подача прогресса</div>
            <div style={{ fontSize:13, color:"#6b6b8a", marginBottom:20 }}>
              {demon ? <span style={{ color:DM[getDemonDiff(demon.id)||"ext"]?.color }}>《 {demon.name} 》</span> : "Выберите уровень"}
            </div>

            {/* Video-only banner */}
            <div style={{ background:"rgba(248,113,113,0.07)", border:"1px solid rgba(248,113,113,0.2)", borderRadius:12, padding:"11px 14px", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:20 }}>🎬</span>
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, color:"#f87171", marginBottom:2 }}>Только видео!</div>
                <div style={{ fontSize:12, color:"#b8b8d0", lineHeight:1.5 }}>Скриншоты не принимаются. Сначала отправьте видео в Telegram-группу.</div>
              </div>
            </div>

            {/* Rules */}
            <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:18 }}>
              {rules.map((r,i) => (
                <div key={i} style={{ display:"flex", gap:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"8px 12px", fontSize:12, color:"#b0b0c8", lineHeight:1.5, alignItems:"flex-start" }}>
                  <span style={{ flexShrink:0, fontSize:13, marginTop:1 }}>{r.icon}</span><span>{r.t}</span>
                </div>
              ))}
            </div>

            {/* TG link */}
            <a href="https://t.me/+rxTdIyv5aeUzOTUy" target="_blank" rel="noopener" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"11px 18px", borderRadius:12, background:"linear-gradient(135deg,#229ED9,#1a7eb5)", color:"#fff", fontWeight:700, fontSize:14, textDecoration:"none", marginBottom:18 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              Перейти в Telegram-группу
            </a>

            <TextInput label="Ваш Telegram username" value={tgUser} onChange={setTgUser} placeholder="@username (без @)"/>
            <div style={{ marginBottom:16 }}>
              <FieldLabel>Прогресс: <span style={{ color:"#a78bfa" }}>{pct}%</span></FieldLabel>
              <input type="range" min="1" max="100" value={pct} onChange={e=>setPct(e.target.value)} style={{ width:"100%", accentColor:"#a78bfa" }}/>
            </div>
            <FlashMsg msg={err} type="error"/>
            <Btn onClick={submit} color="#a78bfa" style={{ width:"100%", padding:11 }}>✈️ Отправить заявку</Btn>
          </>
        )}
      </div>
    </div>
  );
};

const getDemonDiff = (id) => ALL_DEMONS.find(d=>d.id===id)?.diff;

/* ══════════════════════════════════════════════
   DEMON CARD
══════════════════════════════════════════════ */
const DemonCard = ({ demon, diff, rank, user, approved, onSubmit, animDelay=0 }) => {
  const [open, setOpen] = useState(false);
  const meta = DM[diff];
  const rankColor = rank===0?"#fbbf24":rank===1?"#94a3b8":rank===2?"#c47a3a":"#3a3a5a";
  const myApp = approved.filter(a=>a.username===user.username&&a.demonId===demon.id);
  const beaten = myApp.some(a=>a.percent>=100);
  const bestPct = myApp.length ? Math.max(...myApp.map(a=>a.percent)) : 0;

  return (
    <div style={{ background:"rgba(22,22,36,0.9)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, overflow:"hidden", transition:"border-color 0.22s, transform 0.18s, box-shadow 0.22s", animation:`slideUp 0.38s ${animDelay}ms cubic-bezier(.4,0,.2,1) both` }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.13)"; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 32px rgba(0,0,0,0.45)"; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}
    >
      {/* Main row */}
      <div onClick={()=>setOpen(o=>!o)} style={{ display:"flex", alignItems:"stretch", minHeight:80, cursor:"pointer", userSelect:"none" }}>
        <div style={{ width:46, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:rankColor, borderRight:"1px solid rgba(255,255,255,0.06)" }}>{rank+1}</div>
        <LevelArt demon={demon} diff={diff}/>
        <div style={{ flex:1, minWidth:0, padding:"10px 12px", display:"flex", flexDirection:"column", justifyContent:"center", gap:3 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:"#e8e8f8", wordBreak:"break-word", lineHeight:1.2 }}>{demon.name}</div>
          <div style={{ fontSize:12, color:"#6b6b8a", display:"flex", alignItems:"center", gap:4 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{opacity:0.5,flexShrink:0}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {demon.creator}<span style={{opacity:0.4,fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>· {meta.pts}pts</span>
          </div>
          {bestPct>0 && (
            <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:3 }}>
              <Bar value={bestPct} color={meta.color}/>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#6b6b8a", whiteSpace:"nowrap" }}>{bestPct}%</span>
            </div>
          )}
        </div>
        <div style={{ width:124, flexShrink:0, display:"flex", flexDirection:"column", alignItems:"flex-end", justifyContent:"center", padding:"10px 12px", gap:6 }}>
          <DiffBadge diff={diff}/>
          {beaten && <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, padding:"3px 7px", borderRadius:6, background:"rgba(74,222,128,0.1)", color:"#4ade80", border:"1px solid rgba(74,222,128,0.25)" }}>✓ Beaten</span>}
          <span style={{ color:"#3a3a58", fontSize:10, transition:"transform 0.25s", transform:open?"rotate(180deg)":"none", display:"block" }}>▾</span>
        </div>
      </div>

      {/* Panel */}
      {open && (
        <div onClick={e=>e.stopPropagation()} style={{ borderTop:"1px solid rgba(255,255,255,0.06)", background:"rgba(10,10,18,0.7)", padding:"14px 16px", animation:"fadeIn 0.2s" }}>
          <div style={{ fontSize:13, color:"#6b6b8a", lineHeight:1.6, marginBottom:12 }}>
            Прогресс подтверждается через видео в Telegram-группе.<br/>
            После проверки администратором — баллы начислятся автоматически.
          </div>
          <Btn onClick={()=>onSubmit(demon)} color="#229ED9" style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            Подать прогресс
          </Btn>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════
   LIST PAGE
══════════════════════════════════════════════ */
const ListPage = ({ user, approved, onSubmit }) => {
  let delay = 0;
  const keys = ["ext","ins","hard","med"];
  return (
    <div>
      {keys.map((k,ki,arr) => {
        const meta = DM[k];
        const demons = DEMONS_DATA[k];
        return (
          <div key={k}>
            <div style={{ marginBottom:32 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <div style={{ width:3, height:22, borderRadius:2, background:meta.color, boxShadow:`0 0 12px ${meta.glow}`, flexShrink:0 }}/>
                <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, color:meta.color }}>{meta.label}</span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#3a3a5a", background:"rgba(255,255,255,0.04)", padding:"2px 8px", borderRadius:20 }}>{demons.length}</span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {demons.map((d,i) => { const card = <DemonCard key={d.id} demon={d} diff={k} rank={i} user={user} approved={approved} onSubmit={onSubmit} animDelay={delay*30}/>; delay++; return card; })}
              </div>
            </div>
            {ki < arr.length-1 && <hr style={{ border:"none", borderTop:"1px solid rgba(255,255,255,0.05)", margin:"4px 0 32px" }}/>}
          </div>
        );
      })}
    </div>
  );
};

/* ══════════════════════════════════════════════
   PROFILE PAGE
══════════════════════════════════════════════ */
const ProfilePage = ({ user, approved }) => {
  const myRecs  = approved.filter(a=>a.username===user.username);
  const beaten  = myRecs.filter(a=>a.percent>=100);
  const progRecs = myRecs.filter(a=>a.percent<100);

  const StatBox = ({val,label,color}) => (
    <div style={{ background:"rgba(22,22,36,0.9)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"18px 14px", textAlign:"center", animation:"slideUp 0.35s ease both" }}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:32, lineHeight:1, letterSpacing:-1, color }}>{val}</div>
      <div style={{ fontSize:10, fontWeight:600, letterSpacing:1.5, color:"#6b6b8a", textTransform:"uppercase", marginTop:5 }}>{label}</div>
    </div>
  );

  const RecRow = ({ rec }) => {
    const d = ALL_DEMONS.find(x=>x.id===rec.demonId); if(!d) return null;
    const m = DM[d.diff];
    return (
      <div style={{ background:"rgba(22,22,36,0.9)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, overflow:"hidden", display:"flex", alignItems:"stretch", minHeight:66 }}>
        <LevelArt demon={d} diff={d.diff} w={88}/>
        <div style={{ flex:1, minWidth:0, padding:"8px 12px", display:"flex", flexDirection:"column", justifyContent:"center", gap:3 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:"#e8e8f8", wordBreak:"break-word" }}>{d.name}</div>
          <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:2 }}>
            <Bar value={rec.percent} color={m.color}/>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#6b6b8a" }}>{rec.percent}%</span>
          </div>
          <div style={{ fontSize:10, color:"#3a3a5a" }}>подтверждено {new Date(rec.approvedAt).toLocaleDateString("ru")}</div>
        </div>
        <div style={{ flexShrink:0, padding:"8px 10px", display:"flex", flexDirection:"column", alignItems:"flex-end", justifyContent:"center", gap:5 }}>
          <DiffBadge diff={d.diff}/>
          {rec.percent>=100 && <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"#4ade80", background:"rgba(74,222,128,0.1)", border:"1px solid rgba(74,222,128,0.22)", borderRadius:5, padding:"2px 6px" }}>✓ Beaten</span>}
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"#a78bfa" }}>+{rec.ptsAwarded}pts</span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ background:"rgba(22,22,36,0.9)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"20px 18px", marginBottom:16, display:"flex", alignItems:"center", gap:16, animation:"slideUp 0.35s ease" }}>
        <UserAvatar user={user} size={54}/>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, color:"#e8e8f8" }}>{user.displayName||user.username}</div>
          <div style={{ fontSize:12, color:"#6b6b8a", marginTop:2 }}>{user.role==="admin"?"👑 Администратор":"Игрок"}</div>
        </div>
        <div style={{ marginLeft:"auto", textAlign:"right" }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:28, color:"#fbbf24", letterSpacing:-1 }}>{user.points}</div>
          <div style={{ fontSize:10, color:"#6b6b8a", letterSpacing:1, textTransform:"uppercase" }}>баллов</div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:10, marginBottom:20 }}>
        <StatBox val={user.points} label="Баллы" color="#fbbf24"/>
        <StatBox val={beaten.length} label="Пройдено" color="#4ade80"/>
        <StatBox val={progRecs.length} label="Прогресс" color="#fb923c"/>
      </div>
      {beaten.length>0&&<><div style={{ fontSize:10,fontWeight:700,letterSpacing:2,color:"#6b6b8a",textTransform:"uppercase",marginBottom:9 }}>✓ Пройдено</div><div style={{ display:"flex",flexDirection:"column",gap:7,marginBottom:20 }}>{beaten.map((r,i)=><RecRow key={i} rec={r}/>)}</div></>}
      {progRecs.length>0&&<><div style={{ fontSize:10,fontWeight:700,letterSpacing:2,color:"#6b6b8a",textTransform:"uppercase",marginBottom:9 }}>⏳ Прогрессы</div><div style={{ display:"flex",flexDirection:"column",gap:7 }}>{progRecs.map((r,i)=><RecRow key={i} rec={r}/>)}</div></>}
      {myRecs.length===0&&(
        <div style={{ background:"rgba(22,22,36,0.9)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"44px 20px", textAlign:"center", color:"#6b6b8a" }}>
          <div style={{ fontSize:32,marginBottom:10 }}>🎮</div>
          <p style={{ fontSize:13,lineHeight:1.7 }}>Подтверждённых прогрессов пока нет.<br/>Отправьте видео в Telegram-группу!</p>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════
   SETTINGS PAGE
══════════════════════════════════════════════ */
const SettingsPage = ({ user, db, onUpdate, onLogout }) => {
  const [newNick,    setNewNick]    = useState(user.displayName||user.username);
  const [oldPw,      setOldPw]      = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confPw,     setConfPw]     = useState("");
  const [avatarPrev, setAvatarPrev] = useState(user.avatar);
  const [err,  setErr]  = useState("");
  const [succ, setSucc] = useState("");

  const flash = (msg, isErr=false) => {
    if (isErr) { setErr(msg); setSucc(""); } else { setSucc(msg); setErr(""); }
    setTimeout(()=>{ setErr(""); setSucc(""); }, 3000);
  };

  const changeNick = () => {
    const n = newNick.trim();
    if (!n||n.length<3||n.length>20) { flash("Ник: 3-20 символов",true); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(n)) { flash("Ник: только буквы, цифры, _",true); return; }
    if (db.users.find(u=>u.username===n&&u.username!==user.username)) { flash("Этот ник занят",true); return; }
    const newDb = { ...db,
      users: db.users.map(u=>u.username===user.username?{...u,username:n,displayName:n}:u),
      approved: db.approved.map(a=>a.username===user.username?{...a,username:n}:a),
      pending:  db.pending.map(p=>p.username===user.username?{...p,username:n}:p),
    };
    onUpdate(newDb);
    saveSession({username:n});
    flash("Ник изменён! Выполняется выход…");
    setTimeout(onLogout, 1800);
  };

  const changePw = () => {
    if (!oldPw||!newPw||!confPw) { flash("Заполните все поля",true); return; }
    const me = db.users.find(u=>u.username===user.username);
    if (!me||me.password!==oldPw) { flash("Неверный текущий пароль",true); return; }
    if (newPw.length<6||newPw.length>30) { flash("Новый пароль: 6-30 символов",true); return; }
    if (newPw!==confPw) { flash("Пароли не совпадают",true); return; }
    onUpdate({ ...db, users: db.users.map(u=>u.username===user.username?{...u,password:newPw}:u) });
    setOldPw(""); setNewPw(""); setConfPw("");
    flash("Пароль успешно изменён!");
  };

  const changeAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { flash("Только изображения",true); return; }
    if (file.size>2*1024*1024) { flash("Максимум 2MB",true); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      onUpdate({ ...db, users: db.users.map(u=>u.username===user.username?{...u,avatar:reader.result}:u) });
      setAvatarPrev(reader.result);
      flash("Аватар обновлён!");
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    onUpdate({ ...db, users: db.users.map(u=>u.username===user.username?{...u,avatar:null}:u) });
    setAvatarPrev(null);
    flash("Аватар удалён!");
  };

  const Card = ({children,title}) => (
    <div style={{ background:"rgba(22,22,36,0.9)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"20px 18px", marginBottom:12, animation:"slideUp 0.35s ease both" }}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:"#a78bfa", marginBottom:16, letterSpacing:0.3 }}>{title}</div>
      {children}
    </div>
  );

  return (
    <div>
      <FlashMsg msg={err} type="error"/>
      <FlashMsg msg={succ} type="success"/>

      <Card title="⚙️ Аватар">
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <UserAvatar user={{...user,avatar:avatarPrev}} size={60}/>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <label style={{ cursor:"pointer" }}>
              <Btn onClick={()=>{}} color="#a78bfa" style={{ pointerEvents:"none" }} small>Загрузить фото</Btn>
              <input type="file" accept="image/*" onChange={changeAvatar} style={{ display:"none" }}/>
            </label>
            {avatarPrev && <Btn onClick={removeAvatar} color="#f87171" outline small>Удалить</Btn>}
          </div>
        </div>
      </Card>

      <Card title="✏️ Изменить никнейм">
        <TextInput value={newNick} onChange={setNewNick} placeholder="Новый ник"/>
        <div style={{ fontSize:11, color:"#6b6b8a", marginBottom:12 }}>3-20 символов, буквы/цифры/_. После смены ника нужно войти заново.</div>
        <Btn onClick={changeNick} color="#a78bfa">Сохранить ник</Btn>
      </Card>

      <Card title="🔑 Изменить пароль">
        <TextInput label="Текущий пароль" type="password" value={oldPw} onChange={setOldPw} placeholder="••••••••"/>
        <TextInput label="Новый пароль" type="password" value={newPw} onChange={setNewPw} placeholder="минимум 6 символов"/>
        <TextInput label="Повторите новый пароль" type="password" value={confPw} onChange={setConfPw} placeholder="••••••••"/>
        <Btn onClick={changePw} color="#a78bfa">Изменить пароль</Btn>
      </Card>
    </div>
  );
};

/* ══════════════════════════════════════════════
   LEADERBOARD
══════════════════════════════════════════════ */
const LeaderboardPage = ({ db, approved }) => {
  const ranked = [...db.users]
    .map(u=>({...u, recs: approved.filter(a=>a.username===u.username)}))
    .sort((a,b)=>b.points-a.points);
  return (
    <div>
      <div style={{ fontSize:10,fontWeight:700,letterSpacing:2,color:"#6b6b8a",textTransform:"uppercase",marginBottom:14 }}>Таблица лидеров</div>
      <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
        {ranked.map((u,i)=>{
          const beaten = u.recs.filter(a=>a.percent>=100).length;
          const rc = i===0?"#fbbf24":i===1?"#94a3b8":i===2?"#c47a3a":"#3a3a5a";
          return (
            <div key={u.username} style={{ background:"rgba(22,22,36,0.9)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"12px 16px", display:"flex", alignItems:"center", gap:14, animation:`slideUp 0.35s ${i*40}ms ease both` }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:16, color:rc, width:30, textAlign:"center", flexShrink:0 }}>#{i+1}</div>
              <UserAvatar user={u} size={38}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:"#e8e8f8" }}>{u.displayName||u.username}{u.role==="admin"&&<span style={{fontSize:11,color:"#fbbf24",marginLeft:5}}>👑</span>}</div>
                <div style={{ fontSize:11, color:"#6b6b8a" }}>{beaten} пройдено · {u.recs.length} подтверждений</div>
              </div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:"#fbbf24", letterSpacing:-1 }}>{u.points}</div>
              <div style={{ fontSize:10, color:"#6b6b8a", letterSpacing:1 }}>pts</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   ABOUT PAGE
══════════════════════════════════════════════ */
const AboutPage = () => (
  <div>
    <div style={{ background:"rgba(22,22,36,0.9)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"22px 18px", marginBottom:12, animation:"slideUp 0.35s ease" }}>
      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:14 }}>
        <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:"#e8e8f8" }}>GD<span style={{color:"#a78bfa"}}>·</span>Demons</div>
        <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#a78bfa",background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.25)",borderRadius:6,padding:"2px 8px" }}>{APP_VER}</span>
      </div>
      <p style={{ fontSize:13,color:"#8888a8",lineHeight:1.75,marginBottom:14 }}>Трекер прогресса для прохождения демонов в Geometry Dash. Подтверждение прогресса происходит через Telegram-группу.</p>
      <a href="https://t.me/+rxTdIyv5aeUzOTUy" target="_blank" rel="noopener" style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"9px 18px",borderRadius:30,background:"rgba(34,158,217,0.15)",border:"1px solid rgba(34,158,217,0.3)",color:"#229ED9",fontSize:13,fontWeight:600,textDecoration:"none" }}>
        📱 Telegram-группа
      </a>
    </div>
    <div style={{ background:"rgba(22,22,36,0.9)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"22px 18px", animation:"slideUp 0.4s 60ms ease both" }}>
      <div style={{ fontSize:10,fontWeight:700,letterSpacing:2,color:"#6b6b8a",textTransform:"uppercase",marginBottom:16 }}>📋 История обновлений</div>
      {UPDATE_HISTORY.map((upd,i)=>(
        <div key={i} style={{ marginBottom:i<UPDATE_HISTORY.length-1?20:0 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:"#a78bfa",background:"rgba(167,139,250,0.1)",padding:"2px 8px",borderRadius:6 }}>{upd.version}</span>
            <span style={{ fontSize:11,color:"#3a3a5a" }}>{upd.date}</span>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:4 }}>
            {upd.changes.map((c,j)=><div key={j} style={{ fontSize:12,color:"#8888a8",paddingLeft:4 }}>{c}</div>)}
          </div>
          {i<UPDATE_HISTORY.length-1&&<hr style={{ border:"none",borderTop:"1px solid rgba(255,255,255,0.05)",margin:"18px 0 0" }}/>}
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   ADMIN PANEL
══════════════════════════════════════════════ */
const AdminPanel = ({ db, onUpdate, currentUser }) => {
  const [activeTab, setActiveTab] = useState("pending");
  const [ptUser,setPtUser]=useState(""); const [ptAmt,setPtAmt]=useState(""); const [ptNote,setPtNote]=useState("");
  const [selUser,setSelUser]=useState(""); const [selDemon,setSelDemon]=useState(""); const [selPct,setSelPct]=useState("100");
  const [flash, setFlash] = useState({msg:"",ok:true});
  const showFlash = (msg,ok=true) => { setFlash({msg,ok}); setTimeout(()=>setFlash({msg:"",ok:true}),3000); };

  const doApprove = (p) => {
    const demon = ALL_DEMONS.find(d=>d.id===p.demonId); if(!demon) return;
    const pts = p.percent>=100 ? demon.diffPts : Math.floor(demon.diffPts*p.percent/100*0.3);
    const rec = { id:Date.now(), username:p.username, demonId:p.demonId, percent:p.percent, approvedAt:new Date().toISOString(), approvedBy:currentUser.username, ptsAwarded:pts };
    onUpdate({ ...db, pending:db.pending.filter(x=>x.id!==p.id), approved:[...db.approved,rec], users:db.users.map(u=>u.username===p.username?{...u,points:u.points+pts}:u) });
    showFlash(`✓ Одобрено: ${p.username} +${pts}pts`);
  };
  const doReject = (p) => { onUpdate({...db,pending:db.pending.filter(x=>x.id!==p.id)}); showFlash(`✗ Отклонено: ${p.username}`,false); };

  const doAddManual = () => {
    if(!selUser||!selDemon) return;
    const pct = Math.min(100,Math.max(1,parseInt(selPct)||0));
    const demon = ALL_DEMONS.find(d=>d.id===selDemon); if(!demon) return;
    const pts = pct>=100 ? demon.diffPts : Math.floor(demon.diffPts*pct/100*0.3);
    const rec = { id:Date.now(), username:selUser, demonId:selDemon, percent:pct, approvedAt:new Date().toISOString(), approvedBy:currentUser.username, ptsAwarded:pts };
    onUpdate({ ...db, approved:[...db.approved,rec], users:db.users.map(u=>u.username===selUser?{...u,points:u.points+pts}:u) });
    showFlash(`✓ Добавлено: ${selUser} ${pct}% +${pts}pts`);
  };

  const doPoints = (plus) => {
    const amt=parseInt(ptAmt)||0; if(!ptUser||!amt) return;
    const delta=plus?amt:-amt;
    onUpdate({...db, users:db.users.map(u=>u.username===ptUser?{...u,points:Math.max(0,u.points+delta)}:u)});
    showFlash(`${delta>0?"+":""}${delta}pts → ${ptUser}`);
    setPtAmt(""); setPtNote("");
  };

  const tabStyle = (k) => ({ fontFamily:"'Outfit',sans-serif", fontWeight:500, fontSize:12, padding:"6px 12px", border:"none", borderRadius:7, background:activeTab===k?"rgba(167,139,250,0.18)":"transparent", color:activeTab===k?"#a78bfa":"#6b6b8a", cursor:"pointer" });
  const Card2 = ({children}) => (<div style={{ background:"rgba(22,22,36,0.9)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"16px 16px" }}>{children}</div>);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
        <span style={{ fontSize:18 }}>👑</span>
        <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, color:"#fbbf24" }}>Панель администратора</span>
      </div>
      <FlashMsg msg={flash.msg} type={flash.ok?"success":"error"}/>
      <div style={{ display:"flex", gap:3, marginBottom:18, background:"rgba(22,22,36,0.9)", borderRadius:12, padding:4, flexWrap:"wrap" }}>
        {[["pending",`Заявки (${db.pending.length})`],["manual","Вручную"],["users","Игроки"],["points","Баллы"]].map(([k,l])=>(
          <button key={k} onClick={()=>setActiveTab(k)} style={tabStyle(k)}>{l}</button>
        ))}
      </div>

      {activeTab==="pending" && (
        db.pending.length===0
          ? <div style={{ textAlign:"center",color:"#6b6b8a",padding:"40px 20px",background:"rgba(22,22,36,0.9)",borderRadius:14,border:"1px solid rgba(255,255,255,0.06)" }}><div style={{fontSize:24,marginBottom:8}}>✅</div><p style={{fontSize:13}}>Нет ожидающих заявок</p></div>
          : <div style={{ display:"flex",flexDirection:"column",gap:8 }}>{db.pending.map(p=>{
              const d=ALL_DEMONS.find(x=>x.id===p.demonId);
              return (
                <Card2 key={p.id}>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap" }}>
                    <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:"#e8e8f8" }}>{p.username}</span>
                    <span style={{ color:"#3a3a5a" }}>→</span>
                    <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:12,color:d?DM[d.diff].color:"#e8e8f8" }}>{d?.name}</span>
                    {d&&<DiffBadge diff={d.diff}/>}
                    <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"#fbbf24" }}>{p.percent}%</span>
                    <span style={{ marginLeft:"auto",fontSize:10,color:"#3a3a5a" }}>{new Date(p.submittedAt).toLocaleString("ru")}</span>
                  </div>
                  {p.note&&<div style={{ fontSize:11,color:"#8888a8",marginBottom:10,background:"rgba(255,255,255,0.03)",borderRadius:8,padding:"7px 10px" }}>{p.note}</div>}
                  <div style={{ display:"flex",gap:8 }}>
                    <Btn onClick={()=>doApprove(p)} color="#4ade80" small>✓ Одобрить</Btn>
                    <Btn onClick={()=>doReject(p)} color="#f87171" outline small>✗ Отклонить</Btn>
                  </div>
                </Card2>
              );
            })}</div>
      )}

      {activeTab==="manual" && (
        <Card2>
          <SelectInput label="Игрок" value={selUser} onChange={setSelUser}>
            <option value="">Выберите игрока</option>
            {db.users.map(u=><option key={u.username} value={u.username}>{u.displayName||u.username}</option>)}
          </SelectInput>
          <SelectInput label="Уровень" value={selDemon} onChange={setSelDemon}>
            <option value="">Выберите уровень</option>
            {Object.entries(DEMONS_DATA).flatMap(([d,arr])=>arr.map(x=><option key={x.id} value={x.id}>[{DM[d].label.split(" ")[0]}] {x.name}</option>))}
          </SelectInput>
          <div style={{ marginBottom:14 }}>
            <FieldLabel>Процент: <span style={{color:"#a78bfa"}}>{selPct}%</span></FieldLabel>
            <input type="range" min="1" max="100" value={selPct} onChange={e=>setSelPct(e.target.value)} style={{ width:"100%", accentColor:"#a78bfa" }}/>
          </div>
          <Btn onClick={doAddManual} color="#4ade80">Добавить прогресс</Btn>
        </Card2>
      )}

      {activeTab==="users" && (
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          {db.users.map((u,i)=>{
            const recs=db.approved.filter(a=>a.username===u.username);
            const beaten=recs.filter(a=>a.percent>=100).length;
            return (
              <div key={u.username} style={{ background:"rgba(22,22,36,0.9)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",gap:10,animation:`slideUp 0.3s ${i*30}ms ease both` }}>
                <UserAvatar user={u} size={36}/>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:"#e8e8f8" }}>{u.displayName||u.username}{u.role==="admin"&&<span style={{fontSize:10,color:"#fbbf24",marginLeft:4}}>👑</span>}</div>
                  <div style={{ fontSize:11,color:"#6b6b8a" }}>{beaten} пройдено · {recs.length} записей</div>
                </div>
                <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:"#fbbf24" }}>{u.points}pts</div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab==="points" && (
        <Card2>
          <SelectInput label="Игрок" value={ptUser} onChange={setPtUser}>
            <option value="">Выберите игрока</option>
            {db.users.map(u=><option key={u.username} value={u.username}>{u.displayName||u.username} ({u.points}pts)</option>)}
          </SelectInput>
          <TextInput label="Количество баллов" type="number" value={ptAmt} onChange={setPtAmt} placeholder="50"/>
          <TextInput label="Причина (необязательно)" value={ptNote} onChange={setPtNote} placeholder="за что"/>
          <div style={{ display:"flex",gap:8 }}>
            <Btn onClick={()=>doPoints(true)} color="#4ade80">+ Начислить</Btn>
            <Btn onClick={()=>doPoints(false)} color="#f87171" outline>− Снять</Btn>
          </div>
        </Card2>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════════ */
export default function App() {
  const [db,  setDb]  = useState(loadDb);
  const [user, setUser] = useState(null);
  const [tab,  setTab]  = useState("list");
  const [modal, setModal]   = useState(false);
  const [selDemon, setSelDemon] = useState(null);
  const [initialized, setInit] = useState(false);

  const updateDb = (newDb) => { setDb(newDb); saveDb(newDb); };

  // Restore session on mount
  useEffect(() => {
    const savedUser = loadSession(db);
    if (savedUser) setUser(savedUser);
    setInit(true);
  }, []);

  // Keep user in sync with db changes
  useEffect(() => {
    if (user) {
      const fresh = db.users.find(u=>u.username===user.username);
      if (fresh && JSON.stringify(fresh)!==JSON.stringify(user)) setUser(fresh);
    }
  }, [db]);

  const handleAuth = (u, isNew=false) => {
    if (isNew) {
      const newDb = { ...db, users:[...db.users, u] };
      updateDb(newDb);
      setUser(u);
      saveSession(u);
    } else {
      const fresh = db.users.find(x=>x.username===u.username)||u;
      setUser(fresh);
      saveSession(fresh);
    }
    setTab("list");
  };

  const handleLogout = () => { setUser(null); saveSession(null); setTab("list"); };

  const openSubmit = (demon) => { setSelDemon(demon); setModal(true); };
  const closeModal = () => { setModal(false); setSelDemon(null); };

  if (!initialized) return <div style={{ minHeight:"100vh", background:"#0d0d14" }}/>;
  if (!user) return <AuthPage onAuth={handleAuth} db={db}/>;

  const isAdmin = user.role==="admin";

  const TABS = [
    {k:"list",l:"Список"},
    {k:"profile",l:"Профиль"},
    {k:"leaderboard",l:"Лидеры"},
    {k:"about",l:"О проекте"},
    {k:"settings",l:"Настройки"},
    ...(isAdmin?[{k:"admin",l:"👑 Админ"}]:[]),
  ];

  return (
    <div style={{ background:"#0d0d14", minHeight:"100vh", color:"#e8e8f8", fontFamily:"'Outfit',sans-serif", position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.4; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d0d14; }
        ::-webkit-scrollbar-thumb { background: #1e1e30; border-radius: 4px; }
        @keyframes slideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes fadeSlide { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
        @keyframes authIn { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
      `}</style>

      <BgPattern/>

      {/* HEADER */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:"rgba(13,13,20,0.88)", backdropFilter:"blur(22px)", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", padding:"0 16px", height:58, gap:10 }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, letterSpacing:-0.5, whiteSpace:"nowrap", color:"#e8e8f8" }}>
          GD<span style={{color:"#a78bfa"}}>·</span>Demons
        </div>
        <nav style={{ display:"flex", gap:2, flex:1, overflowX:"auto", padding:"0 4px" }}>
          {TABS.map(t=>(
            <button key={t.k} onClick={()=>setTab(t.k)} style={{ fontFamily:"'Outfit',sans-serif", fontWeight:500, fontSize:12, padding:"6px 12px", border:"none", borderRadius:8, background:tab===t.k?(t.k==="admin"?"rgba(251,191,36,0.12)":"rgba(255,255,255,0.08)"):"transparent", color:tab===t.k?(t.k==="admin"?"#fbbf24":"#e8e8f8"):"#6b6b8a", cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.18s" }}>
              {t.l}
            </button>
          ))}
        </nav>
        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"#fbbf24", background:"rgba(251,191,36,0.1)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:7, padding:"3px 9px" }}>{user.points}pts</div>
          <UserAvatar user={user} size={28}/>
          <button onClick={handleLogout} style={{ fontFamily:"'Outfit',sans-serif", fontSize:11, padding:"5px 10px", border:"1px solid rgba(255,255,255,0.09)", borderRadius:7, background:"transparent", color:"#6b6b8a", cursor:"pointer" }}>Выйти</button>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div style={{ maxWidth:940, margin:"0 auto", padding:"24px 14px 80px", position:"relative", zIndex:1 }}>
        {tab==="list"        && <ListPage        user={user} approved={db.approved} onSubmit={openSubmit}/>}
        {tab==="profile"     && <ProfilePage     user={user} approved={db.approved}/>}
        {tab==="leaderboard" && <LeaderboardPage db={db}     approved={db.approved}/>}
        {tab==="about"       && <AboutPage/>}
        {tab==="settings"    && <SettingsPage    user={user} db={db} onUpdate={updateDb} onLogout={handleLogout}/>}
        {tab==="admin"&&isAdmin && <AdminPanel   db={db}     onUpdate={updateDb} currentUser={user}/>}
      </div>

      <SubmitModal open={modal} onClose={closeModal} user={user} demon={selDemon} db={db} onUpdate={updateDb}/>
    </div>
  );
}