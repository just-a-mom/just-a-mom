"use client";

import { useEffect, useRef } from "react";

// ╔══════════════════════════════════════════════╗
// ║           TUNING KNOBS                       ║
// ╚══════════════════════════════════════════════╝
const SPOT_MIN = 2;
const SPOT_MAX = 7;
const FG_SPD_MIN = 0.22;
const FG_SPD_MAX = 0.58;
const BG_COUNT = 60;
const TARGET_CHANGE_MS = 8000;

// ╔══════════════════════════════════════════════╗
// ║           PHRASE LISTS                       ║
// ╚══════════════════════════════════════════════╝
const phrasesEN = [
  "who saves people","who forgets leftovers","who cries over the state of the country",
  "who keeps going","who is disabled","who is marginalized","who was tokenized",
  "who is undocumented","who orders too much takeout","who still gets shit done",
  "who has seen some shit","who advocates","who is exhausted","who survives systems",
  "who raises hell politely","who works night shift","who became her own rescue",
  "who keeps everyone alive","who learned boundaries late","who still shows up",
  "who deserves softness too","who was called emotional","who was right",
  "who is ok","who has it together","who is winging it","who rebuilt her life",
  "who can fix the Wi-Fi","who carries grief in her body","who became impossible to manipulate",
  "who white water rafts","who writes legislation in her spare time","who escaped abuse",
  "who started over","who is a badass","who builds community","who is underestimated",
  "who runs for office","who refuses to disappear","who survived divorce",
  "who owns a business","who learned coding at 42","who carries the mental load",
  "who homeschools","who grows tomatoes","who can deadlift 300 pounds","who has three jobs",
  "who organizes the fundraiser","who rebuilds engines","who learned English at 30",
  "who fights for her kids","who still makes magic happen","who keeps receipts",
  "who became the emergency contact","who drives the carpool","who runs the PTA",
  "who buries grief quietly","who makes impossible things work","who leaves and starts again",
  "who protects people","who fosters children","who survived addiction",
  "who writes poetry in the laundry room","who leads quietly","who is tired",
  "who is not weak","who carries everyone","who has no village","who keeps the calendar",
  "who changes policy","who keeps people alive","who starts nonprofits",
  "who votes in every election","who speaks at town meetings","who does not ask permission",
  "who survived the unimaginable","who teaches herself everything",
  "who creates beauty from chaos","who is chronically ill","who is autistic",
  "who is neurodivergent","who was talked over","who survived racism",
  "who survived misogyny","who survives both","who wears a hijab",
  "who translates for her parents","who is the first in her family","who grew up poor",
  "who grew up parentified","who lives paycheck to paycheck","who is exhausted by systems",
  "who cannot afford to fail","who has to work twice as hard",
  "who learned survival before confidence","who was denied accommodations",
  "who became her own advocate","who speaks multiple languages","who sends money home",
  "who carries generational trauma","who survived colonization",
  "who knows what discrimination feels like","who is invisible until needed",
  "who is hypervisible when she speaks","who has been reduced to a diversity statistic",
  "who is not your token","who is not your stereotype","who is not illegal",
  "who belongs here","who deserves safety","who deserves joy",
  "who forgot herself for a while","who remembers everything","who answers emails at midnight",
  "who fought the insurance company","who always brings snacks","who files FOIA requests",
  "who calls legislators back","who started therapy","who survived postpartum depression",
  "who rebuilt after bankruptcy","who sleeps with one ear open","who has court tomorrow",
  "who knows the school lunch code","who stopped apologizing","who cut ties and healed",
  "who knows CPR","who got sober","who keeps everyone else's secrets","who is funny as hell",
  "who has stretch marks and standards","who changed her whole life quietly",
  "who left the marriage","who still gets underestimated","who knows where everything is",
  "who starts the group text","who survived family court","who keeps tiny humans alive",
  "who learned to take up space","who made dinner again","who finally chose herself",
  "who reads the fine print","who fact-checks everything","who keeps screenshots",
  "who stopped shrinking","who has restarted from zero twice","who made a home from nothing",
  "who keeps the world running","who is absolutely not just anything",
  "who has tabs open for weeks","who knows everyone's allergies",
  "who works unpaid overtime at home","who is rebuilding slowly","who still shows kindness",
  "who can survive on four hours of sleep","who became stronger than expected",
  "who keeps backup plans","who left survival mode","who finally feels peace sometimes",
  "who can command a room","who quietly saves everyone","who still dances in the kitchen",
  "who lost herself and came back wiser","who keeps tissues in the glove compartment",
  "who learned self-respect the hard way","who still has dreams",
  "who started believing herself","who never got the luxury of falling apart",
  "who notices everything","who deserves rest","who made a way out of no way",
  "who figured it out alone","who meal preps","who is fine","who is coping",
  "who asks for help","who does it all","who rests","who thrives","who survives",
  "who starts over again","who is learning as she goes","who cries in parking lots",
  "who sends the follow-up email","who carries snacks and rage","who Googles everything",
  "who keeps spare chargers","who misses deadlines sometimes","who still makes the appointment",
  "who is healing in public","who has panic attacks and opinions",
  "who is both grieving and hopeful","who is messy and magnificent",
];

