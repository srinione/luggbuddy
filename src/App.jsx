import { useState, useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --cream:   #FAF8F4;
    --warm:    #F3EFE7;
    --sand:    #E8E0D0;
    --saffron: #E8640A;
    --saffron-soft: rgba(232,100,10,0.08);
    --green:   #1A6B3C;
    --ink:     #1C1917;
    --ink-mid: #44403C;
    --ink-soft:#78716C;
    --white:   #FFFFFF;
    --teal:    #0D7377;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--ink);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  /* ── TRICOLOR ── */
  .tribar { display:flex; height:3px; position:fixed; top:0; left:0; right:0; z-index:300; }
  .tribar .s { flex:1; background:#FF9933; }
  .tribar .w { flex:1; background:#fff; }
  .tribar .g { flex:1; background:#138808; }

  /* ── NAV ── */
  nav {
    position: fixed; top:3px; left:0; right:0; z-index:200;
    display: flex; align-items:center; justify-content:space-between;
    padding: 1.2rem 4rem;
    background: rgba(250,248,244,0.92);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(28,25,23,0.06);
  }
  .nav-logo { display:flex; align-items:center; gap:0.6rem; text-decoration:none; }
  .nav-logo-icon {
    width:34px; height:34px; background:var(--saffron);
    border-radius:9px; display:flex; align-items:center;
    justify-content:center; font-size:1rem;
  }
  .nav-logo-text {
    font-family:'Cormorant Garamond',serif;
    font-size:1.5rem; font-weight:600; color:var(--ink); letter-spacing:-0.3px;
  }
  .nav-logo-text span { color:var(--saffron); }
  .nav-links { display:flex; gap:2rem; list-style:none; }
  .nav-links a { color:var(--ink-mid); text-decoration:none; font-size:0.85rem; font-weight:500; transition:color 0.2s; }
  .nav-links a:hover { color:var(--saffron); }
  .nav-cta {
    background:var(--ink); color:var(--white);
    font-size:0.82rem; font-weight:600;
    padding:0.6rem 1.4rem; border-radius:50px;
    text-decoration:none; transition:all 0.25s;
    letter-spacing:0.2px;
  }
  .nav-cta:hover { background:var(--saffron); }
  .hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; background:none; border:none; padding:4px; }
  .hamburger span { width:22px; height:1.5px; background:var(--ink); display:block; transition:all 0.3s; }
  .mob-menu { display:none; position:fixed; top:64px; left:0; right:0; background:var(--cream); padding:1.5rem 2rem 2rem; z-index:199; border-bottom:1px solid var(--sand); flex-direction:column; gap:1.2rem; }
  .mob-menu.open { display:flex; }
  .mob-menu a { color:var(--ink-mid); text-decoration:none; font-size:1.1rem; font-weight:500; padding:0.3rem 0; border-bottom:1px solid var(--sand); }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: grid; grid-template-columns: 1fr 1fr;
    padding-top: 64px;
  }

  .hero-left {
    display: flex; flex-direction:column; justify-content:center;
    padding: 5rem 4rem 5rem 4rem;
    position: relative;
  }
  .hero-left::after {
    content:''; position:absolute; right:0; top:15%; bottom:15%;
    width:1px; background:var(--sand);
  }

  .hero-eyebrow {
    display:inline-flex; align-items:center; gap:0.5rem;
    font-size:0.7rem; font-weight:600; letter-spacing:2.5px;
    text-transform:uppercase; color:var(--saffron);
    margin-bottom:2rem;
    animation: fadeUp 0.6s ease both;
  }
  .eyebrow-dot { width:6px; height:6px; background:var(--saffron); border-radius:50%; }

  .hero h1 {
    font-family:'Cormorant Garamond',serif;
    font-size: clamp(3.2rem, 5vw, 5.5rem);
    font-weight:600; line-height:1.05;
    letter-spacing:-1px; margin-bottom:1.8rem;
    animation: fadeUp 0.7s 0.1s ease both;
  }
  .hero h1 em { font-style:italic; color:var(--saffron); }

  .hero-desc {
    font-size:1rem; color:var(--ink-soft); line-height:1.8;
    max-width:400px; margin-bottom:2.5rem;
    animation: fadeUp 0.7s 0.2s ease both;
    font-weight:400;
  }

  .hero-actions {
    display:flex; gap:1rem; flex-wrap:wrap;
    animation: fadeUp 0.7s 0.3s ease both;
  }
  .btn-dark {
    background:var(--ink); color:var(--white);
    font-size:0.88rem; font-weight:600;
    padding:0.85rem 2rem; border-radius:50px;
    border:none; cursor:pointer; text-decoration:none;
    display:inline-block; transition:all 0.25s; letter-spacing:0.2px;
  }
  .btn-dark:hover { background:var(--saffron); transform:translateY(-1px); }
  .btn-outline-dark {
    background:transparent; color:var(--ink);
    font-size:0.88rem; font-weight:500;
    padding:0.85rem 2rem; border-radius:50px;
    border:1.5px solid var(--sand);
    cursor:pointer; text-decoration:none;
    display:inline-block; transition:all 0.25s;
  }
  .btn-outline-dark:hover { border-color:var(--ink); }

  /* HERO STAT ROW */
  .hero-stats {
    display:flex; gap:2.5rem; margin-top:3.5rem; padding-top:2.5rem;
    border-top:1px solid var(--sand);
    animation: fadeUp 0.7s 0.4s ease both;
  }
  .hstat-n {
    font-family:'Cormorant Garamond',serif;
    font-size:2.2rem; font-weight:600; color:var(--ink); line-height:1;
    display:block; margin-bottom:0.25rem;
  }
  .hstat-l { font-size:0.72rem; color:var(--ink-soft); font-weight:500; letter-spacing:0.3px; }

  /* HERO RIGHT — IMAGE GRID */
  .hero-right {
    position:relative; overflow:hidden;
    animation: fadeIn 1s 0.2s ease both;
  }
  .hero-img-main {
    width:100%; height:100%; object-fit:cover;
    display:block;
  }
  .hero-img-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to right, rgba(250,248,244,0.15) 0%, transparent 40%);
  }

  /* FLOATING CARD on hero image */
  .hero-float-card {
    position:absolute; bottom:2.5rem; left:2rem;
    background:rgba(255,255,255,0.95);
    backdrop-filter:blur(12px);
    border-radius:16px; padding:1.1rem 1.4rem;
    box-shadow:0 8px 32px rgba(28,25,23,0.12);
    display:flex; align-items:center; gap:0.9rem;
    animation: slideUp 0.8s 0.6s ease both;
    min-width:240px;
  }
  .hfc-av {
    width:44px; height:44px; border-radius:50%;
    background:linear-gradient(135deg,var(--saffron),#c45200);
    display:flex; align-items:center; justify-content:center;
    font-size:1.3rem; flex-shrink:0;
  }
  .hfc-name { font-size:0.88rem; font-weight:600; color:var(--ink); margin-bottom:0.15rem; }
  .hfc-sub { font-size:0.72rem; color:var(--ink-soft); }
  .hfc-badge {
    margin-left:auto; background:var(--saffron);
    color:#fff; font-size:0.6rem; font-weight:700;
    padding:0.25rem 0.6rem; border-radius:50px; letter-spacing:0.5px;
    white-space:nowrap;
  }

  /* ── MARQUEE ── */
  .marquee-wrap {
    overflow:hidden; background:var(--ink); padding:0.9rem 0;
    border-top:1px solid rgba(255,255,255,0.05);
  }
  .marquee-track {
    display:flex; gap:3rem; width:max-content;
    animation: marquee 25s linear infinite;
  }
  .marquee-item {
    display:flex; align-items:center; gap:0.7rem;
    color:rgba(255,255,255,0.55); font-size:0.78rem;
    font-weight:500; letter-spacing:1px; text-transform:uppercase;
    white-space:nowrap;
  }
  .marquee-sep { color:var(--saffron); font-size:0.6rem; }
  @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  /* ── SECTIONS ── */
  section { padding:7rem 4rem; }

  .section-label {
    font-size:0.68rem; font-weight:600; letter-spacing:3px;
    text-transform:uppercase; color:var(--saffron); margin-bottom:1rem;
  }
  .section-title {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(2.2rem,4vw,3.5rem); font-weight:600;
    line-height:1.1; letter-spacing:-0.5px;
  }
  .section-title em { font-style:italic; color:var(--saffron); }

  /* ── SERVICES ── */
  .services-section { background:var(--cream); }
  .services-head {
    display:grid; grid-template-columns:1fr 1fr;
    gap:3rem; align-items:end; margin-bottom:5rem;
  }
  .services-desc { font-size:1rem; color:var(--ink-soft); line-height:1.8; max-width:380px; margin-left:auto; }

  .services-grid {
    display:grid; grid-template-columns:repeat(3,1fr);
    gap:1.5px; background:var(--sand);
    border:1.5px solid var(--sand); border-radius:16px; overflow:hidden;
  }
  .svc-cell {
    background:var(--cream); padding:2.5rem 2rem;
    transition:background 0.25s;
    position:relative; overflow:hidden;
  }
  .svc-cell:hover { background:var(--white); }
  .svc-num {
    font-family:'Cormorant Garamond',serif;
    font-size:0.85rem; color:var(--sand); font-weight:600;
    margin-bottom:2rem; display:block;
  }
  .svc-emoji { font-size:2rem; display:block; margin-bottom:1.2rem; }
  .svc-title { font-size:0.95rem; font-weight:600; color:var(--ink); margin-bottom:0.6rem; }
  .svc-desc { font-size:0.82rem; color:var(--ink-soft); line-height:1.7; }

  /* ── HOW SECTION ── */
  .how-section {
    background:var(--ink);
    display:grid; grid-template-columns:1fr 1.2fr;
    gap:0; padding:0;
  }
  .how-left {
    padding:7rem 4rem;
    display:flex; flex-direction:column; justify-content:center;
  }
  .how-left .section-title { color:var(--white); margin-bottom:1rem; }
  .how-left .section-label { color:var(--saffron); }
  .how-desc { font-size:0.95rem; color:rgba(255,255,255,0.5); line-height:1.8; margin-bottom:3rem; }
  .steps-list { display:flex; flex-direction:column; gap:0; }
  .step-row {
    display:flex; gap:1.5rem; padding:1.8rem 0;
    border-bottom:1px solid rgba(255,255,255,0.07);
    transition:all 0.2s;
  }
  .step-row:last-child { border-bottom:none; }
  .step-num {
    font-family:'Cormorant Garamond',serif;
    font-size:2rem; font-weight:600; color:rgba(255,255,255,0.12);
    line-height:1; min-width:2rem; padding-top:0.2rem;
  }
  .step-content {}
  .step-title { font-size:0.92rem; font-weight:600; color:var(--white); margin-bottom:0.3rem; }
  .step-body { font-size:0.8rem; color:rgba(255,255,255,0.45); line-height:1.6; }

  .how-right { position:relative; min-height:600px; }
  .how-right img { width:100%; height:100%; object-fit:cover; display:block; }
  .how-right::before {
    content:''; position:absolute; inset:0; z-index:1;
    background:linear-gradient(to right, var(--ink) 0%, transparent 20%);
  }

  /* ── PHOTO FEATURE ── */
  .photo-feature {
    background:var(--warm);
    display:grid; grid-template-columns:1.1fr 0.9fr;
    gap:5rem; align-items:center;
  }
  .photo-grid {
    display:grid; grid-template-columns:1fr 1fr;
    grid-template-rows:280px 280px;
    gap:1rem;
  }
  .photo-grid img {
    width:100%; height:100%; object-fit:cover;
    border-radius:12px; display:block;
  }
  .photo-grid img:first-child {
    grid-row:span 2; border-radius:16px;
  }
  .photo-info {}
  .photo-info .section-title { margin-bottom:1.5rem; }
  .photo-info p { font-size:0.95rem; color:var(--ink-soft); line-height:1.85; margin-bottom:2rem; }

  /* FEATURE LIST */
  .feature-list { display:flex; flex-direction:column; gap:1rem; margin-bottom:2.5rem; }
  .feat-item { display:flex; align-items:center; gap:0.8rem; }
  .feat-check {
    width:22px; height:22px; border-radius:50%;
    background:var(--saffron-soft); border:1px solid rgba(232,100,10,0.2);
    display:flex; align-items:center; justify-content:center;
    font-size:0.65rem; color:var(--saffron); flex-shrink:0; font-weight:700;
  }
  .feat-text { font-size:0.88rem; color:var(--ink-mid); font-weight:500; }

  /* ── PRICING ── */
  .pricing-section { background:var(--cream); }
  .pricing-head { text-align:center; max-width:520px; margin:0 auto 4rem; }
  .pricing-sub { font-size:0.95rem; color:var(--ink-soft); line-height:1.7; margin-top:1rem; }
  .plans-grid {
    display:grid; grid-template-columns:repeat(3,1fr);
    gap:1.5rem; max-width:1000px; margin:0 auto;
  }
  .plan-card {
    background:var(--white); border:1.5px solid var(--sand);
    border-radius:20px; padding:2.5rem 2rem;
    transition:all 0.25s; position:relative; overflow:hidden;
  }
  .plan-card.popular { border-color:var(--saffron); background:var(--ink); }
  .plan-card:not(.popular):hover { border-color:var(--ink); transform:translateY(-3px); box-shadow:0 12px 40px rgba(28,25,23,0.08); }
  .popular-tag {
    position:absolute; top:0; left:50%; transform:translateX(-50%);
    background:var(--saffron); color:#fff;
    font-size:0.62rem; font-weight:700; padding:0.25rem 1rem;
    border-radius:0 0 8px 8px; letter-spacing:1px; text-transform:uppercase;
  }
  .plan-emoji { font-size:1.8rem; display:block; margin:0.5rem 0 1.2rem; }
  .plan-name { font-size:0.8rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:0.8rem; }
  .plan-card:not(.popular) .plan-name { color:var(--ink-soft); }
  .plan-card.popular .plan-name { color:rgba(255,255,255,0.5); }
  .plan-price {
    font-family:'Cormorant Garamond',serif;
    font-size:3rem; font-weight:600; line-height:1; margin-bottom:0.3rem;
  }
  .plan-card:not(.popular) .plan-price { color:var(--ink); }
  .plan-card.popular .plan-price { color:var(--white); }
  .plan-period { font-size:0.75rem; color:var(--ink-soft); margin-bottom:1.8rem; }
  .plan-card.popular .plan-period { color:rgba(255,255,255,0.4); }
  .plan-features { list-style:none; display:flex; flex-direction:column; gap:0.7rem; margin-bottom:2rem; }
  .plan-features li { font-size:0.82rem; display:flex; align-items:center; gap:0.6rem; }
  .plan-card:not(.popular) .plan-features li { color:var(--ink-mid); }
  .plan-card.popular .plan-features li { color:rgba(255,255,255,0.75); }
  .plan-features li::before { content:'→'; font-size:0.7rem; flex-shrink:0; }
  .plan-card:not(.popular) .plan-features li::before { color:var(--saffron); }
  .plan-card.popular .plan-features li::before { color:rgba(255,255,255,0.35); }
  .plan-btn {
    display:block; width:100%; text-align:center;
    padding:0.85rem; border-radius:50px;
    font-size:0.85rem; font-weight:600; cursor:pointer;
    text-decoration:none; transition:all 0.25s; border:none;
    font-family:'DM Sans',sans-serif;
  }
  .plan-card:not(.popular) .plan-btn { background:var(--ink); color:var(--white); }
  .plan-card:not(.popular) .plan-btn:hover { background:var(--saffron); }
  .plan-card.popular .plan-btn { background:var(--saffron); color:var(--white); }
  .plan-card.popular .plan-btn:hover { background:#c45200; }

  /* ── CITY COVERAGE ── */
  .cities-section { background:var(--warm); padding:5rem 4rem; }
  .cities-inner { display:flex; align-items:center; justify-content:space-between; gap:3rem; flex-wrap:wrap; }
  .cities-text .section-title { margin-bottom:0.8rem; }
  .cities-text p { font-size:0.93rem; color:var(--ink-soft); line-height:1.7; max-width:340px; }
  .cities-pills { display:flex; flex-wrap:wrap; gap:0.7rem; max-width:560px; }
  .city-pill {
    background:var(--white); border:1px solid var(--sand);
    color:var(--ink-mid); font-size:0.8rem; font-weight:500;
    padding:0.5rem 1.1rem; border-radius:50px;
    transition:all 0.2s; cursor:default;
  }
  .city-pill:hover { border-color:var(--saffron); color:var(--saffron); background:var(--cream); }

  /* ── TESTIMONIALS ── */
  .testi-section { background:var(--cream); padding:7rem 4rem; }
  .testi-head { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:4rem; }
  .testi-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }
  .testi-card {
    background:var(--white); border:1px solid var(--sand);
    border-radius:16px; padding:2rem;
    transition:all 0.25s;
  }
  .testi-card:hover { box-shadow:0 8px 32px rgba(28,25,23,0.07); transform:translateY(-2px); }
  .testi-stars { color:var(--saffron); font-size:0.8rem; letter-spacing:2px; margin-bottom:1.2rem; }
  .testi-quote { font-family:'Cormorant Garamond',serif; font-size:1.1rem; line-height:1.65; color:var(--ink-mid); margin-bottom:1.5rem; font-style:italic; }
  .testi-person { display:flex; align-items:center; gap:0.8rem; border-top:1px solid var(--sand); padding-top:1.2rem; }
  .testi-av { width:36px; height:36px; border-radius:50%; background:var(--saffron); display:flex; align-items:center; justify-content:center; font-size:1rem; }
  .testi-name { font-size:0.82rem; font-weight:600; color:var(--ink); }
  .testi-loc { font-size:0.72rem; color:var(--ink-soft); }

  /* ── FOOTER ── */
  footer {
    background:var(--ink); color:rgba(255,255,255,0.5);
    padding:5rem 4rem 2.5rem;
  }
  .footer-top {
    display:grid; grid-template-columns:1.5fr 1fr 1fr 1fr;
    gap:3rem; padding-bottom:4rem;
    border-bottom:1px solid rgba(255,255,255,0.07);
    margin-bottom:2.5rem;
  }
  .footer-brand-name {
    font-family:'Cormorant Garamond',serif;
    font-size:1.6rem; font-weight:600; color:var(--white);
    margin-bottom:0.8rem; display:block;
  }
  .footer-brand-name span { color:var(--saffron); }
  .footer-brand p { font-size:0.8rem; line-height:1.7; }
  .footer-col h5 { font-size:0.7rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,0.7); margin-bottom:1.2rem; }
  .footer-col ul { list-style:none; display:flex; flex-direction:column; gap:0.6rem; }
  .footer-col a { color:rgba(255,255,255,0.4); text-decoration:none; font-size:0.8rem; transition:color 0.2s; }
  .footer-col a:hover { color:var(--saffron); }
  .footer-bottom { display:flex; justify-content:space-between; align-items:center; font-size:0.73rem; flex-wrap:wrap; gap:0.5rem; }
  .footer-flag { display:flex; align-items:center; gap:0.4rem; }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  /* ── RESPONSIVE ── */
  @media(max-width:900px){
    nav { padding:1rem 1.5rem; }
    .nav-links, .nav-cta { display:none; }
    .hamburger { display:flex; }
    .hero { grid-template-columns:1fr; min-height:auto; }
    .hero-left { padding:6rem 1.5rem 3rem; }
    .hero-left::after { display:none; }
    .hero-right { height:55vw; min-height:300px; }
    section { padding:4rem 1.5rem; }
    .services-head { grid-template-columns:1fr; gap:1.5rem; }
    .services-desc { margin-left:0; }
    .services-grid { grid-template-columns:1fr; }
    .how-section { grid-template-columns:1fr; }
    .how-right { min-height:280px; }
    .how-right::before { display:none; }
    .photo-feature { grid-template-columns:1fr; gap:2.5rem; }
    .photo-grid { grid-template-rows:200px 200px; }
    .plans-grid { grid-template-columns:1fr; max-width:400px; }
    .cities-inner { flex-direction:column; align-items:flex-start; }
    .testi-grid { grid-template-columns:1fr; }
    .testi-head { flex-direction:column; gap:1rem; align-items:flex-start; }
    .footer-top { grid-template-columns:1fr 1fr; gap:2rem; }
    .footer-bottom { flex-direction:column; text-align:center; }
    .hero-stats { gap:1.5rem; }
  }
