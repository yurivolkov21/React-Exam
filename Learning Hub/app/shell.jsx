(function(){
/* global React, Icon, SUBJECT_OPTIONS, SUBJECT_COLOR, ProgressRing, useToast, uid, todayISO */

// ===== Auth screen =====
function AuthScreen({ onLogin, onSignup }) {
  const [mode, setMode] = useState("login");
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const update = (k) => (e) => setValues(v => ({ ...v, [k]: e.target.value }));

  const submitLogin = (e) => {
    e.preventDefault();
    const errs = {};
    if (!window.isEmail(values.email.trim())) errs.email = "Enter a valid email address.";
    if (values.password.length < 8) errs.password = "Password must be at least 8 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onLogin({ email: values.email.trim().toLowerCase(), name: values.email.split("@")[0] || "Learner" });
  };

  const submitSignup = (e) => {
    e.preventDefault();
    const errs = {};
    if (!values.name.trim()) errs.name = "Please enter your full name.";
    if (!window.isEmail(values.email.trim())) errs.email = "Enter a valid email address.";
    if (values.password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (values.password !== values.confirmPassword) errs.confirmPassword = "Passwords do not match.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSignup({ name: values.name.trim(), email: values.email.trim().toLowerCase() });
  };

  return (
    <div className="auth-split">
      <aside className="auth-hero">
        <div className="auth-hero-brand">
          <span className="mark">L</span>
          <span className="name">Learning Hub</span>
        </div>
        <div className="auth-hero-content">
          <h1>Show up daily. Learn <em>deliberately.</em> Ship with confidence.</h1>
          <p className="auth-hero-lede">
            A calm, focused space to plan your study, track what matters, and build a streak that sticks — all frontend, fully local, always yours.
          </p>
          <div className="auth-hero-stats">
            <div className="auth-hero-stat"><div className="n">4</div><div className="l">Focus areas</div></div>
            <div className="auth-hero-stat"><div className="n">25m</div><div className="l">Session blocks</div></div>
            <div className="auth-hero-stat"><div className="n">∞</div><div className="l">Offline first</div></div>
          </div>
        </div>
        <div className="auth-hero-foot">Frontend-only demo · data saved locally to your browser</div>
      </aside>

      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="auth-form-head">
            <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
            <p>{mode === "login" ? "Sign in to pick up where you left off." : "Start tracking your study in less than a minute."}</p>
          </div>

          <div className="auth-tabs" role="tablist">
            <button type="button" role="tab" className={`auth-tab ${mode === "login" ? "is-active" : ""}`} onClick={() => { setMode("login"); setErrors({}); }}>Sign in</button>
            <button type="button" role="tab" className={`auth-tab ${mode === "signup" ? "is-active" : ""}`} onClick={() => { setMode("signup"); setErrors({}); }}>Create account</button>
          </div>

          {mode === "login" ? (
            <form onSubmit={submitLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="field">
                <label className="label" htmlFor="email">Email</label>
                <input id="email" className={`input ${errors.email ? "has-error" : ""}`} type="email" placeholder="you@example.com" value={values.email} onChange={update("email")} />
                {errors.email ? <div className="error"><Icon.alert /> {errors.email}</div> : null}
              </div>
              <div className="field">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <label className="label" htmlFor="password">Password</label>
                  <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 12, color: "var(--muted)", textDecoration: "underline", textUnderlineOffset: 3 }}>Forgot?</a>
                </div>
                <input id="password" className={`input ${errors.password ? "has-error" : ""}`} type="password" placeholder="••••••••" value={values.password} onChange={update("password")} />
                {errors.password ? <div className="error"><Icon.alert /> {errors.password}</div> : null}
              </div>
              <button type="submit" className="btn btn-primary" style={{ height: 40, marginTop: 4 }}>Sign in</button>
              <div className="or-divider">or</div>
              <button type="button" className="btn btn-outline" style={{ height: 40 }}>
                <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </button>
              <div className="auth-foot">Don't have an account? <button type="button" onClick={() => setMode("signup")}>Create one</button></div>
            </form>
          ) : (
            <form onSubmit={submitSignup} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="field">
                <label className="label" htmlFor="name">Full name</label>
                <input id="name" className={`input ${errors.name ? "has-error" : ""}`} type="text" placeholder="Your name" value={values.name} onChange={update("name")} />
                {errors.name ? <div className="error"><Icon.alert /> {errors.name}</div> : null}
              </div>
              <div className="field">
                <label className="label" htmlFor="email2">Email</label>
                <input id="email2" className={`input ${errors.email ? "has-error" : ""}`} type="email" placeholder="you@example.com" value={values.email} onChange={update("email")} />
                {errors.email ? <div className="error"><Icon.alert /> {errors.email}</div> : null}
              </div>
              <div className="field">
                <label className="label" htmlFor="password2">Password</label>
                <input id="password2" className={`input ${errors.password ? "has-error" : ""}`} type="password" placeholder="At least 8 characters" value={values.password} onChange={update("password")} />
                {errors.password ? <div className="error"><Icon.alert /> {errors.password}</div> : null}
              </div>
              <div className="field">
                <label className="label" htmlFor="confirmPassword">Confirm password</label>
                <input id="confirmPassword" className={`input ${errors.confirmPassword ? "has-error" : ""}`} type="password" placeholder="Repeat password" value={values.confirmPassword} onChange={update("confirmPassword")} />
                {errors.confirmPassword ? <div className="error"><Icon.alert /> {errors.confirmPassword}</div> : null}
              </div>
              <button type="submit" className="btn btn-primary" style={{ height: 40, marginTop: 4 }}>Create account</button>
              <div className="auth-foot">Already registered? <button type="button" onClick={() => setMode("login")}>Sign in</button></div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

// ===== Sidebar =====
function Sidebar({ section, onSection, user, onLogout, taskStats, collapsed, onToggleCollapse }) {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: <Icon.layout /> },
    { key: "tasks", label: "Tasks", icon: <Icon.list />, count: taskStats.pending },
    { key: "notes", label: "Notes", icon: <Icon.book /> },
    { key: "assistant", label: "Assistant", icon: <Icon.sparkle /> },
  ];
  const initials = user.name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("") || "L";
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="sidebar-mark">L</span>
          {!collapsed && (
            <div className="sidebar-title">
              <span className="sidebar-title-main">Learning Hub</span>
              <span className="sidebar-title-sub">Semester 1 · Active</span>
            </div>
          )}
        </div>
        {!collapsed && (
          <button className="sidebar-collapse" onClick={onToggleCollapse} title="Collapse sidebar">
            <Icon.sidebarLeft />
          </button>
        )}
      </div>

      <div className="sidebar-content">
        <div className="nav-group">
          {!collapsed && <div className="nav-group-label">Workspace</div>}
          {items.map(it => (
            <button key={it.key} className={`nav-item ${section === it.key ? "is-active" : ""}`} onClick={() => onSection(it.key)} title={it.label}>
              <span className="nav-icon">{it.icon}</span>
              {!collapsed && <span>{it.label}</span>}
              {!collapsed && it.count != null && it.count > 0 ? <span className="nav-count">{it.count}</span> : null}
            </button>
          ))}
        </div>

        {!collapsed && (
          <div className="nav-group">
            <div className="nav-group-label">Library</div>
            <button className="nav-item"><span className="nav-icon"><Icon.stack /></span><span>React patterns</span></button>
            <button className="nav-item"><span className="nav-icon"><Icon.stack /></span><span>TypeScript refs</span></button>
            <button className="nav-item"><span className="nav-icon"><Icon.stack /></span><span>UI snippets</span></button>
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <button className="user-pill" onClick={onLogout} title="Sign out">
          <span className="avatar avatar-sm">{initials}</span>
          {!collapsed && (
            <>
              <div className="user-pill-info">
                <div className="user-pill-name">{user.name}</div>
                <div className="user-pill-email">{user.email}</div>
              </div>
              <span style={{ color: "var(--muted)" }}><Icon.logout /></span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

// ===== Topbar =====
function Topbar({ section, onNewTask, onToggleSidebar, user, streak }) {
  const titles = {
    dashboard: "Dashboard",
    tasks: "Tasks",
    notes: "Notes",
    assistant: "Assistant",
  };
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <div className="topbar">
      <button className="btn btn-ghost btn-icon btn-sm" onClick={onToggleSidebar} title="Toggle sidebar">
        <Icon.sidebarLeft />
      </button>
      <div className="topbar-crumbs">
        <span>Learning Hub</span>
        <span className="sep">/</span>
        <span className="cur">{titles[section]}</span>
      </div>
      <div className="topbar-actions">
        <span className="badge badge-accent"><Icon.flame /> {streak}-day streak</span>
        <span style={{ fontSize: 12.5, color: "var(--muted)", marginRight: 4 }}>{greeting}, {user.name.split(" ")[0]}</span>
        <button className="btn btn-accent btn-sm" onClick={onNewTask}>
          <Icon.plus /> New task
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { AuthScreen, Sidebar, Topbar });

})();