const phrasesOther: { t: string; f: string }[] = [
  // Spanish
  {t:"que sigue adelante",f:"'Kalam',cursive"},
  {t:"que sobrevive",f:"'Caveat',cursive"},
  {t:"que está agotada",f:"'Indie Flower',cursive"},
  {t:"que lucha por sus hijos",f:"'Shadows Into Light',cursive"},
  {t:"que pertenece aquí",f:"'Permanent Marker',cursive"},
  {t:"que merece descanso",f:"'Nothing You Could Do',cursive"},
  {t:"que no es ilegal",f:"'Courier Prime',monospace"},
  {t:"que se levanta de nuevo",f:"'Caveat',cursive"},
  {t:"que aún aparece",f:"'Shadows Into Light',cursive"},
  // Mandarin
  {t:"她坚持下去",f:"'Noto Sans SC',sans-serif"},
  {t:"她属于这里",f:"'Noto Sans SC',sans-serif"},
  {t:"她值得休息",f:"'Noto Sans SC',sans-serif"},
  {t:"她从不放弃",f:"'Noto Sans SC',sans-serif"},
  {t:"她保护每个人",f:"'Noto Sans SC',sans-serif"},
  // Hindi
  {t:"जो आगे बढ़ती रहती है",f:"'Noto Sans Devanagari',sans-serif"},
  {t:"जो थकी हुई है",f:"'Noto Sans Devanagari',sans-serif"},
  {t:"जो यहाँ की है",f:"'Noto Sans Devanagari',sans-serif"},
  {t:"जो फिर उठती है",f:"'Noto Sans Devanagari',sans-serif"},
  // Arabic
  {t:"التي تستمر رغم كل شيء",f:"'Noto Sans Arabic',sans-serif"},
  {t:"التي تنتمي هنا",f:"'Noto Sans Arabic',sans-serif"},
  {t:"التي تستحق الراحة",f:"'Noto Sans Arabic',sans-serif"},
  {t:"التي لم تستسلم",f:"'Noto Sans Arabic',sans-serif"},
  // French
  {t:"qui continue malgré tout",f:"'Reenie Beanie',cursive"},
  {t:"qui appartient ici",f:"'Caveat',cursive"},
  {t:"qui mérite le repos",f:"'Indie Flower',cursive"},
  {t:"qui se relève encore",f:"'Architects Daughter',cursive"},
  // Portuguese
  {t:"que continua em frente",f:"'Kalam',cursive"},
  {t:"que pertence aqui",f:"'Indie Flower',cursive"},
  {t:"que merece descansar",f:"'Nothing You Could Do',cursive"},
  // Bengali
  {t:"যে এগিয়ে চলে",f:"'Noto Sans Bengali',sans-serif"},
  {t:"যে সবাইকে বাঁচায়",f:"'Noto Sans Bengali',sans-serif"},
  {t:"যে বিশ্রাম পাওয়ার যোগ্য",f:"'Noto Sans Bengali',sans-serif"},
  // Russian
  {t:"которая продолжает идти",f:"'Special Elite',cursive"},
  {t:"которая выживает",f:"'Courier Prime',monospace"},
  {t:"которая заслуживает отдыха",f:"'Courier Prime',monospace"},
  // Urdu
  {t:"جو آگے بڑھتی رہتی ہے",f:"'Noto Sans Arabic',sans-serif"},
  {t:"جو یہاں کی ہے",f:"'Noto Sans Arabic',sans-serif"},
  {t:"جو آرام کی مستحق ہے",f:"'Noto Sans Arabic',sans-serif"},
  // Indonesian
  {t:"yang terus melangkah",f:"'Kalam',cursive"},
  {t:"yang bertahan dari segalanya",f:"'Caveat',cursive"},
  {t:"yang ada di sini",f:"'Shadows Into Light',cursive"},
];

