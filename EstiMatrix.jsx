import { useState, useEffect, useRef } from "react";

// ─── Design tokens ───────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --blue-950: #020b1a;
  --blue-900: #061529;
  --blue-800: #0a2447;
  --blue-700: #0d3166;
  --blue-600: #1047a0;
  --blue-500: #1560c8;
  --blue-400: #2b7fff;
  --blue-300: #60a5fa;
  --blue-200: #bfdbfe;
  --blue-100: #dbeafe;
  --blue-50:  #eff6ff;
  --white:    #ffffff;
  --glass:    rgba(255,255,255,0.06);
  --glass2:   rgba(255,255,255,0.10);
  --border:   rgba(91,147,255,0.18);
  --shadow:   0 8px 40px rgba(0,0,0,0.45);
  --font-head: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;
}

body { font-family: var(--font-body); background: var(--blue-950); color: var(--white); }

/* scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--blue-900); }
::-webkit-scrollbar-thumb { background: var(--blue-600); border-radius: 99px; }

/* ── layout ── */
.app { display: flex; min-height: 100vh; }

/* ── sidebar ── */
.sidebar {
  width: 240px; min-width: 240px;
  background: var(--blue-900);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  padding: 0 0 24px;
  position: sticky; top: 0; height: 100vh;
  overflow-y: auto;
}
.sidebar-logo {
  padding: 28px 24px 20px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 12px;
}
.sidebar-logo .logo-text {
  font-family: var(--font-head);
  font-size: 1.5rem; font-weight: 800;
  background: linear-gradient(135deg, #fff 30%, var(--blue-300));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  letter-spacing: -.5px;
}
.sidebar-logo .logo-sub {
  font-size: .7rem; color: var(--blue-300); letter-spacing: 2px;
  text-transform: uppercase; margin-top: 2px;
}
.nav-section-label {
  font-size: .65rem; color: var(--blue-400); letter-spacing: 2px;
  text-transform: uppercase; padding: 14px 24px 6px; font-weight: 600;
}
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 20px; margin: 2px 10px; border-radius: 10px;
  cursor: pointer; transition: all .18s;
  font-size: .875rem; color: var(--blue-200);
  border: 1px solid transparent;
}
.nav-item:hover { background: var(--glass2); color: var(--white); }
.nav-item.active {
  background: linear-gradient(135deg, var(--blue-700), var(--blue-600));
  color: var(--white); border-color: var(--blue-400);
  box-shadow: 0 4px 20px rgba(21,96,200,.4);
}
.nav-item .nav-icon { font-size: 1rem; width: 20px; text-align: center; }
.nav-badge {
  margin-left: auto; background: var(--blue-400);
  color: var(--white); font-size: .65rem; font-weight: 700;
  padding: 2px 7px; border-radius: 99px;
}
.sidebar-user {
  margin-top: auto; padding: 16px 20px;
  border-top: 1px solid var(--border);
  display: flex; align-items: center; gap: 10px;
}
.user-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, var(--blue-500), var(--blue-300));
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: .85rem;
}
.user-name { font-size: .82rem; font-weight: 600; }
.user-role { font-size: .7rem; color: var(--blue-300); }

/* ── main ── */
.main { flex: 1; overflow-y: auto; background: var(--blue-950); }

/* ── topbar ── */
.topbar {
  background: rgba(6,21,41,.92);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  padding: 14px 32px;
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 50;
}
.topbar-title { font-family: var(--font-head); font-size: 1.1rem; font-weight: 700; }
.topbar-right { display: flex; align-items: center; gap: 14px; }
.topbar-btn {
  background: var(--glass); border: 1px solid var(--border);
  color: var(--blue-200); padding: 7px 14px; border-radius: 8px;
  cursor: pointer; font-size: .8rem; font-family: var(--font-body);
  transition: all .15s; display: flex; align-items: center; gap: 6px;
}
.topbar-btn:hover { background: var(--glass2); border-color: var(--blue-400); color: var(--white); }
.topbar-btn.primary {
  background: linear-gradient(135deg, var(--blue-600), var(--blue-500));
  border-color: var(--blue-400); color: var(--white);
}
.topbar-btn.primary:hover { background: linear-gradient(135deg, var(--blue-500), var(--blue-400)); }
.role-badge {
  background: var(--glass2); border: 1px solid var(--border);
  padding: 4px 12px; border-radius: 99px;
  font-size: .72rem; color: var(--blue-300); font-weight: 600; letter-spacing: 1px;
}

/* ── page ── */
.page { padding: 28px 32px; }
.page-header { margin-bottom: 24px; }
.page-title { font-family: var(--font-head); font-size: 1.6rem; font-weight: 800; }
.page-subtitle { color: var(--blue-300); font-size: .85rem; margin-top: 4px; }