`;

const CITIES = ["Delhi","Mumbai","Bengaluru","Hyderabad","Chennai","Kochi","Kolkata","Pune","Lucknow","Chandigarh","Ahmedabad","Jaipur"];

export default function App() {
  const [mobOpen, setMobOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      {/* TRICOLOR */}
      <div className="tribar"><div className="s"/><div className="w"/><div className="g"/></div>

      {/* NAV */}
      <nav style={{ boxShadow: scrolled ? "0 2px 20px rgba(28,25,23,0.07)" : "none" }}>
        <a href="#" className="nav-logo">
          <div className="nav-logo-icon">🧳</div>
          <span className="nav-logo-text">Lug<span>Buddy</span></span>
        </a>
        <ul className="nav-links">
          {[["#services","Services"],["#how","How It Works"],["#pricing","Pricing"],["#cities","Cities"]].map(([h,l])=>(
            <li key={l}><a href={h}>{l}</a></li>
          ))}
        </ul>
        <a href="#booking" className="nav-cta">Book a Buddy</a>
        <button className="hamburger" onClick={() => setMobOpen(o=>!o)}>
          <span/><span/><span/>
        </button>
      </nav>

      <div className={`mob-menu ${mobOpen?"open":""}`}>
        {[["#services","Services"],["#how","How It Works"],["#pricing","Pricing"],["#cities","Cities"],["#booking","Book a Buddy"]].map(([h,l])=>(
          <a key={l} href={h} onClick={()=>setMobOpen(false)}>{l}</a>
        ))}
      </div>

      {/* ── HERO ── */}
      <section style={{padding:0}}>
        <div className="hero">

          {/* LEFT */}
          <div className="hero-left">
            <div className="hero-eyebrow">
              <div className="eyebrow-dot"/>
              India's Shopping Helper Service · 🇮🇳
            </div>

            <h1>
              Drop the bags.<br/>
              <em>Keep the joy</em><br/>
              of shopping.
            </h1>

            <p className="hero-desc">
              Hire a verified, trained personal helper at your favourite Indian mall.
              They carry your bags, push your stroller, hold heavy items —
              so you can shop freely.
            </p>

            <div className="hero-actions">
              <a href="#booking" className="btn-dark">Book a Buddy →</a>
              <a href="#how" className="btn-outline-dark">See How It Works</a>
            </div>

            <div className="hero-stats">
              {[["50K+","Shoppers served"],["200+","Malls & events"],["4.9","Average rating"]].map(([n,l])=>(
                <div key={l}>
                  <span className="hstat-n">{n}</span>
                  <span className="hstat-l">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — full bleed image */}
          <div className="hero-right">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80&fit=crop"
              alt="Happy shopper at mall"
              className="hero-img-main"
            />
            <div className="hero-img-overlay"/>
            <div className="hero-float-card">
              <div className="hfc-av">👩</div>
              <div>
                <div className="hfc-name">Priya S. — Your Buddy</div>
                <div className="hfc-sub">Lulu Mall, Kochi · ★★★★★ 5.0</div>
              </div>
              <div className="hfc-badge">EN ROUTE</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...Array(2)].map((_,r)=>
            ["Bag Carrying","Stroller Help","Heavy Items","Car Loading","Mall Guide","Same-Day Booking","Pay at Mall","100% Verified"].map((t,i)=>(
              <div className="marquee-item" key={`${r}-${i}`}>
                {t} <span className="marquee-sep">✦</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section className="services-section" id="services">
        <div className="services-head">
          <div>
            <div className="section-label">What We Offer</div>
            <h2 className="section-title">Every service you<br/>need to shop <em>freely.</em></h2>
          </div>
          <p className="services-desc">
            From carrying bags to navigating crowded floors —
            our trained buddies handle it all so you never have to
            worry about a thing.
          </p>
        </div>

        <div className="services-grid">
          {[
            { n:"01", e:"👜", t:"Bag Carrying",         d:"Every bag, every store, every floor — your buddy carries it all to the car." },
            { n:"02", e:"🍼", t:"Stroller Assistance",   d:"Push, steer and navigate crowded malls with ease while you browse." },
            { n:"03", e:"📦", t:"Heavy Item Holding",    d:"Electronics, appliances, large boxes — we hold everything until you're ready." },
            { n:"04", e:"🗺️", t:"Mall Navigation",       d:"New to the mall? Your buddy knows every store, exit and shortcut." },
            { n:"05", e:"🚗", t:"Car Escort & Loading",  d:"We walk you out and load all your bags safely. The perfect finish." },
            { n:"06", e:"🎪", t:"Events & Outdoor Fairs",d:"Markets, expos, festivals — we show up wherever the shopping happens." },
          ].map(({n,e,t,d})=>(
            <div className="svc-cell" key={n}>
              <span className="svc-num">{n}</span>
              <span className="svc-emoji">{e}</span>
              <div className="svc-title">{t}</div>
              <p className="svc-desc">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <div className="how-section" id="how">
        <div className="how-left">
          <div className="section-label">How It Works</div>
          <h2 className="section-title" style={{color:"white",marginBottom:"1rem"}}>
            Ready in under<br/><em>five minutes.</em>
          </h2>
          <p className="how-desc">Faster than finding a parking spot — we promise.</p>
          <div className="steps-list">
            {[
              { n:"01", t:"Choose Your Mall",    b:"Select from 200+ malls and events across India." },
              { n:"02", t:"Pick Your Services",  b:"Bags, stroller, heavy items — choose what you need." },
              { n:"03", t:"Get Instantly Matched",b:"Our system finds the closest, highest-rated buddy in seconds." },
              { n:"04", t:"Shop Hands-Free",     b:"Your buddy stays by your side the entire trip." },
            ].map(({n,t,b})=>(
              <div className="step-row" key={n}>
                <div className="step-num">{n}</div>
                <div className="step-content">
                  <div className="step-title">{t}</div>
                  <div className="step-body">{b}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="how-right">
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80&fit=crop"
            alt="Shopping mall India"
          />
        </div>
      </div>

      {/* ── PHOTO FEATURE ── */}
      <section className="photo-feature" id="about">
        <div className="photo-grid">
          <img src="https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=600&q=80&fit=crop" alt="Shopping helper carrying bags"/>
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80&fit=crop" alt="Happy shopper"/>
          <img src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=500&q=80&fit=crop" alt="Indian mall"/>
        </div>
        <div className="photo-info">
          <div className="section-label">Why LugBuddy</div>
          <h2 className="section-title">Trusted by families<br/>across <em>India.</em></h2>
          <p>Every LugBuddy helper is background-checked, identity-verified and trained in-person before their first trip. You get a friendly, professional companion — not just a bag carrier.</p>
          <div className="feature-list">
            {["Background checked & ID verified","In-person trained before every assignment","Rated after every single trip","Pay only at the mall — zero advance payment","Cancel anytime, 30 minutes before, no charge"].map(f=>(
              <div className="feat-item" key={f}>
                <div className="feat-check">✓</div>
                <span className="feat-text">{f}</span>
              </div>
            ))}
          </div>
          <a href="#booking" className="btn-dark">Book a Buddy Today →</a>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="pricing-section" id="pricing">
        <div className="pricing-head">
          <div className="section-label" style={{textAlign:"center"}}>Simple Pricing</div>
          <h2 className="section-title" style={{textAlign:"center"}}>No surprises.<br/><em>Ever.</em></h2>
          <p className="pricing-sub">Flat rates, zero hidden fees. Pay your buddy at the mall — no advance needed.</p>
        </div>
        <div className="plans-grid">
          {[
            { e:"🧺", n:"Quick Lug",      p:"₹149", per:"per hour · 1–2 hrs", popular:false,
              items:["1 service type","Up to 5 bags","1 buddy","In-mall coverage","Standard arrival"] },
            { e:"🧳", n:"Half Day Buddy", p:"₹399", per:"half day · up to 4 hrs", popular:true,
              items:["All services included","Unlimited bags","Stroller help","Car loading","Priority arrival"] },
            { e:"👨‍👩‍👧", n:"Family Pack",  p:"₹699", per:"full day · up to 8 hrs", popular:false,
              items:["2 buddies assigned","Everything included","Navigation guide","Car escort & loading","Instant VIP match"] },
          ].map(({e,n,p,per,popular,items})=>(
            <div className={`plan-card ${popular?"popular":""}`} key={n}>
              {popular && <div className="popular-tag">Most Popular</div>}
              <span className="plan-emoji">{e}</span>
              <div className="plan-name">{n}</div>
              <div className="plan-price">{p}</div>
              <div className="plan-period">{per}</div>
              <ul className="plan-features">{items.map(i=><li key={i}>{i}</li>)}</ul>
              <a href="#booking" className="plan-btn">Choose Plan</a>
            </div>
          ))}
        </div>
      </section>

      {/* ── CITY COVERAGE ── */}
      <section className="cities-section" id="cities">
        <div className="cities-inner">
          <div className="cities-text">
            <div className="section-label">Where We Operate</div>
            <h2 className="section-title">200+ locations<br/>across <em>India.</em></h2>
            <p>From metro malls to local events — LugBuddy is expanding across the country. Don't see your city? We're coming soon.</p>
          </div>
          <div className="cities-pills">
            {CITIES.map(c=><div className="city-pill" key={c}>{c}</div>)}
            <div className="city-pill" style={{borderStyle:"dashed",color:"var(--ink-soft)"}}>+ More Coming Soon</div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testi-section" id="reviews">
        <div className="testi-head">
          <div>
            <div className="section-label">Real Reviews</div>
            <h2 className="section-title">What our shoppers<br/><em>are saying.</em></h2>
          </div>
          <p style={{fontSize:"0.88rem",color:"var(--ink-soft)",maxWidth:"220px",lineHeight:"1.6"}}>
            4.9 average rating across 50,000+ bookings.
          </p>
        </div>
        <div className="testi-grid">
          {[
            { av:"👩", stars:"★★★★★", q:"I'm a mother of two and shopping used to be exhausting. LugBuddy sent an amazing buddy who handled everything. Absolute game changer for our family.", name:"Meera Joshi", city:"Phoenix Palassio, Lucknow" },
            { av:"👴", stars:"★★★★★", q:"After my back surgery I couldn't carry anything. My LugBuddy was professional and patient throughout my entire Diwali shopping trip. Highly recommended.", name:"Ramesh Verma", city:"Forum Mall, Bengaluru" },
            { av:"👩", stars:"★★★★★", q:"Visiting from out of town, had no idea where anything was. My buddy knew every store, carried everything and even suggested the best restaurant. Perfect 10.", name:"Fatima Sheikh", city:"Select CITYWALK, Delhi" },
          ].map(({av,stars,q,name,city})=>(
            <div className="testi-card" key={name}>
              <div className="testi-stars">{stars}</div>
              <p className="testi-quote">"{q}"</p>
              <div className="testi-person">
                <div className="testi-av">{av}</div>
                <div>
                  <div className="testi-name">{name}</div>
                  <div className="testi-loc">{city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-brand-name">Lug<span>Buddy</span></span>
            <p>India's on-demand personal shopping helper. Available at 200+ malls and events. Hands empty, smiles full. 🇮🇳</p>
          </div>
          {[
            { h:"Services",  links:["Bag Carrying","Stroller Help","Heavy Items","Car Loading","Event Help"] },
            { h:"Company",   links:["About Us","Become a Buddy","Locations","Press","Careers"] },
            { h:"Support",   links:["Help Center","Contact Us","Safety","Privacy Policy","Terms"] },
          ].map(({h,links})=>(
            <div className="footer-col" key={h}>
              <h5>{h}</h5>
              <ul>{links.map(l=><li key={l}><a href="#">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2026 LugBuddy India Pvt. Ltd. · lugbuddy.in · All rights reserved.</span>
          <div className="footer-flag">🇮🇳 Made in India, for India</div>
        </div>
      </footer>
    </>
  );
}