const allPhrases = [
  ...phrasesEN.map((t) => ({ t, f: null as string | null })),
  ...phrasesOther,
];

const enFonts = [
  "'Shadows Into Light',cursive","'Nothing You Could Do',cursive",
  "'Reenie Beanie',cursive","'Indie Flower',cursive","'Permanent Marker',cursive",
  "'Caveat',cursive","'Kalam',cursive","'Architects Daughter',cursive",
  "'Special Elite',cursive","'Courier Prime',monospace",
];
const colors = [
  "#1a1410","#2a2018","#3a2a18","#3a3848","#4a2a18",
  "#520a18","#1a2a40","#3a1818","#183028","#0a2218","#321828","#281408",
];
const dirs = ["up","down","left","right","diagUL","diagUR"];

function rand(a: number, b: number) { return Math.random() * (b - a) + a; }
function randInt(a: number, b: number) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function pick<T>(a: T[]): T { return a[Math.floor(Math.random() * a.length)]; }

type Phrase = { t: string; f: string | null };

interface BgParticle {
  el: HTMLDivElement;
  x: number; y: number; vx: number; vy: number;
  rot: number; dir: string;
  wobble: number; wobbleAmp: number; wobbleSpd: number;
}

interface Crossing {
  sx: number; sy: number; vx: number; vy: number;
  travelMs: number; fadeInMs: number; fadeOutStart: number; fadeOutMs: number;
}

interface Slot {
  el: HTMLDivElement;
  active: boolean;
  startTime: number;
  waitUntil: number;
  x: number; y: number; vx: number; vy: number;
  c: Crossing | null;
  rot: number;
  enabled: boolean;
}