/* ── stat cards ── */
.stat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 28px; }
.stat-card {
  background: var(--blue-900);
  border: 1px solid var(--border); border-radius: 14px;
  padding: 20px; position: relative; overflow: hidden;
  transition: transform .2s, box-shadow .2s;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
.stat-card::before {
  content:''; position:absolute; top:0; right:0;
  width:80px; height:80px; border-radius:50%;
  background: radial-gradient(circle, rgba(43,127,255,.15), transparent 70%);
}
.stat-label { font-size: .72rem; color: var(--blue-300); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
.stat-value { font-family: var(--font-head); font-size: 1.9rem; font-weight: 800; }
.stat-change { font-size: .75rem; margin-top: 4px; }
.stat-change.up { color: #34d399; }
.stat-change.down { color: #f87171; }
.stat-change.neutral { color: var(--blue-300); }
.stat-icon { position: absolute; top: 18px; right: 18px; font-size: 1.4rem; opacity: .6; }

/* ── cards ── */
.card {
  background: var(--blue-900);
  border: 1px solid var(--border); border-radius: 14px;
  padding: 22px; margin-bottom: 20px;
}
.card-title {
  font-family: var(--font-head); font-size: 1rem; font-weight: 700;
  margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
}
.card-title span { color: var(--blue-300); font-size: .85rem; font-weight: 400; font-family: var(--font-body); }

/* ── two-col grid ── */
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }

/* ── project list ── */
.project-row {
  display: flex; align-items: center; gap: 14px;
  padding: 12px 0; border-bottom: 1px solid var(--border);
  transition: background .15s; cursor: pointer;
}
.project-row:last-child { border-bottom: none; }
.project-row:hover { background: var(--glass); border-radius: 8px; padding: 12px 10px; margin: 0 -10px; }
.project-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.project-name { font-size: .88rem; font-weight: 600; flex: 1; }
.project-meta { font-size: .75rem; color: var(--blue-300); }
.status-pill {
  padding: 3px 10px; border-radius: 99px; font-size: .7rem; font-weight: 700;
  letter-spacing: .5px; text-transform: uppercase;
}
.status-on-track { background: rgba(52,211,153,.15); color: #34d399; border: 1px solid rgba(52,211,153,.3); }
.status-delayed { background: rgba(248,113,113,.15); color: #f87171; border: 1px solid rgba(248,113,113,.3); }
.status-risk { background: rgba(251,191,36,.15); color: #fbbf24; border: 1px solid rgba(251,191,36,.3); }
.status-completed { background: rgba(96,165,250,.15); color: #60a5fa; border: 1px solid rgba(96,165,250,.3); }

/* ── progress bar ── */
.progress-wrap { margin-top: 6px; }
.progress-label { display: flex; justify-content: space-between; font-size: .72rem; color: var(--blue-300); margin-bottom: 5px; }
.progress-bar { height: 6px; background: var(--blue-800); border-radius: 99px; overflow: hidden; }
.progress-fill {
  height: 100%; border-radius: 99px;
  background: linear-gradient(90deg, var(--blue-500), var(--blue-300));
  transition: width 1s cubic-bezier(.4,0,.2,1);
}
.progress-fill.danger { background: linear-gradient(90deg, #f87171, #fbbf24); }
.progress-fill.success { background: linear-gradient(90deg, #34d399, #60a5fa); }

/* ── form ── */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.full { grid-column: 1/-1; }
.form-label { font-size: .78rem; color: var(--blue-200); font-weight: 500; letter-spacing: .3px; }
.form-input, .form-select, .form-textarea {
  background: var(--blue-800); border: 1px solid var(--border);
  color: var(--white); padding: 10px 14px; border-radius: 9px;
  font-family: var(--font-body); font-size: .85rem;
  transition: border-color .15s, box-shadow .15s; outline: none;
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: var(--blue-400);
  box-shadow: 0 0 0 3px rgba(43,127,255,.18);
}
.form-input::placeholder { color: var(--blue-400); }
.form-textarea { resize: vertical; min-height: 90px; }
.form-select option { background: var(--blue-800); }
.btn {
  padding: 10px 22px; border-radius: 9px; font-family: var(--font-body);
  font-size: .85rem; font-weight: 600; cursor: pointer;
  border: 1px solid transparent; transition: all .15s;
  display: inline-flex; align-items: center; gap: 7px;
}
.btn-primary {
  background: linear-gradient(135deg, var(--blue-600), var(--blue-500));
  color: var(--white); border-color: var(--blue-400);
}
.btn-primary:hover { background: linear-gradient(135deg, var(--blue-500), var(--blue-400)); box-shadow: 0 4px 20px rgba(21,96,200,.5); }
.btn-secondary {
  background: var(--glass); color: var(--blue-200); border-color: var(--border);
}
.btn-secondary:hover { background: var(--glass2); color: var(--white); }
.btn-danger { background: rgba(239,68,68,.15); color: #f87171; border-color: rgba(239,68,68,.3); }
.btn-danger:hover { background: rgba(239,68,68,.3); }

/* ── table ── */
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: .82rem; }
thead th {
  background: var(--blue-800); color: var(--blue-300);
  padding: 10px 14px; text-align: left; font-size: .7rem;
  letter-spacing: 1px; text-transform: uppercase; font-weight: 600;
}
thead th:first-child { border-radius: 8px 0 0 8px; }
thead th:last-child { border-radius: 0 8px 8px 0; }
tbody tr { border-bottom: 1px solid var(--border); transition: background .12s; }
tbody tr:hover { background: var(--glass); }
tbody td { padding: 11px 14px; color: var(--blue-100); vertical-align: middle; }
tbody tr:last-child { border-bottom: none; }

/* ── timeline bar (visual) ── */
.timeline-compare { display: flex; flex-direction: column; gap: 14px; margin-top: 4px; }
.timeline-item-label { font-size: .78rem; color: var(--blue-200); margin-bottom: 4px; font-weight: 500; }
.timeline-bars { display: flex; flex-direction: column; gap: 5px; }
.tbar-row { display: flex; align-items: center; gap: 10px; }
.tbar-name { font-size: .7rem; color: var(--blue-300); width: 70px; text-align: right; }
.tbar-outer { flex: 1; height: 10px; background: var(--blue-800); border-radius: 99px; overflow: hidden; }
.tbar-fill { height: 100%; border-radius: 99px; }
.tbar-predicted { background: linear-gradient(90deg, var(--blue-500), var(--blue-300)); }
.tbar-expected { background: linear-gradient(90deg, #34d399, #6ee7b7); }
.tbar-val { font-size: .7rem; color: var(--blue-200); width: 40px; }

/* ── risk meter ── */
.risk-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
.risk-card {
  background: var(--blue-800); border: 1px solid var(--border);
  border-radius: 12px; padding: 16px; text-align: center;
}
.risk-score {
  font-family: var(--font-head); font-size: 2rem; font-weight: 800;
  margin: 6px 0;
}
.risk-label { font-size: .72rem; color: var(--blue-300); letter-spacing: 1px; text-transform: uppercase; }
.risk-desc { font-size: .75rem; color: var(--blue-200); margin-top: 6px; }
.risk-high { color: #f87171; }
.risk-med { color: #fbbf24; }
.risk-low { color: #34d399; }

/* ── gauge ── */
.gauge-wrap { display: flex; justify-content: center; margin: 8px 0; }
.gauge-svg { filter: drop-shadow(0 0 8px rgba(43,127,255,.4)); }

/* ── activity feed ── */
.activity-list { display: flex; flex-direction: column; gap: 12px; }
.activity-item { display: flex; gap: 12px; align-items: flex-start; }
.activity-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
.activity-content { flex: 1; }
.activity-text { font-size: .82rem; color: var(--blue-100); line-height: 1.4; }
.activity-time { font-size: .7rem; color: var(--blue-400); margin-top: 2px; }

/* ── employee card ── */
.emp-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
.emp-card {
  background: var(--blue-800); border: 1px solid var(--border);
  border-radius: 14px; padding: 18px; transition: transform .2s, box-shadow .2s;
}
.emp-card:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
.emp-head { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.emp-avatar {
  width: 44px; height: 44px; border-radius: 50%;
  background: linear-gradient(135deg, var(--blue-600), var(--blue-400));
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: .9rem; flex-shrink: 0;
}
.emp-name { font-size: .88rem; font-weight: 600; }
.emp-role { font-size: .72rem; color: var(--blue-300); }
.emp-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
.emp-stat { background: var(--blue-900); border-radius: 8px; padding: 8px; text-align: center; }
.emp-stat-val { font-family: var(--font-head); font-size: 1.1rem; font-weight: 700; color: var(--blue-300); }
.emp-stat-lbl { font-size: .65rem; color: var(--blue-400); text-transform: uppercase; letter-spacing: .5px; }

/* ── github commits ── */
.commit-list { display: flex; flex-direction: column; gap: 10px; }
.commit-item {
  display: flex; gap: 12px; align-items: center;
  background: var(--blue-800); border-radius: 9px; padding: 10px 14px;
  border-left: 3px solid var(--blue-500);
}
.commit-hash { font-size: .72rem; color: var(--blue-400); font-family: monospace; width: 65px; }
.commit-msg { flex: 1; font-size: .82rem; color: var(--blue-100); }
.commit-author { font-size: .72rem; color: var(--blue-300); }
.commit-time { font-size: .7rem; color: var(--blue-400); white-space: nowrap; }
.commit-status { font-size: .7rem; }

/* ── alert banner ── */
.alert {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 12px 16px; border-radius: 10px; margin-bottom: 14px; font-size: .83rem;
  border: 1px solid;
}
.alert-danger { background: rgba(239,68,68,.1); border-color: rgba(239,68,68,.3); color: #fca5a5; }
.alert-warning { background: rgba(251,191,36,.1); border-color: rgba(251,191,36,.3); color: #fcd34d; }
.alert-info { background: rgba(43,127,255,.1); border-color: rgba(43,127,255,.3); color: var(--blue-200); }
.alert-success { background: rgba(52,211,153,.1); border-color: rgba(52,211,153,.3); color: #6ee7b7; }
.alert-icon { font-size: 1rem; margin-top: 1px; }

/* ── chart mock ── */
.chart-area { height: 160px; display: flex; align-items: flex-end; gap: 6px; padding: 0 4px; }
.chart-bar-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
.chart-bar {
  width: 100%; border-radius: 6px 6px 0 0;
  background: linear-gradient(180deg, var(--blue-400), var(--blue-600));
  transition: height 1s cubic-bezier(.4,0,.2,1);
  min-height: 4px;
}
.chart-bar.alt { background: linear-gradient(180deg, #34d399, #0d9488); }
.chart-label { font-size: .62rem; color: var(--blue-400); }

/* ── tab ── */
.tabs { display: flex; gap: 4px; margin-bottom: 20px; background: var(--blue-900); border-radius: 10px; padding: 4px; border: 1px solid var(--border); }
.tab-btn {
  flex: 1; padding: 8px 10px; border-radius: 8px; cursor: pointer;
  font-family: var(--font-body); font-size: .8rem; font-weight: 500;
  border: none; transition: all .15s; color: var(--blue-300); background: transparent;
  text-align: center;
}
.tab-btn.active { background: var(--blue-600); color: var(--white); box-shadow: 0 2px 12px rgba(21,96,200,.4); }
.tab-btn:hover:not(.active) { background: var(--glass2); color: var(--white); }

/* ── modal overlay ── */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(2,11,26,.8);
  backdrop-filter: blur(8px); z-index: 200;
  display: flex; align-items: center; justify-content: center;
  animation: fadeIn .18s ease;
}
.modal {
  background: var(--blue-900); border: 1px solid var(--border);
  border-radius: 18px; padding: 28px; width: 560px; max-width: calc(100vw - 32px);
  box-shadow: 0 24px 80px rgba(0,0,0,.6);
  animation: slideUp .22s cubic-bezier(.34,1.56,.64,1);
}
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.modal-title { font-family: var(--font-head); font-size: 1.1rem; font-weight: 800; }
.modal-close { background: var(--glass); border: 1px solid var(--border); color: var(--blue-200); width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; }
.modal-close:hover { background: var(--glass2); color: var(--white); }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 22px; }

/* ── prediction result ── */
.prediction-box {
  background: linear-gradient(135deg, var(--blue-800), var(--blue-900));
  border: 1px solid var(--blue-500); border-radius: 14px;
  padding: 22px; margin-top: 20px;
  animation: slideUp .3s cubic-bezier(.34,1.56,.64,1);
}
.prediction-title { font-family: var(--font-head); font-size: 1rem; font-weight: 700; color: var(--blue-300); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
.prediction-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
.pred-metric { background: var(--blue-900); border-radius: 10px; padding: 14px; border: 1px solid var(--border); }
.pred-metric-val { font-family: var(--font-head); font-size: 1.5rem; font-weight: 800; }
.pred-metric-lbl { font-size: .7rem; color: var(--blue-300); text-transform: uppercase; letter-spacing: 1px; margin-top: 3px; }
.flag-banner {
  margin-top: 14px; background: rgba(251,191,36,.1);
  border: 1px solid rgba(251,191,36,.35); border-radius: 10px;
  padding: 12px 16px; display: flex; align-items: center; gap: 10px;
  color: #fcd34d; font-size: .83rem;
}

/* ── weekly report ── */
.report-card {
  background: var(--blue-800); border: 1px solid var(--border);
  border-radius: 12px; padding: 16px; margin-bottom: 12px;
  border-left: 3px solid var(--blue-500);
}
.report-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.report-week { font-family: var(--font-head); font-size: .88rem; font-weight: 700; }
.report-status { font-size: .7rem; }

/* ── empty state ── */
.empty-state { text-align: center; padding: 48px 24px; color: var(--blue-400); }
.empty-state-icon { font-size: 2.5rem; margin-bottom: 12px; opacity: .5; }
.empty-state-text { font-size: .88rem; }

/* ── login ── */
.login-wrap {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: radial-gradient(ellipse at 30% 20%, rgba(13,49,102,.8) 0%, var(--blue-950) 70%);
  position: relative; overflow: hidden;
}
.login-bg-circle {
  position: absolute; border-radius: 50%;
  background: radial-gradient(circle, rgba(21,96,200,.2), transparent 70%);
}
.login-card {
  background: var(--blue-900); border: 1px solid var(--border);
  border-radius: 20px; padding: 40px; width: 420px; max-width: calc(100vw - 32px);
  position: relative; z-index: 2;
  box-shadow: 0 32px 80px rgba(0,0,0,.6);
  animation: slideUp .4s cubic-bezier(.34,1.56,.64,1);
}
.login-logo { text-align: center; margin-bottom: 28px; }
.login-logo-text {
  font-family: var(--font-head); font-size: 2.2rem; font-weight: 800;
  background: linear-gradient(135deg, #fff 30%, var(--blue-300));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.login-logo-sub { font-size: .72rem; color: var(--blue-400); letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }
.login-role-sel { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 24px; }
.role-btn {
  padding: 12px; border-radius: 10px; cursor: pointer; text-align: center;
  border: 1px solid var(--border); background: var(--glass);
  color: var(--blue-200); font-family: var(--font-body); font-size: .82rem; font-weight: 500;
  transition: all .15s;
}
.role-btn.selected { background: var(--blue-700); border-color: var(--blue-400); color: var(--white); }
.role-btn:hover:not(.selected) { background: var(--glass2); }
.role-btn .role-icon { font-size: 1.4rem; display: block; margin-bottom: 4px; }
.login-divider { text-align: center; color: var(--blue-500); font-size: .75rem; margin: 14px 0; position: relative; }
.login-divider::before, .login-divider::after {
  content:''; position: absolute; top: 50%; width: calc(50% - 24px);
  height: 1px; background: var(--border);
}
.login-divider::before { left: 0; }
.login-divider::after { right: 0; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(.97); } to { opacity: 1; transform: none; } }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .5; } }
.pulse { animation: pulse 2s infinite; }

/* ── dot indicator ── */
.live-dot { width: 8px; height: 8px; border-radius: 50%; background: #34d399; display: inline-block; animation: pulse 2s infinite; margin-right: 6px; }

/* ── misc ── */
.divider { height: 1px; background: var(--border); margin: 18px 0; }
.text-blue { color: var(--blue-300); }
.text-sm { font-size: .8rem; }
.text-xs { font-size: .72rem; }
.flex { display: flex; }
.flex-center { display: flex; align-items: center; }
.gap-8 { gap: 8px; }
.gap-12 { gap: 12px; }
.mt-4 { margin-top: 4px; }
.mt-8 { margin-top: 8px; }
.mt-16 { margin-top: 16px; }
.mb-8 { margin-bottom: 8px; }
.bold { font-weight: 700; }
.mono { font-family: monospace; }
`;

// ─── Mock data ────────────────────────────────────────────────────────────────
const PROJECTS = [
  { id:1, name:"E-Commerce Platform", type:"Web App", complexity:"High", status:"on-track", progress:68, predicted:9, expected:10, cost:142000, team:6, lead:"Arjun S.", deadline:"2025-08-30" },
  { id:2, name:"HR Management System", type:"Enterprise", complexity:"Medium", status:"delayed", progress:41, predicted:7, expected:6, cost:89000, team:4, lead:"Priya M.", deadline:"2025-06-15" },
  { id:3, name:"Inventory Tracker", type:"Mobile App", complexity:"Low", status:"on-track", progress:85, predicted:4, expected:5, cost:38000, team:3, lead:"Karthik R.", deadline:"2025-05-20" },
  { id:4, name:"Analytics Dashboard", type:"Data Platform", complexity:"High", status:"risk", progress:22, predicted:12, expected:9, cost:195000, team:7, lead:"Deepa V.", deadline:"2025-09-01" },
  { id:5, name:"Payment Gateway", type:"FinTech", complexity:"Critical", status:"on-track", progress:55, predicted:6, expected:6, cost:78000, team:5, lead:"Rahul K.", deadline:"2025-07-10" },
];

const EMPLOYEES = [
  { id:1, name:"Arjun Sharma", role:"Full Stack Dev", avatar:"AS", commits:47, tasks:12, tasksCompleted:9, hours:38, project:"E-Commerce Platform", status:"active" },
  { id:2, name:"Priya Menon", role:"Backend Engineer", avatar:"PM", commits:31, tasks:8, tasksCompleted:5, hours:32, project:"HR Management System", status:"active" },
  { id:3, name:"Karthik Raj", role:"Mobile Dev", avatar:"KR", commits:53, tasks:15, tasksCompleted:14, hours:42, project:"Inventory Tracker", status:"active" },
  { id:4, name:"Deepa Varma", role:"Data Engineer", avatar:"DV", commits:19, tasks:10, tasksCompleted:3, hours:28, project:"Analytics Dashboard", status:"risk" },
  { id:5, name:"Rahul Kumar", role:"Security Specialist", avatar:"RK", commits:38, tasks:11, tasksCompleted:8, hours:35, project:"Payment Gateway", status:"active" },
  { id:6, name:"Sneha Pillai", role:"Frontend Dev", avatar:"SP", commits:29, tasks:9, tasksCompleted:7, hours:30, project:"E-Commerce Platform", status:"active" },
];

const COMMITS = [
  { hash:"a3f9b2c", msg:"feat: add JWT authentication middleware", author:"Arjun S.", time:"2h ago", status:"✅" },
  { hash:"7e1d4a9", msg:"fix: resolve payment gateway timeout", author:"Rahul K.", time:"4h ago", status:"✅" },
  { hash:"b8c3e5f", msg:"chore: update analytics queries", author:"Deepa V.", time:"5h ago", status:"✅" },
  { hash:"c2a7d0e", msg:"feat: implement inventory barcode scanner", author:"Karthik R.", time:"8h ago", status:"✅" },
  { hash:"f4b1e9d", msg:"fix: HR module leave calculation bug", author:"Priya M.", time:"1d ago", status:"✅" },
  { hash:"d6f2c8a", msg:"feat: dashboard chart interactivity", author:"Sneha P.", time:"1d ago", status:"✅" },
];

const ACTIVITIES = [
  { color:"#34d399", text:"Arjun Sharma pushed 3 commits to e-commerce/main — Tasks auto-marked ✅", time:"2h ago" },
  { color:"#fbbf24", text:"Risk Alert: Analytics Dashboard — predicted timeline exceeds client expectation by 3 months", time:"3h ago" },
  { color:"#60a5fa", text:"Weekly report submitted by Karthik Raj for Inventory Tracker", time:"5h ago" },
  { color:"#f87171", text:"HR Management System flagged as DELAYED — progress at 41%", time:"6h ago" },
  { color:"#a78bfa", text:"New project 'Payment Gateway' initialized by Admin", time:"8h ago" },
  { color:"#34d399", text:"Deepa Varma completed task: Set up Spark pipeline", time:"10h ago" },
];

const WEEKS = ["W1","W2","W3","W4","W5","W6","W7","W8"];
const COST_DATA = [18,25,31,28,42,38,50,45];
const PROGRESS_DATA = [10,22,35,40,55,63,72,68];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function GaugeChart({ value, max=100, color="#2b7fff" }) {
  const r = 54, cx = 70, cy = 70;
  const arc = (v) => {
    const a = (v / max) * 180 - 180;
    const rad = a * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const start = arc(0), end = arc(value);
  const large = value > max / 2 ? 1 : 0;
  return (
    <div className="gauge-wrap">
      <svg width="140" height="80" className="gauge-svg">
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`}
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round"/>
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`}
          fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"/>
        <text x={cx} y={cy-8} textAnchor="middle" fill="#fff" fontSize="18" fontWeight="800" fontFamily="Syne">{value}%</text>
        <text x={cx} y={cy+8} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">PROGRESS</text>
      </svg>
    </div>
  );
}

function BarChart({ data, labels, color="primary" }) {
  const max = Math.max(...data);
  return (
    <div className="chart-area">
      {data.map((v, i) => (
        <div className="chart-bar-wrap" key={i}>
          <div className={`chart-bar ${color === "green" ? "alt" : ""}`}
            style={{ height: `${(v / max) * 130}px` }} />
          <div className="chart-label">{labels[i]}</div>
        </div>
      ))}
    </div>
  );
}

function StatusPill({ status }) {
  const map = { "on-track":["On Track","status-on-track"], "delayed":["Delayed","status-delayed"], "risk":["At Risk","status-risk"], "completed":["Completed","status-completed"] };
  const [label, cls] = map[status] || ["Unknown",""];
  return <span className={`status-pill ${cls}`}>{label}</span>;
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  return (
    <div className="login-wrap">
      <div className="login-bg-circle" style={{width:400,height:400,top:-100,right:-100}} />
      <div className="login-bg-circle" style={{width:300,height:300,bottom:-80,left:-80}} />
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-text">EstiMatrix</div>
          <div className="login-logo-sub">AI Project Intelligence Platform</div>
        </div>
        <div className="login-role-sel">
          <button className={`role-btn ${role==="admin"?"selected":""}`} onClick={()=>setRole("admin")}>
            <span className="role-icon">🏛️</span>Higher Official
          </button>
          <button className={`role-btn ${role==="employee"?"selected":""}`} onClick={()=>setRole("employee")}>
            <span className="role-icon">👤</span>Employee
          </button>
        </div>
        <div className="form-group" style={{marginBottom:12}}>
          <label className="form-label">Email Address</label>
          <input className="form-input" placeholder={role==="admin"?"admin@company.com":"employee@company.com"} value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="form-group" style={{marginBottom:20}}>
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} />
        </div>
        <button className="btn btn-primary" style={{width:"100%",justifyContent:"center",padding:"12px"}} onClick={()=>onLogin(role)}>
          Sign In to EstiMatrix →
        </button>
        <div style={{textAlign:"center",marginTop:16,fontSize:".75rem",color:"var(--blue-400)"}}>
          Demo: click Sign In to continue
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Command Dashboard</div>
        <div className="page-subtitle"><span className="live-dot"/>Live project intelligence — {new Date().toDateString()}</div>
      </div>

      <div className="alert alert-warning">
        <span className="alert-icon">⚠️</span>
        <div><strong>Risk Alert:</strong> Analytics Dashboard predicted timeline exceeds client expectation by 3 months. Immediate action required.</div>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        {[
          { label:"Total Projects", value:"5", change:"↑ 2 this quarter", type:"neutral", icon:"📁" },
          { label:"Avg Progress", value:"54%", change:"↑ 8% vs last week", type:"up", icon:"📈" },
          { label:"Total Budget", value:"₹5.42L", change:"↓ 3% under budget", type:"up", icon:"💰" },
          { label:"Risk Projects", value:"2", change:"↑ 1 new risk flagged", type:"down", icon:"🔴" },
        ].map((s,i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className={`stat-change ${s.type}`}>{s.change}</div>
          </div>
        ))}
      </div>

      <div className="two-col">
        {/* Projects list */}
        <div className="card">
          <div className="card-title">Active Projects <span>— 5 total</span></div>
          {PROJECTS.map(p => (
            <div className="project-row" key={p.id}>
              <div className="project-dot" style={{background: p.status==="on-track"?"#34d399":p.status==="delayed"?"#f87171":"#fbbf24"}} />
              <div style={{flex:1}}>
                <div className="project-name">{p.name}</div>
                <div className="project-meta">{p.type} • {p.team} members • {p.lead}</div>
                <div className="progress-wrap">
                  <div className="progress-bar" style={{marginTop:6}}>
                    <div className={`progress-fill ${p.status==="delayed"?"danger":p.status==="risk"?"danger":"success"}`}
                      style={{width:`${p.progress}%`}} />
                  </div>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <StatusPill status={p.status} />
                <div className="project-meta" style={{marginTop:4}}>{p.progress}%</div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity feed */}
        <div className="card">
          <div className="card-title">Live Activity Feed</div>
          <div className="activity-list">
            {ACTIVITIES.map((a,i) => (
              <div className="activity-item" key={i}>
                <div className="activity-dot" style={{background:a.color}} />
                <div className="activity-content">
                  <div className="activity-text">{a.text}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="two-col">
        {/* Cost chart */}
        <div className="card">
          <div className="card-title">Weekly Cost Burn (₹K)</div>
          <BarChart data={COST_DATA} labels={WEEKS} />
        </div>
        {/* Progress chart */}
        <div className="card">
          <div className="card-title">Avg Progress Over Weeks (%)</div>
          <BarChart data={PROGRESS_DATA} labels={WEEKS} color="green" />
        </div>
      </div>
    </div>
  );
}

// ─── PROJECTS PAGE ────────────────────────────────────────────────────────────
function ProjectsPage({ role, onNewProject }) {
  return (
    <div className="page">
      <div className="page-header" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div className="page-title">Projects</div>
          <div className="page-subtitle">Manage and monitor all active projects</div>
        </div>
        {role==="admin" && <button className="btn btn-primary" onClick={onNewProject}>+ New Project</button>}
      </div>

      <div className="card">
        <div className="card-title">All Projects</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Project</th><th>Type</th><th>Complexity</th><th>Progress</th>
                <th>Predicted</th><th>Expected</th><th>Cost Est.</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {PROJECTS.map(p => (
                <tr key={p.id}>
                  <td><div style={{fontWeight:600}}>{p.name}</div><div style={{fontSize:".72rem",color:"var(--blue-400)"}}>Lead: {p.lead}</div></td>
                  <td><span className="text-blue">{p.type}</span></td>
                  <td>{p.complexity}</td>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div className="progress-bar" style={{width:80}}>
                        <div className={`progress-fill ${p.status==="delayed"||p.status==="risk"?"danger":"success"}`} style={{width:`${p.progress}%`}} />
                      </div>
                      <span style={{fontSize:".75rem"}}>{p.progress}%</span>
                    </div>
                  </td>
                  <td><span style={{color: p.predicted > p.expected ? "#f87171":"#34d399"}}>{p.predicted}mo</span></td>
                  <td>{p.expected}mo</td>
                  <td>₹{(p.cost/100000).toFixed(1)}L</td>
                  <td><StatusPill status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Timeline comparison */}
      <div className="card">
        <div className="card-title">Timeline Comparison — Predicted vs Expected</div>
        <div className="timeline-compare">
          {PROJECTS.map(p => (
            <div key={p.id}>
              <div className="timeline-item-label">{p.name}</div>
              <div className="timeline-bars">
                <div className="tbar-row">
                  <div className="tbar-name">Predicted</div>
                  <div className="tbar-outer">
                    <div className="tbar-fill tbar-predicted" style={{width:`${(p.predicted/14)*100}%`}} />
                  </div>
                  <div className="tbar-val">{p.predicted}mo</div>
                </div>
                <div className="tbar-row">
                  <div className="tbar-name">Expected</div>
                  <div className="tbar-outer">
                    <div className="tbar-fill tbar-expected" style={{width:`${(p.expected/14)*100}%`}} />
                  </div>
                  <div className="tbar-val">{p.expected}mo</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PREDICTION PAGE ──────────────────────────────────────────────────────────
function PredictionPage() {
  const [form, setForm] = useState({ name:"", type:"Web App", complexity:"Medium", deadline:"", team:4, budget:100000 });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [aiOutput, setAiOutput] = useState("");

  const runPrediction = async () => {
    if (!form.name) return;
    setLoading(true);
    setResult(null);
    setAiOutput("");

    // Call real Claude API
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are an AI project estimator. Given this project: Name="${form.name}", Type="${form.type}", Complexity="${form.complexity}", Team Size=${form.team}, Client Expected Deadline="${form.deadline}", Budget=₹${form.budget}.

Based on typical industry data for ${form.type} projects of ${form.complexity} complexity with ${form.team} team members, provide:
1. Estimated timeline in months
2. Estimated cost in INR
3. Risk level (Low/Medium/High/Critical)
4. Top 3 risk factors
5. 2-sentence recommendation

Respond ONLY with a JSON object (no markdown): {"timeline":number,"cost":number,"risk":"Low|Medium|High|Critical","riskFactors":["r1","r2","r3"],"recommendation":"text"}`
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.find(c=>c.type==="text")?.text || "{}";
      let parsed;
      try { parsed = JSON.parse(text.replace(/```json|```/g,"")); } catch { parsed = null; }

      if (parsed) {
        const clientMonths = form.deadline ? Math.ceil((new Date(form.deadline) - new Date()) / (1000*60*60*24*30)) : null;
        setResult({ ...parsed, clientMonths, flag: clientMonths && parsed.timeline > clientMonths });
        setAiOutput(parsed.recommendation);
      } else {
        // fallback
        const base = form.complexity==="Low"?3:form.complexity==="Medium"?6:form.complexity==="High"?10:14;
        const tl = Math.round(base * (1 + (form.team > 5 ? -0.1 : 0.1)));
        setResult({ timeline: tl, cost: form.budget*0.9, risk: form.complexity==="High"||form.complexity==="Critical"?"High":"Medium", riskFactors:["Scope creep","Resource constraints","Integration complexity"], recommendation:"Allocate buffer time and review resources.", flag: false });
      }
    } catch {
      const base = form.complexity==="Low"?3:form.complexity==="Medium"?6:form.complexity==="High"?10:14;
      setResult({ timeline: base, cost: form.budget*0.85, risk:"Medium", riskFactors:["Scope creep","Team availability","Tech debt"], recommendation:"Regular milestone reviews recommended.", flag: false });
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">AI Prediction Engine</div>
        <div className="page-subtitle">Uses historical project data to predict timeline, cost, and risk</div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-title">🔮 New Project Setup</div>
          <div className="form-grid">
            <div className="form-group full">
              <label className="form-label">Project Name</label>
              <input className="form-input" placeholder="e.g. CRM System v2" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Project Type</label>
              <select className="form-select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                {["Web App","Mobile App","Enterprise","Data Platform","FinTech","E-Commerce","API Service"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Complexity</label>
              <select className="form-select" value={form.complexity} onChange={e=>setForm({...form,complexity:e.target.value})}>
                {["Low","Medium","High","Critical"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Team Size</label>
              <input className="form-input" type="number" min="1" max="30" value={form.team} onChange={e=>setForm({...form,team:+e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Expected Deadline (Client)</label>
              <input className="form-input" type="date" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})} />
            </div>
            <div className="form-group full">
              <label className="form-label">Budget (₹)</label>
              <input className="form-input" type="number" value={form.budget} onChange={e=>setForm({...form,budget:+e.target.value})} />
            </div>
          </div>
          <div style={{marginTop:20}}>
            <button className="btn btn-primary" onClick={runPrediction} disabled={loading}>
              {loading ? "⏳ Analyzing with AI..." : "🚀 Run AI Prediction"}
            </button>
          </div>

          {result && (
            <div className="prediction-box">
              <div className="prediction-title">✨ AI Prediction Results</div>
              <div className="prediction-grid">
                <div className="pred-metric">
                  <div className="pred-metric-val" style={{color:"var(--blue-300)"}}>{result.timeline}mo</div>
                  <div className="pred-metric-lbl">Timeline</div>
                </div>
                <div className="pred-metric">
                  <div className="pred-metric-val" style={{color:"#34d399"}}>₹{(result.cost/100000).toFixed(1)}L</div>
                  <div className="pred-metric-lbl">Est. Cost</div>
                </div>
                <div className="pred-metric">
                  <div className="pred-metric-val" style={{color:result.risk==="High"||result.risk==="Critical"?"#f87171":result.risk==="Medium"?"#fbbf24":"#34d399"}}>{result.risk}</div>
                  <div className="pred-metric-lbl">Risk Level</div>
                </div>
              </div>
              {result.flag && (
                <div className="flag-banner">
                  ⚡ <strong>Needs Acceleration / High Time Risk</strong> — Predicted {result.timeline}mo exceeds client expectation of {result.clientMonths}mo
                </div>
              )}
              {result.riskFactors && (
                <div style={{marginTop:14}}>
                  <div style={{fontSize:".75rem",color:"var(--blue-300)",marginBottom:6,letterSpacing:"1px",textTransform:"uppercase"}}>Risk Factors</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {result.riskFactors.map((r,i)=><span key={i} className="status-pill status-risk">{r}</span>)}
                  </div>
                </div>
              )}
              {aiOutput && (
                <div style={{marginTop:14,background:"var(--blue-800)",borderRadius:9,padding:"12px",fontSize:".82rem",color:"var(--blue-100)",borderLeft:"3px solid var(--blue-400)"}}>
                  💡 {aiOutput}
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <div className="card">
            <div className="card-title">📊 Historical Accuracy</div>
            <BarChart data={[82,79,91,88,94,87,90,93]} labels={["P1","P2","P3","P4","P5","P6","P7","P8"]} />
            <div style={{fontSize:".75rem",color:"var(--blue-300)",marginTop:8,textAlign:"center"}}>Prediction accuracy % per past project</div>
          </div>
          <div className="card">
            <div className="card-title">📁 Upload Historical Reports</div>
            <div style={{border:"2px dashed var(--border)",borderRadius:12,padding:"28px",textAlign:"center",color:"var(--blue-400)"}}>
              <div style={{fontSize:"2rem",marginBottom:8}}>📄</div>
              <div style={{fontSize:".82rem",marginBottom:12}}>Drag & drop project reports (PDF, Excel, CSV)</div>
              <button className="btn btn-secondary">Choose Files</button>
            </div>
            <div style={{marginTop:12,fontSize:".75rem",color:"var(--blue-400)"}}>
              ✅ 24 historical reports loaded from MongoDB
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EMPLOYEES PAGE ───────────────────────────────────────────────────────────
function EmployeesPage({ role }) {
  const [search, setSearch] = useState("");
  const filtered = EMPLOYEES.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.project.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="page">
      <div className="page-header" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div className="page-title">Employee Tracker</div>
          <div className="page-subtitle">Monitor individual contributions and performance</div>
        </div>
        <input className="form-input" placeholder="🔍 Search employees..." style={{width:240}} value={search} onChange={e=>setSearch(e.target.value)} />
      </div>
      <div className="emp-grid">
        {filtered.map(emp => (
          <div className="emp-card" key={emp.id}>
            <div className="emp-head">
              <div className="emp-avatar">{emp.avatar}</div>
              <div>
                <div className="emp-name">{emp.name}</div>
                <div className="emp-role">{emp.role}</div>
                <div style={{marginTop:4}}><StatusPill status={emp.status==="risk"?"risk":"on-track"} /></div>
              </div>
            </div>
            <div style={{fontSize:".75rem",color:"var(--blue-400)",marginBottom:10}}>📁 {emp.project}</div>
            <div className="progress-wrap">
              <div className="progress-label">
                <span>Tasks Completed</span>
                <span>{emp.tasksCompleted}/{emp.tasks}</span>
              </div>
              <div className="progress-bar">
                <div className={`progress-fill ${emp.tasksCompleted/emp.tasks < 0.5 ? "danger":"success"}`}
                  style={{width:`${(emp.tasksCompleted/emp.tasks)*100}%`}} />
              </div>
            </div>
            <div className="emp-stats">
              <div className="emp-stat"><div className="emp-stat-val">{emp.commits}</div><div className="emp-stat-lbl">Commits</div></div>
              <div className="emp-stat"><div className="emp-stat-val">{emp.hours}h</div><div className="emp-stat-lbl">This Week</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── GITHUB PAGE ──────────────────────────────────────────────────────────────
function GitHubPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">GitHub Integration</div>
        <div className="page-subtitle">Real-time commit tracking with auto task validation</div>
      </div>
      <div className="alert alert-success">
        <span className="alert-icon">✅</span>
        <div>Webhook active — 6 repositories connected. Last sync: 2 minutes ago.</div>
      </div>
      <div className="two-col">
        <div className="card">
          <div className="card-title">🐙 Recent Commits</div>
          <div className="commit-list">
            {COMMITS.map((c,i) => (
              <div className="commit-item" key={i}>
                <div className="commit-hash mono">{c.hash}</div>
                <div className="commit-msg">{c.msg}</div>
                <div>
                  <div className="commit-author text-blue">{c.author}</div>
                  <div className="commit-time">{c.time}</div>
                </div>
                <div className="commit-status">{c.status}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="card">
            <div className="card-title">📦 Connected Repositories</div>
            {PROJECTS.map(p => (
              <div className="project-row" key={p.id}>
                <span style={{fontSize:"1rem"}}>📁</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:".85rem",fontWeight:600}}>{p.name.toLowerCase().replace(/ /g,"-")}</div>
                  <div style={{fontSize:".72rem",color:"var(--blue-400)"}}>main • {Math.floor(Math.random()*50)+20} commits this week</div>
                </div>
                <span className="status-pill status-on-track">Active</span>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-title">⚙️ Auto-Task Validation Rules</div>
            {["Push to main → Mark task complete","PR merged → Update progress %","Failed build → Trigger risk alert","3+ days no commit → Flag employee"].map((r,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"center",padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
                <span style={{color:"#34d399",fontSize:"1rem"}}>✓</span>
                <span style={{fontSize:".82rem",color:"var(--blue-100)"}}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RISK PAGE ────────────────────────────────────────────────────────────────
function RiskPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Risk Analysis</div>
        <div className="page-subtitle">AI-powered risk detection and mitigation insights</div>
      </div>
      <div className="risk-grid">
        {[
          { label:"Delay Risk", score:72, cls:"risk-high", desc:"2 projects behind schedule", icon:"⏱️" },
          { label:"Cost Overrun Risk", score:45, cls:"risk-med", desc:"Budget variance within 15%", icon:"💸" },
          { label:"Resource Risk", score:28, cls:"risk-low", desc:"Team utilization optimal", icon:"👥" },
        ].map((r,i) => (
          <div className="risk-card" key={i}>
            <div style={{fontSize:"1.6rem"}}>{r.icon}</div>
            <div className="risk-label">{r.label}</div>
            <div className={`risk-score ${r.cls}`}>{r.score}</div>
            <div style={{height:6,background:"var(--blue-900)",borderRadius:99,overflow:"hidden",margin:"8px 0"}}>
              <div style={{height:"100%",width:`${r.score}%`,borderRadius:99,background:r.cls.includes("high")?"#f87171":r.cls.includes("med")?"#fbbf24":"#34d399"}} />
            </div>
            <div className="risk-desc">{r.desc}</div>
          </div>
        ))}
      </div>
      <div className="two-col" style={{marginTop:20}}>
        <div className="card">
          <div className="card-title">🚨 Active Risk Alerts</div>
          {[
            { type:"danger", icon:"🔴", msg:"Analytics Dashboard: 3 months behind client deadline — flag: NEEDS ACCELERATION" },
            { type:"warning", icon:"🟡", msg:"HR Management System: Progress stalled at 41%, no commits in 3 days" },
            { type:"warning", icon:"🟡", msg:"Deepa Varma: Low task completion rate (30%) — possible resource bottleneck" },
            { type:"info", icon:"🔵", msg:"Payment Gateway budget variance: ₹4,200 over weekly estimate" },
          ].map((a,i) => (
            <div className={`alert alert-${a.type}`} key={i}>
              <span className="alert-icon">{a.icon}</span><div>{a.msg}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">📋 Risk by Project</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Project</th><th>Risk Score</th><th>Category</th></tr></thead>
              <tbody>
                {PROJECTS.map(p => {
                  const score = p.status==="delayed"?78:p.status==="risk"?82:p.status==="completed"?5:30;
                  return (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div className="progress-bar" style={{width:70}}>
                            <div className="progress-fill" style={{width:`${score}%`,background:score>60?"#f87171":score>40?"#fbbf24":"#34d399"}} />
                          </div>
                          <span style={{fontSize:".75rem"}}>{score}</span>
                        </div>
                      </td>
                      <td><StatusPill status={p.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── REPORTS PAGE ─────────────────────────────────────────────────────────────
function ReportsPage({ role }) {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ work:"", commits:"", pending:"", hours:"" });
  const [submitted, setSubmitted] = useState(false);

  const pastReports = [
    { week:"Week 15 (Apr 7–13)", emp:"Arjun Sharma", commits:12, hours:38, tasks:"API auth, JWT refresh", pending:"File upload module" },
    { week:"Week 14 (Mar 31–Apr 6)", emp:"Karthik Raj", commits:15, hours:42, tasks:"Barcode scanner integration", pending:"Sync module" },
    { week:"Week 15 (Apr 7–13)", emp:"Priya Menon", commits:7, hours:30, tasks:"Leave management API", pending:"Approval workflow" },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Weekly Reports</div>
        <div className="page-subtitle">Submit and review weekly progress reports</div>
      </div>
      <div className="tabs">
        {(role==="admin" ? ["All Reports","Generate Summary"] : ["Submit Report","My Reports"]).map((t,i) => (
          <button key={i} className={`tab-btn ${tab===i?"active":""}`} onClick={()=>setTab(i)}>{t}</button>
        ))}
      </div>

      {tab===0 && role==="admin" && (
        <div className="card">
          <div className="card-title">All Weekly Reports</div>
          {pastReports.map((r,i) => (
            <div className="report-card" key={i}>
              <div className="report-header">
                <div className="report-week">{r.week}</div>
                <span className="status-pill status-on-track">Submitted</span>
              </div>
              <div style={{fontSize:".82rem",color:"var(--blue-200)",marginBottom:6}}><strong>Employee:</strong> {r.emp}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:".78rem",color:"var(--blue-300)"}}>
                <div>✅ Work: {r.tasks}</div>
                <div>⏱️ Hours: {r.hours}h</div>
                <div>🔗 Commits: {r.commits}</div>
                <div>🕐 Pending: {r.pending}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab===0 && role==="employee" && (
        <div className="card">
          <div className="card-title">📝 Submit Weekly Report</div>
          {submitted ? (
            <div className="alert alert-success"><span>✅</span><div>Report submitted successfully! Your manager has been notified.</div></div>
          ) : (
            <div className="form-grid">
              <div className="form-group full">
                <label className="form-label">Work Completed This Week</label>
                <textarea className="form-textarea" placeholder="Describe tasks you completed..." value={form.work} onChange={e=>setForm({...form,work:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Repository / Commit Activity</label>
                <input className="form-input" placeholder="e.g. 12 commits to feature/auth" value={form.commits} onChange={e=>setForm({...form,commits:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Hours Spent</label>
                <input className="form-input" type="number" placeholder="e.g. 38" value={form.hours} onChange={e=>setForm({...form,hours:e.target.value})} />
              </div>
              <div className="form-group full">
                <label className="form-label">Pending Tasks</label>
                <textarea className="form-textarea" placeholder="List any tasks not yet completed..." style={{minHeight:70}} value={form.pending} onChange={e=>setForm({...form,pending:e.target.value})} />
              </div>
              <div className="form-group full">
                <button className="btn btn-primary" onClick={()=>setSubmitted(true)}>📤 Submit Report</button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab===1 && (
        <div className="card">
          <div className="card-title">📊 AI Report Summary</div>
          <div className="alert alert-info"><span>🤖</span><div>AI-generated insights based on this week's reports across all 6 employees.</div></div>
          {[
            { icon:"📈", title:"Top Performer", value:"Karthik Raj", sub:"53 commits, 14/15 tasks, 42 hours" },
            { icon:"⚠️", title:"Needs Attention", value:"Deepa Varma", sub:"Only 3/10 tasks completed, 19 commits" },
            { icon:"💪", title:"Team Velocity", value:"+12%", sub:"vs last week average" },
            { icon:"🎯", title:"Sprint Goal", value:"72% Complete", sub:"Target: 80% by end of week" },
          ].map((m,i)=>(
            <div key={i} style={{display:"flex",gap:14,padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
              <span style={{fontSize:"1.4rem"}}>{m.icon}</span>
              <div>
                <div style={{fontSize:".72rem",color:"var(--blue-400)",textTransform:"uppercase",letterSpacing:"1px"}}>{m.title}</div>
                <div style={{fontWeight:700,fontSize:".95rem"}}>{m.value}</div>
                <div style={{fontSize:".75rem",color:"var(--blue-300)"}}>{m.sub}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── NEW PROJECT MODAL ────────────────────────────────────────────────────────
function NewProjectModal({ onClose }) {
  const [form, setForm] = useState({ name:"", type:"Web App", complexity:"Medium", deadline:"", team:4 });
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">➕ New Project Setup</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="form-grid">
          <div className="form-group full">
            <label className="form-label">Project Name</label>
            <input className="form-input" placeholder="Enter project name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Project Type</label>
            <select className="form-select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
              {["Web App","Mobile App","Enterprise","Data Platform","FinTech"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Complexity</label>
            <select className="form-select" value={form.complexity} onChange={e=>setForm({...form,complexity:e.target.value})}>
              {["Low","Medium","High","Critical"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Team Size</label>
            <input className="form-input" type="number" min="1" value={form.team} onChange={e=>setForm({...form,team:e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Client Deadline</label>
            <input className="form-input" type="date" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})} />
          </div>
          <div className="form-group full">
            <div className="alert alert-info" style={{marginBottom:0}}>
              <span>🤖</span><div>After saving, AI will auto-predict timeline & cost from historical data.</div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onClose}>🚀 Create & Predict</button>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR NAV ──────────────────────────────────────────────────────────────
const ADMIN_NAV = [
  { icon:"🏠", label:"Dashboard", page:"dashboard" },
  { icon:"📁", label:"Projects", page:"projects", badge:"5" },
  { icon:"🔮", label:"AI Prediction", page:"prediction" },
  { icon:"👥", label:"Employees", page:"employees" },
  { icon:"🐙", label:"GitHub Tracker", page:"github" },
  { icon:"⚠️", label:"Risk Analysis", page:"risk" },
  { icon:"📊", label:"Reports", page:"reports", badge:"3" },
];
const EMP_NAV = [
  { icon:"🏠", label:"My Dashboard", page:"dashboard" },
  { icon:"📋", label:"My Tasks", page:"projects" },
  { icon:"🐙", label:"Commits", page:"github" },
  { icon:"📊", label:"Weekly Report", page:"reports" },
];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("admin");
  const [page, setPage] = useState("dashboard");
  const [showNewProject, setShowNewProject] = useState(false);

  const handleLogin = (r) => { setRole(r); setLoggedIn(true); };

  const PAGE_TITLES = {
    dashboard: role==="admin" ? "Command Dashboard" : "My Dashboard",
    projects: "Projects",
    prediction: "AI Prediction",
    employees: "Employees",
    github: "GitHub Tracker",
    risk: "Risk Analysis",
    reports: "Reports",
  };

  const nav = role==="admin" ? ADMIN_NAV : EMP_NAV;

  return (
    <>
      <style>{css}</style>
      {!loggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <div className="app">
          <aside className="sidebar">
            <div className="sidebar-logo">
              <div className="logo-text">EstiMatrix</div>
              <div className="logo-sub">AI Project Intelligence</div>
            </div>
            <div className="nav-section-label">Navigation</div>
            {nav.map(n => (
              <div key={n.page} className={`nav-item ${page===n.page?"active":""}`} onClick={()=>setPage(n.page)}>
                <span className="nav-icon">{n.icon}</span>
                {n.label}
                {n.badge && <span className="nav-badge">{n.badge}</span>}
              </div>
            ))}
            <div className="sidebar-user">
              <div className="user-avatar">{role==="admin"?"AD":"EM"}</div>
              <div>
                <div className="user-name">{role==="admin"?"Admin User":"Arjun Sharma"}</div>
                <div className="user-role">{role==="admin"?"Higher Official":"Developer"}</div>
              </div>
            </div>
          </aside>

          <div className="main">
            <div className="topbar">
              <div className="topbar-title">{PAGE_TITLES[page]}</div>
              <div className="topbar-right">
                <span className="role-badge">{role==="admin"?"ADMIN":"EMPLOYEE"}</span>
                {role==="admin" && <button className="topbar-btn primary" onClick={()=>setShowNewProject(true)}>+ New Project</button>}
                <button className="topbar-btn" onClick={()=>setLoggedIn(false)}>🚪 Logout</button>
              </div>
            </div>

            {page==="dashboard" && <DashboardPage />}
            {page==="projects" && <ProjectsPage role={role} onNewProject={()=>setShowNewProject(true)} />}
            {page==="prediction" && <PredictionPage />}
            {page==="employees" && <EmployeesPage role={role} />}
            {page==="github" && <GitHubPage />}
            {page==="risk" && <RiskPage />}
            {page==="reports" && <ReportsPage role={role} />}
          </div>

          {showNewProject && <NewProjectModal onClose={()=>setShowNewProject(false)} />}
        </div>
      )}
    </>
  );
}
