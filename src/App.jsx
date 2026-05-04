import { useState } from "react";

const API_URL = "https://api.anthropic.com/v1/messages";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Nunito:wght@400;500;600;700;800&display=swap');

  :root {
    --teal: #00C2A8;
    --teal-dark: #009A85;
    --teal-glow: rgba(0,194,168,0.18);
    --lime: #C8FF00;
    --ink: #06100E;
    --ink-mid: #0D1F1C;
    --ink-soft: #162420;
    --saffron: #FF9933;
    --saffron-glow: rgba(255,153,51,0.15);
    --india-green: #138808;
    --white: #FFFFFF;
    --gray: #6B8A86;
    --gray-light: #B0CECA;
    --danger: #FF4D6D;
    --success: #00C27A;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Nunito', sans-serif; background: var(--ink); color: var(--white); overflow-x: hidden; }

  /* TRICOLOR TOP BAR */
  .tribar { display: flex; height: 4px; position: fixed; top: 0; left: 0; right: 0; z-index: 201; }
  .tribar .s { flex: 1; background: var(--saffron); }
  .tribar .w { flex: 1; background: var(--white); }
  .tribar .g { flex: 1; background: var(--india-green); }

  /* NAV */
  .nav {
    position: fixed; top: 4px; left: 0; right: 0; z-index: 200;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.9rem 3rem;
    background: rgba(6,16,14,0.96); backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0,194,168,0.12);
  }
  .logo-wrap { display: flex; align-items: center; gap: 0.7rem; }
  .logo-icon { width: 38px; height: 38px; background: var(--teal); border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; box-shadow: 0 0 18px var(--teal-glow); }
  .logo-text { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 900; color: var(--white); letter-spacing: -0.5px; }
  .logo-text span { color: var(--teal); }
  .logo-sub { font-size: 0.5rem; color: var(--gray); letter-spacing: 2.5px; text-transform: uppercase; font-weight: 600; margin-top: 1px; }
  .nav-links { display: flex; gap: 0.2rem; }
  .nl { color: var(--gray-light); text-decoration: none; font-size: 0.83rem; font-weight: 700; padding: 0.4rem 0.9rem; border-radius: 50px; transition: all 0.25s; }
  .nl:hover { color: var(--teal); background: var(--teal-glow); }
  .nav-cta { background: var(--saffron); color: var(--ink); font-family: 'Nunito', sans-serif; font-size: 0.83rem; font-weight: 800; padding: 0.55rem 1.3rem; border-radius: 50px; border: none; cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.3s; box-shadow: 0 0 18px var(--saffron-glow); }
  .nav-cta:hover { background: var(--lime); transform: scale(1.05); }
  .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; }
  .hamburger span { width: 22px; height: 2px; background: var(--white); border-radius: 2px; display: block; }
  .mob-menu { display: none; position: fixed; top: 69px; left: 0; right: 0; background: rgba(6,16,14,0.98); padding: 1.5rem 2rem; z-index: 199; flex-direction: column; gap: 0.5rem; border-bottom: 1px solid rgba(0,194,168,0.12); }
  .mob-menu.open { display: flex; }
  .mob-menu a { color: var(--gray-light); text-decoration: none; font-size: 1rem; font-weight: 700; padding: 0.6rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); }

  /* HERO */
  .hero { min-height: 100vh; padding: 9rem 3rem 5rem; display: grid; grid-template-columns: 1.1fr 0.9fr; align-items: center; gap: 4rem; position: relative; overflow: hidden; }
  .hero-bg { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse 55% 50% at 75% 25%, rgba(255,153,51,0.1) 0%, transparent 60%), radial-gradient(ellipse 45% 55% at 15% 85%, rgba(0,194,168,0.1) 0%, transparent 60%); }
  .hero-grid { position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(rgba(0,194,168,0.03) 1px,transparent 1px), linear-gradient(90deg,rgba(0,194,168,0.03) 1px,transparent 1px); background-size: 55px 55px; }

  .eyebrow { display: inline-flex; align-items: center; gap: 0.6rem; background: rgba(255,153,51,0.12); border: 1px solid rgba(255,153,51,0.3); color: var(--saffron); font-size: 0.7rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; padding: 0.4rem 1rem; border-radius: 50px; margin-bottom: 1.6rem; animation: fadeUp 0.7s ease both; }
  .live-dot { width: 7px; height: 7px; background: var(--saffron); border-radius: 50%; animation: pulse 1.5s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.6);opacity:0.5;} }

  .hero h1 { font-family: 'Syne', sans-serif; font-size: clamp(2.8rem, 5vw, 5.2rem); font-weight: 900; line-height: 1.0; letter-spacing: -2px; margin-bottom: 1.2rem; animation: fadeUp 0.8s 0.1s ease both; }
  .h-line1 { display: block; color: var(--white); }
  .h-line2 { display: block; color: var(--teal); }
  .h-line3 { display: block; background: linear-gradient(90deg, var(--saffron), var(--teal)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

  .hero-sub { font-size: 1rem; color: var(--gray-light); line-height: 1.8; max-width: 470px; margin-bottom: 2.2rem; animation: fadeUp 0.8s 0.2s ease both; }
  .hero-sub strong { color: var(--saffron); }
  .hero-sub em { color: var(--teal); font-style: normal; font-weight: 700; }

  .hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; animation: fadeUp 0.8s 0.3s ease both; }
  .btn-saffron { background: var(--saffron); color: var(--ink); font-family: 'Nunito', sans-serif; font-size: 0.95rem; font-weight: 800; padding: 0.9rem 2.2rem; border-radius: 14px; border: none; cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.3s; box-shadow: 0 0 24px var(--saffron-glow); }
  .btn-saffron:hover { background: var(--lime); transform: translateY(-3px); box-shadow: 0 8px 28px rgba(200,255,0,0.3); }
  .btn-ghost { background: transparent; color: var(--gray-light); font-family: 'Nunito', sans-serif; font-size: 0.95rem; font-weight: 700; padding: 0.9rem 2.2rem; border-radius: 14px; border: 1.5px solid rgba(255,255,255,0.1); cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.3s; }
  .btn-ghost:hover { border-color: var(--teal); color: var(--teal); background: var(--teal-glow); }

  /* PHONE MOCKUP */
  .hero-right { position: relative; animation: fadeUp 0.9s 0.2s ease both; }
  .phone { width: 270px; margin: 0 auto; background: var(--ink-mid); border: 1px solid rgba(255,153,51,0.2); border-radius: 36px; overflow: hidden; box-shadow: 0 0 50px rgba(255,153,51,0.12), 0 40px 80px rgba(0,0,0,0.5); }
  .phone-top { height: 28px; background: var(--ink); border-radius: 0 0 14px 14px; width: 90px; margin: 0 auto; }
  .phone-body { padding: 1.1rem 1.1rem 2rem; }
  .app-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.1rem; }
  .app-name { font-family: 'Syne', sans-serif; font-size: 0.9rem; font-weight: 900; }
  .app-name span { color: var(--teal); }
  .app-badge { background: rgba(255,153,51,0.15); color: var(--saffron); font-size: 0.6rem; font-weight: 900; padding: 0.2rem 0.5rem; border-radius: 50px; border: 1px solid rgba(255,153,51,0.3); }
  .buddy-block { background: var(--ink-soft); border-radius: 14px; padding: 0.9rem; margin-bottom: 0.7rem; border: 1px solid rgba(0,194,168,0.1); animation: floatY 3s ease-in-out infinite; }
  .bb-top { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem; }
  .bb-av { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--teal), var(--teal-dark)); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
  .bb-name { font-size: 0.8rem; font-weight: 800; color: var(--white); }
  .bb-sub { font-size: 0.6rem; color: var(--gray); }
  .bb-stars { color: var(--lime); font-size: 0.65rem; font-weight: 900; }
  .bb-eta { margin-left: auto; background: rgba(200,255,0,0.1); color: var(--lime); font-size: 0.6rem; font-weight: 900; padding: 0.2rem 0.5rem; border-radius: 50px; border: 1px solid rgba(200,255,0,0.2); }
  .bb-tags { display: flex; gap: 0.35rem; flex-wrap: wrap; }
  .bb-tag { background: rgba(0,194,168,0.1); color: var(--teal); font-size: 0.55rem; font-weight: 800; padding: 0.18rem 0.45rem; border-radius: 50px; }
  .loc-bar { background: var(--ink-soft); border-radius: 11px; padding: 0.6rem; display: flex; align-items: center; gap: 0.5rem; border: 1px solid rgba(255,255,255,0.04); }
  .loc-dot { width: 7px; height: 7px; background: var(--saffron); border-radius: 50%; flex-shrink: 0; box-shadow: 0 0 8px var(--saffron); }
  .loc-t { font-size: 0.65rem; color: var(--gray-light); font-weight: 600; }
  .loc-badge { margin-left: auto; background: var(--teal); color: var(--ink); font-size: 0.57rem; font-weight: 900; padding: 0.18rem 0.5rem; border-radius: 50px; }

  .float-chip { position: absolute; background: var(--ink-mid); border: 1px solid rgba(255,153,51,0.2); border-radius: 11px; padding: 0.45rem 0.8rem; display: flex; align-items: center; gap: 0.4rem; font-size: 0.7rem; font-weight: 700; color: var(--white); box-shadow: 0 8px 24px rgba(0,0,0,0.3); white-space: nowrap; }
  .fc1 { top: 5px; right: -85px; animation: floatY 3.5s 0.4s ease-in-out infinite; }
  .fc2 { bottom: 80px; left: -95px; animation: floatY 4s 0.8s ease-in-out infinite; }
  .chip-dot { width: 6px; height: 6px; border-radius: 50%; }
  .chip-dot.s { background: var(--saffron); }
  .chip-dot.t { background: var(--teal); }

  /* STATS TICKER */
  .ticker { background: linear-gradient(90deg, var(--saffron), #FF7700, var(--saffron)); background-size: 200% 100%; animation: shimmer 3s ease-in-out infinite; padding: 1rem 3rem; display: flex; justify-content: space-around; flex-wrap: wrap; gap: 0.5rem; }
  @keyframes shimmer { 0%,100%{background-position:0%} 50%{background-position:100%} }
  .t-item { display: flex; align-items: center; gap: 0.5rem; }
  .t-n { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 900; color: var(--ink); }
  .t-l { font-size: 0.68rem; font-weight: 800; color: rgba(6,16,14,0.65); text-transform: uppercase; letter-spacing: 0.4px; }
  .t-sep { width: 1px; height: 28px; background: rgba(6,16,14,0.15); }

  /* CITY STRIP */
  .city-strip { background: var(--ink-mid); border-top: 1px solid rgba(0,194,168,0.1); border-bottom: 1px solid rgba(0,194,168,0.1); padding: 1rem 3rem; display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap; }
  .city-strip span { font-size: 0.75rem; color: var(--gray); font-weight: 600; }
  .city-pill { background: rgba(0,194,168,0.08); border: 1px solid rgba(0,194,168,0.18); color: var(--teal); font-size: 0.7rem; font-weight: 800; padding: 0.25rem 0.75rem; border-radius: 50px; }

  /* SECTION BASE */
  .section { padding: 5.5rem 3rem; }
  .sl { font-size: 0.68rem; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; color: var(--saffron); margin-bottom: 0.5rem; }
  .st { font-family: 'Syne', sans-serif; font-size: clamp(1.8rem, 3vw, 2.9rem); font-weight: 900; letter-spacing: -1px; line-height: 1.1; margin-bottom: 0.7rem; }
  .ss { font-size: 0.93rem; color: var(--gray); line-height: 1.7; max-width: 500px; }
  .sh { margin-bottom: 3rem; }

  /* SERVICES */
  .svc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.3rem; }
  .svc { background: var(--ink-mid); border: 1px solid rgba(255,255,255,0.05); border-radius: 18px; padding: 2rem; transition: all 0.3s; position: relative; overflow: hidden; }
  .svc::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--saffron), var(--teal), var(--india-green)); transform: scaleX(0); transform-origin: left; transition: transform 0.35s; }
  .svc:hover { border-color: rgba(255,153,51,0.25); transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
  .svc:hover::after { transform: scaleX(1); }
  .svc-iw { width: 50px; height: 50px; border-radius: 13px; background: rgba(255,153,51,0.1); border: 1px solid rgba(255,153,51,0.2); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1.1rem; }
  .svc-t { font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 900; margin-bottom: 0.5rem; }
  .svc-d { font-size: 0.82rem; color: var(--gray); line-height: 1.65; }
  .svc-chip { display: inline-block; margin-top: 0.8rem; background: rgba(200,255,0,0.08); color: var(--lime); font-size: 0.65rem; font-weight: 800; padding: 0.2rem 0.65rem; border-radius: 50px; border: 1px solid rgba(200,255,0,0.18); }

  /* HOW IT WORKS */
  .how { background: var(--ink-mid); padding: 5.5rem 3rem; }
  .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(195px, 1fr)); gap: 1.2rem; margin-top: 2.5rem; }
  .step { padding: 2rem 1.5rem; border-radius: 16px; background: var(--ink-soft); border: 1px solid rgba(0,194,168,0.08); text-align: center; transition: all 0.3s; }
  .step:hover { border-color: rgba(255,153,51,0.3); box-shadow: 0 0 24px var(--saffron-glow); }
  .step-n { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--saffron), #FF6600); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 900; color: var(--ink); margin: 0 auto 1rem; box-shadow: 0 0 14px var(--saffron-glow); }
  .step-i { font-size: 1.8rem; margin-bottom: 0.7rem; display: block; }
  .step-t { font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 900; margin-bottom: 0.4rem; }
  .step-d { font-size: 0.76rem; color: var(--gray); line-height: 1.6; }

  /* PRICING */
  .pricing { padding: 5.5rem 3rem; background: var(--ink); }
  .price-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.3rem; margin-top: 2.5rem; }
  .pc { background: var(--ink-mid); border-radius: 20px; padding: 2.2rem 2rem; border: 1.5px solid rgba(255,255,255,0.06); text-align: center; position: relative; transition: all 0.3s; overflow: hidden; }
  .pc.feat { background: var(--saffron); border-color: var(--saffron); box-shadow: 0 0 60px var(--saffron-glow); }
  .pc:not(.feat):hover { border-color: rgba(255,153,51,0.35); transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.3); }
  .feat-badge { position: absolute; top: 0; left: 50%; transform: translateX(-50%); background: var(--lime); color: var(--ink); font-size: 0.62rem; font-weight: 900; padding: 0.28rem 1rem; border-radius: 0 0 10px 10px; letter-spacing: 1px; text-transform: uppercase; }
  .pc-e { font-size: 2rem; display: block; margin: 0.5rem 0 0.7rem; }
  .pc-n { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 900; margin-bottom: 0.2rem; }
  .pc:not(.feat) .pc-n { color: var(--white); }
  .feat .pc-n { color: var(--ink); }
  .pc-p { font-family: 'Syne', sans-serif; font-size: 2.6rem; font-weight: 900; margin: 0.6rem 0 0.2rem; letter-spacing: -1px; }
  .pc:not(.feat) .pc-p { color: var(--teal); }
  .feat .pc-p { color: var(--ink); }
  .pc-per { font-size: 0.73rem; margin-bottom: 1.3rem; }
  .pc:not(.feat) .pc-per { color: var(--gray); }
  .feat .pc-per { color: rgba(6,16,14,0.6); }
  .pc-list { list-style: none; text-align: left; margin-bottom: 1.8rem; display: flex; flex-direction: column; gap: 0.5rem; }
  .pc-list li { font-size: 0.8rem; display: flex; align-items: flex-start; gap: 0.5rem; }
  .pc:not(.feat) .pc-list li { color: var(--gray-light); }
  .feat .pc-list li { color: rgba(6,16,14,0.8); }
  .pc-list li::before { content: '✓'; font-weight: 900; flex-shrink: 0; }
  .pc:not(.feat) .pc-list li::before { color: var(--saffron); }
  .feat .pc-list li::before { color: var(--ink); }
  .pc-btn { display: block; width: 100%; text-align: center; text-decoration: none; padding: 0.82rem; border-radius: 12px; font-family: 'Nunito', sans-serif; font-size: 0.88rem; font-weight: 800; transition: all 0.3s; border: none; cursor: pointer; }
  .pc:not(.feat) .pc-btn { background: rgba(255,153,51,0.1); color: var(--saffron); border: 1px solid rgba(255,153,51,0.25); }
  .pc:not(.feat) .pc-btn:hover { background: var(--saffron); color: var(--ink); }
  .feat .pc-btn { background: var(--ink); color: var(--saffron); }
  .feat .pc-btn:hover { background: var(--lime); color: var(--ink); }

  /* BOOKING */
  .booking { padding: 5.5rem 3rem; background: var(--ink-mid); display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
  .book-info h2 { font-family: 'Syne', sans-serif; font-size: 2.1rem; font-weight: 900; letter-spacing: -1px; line-height: 1.15; margin-bottom: 1rem; }
  .book-info h2 span { color: var(--teal); }
  .book-info p { color: var(--gray); line-height: 1.75; margin-bottom: 2rem; font-size: 0.9rem; }
  .perks { display: flex; flex-direction: column; gap: 0.9rem; }
  .perk { display: flex; align-items: flex-start; gap: 0.9rem; }
  .perk-b { width: 40px; height: 40px; border-radius: 11px; background: rgba(255,153,51,0.1); border: 1px solid rgba(255,153,51,0.2); display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
  .perk strong { display: block; font-size: 0.85rem; font-weight: 800; color: var(--white); margin-bottom: 0.1rem; }
  .perk span { font-size: 0.76rem; color: var(--gray); line-height: 1.4; }

  /* FORM */
  .form-box { background: var(--ink-soft); border-radius: 22px; padding: 2.5rem; border: 1px solid rgba(255,153,51,0.12); box-shadow: 0 0 40px rgba(0,0,0,0.3); }
  .form-title { font-family: 'Syne', sans-serif; font-size: 1.35rem; font-weight: 900; margin-bottom: 1.5rem; letter-spacing: -0.5px; }
  .fg { margin-bottom: 0.95rem; }
  .fg label { display: block; font-size: 0.68rem; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: var(--gray); margin-bottom: 0.3rem; }
  .fg input, .fg select, .fg textarea { width: 100%; padding: 0.72rem 0.95rem; background: var(--ink-mid); border: 1.5px solid rgba(255,255,255,0.07); border-radius: 11px; font-family: 'Nunito', sans-serif; font-size: 0.86rem; color: var(--white); outline: none; transition: all 0.3s; }
  .fg input::placeholder, .fg textarea::placeholder { color: var(--gray); }
  .fg select option { background: var(--ink-mid); }
  .fg input:focus, .fg select:focus, .fg textarea:focus { border-color: var(--saffron); box-shadow: 0 0 0 3px rgba(255,153,51,0.1); }
  .fg input.err, .fg select.err { border-color: var(--danger); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; }
  .checks { display: flex; flex-wrap: wrap; gap: 0.45rem; margin-top: 0.35rem; }
  .ck { padding: 0.35rem 0.8rem; border-radius: 50px; border: 1.5px solid rgba(255,255,255,0.09); background: var(--ink-mid); font-family: 'Nunito', sans-serif; font-size: 0.74rem; font-weight: 700; cursor: pointer; color: var(--gray-light); transition: all 0.2s; }
  .ck.on { background: var(--saffron); color: var(--ink); border-color: var(--saffron); font-weight: 800; }
  .ck:hover:not(.on) { border-color: var(--saffron); color: var(--saffron); }
  .sub-btn { width: 100%; padding: 1rem; margin-top: 0.5rem; background: var(--saffron); color: var(--ink); border: none; border-radius: 13px; font-family: 'Nunito', sans-serif; font-size: 1rem; font-weight: 800; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 0 20px var(--saffron-glow); }
  .sub-btn:hover:not(:disabled) { background: var(--lime); transform: translateY(-1px); }
  .sub-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  /* AI STATUS */
  .ai-box { margin-top: 1rem; padding: 1.1rem; border-radius: 13px; font-size: 0.82rem; line-height: 1.7; animation: fadeUp 0.4s ease; border: 1px solid; }
  .ai-box.loading { background: rgba(0,194,168,0.06); border-color: rgba(0,194,168,0.2); color: var(--gray-light); }
  .ai-box.ok { background: rgba(0,194,122,0.06); border-color: rgba(0,194,122,0.22); color: var(--gray-light); }
  .ai-box.fail { background: rgba(255,77,109,0.06); border-color: rgba(255,77,109,0.22); color: var(--gray-light); }
  .ai-lbl { font-size: 0.62rem; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 0.4rem; display: block; }
  .ai-box.loading .ai-lbl { color: var(--teal); }
  .ai-box.ok .ai-lbl { color: var(--success); }
  .ai-box.fail .ai-lbl { color: var(--danger); }

  .h-card { background: var(--ink-mid); border-radius: 13px; padding: 0.95rem; border: 1px solid rgba(255,153,51,0.2); margin-top: 1rem; display: flex; align-items: center; gap: 0.9rem; animation: popIn 0.4s cubic-bezier(.34,1.56,.64,1); }
  .h-av { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--saffron), #FF6600); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; box-shadow: 0 0 14px var(--saffron-glow); }
  .h-name { font-family: 'Syne', sans-serif; font-size: 0.9rem; font-weight: 900; color: var(--white); margin-bottom: 0.1rem; }
  .h-meta { font-size: 0.7rem; color: var(--gray); }
  .h-stars { color: var(--lime); font-size: 0.7rem; font-weight: 800; margin-left: 0.3rem; }
  .h-onway { margin-left: auto; background: rgba(200,255,0,0.1); border: 1px solid rgba(200,255,0,0.22); color: var(--lime); font-size: 0.62rem; font-weight: 800; padding: 0.22rem 0.55rem; border-radius: 50px; white-space: nowrap; }

  .spin { width: 17px; height: 17px; border: 2.5px solid rgba(6,16,14,0.3); border-top-color: var(--ink); border-radius: 50%; animation: spin 0.75s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* TRUST */
  .trust { background: var(--ink-mid); padding: 3rem; border-top: 1px solid rgba(255,255,255,0.04); }
  .trust-inner { display: flex; align-items: center; justify-content: space-around; flex-wrap: wrap; gap: 2rem; }
  .trust-item { text-align: center; }
  .trust-icon { font-size: 2rem; margin-bottom: 0.4rem; display: block; }
  .trust-t { font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 900; margin-bottom: 0.2rem; }
  .trust-d { font-size: 0.72rem; color: var(--gray); }
  .trust-sep { width: 1px; height: 50px; background: rgba(255,255,255,0.06); }

  /* TESTIMONIALS */
  .testi { padding: 5.5rem 3rem; background: var(--ink); }
  .testi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(255px, 1fr)); gap: 1.2rem; margin-top: 2.5rem; }
  .t-card { background: var(--ink-mid); border-radius: 16px; padding: 1.7rem; border: 1px solid rgba(255,255,255,0.05); transition: all 0.3s; }
  .t-card:hover { border-color: rgba(255,153,51,0.22); transform: translateY(-3px); box-shadow: 0 12px 28px rgba(0,0,0,0.25); }
  .t-stars { color: var(--saffron); font-size: 0.85rem; margin-bottom: 0.7rem; }
  .t-q { font-size: 0.83rem; color: var(--gray-light); line-height: 1.72; margin-bottom: 1rem; font-style: italic; }
  .t-person { display: flex; align-items: center; gap: 0.65rem; }
  .t-av { width: 34px; height: 34px; border-radius: 50%; background: var(--saffron); display: flex; align-items: center; justify-content: center; font-size: 1rem; }
  .t-name { font-size: 0.8rem; font-weight: 800; color: var(--white); }
  .t-loc { font-size: 0.68rem; color: var(--gray); }

  /* FOOTER */
  footer { background: var(--ink); border-top: 1px solid rgba(255,255,255,0.05); padding: 4rem 3rem 2rem; }
  .f-tribar { display: flex; height: 3px; margin-bottom: 1.5rem; border-radius: 2px; overflow: hidden; }
  .f-tribar .s { flex:1; background: var(--saffron); }
  .f-tribar .w { flex:1; background: rgba(255,255,255,0.5); }
  .f-tribar .g { flex:1; background: var(--india-green); }
  .f-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 2.5rem; margin-bottom: 2.5rem; }
  .f-brand p { font-size: 0.78rem; color: var(--gray); line-height: 1.7; margin-top: 0.8rem; max-width: 260px; }
  .fc h4 { font-size: 0.68rem; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gray); margin-bottom: 0.9rem; }
  .fc ul { list-style: none; display: flex; flex-direction: column; gap: 0.45rem; }
  .fc a { color: rgba(255,255,255,0.38); text-decoration: none; font-size: 0.78rem; font-weight: 600; transition: color 0.2s; }
  .fc a:hover { color: var(--saffron); }
  .f-bottom { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.3rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.73rem; color: var(--gray); flex-wrap: wrap; gap: 0.5rem; }
  .f-teal { color: var(--teal); font-weight: 800; }
  .f-saff { color: var(--saffron); font-weight: 800; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
  @keyframes floatY { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
  @keyframes popIn { from{opacity:0;transform:scale(0.82);} to{opacity:1;transform:scale(1);} }

  @media(max-width:860px){
    .nav { padding: 0.9rem 1.5rem; }
    .nav-links, .nav-cta { display: none; }
    .hamburger { display: flex; }
    .hero { grid-template-columns: 1fr; padding: 8rem 1.5rem 4rem; text-align: center; gap: 2.5rem; }
    .hero-sub { margin: 0 auto 1.5rem; }
    .hero-btns { justify-content: center; }
    .hero-right { display: flex; justify-content: center; }
    .phone { width: 240px; }
    .fc1, .fc2 { display: none; }
    .ticker { padding: 1rem; }
    .t-sep { display: none; }
    .city-strip { gap: 0.8rem; padding: 1rem 1.5rem; }
    .section, .how, .pricing, .testi, .trust { padding: 4rem 1.5rem; }
    .booking { grid-template-columns: 1fr; gap: 2.5rem; padding: 4rem 1.5rem; }
    .form-row { grid-template-columns: 1fr; }
    .f-grid { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .f-bottom { flex-direction: column; text-align: center; }
    .trust-sep { display: none; }
    .trust-inner { gap: 1.2rem; }
  }
`;

const MALLS = [
  "Phoenix Palassio – Lucknow", "Select CITYWALK – New Delhi",
  "Lulu Mall – Kochi", "Inorbit Mall – Mumbai",
  "Forum Mall – Bengaluru", "Nexus Elante – Chandigarh",
  "Sarath City Capital – Hyderabad", "VR Mall – Chennai",
  "Seasons Mall – Pune", "South City Mall – Kolkata",
  "Ambience Mall – Gurugram", "Pacific Mall – Delhi",
  "Orion Mall – Bengaluru", "Fun Republic – Ahmedabad",
  "Outdoor Event / Fair / Expo",
];

const SVCS = [
  { id: "bags",     label: "👜 Bag Carrying" },
  { id: "stroller", label: "🍼 Stroller Help" },
  { id: "heavy",    label: "📦 Heavy Items" },
  { id: "car",      label: "🚗 Car Loading" },
  { id: "guide",    label: "🗺️ Mall Guide" },
];

const PLANS = [
  { id: "quick",  txt: "Quick Lug – ₹149/hr" },
  { id: "half",   txt: "Half Day – ₹399" },
  { id: "family", txt: "Family Pack – ₹699/day" },
];

const HELPERS = [
  { e: "🧑", name: "Ravi Kumar",   rating: "4.9★", trips: "380 trips", eta: "3 min away" },
  { e: "👩", name: "Priya Sharma", rating: "5.0★", trips: "510 trips", eta: "2 min away" },
  { e: "👨", name: "Amit Singh",   rating: "4.8★", trips: "270 trips", eta: "4 min away" },
  { e: "👩", name: "Sunita Devi",  rating: "4.9★", trips: "640 trips", eta: "2 min away" },
];

export default function App() {
  const [mobOpen, setMobOpen] = useState(false);
  const [svcs, setSvcs]       = useState([]);
  const [plan, setPlan]       = useState("quick");
  const [form, setForm]       = useState({ name:"", phone:"", email:"", location:"", date:"", time:"", notes:"" });
  const [errors, setErrors]   = useState({});
  const [status, setStatus]   = useState(null);
  const [aiMsg, setAiMsg]     = useState("");
  const [helper, setHelper]   = useState(null);
  const today = new Date().toISOString().split("T")[0];

  const tog = id => setSvcs(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  function validate() {
    const e = {};
    if (!form.name.trim())  e.name     = true;
    if (!form.phone.trim()) e.phone    = true;
    if (!form.location)     e.location = true;
    if (!form.date)         e.date     = true;
    if (!form.time)         e.time     = true;
    if (!svcs.length)       e.svcs     = true;
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function submit() {
    if (!validate()) return;
    setStatus("loading"); setAiMsg(""); setHelper(null);
    const selSvcs = svcs.map(id => SVCS.find(s => s.id === id)?.label).join(", ");
    const selPlan = PLANS.find(p => p.id === plan)?.txt;
    const h = HELPERS[Math.floor(Math.random() * HELPERS.length)];
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are LugBuddy India's friendly AI booking assistant. 
Write a warm, professional 3-4 sentence booking confirmation in English only.
Include: greet by first name, confirm buddy is matched, mention their services, give one useful tip for their specific Indian mall.
Use ₹ for currency. End with "Happy Shopping! 🛍️🇮🇳"`,
          messages: [{
            role: "user",
            content: `New booking:
Name: ${form.name}
Phone: ${form.phone}
Mall: ${form.location}
Date/Time: ${form.date} at ${form.time}
Services: ${selSvcs}
Plan: ${selPlan}
Buddy: ${h.name} (${h.rating}, ${h.trips})
Notes: ${form.notes || "None"}
Write the confirmation.`
          }]
        })
      });
      const data = await res.json();
      const msg = data.content?.find(b => b.type === "text")?.text || "Booking confirmed! Your buddy is on the way.";
      setAiMsg(msg); setHelper(h); setStatus("ok");
    } catch {
      setStatus("fail");
      setAiMsg("Something went wrong. Please call us at +91-98765-43210 or try again.");
    }
  }

  return (
    <>
      <style>{STYLES}</style>

      {/* TRICOLOR */}
      <div className="tribar"><div className="s"/><div className="w"/><div className="g"/></div>

      {/* NAV */}
      <nav className="nav">
        <div className="logo-wrap">
          <div className="logo-icon">🧳</div>
          <div>
            <div className="logo-text">Lug<span>Buddy</span></div>
            <div className="logo-sub">lugbuddy.in · 🇮🇳 India</div>
          </div>
        </div>
        <div className="nav-links">
          {[["#services","Services"],["#how","How It Works"],["#pricing","Pricing"],["#reviews","Reviews"]].map(([h,l]) => (
            <a key={l} href={h} className="nl">{l}</a>
          ))}
        </div>
        <a href="#booking" className="nav-cta">Book a Buddy →</a>
        <div className="hamburger" onClick={() => setMobOpen(o => !o)}>
          <span/><span/><span/>
        </div>
      </nav>

      <div className={`mob-menu ${mobOpen ? "open" : ""}`}>
        {[["#services","🛍️ Services"],["#how","📋 How It Works"],["#pricing","💰 Pricing"],["#booking","✅ Book a Buddy"]].map(([h,l]) => (
          <a key={l} href={h} onClick={() => setMobOpen(false)}>{l}</a>
        ))}
      </div>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-bg"/><div className="hero-grid"/>
        <div style={{position:"relative",zIndex:2}}>
          <div className="eyebrow"><div className="live-dot"/> 🇮🇳 Live at 200+ Malls Across India</div>
          <h1>
            <span className="h-line1">Drop the bags.</span>
            <span className="h-line2">Keep the fun.</span>
            <span className="h-line3">LugBuddy.</span>
          </h1>
          <p className="hero-sub">
            Hire a <strong>certified personal shopping helper</strong> on-demand at your favourite Indian mall.
            They carry your bags, push your stroller, hold heavy items —
            you just <em>enjoy the experience</em>.
          </p>
          <div className="hero-btns">
            <a href="#booking" className="btn-saffron">🧳 Book a Buddy Now</a>
            <a href="#how" className="btn-ghost">See How It Works</a>
          </div>
        </div>

        <div className="hero-right">
          <div style={{position:"relative",width:"270px",margin:"0 auto"}}>
            <div className="phone">
              <div className="phone-top"/>
              <div className="phone-body">
                <div className="app-bar">
                  <div className="app-name">Lug<span>Buddy</span> 🇮🇳</div>
                  <div className="app-badge">● LIVE</div>
                </div>
                <div className="buddy-block">
                  <div className="bb-top">
                    <div className="bb-av">👩</div>
                    <div>
                      <div className="bb-name">Priya Sharma</div>
                      <div className="bb-sub">Certified LugBuddy</div>
                      <div className="bb-stars">★★★★★ 5.0</div>
                    </div>
                    <div className="bb-eta">2 min</div>
                  </div>
                  <div className="bb-tags">
                    <span className="bb-tag">👜 Bags</span>
                    <span className="bb-tag">🍼 Stroller</span>
                    <span className="bb-tag">📦 Heavy</span>
                  </div>
                </div>
                <div className="loc-bar">
                  <div className="loc-dot"/>
                  <div className="loc-t">Heading to Mall Entrance A</div>
                  <div className="loc-badge">EN ROUTE</div>
                </div>
              </div>
            </div>
            <div className="float-chip fc1"><div className="chip-dot s"/>Matched in 47s</div>
            <div className="float-chip fc2"><div className="chip-dot t"/>50K+ Happy Shoppers</div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="ticker">
        {[["50K+","Happy Shoppers"],["200+","Malls & Events"],["4.9★","Avg Rating"],["< 5min","Buddy Arrival"],["100%","Verified"]].map(([n,l],i,a) => (
          <div key={l} style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
            <div className="t-item"><div className="t-n">{n}</div><div className="t-l">{l}</div></div>
            {i < a.length-1 && <div className="t-sep"/>}
          </div>
        ))}
      </div>

      {/* CITIES */}
      <div className="city-strip">
        <span>Available in:</span>
        {["Delhi","Mumbai","Bengaluru","Hyderabad","Chennai","Kochi","Kolkata","Pune","Lucknow","Chandigarh"].map(c => (
          <span className="city-pill" key={c}>{c}</span>
        ))}
      </div>

      {/* SERVICES */}
      <section className="section" id="services" style={{background:"var(--ink)"}}>
        <div className="sh">
          <div className="sl">What We Offer</div>
          <h2 className="st">Your buddy handles it.<br/>You enjoy the shopping.</h2>
          <p className="ss">From bags to strollers — our trained, verified buddies are ready for every shopping need across India's top malls.</p>
        </div>
        <div className="svc-grid">
          {[
            { i:"👜", t:"Bag Carrying",        chip:"Most Popular",    d:"Your buddy carries every shopping bag from store to store — no more sore arms or struggling to the car park." },
            { i:"🍼", t:"Stroller Assistance",  chip:"Families Love This", d:"Crowded malls are no problem. Our buddies steer your stroller through every floor so you can browse freely." },
            { i:"📦", t:"Heavy Item Holding",   chip:"Always Available", d:"Electronics, appliances, large boxes — we hold all your bulky purchases until you are ready to leave." },
            { i:"🗺️", t:"Mall Navigation Guide",chip:"Free Add-On",     d:"New to the mall? Your buddy knows every store, food court, exit, and shortcut — your personal insider guide." },
            { i:"🚗", t:"Car Escort & Loading", chip:"In Premium Plan",  d:"We walk you to your vehicle and load every bag safely. The perfect end to a perfect shopping trip." },
            { i:"🎪", t:"Events & Outdoor Fairs",chip:"Outdoor Ready",  d:"Farmers markets, expos, festivals, holiday fairs — LugBuddy shows up wherever the shopping happens." },
          ].map(({ i, t, chip, d }) => (
            <div className="svc" key={t}>
              <div className="svc-iw">{i}</div>
              <div className="svc-t">{t}</div>
              <p className="svc-d">{d}</p>
              <span className="svc-chip">{chip}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how" id="how">
        <div className="sh">
          <div className="sl">Simple Process</div>
          <h2 className="st">Your buddy ready<br/>in under 5 minutes.</h2>
          <p className="ss">From booking to buddy arrival — faster than finding a parking spot.</p>
        </div>
        <div className="steps">
          {[
            { n:"01", i:"📍", t:"Choose Your Venue",   d:"Select from 200+ malls and events across India. We are already on-site at most locations." },
            { n:"02", i:"🛎️", t:"Pick Your Services",  d:"Bags, stroller, heavy items — mix and match exactly what you need for today's trip." },
            { n:"03", i:"🤖", t:"AI Matches You",      d:"Our system finds the closest available, highest-rated buddy near you in seconds." },
            { n:"04", i:"🛍️", t:"Shop Hands-Free",    d:"Your buddy stays by your side the entire trip. Hands empty, smile full." },
          ].map(({ n, i, t, d }) => (
            <div className="step" key={n}>
              <div className="step-n">{n}</div>
              <span className="step-i">{i}</span>
              <div className="step-t">{t}</div>
              <p className="step-d">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing" id="pricing">
        <div className="sh">
          <div className="sl">Simple Pricing</div>
          <h2 className="st">No surprises.<br/>No hidden charges.</h2>
          <p className="ss">Flat rates, zero hidden fees. Pay your buddy at the mall — no advance payment needed.</p>
        </div>
        <div className="price-grid">
          {[
            { id:"quick",  e:"🧺", n:"Quick Lug",       p:"₹149", per:"per hour · 1–2 hrs",         feat:false, items:["1 service type","Up to 5 bags","1 buddy assigned","In-mall coverage","Standard arrival"] },
            { id:"half",   e:"🧳", n:"Half Day Buddy",   p:"₹399", per:"half day · up to 4 hours",   feat:true,  items:["All services included","Unlimited bags","Stroller assistance","Car loading","Under 3 min arrival"] },
            { id:"family", e:"👨‍👩‍👧", n:"Family Pack",    p:"₹699", per:"full day · up to 8 hours",   feat:false, items:["2 buddies assigned","Stroller + bags + heavy items","Navigation guide","Car escort & loading","VIP instant match"] },
          ].map(p => (
            <div className={`pc ${p.feat ? "feat" : ""}`} key={p.id}>
              {p.feat && <div className="feat-badge">✦ Most Popular</div>}
              <span className="pc-e">{p.e}</span>
              <div className="pc-n">{p.n}</div>
              <div className="pc-p">{p.p}</div>
              <div className="pc-per">{p.per}</div>
              <ul className="pc-list">{p.items.map(f => <li key={f}>{f}</li>)}</ul>
              <a href="#booking" className="pc-btn" onClick={() => setPlan(p.id)}>Choose Plan →</a>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST BADGES */}
      <div className="trust">
        <div className="trust-inner">
          {[
            { i:"🛡️", t:"100% Verified",        d:"Background checked & trained" },
            { i:"⚡",  t:"3–5 Min Arrival",      d:"Fastest matching in India" },
            { i:"🇮🇳", t:"Made in India",         d:"Proudly Indian service" },
            { i:"📞",  t:"24/7 Support",          d:"+91-98765-43210" },
            { i:"💸",  t:"Pay at Mall",           d:"No advance payment needed" },
          ].map(({ i, t, d }, idx, a) => (
            <div key={t} style={{display:"flex",alignItems:"center",gap:"2rem"}}>
              <div className="trust-item">
                <span className="trust-icon">{i}</span>
                <div className="trust-t">{t}</div>
                <div className="trust-d">{d}</div>
              </div>
              {idx < a.length - 1 && <div className="trust-sep"/>}
            </div>
          ))}
        </div>
      </div>

      {/* BOOKING */}
      <section className="booking" id="booking">
        <div className="book-info">
          <div className="sl">Book Your Buddy</div>
          <h2>Ready in <span>60 seconds.</span></h2>
          <p>Fill in a few quick details and our AI will match you with the best available buddy at your location. Same-day bookings always welcome.</p>
          <div className="perks">
            {[
              { i:"🔒", t:"100% Safe & Verified",    d:"Every buddy passes background checks, ID verification and in-person training" },
              { i:"⚡", t:"AI-Powered Matching",      d:"Real-time matching finds your closest, highest-rated buddy in seconds" },
              { i:"💬", t:"Cancel Anytime",           d:"Cancel up to 30 minutes before — no charge, no questions asked" },
              { i:"🏦", t:"Pay at the Mall",          d:"No advance payment — pay your buddy only after they arrive" },
            ].map(({ i, t, d }) => (
              <div className="perk" key={t}>
                <div className="perk-b">{i}</div>
                <div><strong>{t}</strong><span>{d}</span></div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-box">
          <div className="form-title">🧳 Book Your Buddy</div>

          <div className="form-row">
            <div className="fg">
              <label>Your Name *</label>
              <input className={errors.name ? "err" : ""} placeholder="Rahul Sharma" value={form.name}
                onChange={e => setForm(f => ({...f, name: e.target.value}))}/>
            </div>
            <div className="fg">
              <label>Phone Number *</label>
              <input className={errors.phone ? "err" : ""} placeholder="+91 98765 43210" value={form.phone}
                onChange={e => setForm(f => ({...f, phone: e.target.value}))}/>
            </div>
          </div>

          <div className="fg">
            <label>Email (Optional)</label>
            <input type="email" placeholder="rahul@email.com" value={form.email}
              onChange={e => setForm(f => ({...f, email: e.target.value}))}/>
          </div>

          <div className="fg">
            <label>Mall / Venue *</label>
            <select className={errors.location ? "err" : ""} value={form.location}
              onChange={e => setForm(f => ({...f, location: e.target.value}))}>
              <option value="">Select your mall or event…</option>
              {MALLS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>

          <div className="form-row">
            <div className="fg">
              <label>Date *</label>
              <input type="date" className={errors.date ? "err" : ""} min={today} value={form.date}
                onChange={e => setForm(f => ({...f, date: e.target.value}))}/>
            </div>
            <div className="fg">
              <label>Time *</label>
              <input type="time" className={errors.time ? "err" : ""} value={form.time}
                onChange={e => setForm(f => ({...f, time: e.target.value}))}/>
            </div>
          </div>

          <div className="fg">
            <label style={{color: errors.svcs ? "var(--danger)" : undefined}}>
              Services Needed * {errors.svcs && "— select at least one"}
            </label>
            <div className="checks">
              {SVCS.map(s => (
                <button key={s.id} className={`ck ${svcs.includes(s.id) ? "on" : ""}`}
                  onClick={() => tog(s.id)}>{s.label}</button>
              ))}
            </div>
          </div>

          <div className="fg">
            <label>Plan</label>
            <select value={plan} onChange={e => setPlan(e.target.value)}>
              {PLANS.map(p => <option key={p.id} value={p.id}>{p.txt}</option>)}
            </select>
          </div>

          <div className="fg">
            <label>Special Notes (Optional)</label>
            <textarea rows={2} placeholder="e.g. I have a double stroller, need help with a large TV..."
              value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}
              style={{resize:"vertical"}}/>
          </div>

          <button className="sub-btn" onClick={submit} disabled={status === "loading"}>
            {status === "loading"
              ? <><span className="spin"/> Finding Your Buddy…</>
              : "🛍️ Confirm Booking"}
          </button>

          {status === "loading" && (
            <div className="ai-box loading">
              <span className="ai-lbl">🤖 AI Processing</span>
              Confirming your booking and matching the best available buddy near you…
            </div>
          )}

          {status === "ok" && aiMsg && (
            <>
              <div className="ai-box ok">
                <span className="ai-lbl">✅ Booking Confirmed</span>
                {aiMsg}
              </div>
              {helper && (
                <div className="h-card">
                  <div className="h-av">{helper.e}</div>
                  <div>
                    <div className="h-name">{helper.name} <span className="h-stars">{helper.rating}</span></div>
                    <div className="h-meta">{helper.trips} completed</div>
                  </div>
                  <div className="h-onway">🟢 {helper.eta}</div>
                </div>
              )}
            </>
          )}

          {status === "fail" && (
            <div className="ai-box fail">
              <span className="ai-lbl">❌ Error</span>
              {aiMsg}
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testi" id="reviews">
        <div className="sh">
          <div className="sl">Real Reviews</div>
          <h2 className="st">Shoppers across India<br/>are obsessed.</h2>
          <p className="ss">Real stories from real customers — across the country.</p>
        </div>
        <div className="testi-grid">
          {[
            { av:"👩", stars:"★★★★★", q:`"I'm a mother of two and shopping at the mall was always exhausting. LugBuddy sent an amazing buddy who carried everything and helped with my stroller the whole trip. Absolute game changer!"`, name:"Meera Joshi", city:"Phoenix Palassio, Lucknow" },
            { av:"👴", stars:"★★★★★", q:`"After my back surgery I couldn't carry anything. My LugBuddy was professional, patient and incredibly helpful throughout my entire Diwali shopping trip. Highly recommended!"`, name:"Ramesh Verma", city:"Forum Mall, Bengaluru" },
            { av:"👩", stars:"★★★★★", q:`"I was visiting from out of town and had no idea where anything was. My buddy knew every store, carried all my bags, and even recommended the best restaurant. Perfect 10 out of 10!"`, name:"Fatima Sheikh", city:"Select CITYWALK, Delhi" },
            { av:"👨", stars:"★★★★★", q:`"We booked the family pack for a Saturday at Lulu Mall. Two buddies came — one with the kids, one handling bags. Best ₹699 we ever spent. We will never shop without LugBuddy again!"`, name:"Thomas Family", city:"Lulu Mall, Kochi" },
          ].map(({ av, stars, q, name, city }) => (
            <div className="t-card" key={name}>
              <div className="t-stars">{stars}</div>
              <p className="t-q">{q}</p>
              <div className="t-person">
                <div className="t-av">{av}</div>
                <div><div className="t-name">{name}</div><div className="t-loc">{city}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="f-tribar"><div className="s"/><div className="w"/><div className="g"/></div>
        <div className="f-grid">
          <div className="f-brand">
            <div style={{display:"flex",alignItems:"center",gap:"0.7rem"}}>
              <div style={{width:"36px",height:"36px",background:"var(--teal)",borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem"}}>🧳</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.4rem",fontWeight:"900"}}>Lug<span style={{color:"var(--teal)"}}>Buddy</span></div>
            </div>
            <p>India's on-demand personal shopping helper service. Available at 200+ malls and events nationwide. Hands empty, smiles full. 🇮🇳</p>
          </div>
          {[
            { h:"Services", links:["Bag Carrying","Stroller Help","Heavy Items","Car Loading","Event Help"] },
            { h:"Company",  links:["About Us","Become a Buddy","Locations","Press","Careers"] },
            { h:"Support",  links:["Help Center","Contact Us","Safety","Privacy Policy","Terms"] },
          ].map(({ h, links }) => (
            <div className="fc" key={h}>
              <h4>{h}</h4>
              <ul>{links.map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="f-bottom">
          <span>© 2026 LugBuddy India Pvt. Ltd. · <span className="f-teal">lugbuddy.in</span> · All rights reserved.</span>
          <span>🇮🇳 <span className="f-saff">Made in India</span>, for India</span>
        </div>
      </footer>
    </>
  );
}