// Special annotated phrases — rendered with handwritten corrections/annotations
const specialRenderers: Record<string, (el: HTMLElement, f: string, c: string, sz: number) => void> = {
  "who is ok": (el,f,c,sz) => {
    el.innerHTML = `<span style="font-family:${f};font-size:${sz}rem;color:${c};">who is ok</span><div><span style="font-family:'Caveat',cursive;color:#8B0000;font-size:${sz*1.1}rem;font-weight:700;display:inline-block;transform:rotate(-8deg) translate(5px,-2px);">NOT</span></div><div><span style="font-family:'Kalam',cursive;color:#666;font-size:${sz*0.75}rem;">and that's ok</span></div>`;
  },
  "who is fine": (el,f,c,sz) => {
    el.innerHTML = `<span style="font-family:${f};font-size:${sz}rem;color:${c};">who is <span style="text-decoration:line-through;text-decoration-color:rgba(139,0,0,0.7);">fine</span></span><div><span style="font-family:'Caveat',cursive;color:#8B0000;font-size:${sz*0.82}rem;">coping</span></div>`;
  },
  "who has it together": (el,f,c,sz) => {
    el.innerHTML = `<span style="font-family:${f};font-size:${sz}rem;color:${c};">who has it together</span><div><span style="font-family:'Indie Flower',cursive;color:#666;font-size:${sz*0.72}rem;">(for about 11 minutes)</span></div>`;
  },
  "who is winging it": (el,f,c,sz) => {
    el.innerHTML = `<span style="font-family:${f};font-size:${sz}rem;color:${c};">who is winging it</span><div><span style="font-family:'Caveat',cursive;color:#666;font-size:${sz*0.8}rem;">honestly</span></div>`;
  },
  "who is exhausted": (el,f,c,sz) => {
    el.innerHTML = `<span style="font-family:${f};font-size:${sz}rem;color:${c};background:rgba(255,200,30,0.35);padding:0 3px;border-radius:1px;">who is exhausted</span>`;
  },
  "who belongs here": (el,f,c,sz) => {
    el.innerHTML = `<span style="font-family:${f};font-size:${sz}rem;color:#1a4a6a;font-weight:700;text-decoration:underline;text-underline-offset:3px;">who belongs here</span>`;
  },
  "who is not illegal": (el,f,c,sz) => {
    el.innerHTML = `<span style="font-family:${f};font-size:${sz}rem;color:#6a3a28;font-weight:700;">who is not illegal</span>`;
  },
};

export default function Home() {
  const bgRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const bgEl = bgRef.current;
    const fgEl = fgRef.current;
    if (!bgEl || !fgEl) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    const onResize = () => { W = window.innerWidth; H = window.innerHeight; };
    window.addEventListener("resize", onResize);

    // Shuffled queues
    let bgQ: Phrase[] = [...allPhrases].sort(() => Math.random() - 0.5);
    let fgQ: Phrase[] = [...allPhrases].sort(() => Math.random() - 0.5);
    const nextBg = (): Phrase => { if (!bgQ.length) bgQ = [...allPhrases].sort(() => Math.random() - 0.5); return bgQ.shift()!; };
    const nextFg = (): Phrase => { if (!fgQ.length) fgQ = [...allPhrases].sort(() => Math.random() - 0.5); return fgQ.shift()!; };

    // ── Background ghosts ──────────────────────────────
    const bgP: BgParticle[] = [];

    const placeBg = (p: BgParticle, init: boolean) => {
      const item = nextBg();
      p.el.textContent = item.t;
      p.el.style.fontFamily = item.f ?? pick(enFonts);
    p.el.style.fontSize = rand(1.5, 2.5) + "rem";
      p.el.style.color = pick(colors);
      p.el.style.fontWeight = Math.random() < 0.25 ? "700" : "400";
           p.el.style.opacity = "0.07"; const el = document.createElement("div");
      el.style.cssText = "position:absolute;left:0;top:0;pointer-events:none;line-height:1.35;white-space:nowrap;will-change:transform,opacity;";
      bgEl.appendChild(el);
      const p = { el, x:0, y:0, vx:0, vy:0, rot:0, dir:"up", wobble:0, wobbleAmp:0, wobbleSpd:0 };
      placeBg(p, true);
      bgP.push(p);
    }

    // ── Foreground spotlights ──────────────────────────
    const makeCrossing = (): Crossing => {
      const dir = pick(dirs);
      const spd = rand(FG_SPD_MIN, FG_SPD_MAX);
      const pxPerMs = spd / 16.67;
      let sx=0, sy=0, vx=0, vy=0, travelMs=0;
      if (dir==="up")     { sx=rand(40,W-180); sy=H+80;  vx=rand(-0.03,0.03); vy=-spd; travelMs=(H+160)/pxPerMs; }
      else if (dir==="down")  { sx=rand(40,W-180); sy=-80;   vx=rand(-0.03,0.03); vy=spd;  travelMs=(H+160)/pxPerMs; }
      else if (dir==="left")  { sx=W+80; sy=rand(60,H-60); vx=-spd; vy=rand(-0.03,0.03); travelMs=(W+200)/pxPerMs; }
      else if (dir==="right") { sx=-80;  sy=rand(60,H-60); vx=spd;  vy=rand(-0.03,0.03); travelMs=(W+200)/pxPerMs; }
      else if (dir==="diagUL"){ sx=W+80; sy=H+80; vx=-spd*.7; vy=-spd*.7; travelMs=Math.sqrt((W+160)**2+(H+160)**2)/pxPerMs; }
      else                    { sx=-80;  sy=H+80; vx=spd*.7;  vy=-spd*.7; travelMs=Math.sqrt((W+160)**2+(H+160)**2)/pxPerMs; }
      return { sx, sy, vx, vy, travelMs, fadeInMs:travelMs*0.12, fadeOutStart:travelMs*0.88, fadeOutMs:travelMs*0.12 };
    };

    const buildSlotContent = (slot: Slot, now: number) => {
      const item = nextFg();
      const phrase = item.t;
      const c = makeCrossing();
      const font = item.f ?? pick(enFonts);
      const color = pick(colors);
      const sz = rand(0.95, 1.4);
      const rot = rand(-12, 12);
      const sp = specialRenderers[phrase];
      slot.c = c; slot.x = c.sx; slot.y = c.sy; slot.vx = c.vx; slot.vy = c.vy;
      slot.rot = rot; slot.startTime = now; slot.active = true; slot.waitUntil = 0;
      slot.el.style.cssText = `position:absolute;left:0;top:0;pointer-events:none;line-height:1.45;text-align:center;max-width:260px;white-space:normal;will-change:transform,opacity;font-family:${font};font-size:${sz}rem;color:${color};font-weight:700;opacity:0;`;
      slot.el.innerHTML = "";
      if (sp) {
        sp(slot.el, font, color, sz);
      } else {
        const t = Math.random();
        if (t < 0.11) {
          slot.el.innerHTML = `<span style="background:rgba(255,200,30,0.35);padding:0 3px;border-radius:1px;font-family:${font};font-size:${sz}rem;color:${color};">${phrase}</span>`;
        } else if (t < 0.18 && !item.f) {
          slot.el.innerHTML = `<span style="font-family:'Courier Prime',monospace;font-size:${sz*0.88}rem;color:#1a1410;letter-spacing:0.04em;">${phrase}</span>`;
        } else {
          slot.el.innerHTML = `<span style="font-family:${font};font-size:${sz}rem;color:${color};">${phrase}</span>`;
        }
      }
    };

    // Pre-create SPOT_MAX slots
    const slots: Slot[] = Array.from({ length: SPOT_MAX }, () => {
      const el = document.createElement("div");
      el.style.opacity = "0";
      fgEl.appendChild(el);
      return { el, active:false, startTime:0, waitUntil:0, x:0, y:0, vx:0, vy:0, c:null, rot:0, enabled:false };
    });

    let targetCount = randInt(SPOT_MIN, SPOT_MAX);
    let lastTargetChange = 0;
    let initialized = false;

    const initSlots = (now: number) => {
      for (let i = 0; i < SPOT_MAX; i++) {
        slots[i].enabled = i < targetCount;
        if (slots[i].enabled) slots[i].waitUntil = now + i * randInt(400, 1200);
      }
    };

    const easeInOut = (t: number) => t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2;

    const loop = (now: number) => {
      // Background
      for (let i = 0; i < bgP.length; i++) {
        const p = bgP[i];
        p.x += p.vx; p.y += p.vy; p.wobble += p.wobbleSpd;
        if (bgOff(p)) placeBg(p, false);
        p.el.style.transform = `translate(${p.x + Math.sin(p.wobble)*p.wobbleAmp}px,${p.y + Math.cos(p.wobble*0.7)*p.wobbleAmp}px) rotate(${p.rot}deg)`;
      }

      if (!initialized) { initSlots(now); initialized = true; }

      // Re-roll target count
      if (now - lastTargetChange > TARGET_CHANGE_MS) {
        targetCount = randInt(SPOT_MIN, SPOT_MAX);
        lastTargetChange = now;
        let running = 0;
        for (let i = 0; i < SPOT_MAX; i++) {
          if (running < targetCount) {
            if (!slots[i].enabled) { slots[i].enabled = true; if (!slots[i].active) slots[i].waitUntil = now + randInt(0, 800); }
            running++;
          } else {
            slots[i].enabled = false;
          }
        }
      }

      // Tick foreground
      for (let i = 0; i < SPOT_MAX; i++) {
        const s = slots[i];
        if (!s.active) {
          if (!s.enabled) continue;
          if (s.waitUntil > 0 && now >= s.waitUntil) buildSlotContent(s, now);
          continue;
        }
        const elapsed = now - s.startTime;
        s.x += s.vx; s.y += s.vy;
        let op: number;
        if      (elapsed <= s.c!.fadeInMs)      op = easeInOut(elapsed / s.c!.fadeInMs);
        else if (elapsed <= s.c!.fadeOutStart)  op = 1;
        else if (elapsed <= s.c!.travelMs)      op = easeInOut(1 - (elapsed - s.c!.fadeOutStart) / s.c!.fadeOutMs);
        else                                    op = 0;
        s.el.style.transform = `translate(${s.x}px,${s.y}px) rotate(${s.rot}deg)`;
        s.el.style.opacity = String(op);
        if (elapsed >= s.c!.travelMs) {
          s.active = false;
          s.el.style.opacity = "0";
          if (s.enabled) s.waitUntil = now + 50;
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      bgEl.innerHTML = "";
      fgEl.innerHTML = "";
    };
  }, []);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Kalam:wght@400;700&family=Indie+Flower&family=Permanent+Marker&family=Rock+Salt&family=Shadows+Into+Light&family=Architects+Daughter&family=Nothing+You+Could+Do&family=Reenie+Beanie&family=Special+Elite&family=Courier+Prime:wght@400;700&family=Noto+Sans+Arabic&family=Noto+Sans+Devanagari&family=Noto+Sans+Bengali&family=Noto+Sans+SC&display=swap');
        html, body { margin: 0; padding: 0; overflow: hidden; width: 100%; height: 100%; }
      `}</style>

      <main
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: "#f5ede4",
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.007) 3px,rgba(0,0,0,0.007) 4px),repeating-linear-gradient(90deg,transparent,transparent 14px,rgba(0,0,0,0.004) 14px,rgba(0,0,0,0.004) 15px)",
        }}
      >
        {/* Background ghost layer */}
        <div
          ref={bgRef}
          style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 3 }}
        />

        {/* Foreground spotlight layer */}
        <div
          ref={fgRef}
          style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none", overflow: "hidden" }}
        />

        {/* Title */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            textAlign: "center",
            padding: "1rem",
          }}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <div
              style={{
                fontFamily: "'Rock Salt', cursive",
                fontSize: "clamp(2.4rem, 8.5vw, 5rem)",
                fontWeight: 400,
                color: "#1a1210",
                letterSpacing: "-0.02em",
                transform: "rotate(-1.5deg)",
                display: "inline-block",
              }}
            >
              JUST-A-MOM
            </div>
            <svg
              viewBox="0 0 480 18"
              width="100%"
              style={{ display: "block", marginTop: "-2px", opacity: 0.35, overflow: "visible" }}
            >
              <path d="M4 10 Q60 4 120 10 Q180 16 240 10 Q300 4 360 10 Q420 16 476 10" stroke="#7a5030" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M4 14 Q80 10 160 14 Q240 18 320 14 Q400 10 476 14" stroke="#7a5030" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.3"/>
            </svg>
          </div>
          <p
            style={{
              marginTop: "0.7rem",
              fontFamily: "'Kalam', cursive",
              fontSize: "0.88rem",
              color: "rgba(50,30,15,0.38)",
              letterSpacing: "0.06em",
            }}
          >
            millions of us. still showing up.
          </p>
        </div>
      </main>
    </>
  );
}
