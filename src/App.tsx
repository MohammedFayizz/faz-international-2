import React, { useState, useEffect } from "react";
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useSpring 
} from "framer-motion";
import { 
  Terminal, 
  Cpu, 
  Layers, 
  CheckCircle, 
  ArrowUpRight, 
  Sliders, 
  Clock, 
  Send,
  Zap,
  Lock,
  Compass,
  Activity,
  Award,
  Infinity,
  FileText,
  Facebook,
  Instagram
} from "lucide-react";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer 
} from "recharts";
import confetti from "canvas-confetti";
import { PCBCircuitBackground } from "./components/PCBCircuitBackground";

// Web Audio synthesizer utility - Boosted volume for clear, high-fidelity tactile feedback
const triggerTickAudio = (freq = 1100, customVolume = 0.12) => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    // Boost volume by an additional factor to ensure a high, clear volume level
    const finalVolume = customVolume * 4.5;
    gainNode.gain.setValueAtTime(finalVolume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.16);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.16);
  } catch (error) {
    // Fail silently when browser restricts audio initialization before gesture
  }
};

// Skills Data
const skills = [
  { name: "Web & App Development", level: 94, category: "Software", desc: "Professional business websites & iOS & Android apps" },
  { name: "CRM Development", level: 95, category: "Software", desc: "All customer data auto-saved CRM Custom" },
  { name: "AI Voice Agent", level: 98, category: "AI Solutions", desc: "Handles calls, answers like a real human 24/7" },
  { name: "Chatbot Development", level: 90, category: "AI Solutions", desc: "Smart bots for your business" },
  { name: "Automation-WhatsApp/Email & Custom", level: 96, category: "AI Solutions", desc: "Instant auto-replies and follow-ups and other custom works flows" },
  { name: " AI Bookkeeping Accounting", level: 92, category: "Accounting", desc: "Every transaction recorded and organised automatically Help of AI from entries to financial statements" },
  { name: "ERP & Custom Software Development", level: 97, category: "Software", desc: "Tailored solutions for your needs" },
  { name: "VAT ,Tax Filing & Payroll", level: 91, category: "Accounting", desc: "Saudi VAT calculations prepared and filed automatically & Employee salaries processed on time every month" },
  { name: "ZATCA Regulations", level: 87, category: "Accounting", desc: "Fully compliant with ZATCA e-invoicing and Saudi tax System requirements." }
];

// Monthly sliding pricing scale for each tier
const planPricingSchedule: Record<string, Record<number, number>> = {
  standard: {
    1: 950, 2: 950, 3: 950, 4: 941, 5: 941, 6: 930, 7: 930, 8: 922, 9: 922, 10: 912, 11: 912, 12: 902
  },
  platinum: {
    1: 1610, 2: 1610, 3: 1594, 4: 1594, 5: 1578, 6: 1578, 7: 1562, 8: 1562, 9: 1546, 10: 1546, 11: 1530, 12: 1530
  },
  enterprise: {
    1: 2000, 2: 2000, 3: 1980, 4: 1980, 5: 1960, 6: 1960, 7: 1940, 8: 1940, 9: 1920, 10: 1920, 11: 1900, 12: 1900
  }
};

// Plans Data with interactive modifier presets
const planPresets = [
  {
    id: "standard",
    name: "Starter ⭐",
    description: "Perfect for small businesses just getting started with AI automation.",
    price: 950,
    delivery: "14 Days",
    features: [
      "800 mins/month",
      "AI Voice Agent",
      "WhatsApp, Email & Custom Automation",
      "Google CRM Sheet,Calendar Management,Multilingual Arabic ,English & Hindi",
      "Extra Minutes 1.310 SAR/min",
      "Setup Fee FREE,Annual Discount 5% off"
    ],
    badge: "Plan 1"
  },
  {
    id: "platinum",
    name: "Growth 🚀",
    description: "For growing businesses ready to scale faster and serve more customers.",
    price: 1610,
    delivery: "14 Days",
    features: [
      "1,300 mins/month",
      "AI Voice Agent",
      "WhatsApp, Email & Custom Automation",
      "Google CRM Sheet,Calendar Management, Multilingual Arabic, English & Hindi",
      "Booking ,Quotation & Custom AI",
      "Extra Minutes 1.310 SAR/min",
      "Setup Fee FREE,Annual Discount 5% off"
    ],
    badge: "Plan 2",
    popular: true
  },
  {
    id: "enterprise",
    name: "Pro 💎",
    description: "For established businesses that demand the best — zero compromises.",
    price: 2000,
    delivery: "14 Days",
    features: [
      "2,400 mins/month",
      "AI Voice Agent",
      "WhatsApp, Email & Custom Automation",
      "Google CRM Sheet, Calendar Management, Multilingual Arabic, English & Hindi",
      "Booking , Quotation ,Custom AI & Automatic Integration",
      "Extra Minutes 1.310 SAR/min",
      "Setup Fee FREE,Annual Discount 5% off"
    ],
    badge: "Plan 3 "
  }
];

// Reusable cinematic text animations utilizing physical ease curves and custom blur focus
const animTextContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  },
  viewport: { once: true, margin: "-10%" }
};

const animTextChild = {
  initial: { opacity: 0, y: 16, filter: "blur(3px)" },
  whileInView: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

// Physics-based Pop, Soft Slide-up, and Stagger entries
const animPopIn = {
  initial: { opacity: 0, scale: 0.93, y: 10 },
  whileInView: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 14,
      mass: 0.8
    }
  },
  viewport: { once: true, margin: "-8%" }
};

const animSoftSlideUp = {
  initial: { opacity: 0, y: 35 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 75,
      damping: 18
    }
  },
  viewport: { once: true, margin: "-8%" }
};

const animSoftSlideRight = {
  initial: { opacity: 0, x: -35 },
  whileInView: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 75,
      damping: 18
    }
  },
  viewport: { once: true, margin: "-8%" }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1
    }
  },
  viewport: { once: true, margin: "-8%" }
};

const radarData = [
  { subject: "Call Handles", score: 95 },
  { subject: "Hours Saved", score: 92 },
  { subject: "Response Time", score: 88 },
  { subject: "Language", score: 90 },
  { subject: "uptime", score: 98 }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [proposalSubmitted, setProposalSubmitted] = useState<boolean>(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  
  // Custom Dynamic Island states
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Monitor scroll for Dynamic Island contraction & mobile detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  // Interactive pricing configuration parameters
  const [customTermMonths, setCustomTermMonths] = useState<number>(3);
  const [addSlaGuarantee, setAddSlaGuarantee] = useState<boolean>(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("platinum");

  // Contact form state fields
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(1);
  const [clientProposalNotes, setClientProposalNotes] = useState("");
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Sync cursor halos
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Filter skills by category selection
  const filteredSkills = skills.filter((item) => {
    if (activeTab === "All") return true;
    return item.category === activeTab;
  });

  const activePlanPrice = planPresets.find(p => p.id === selectedPlanId) || planPresets[1];

  // Dynamic calculations based on client interaction parameters and exact monthly sliding scale
  const calculateDerivedPricing = (planId = selectedPlanId) => {
    let basePrice = 950;
    const schedule = planPricingSchedule[planId];
    if (schedule && schedule[customTermMonths]) {
      basePrice = schedule[customTermMonths];
    } else {
      const activePlan = planPresets.find(p => p.id === planId) || planPresets[1];
      basePrice = activePlan.price;
    }
    if (addSlaGuarantee) {
      basePrice += 100; // Customisation upgrade fee
    }
    return basePrice;
  };

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) {
      alert("Please specify your full name and email address.");
      return;
    }
    triggerTickAudio(1400, 0.08);

    const activePlan = planPresets.find(p => p.id === selectedPlanId);
    const planName = activePlan ? activePlan.name : selectedPlanId;
    const levelSelected = ["Starter", "Growth", "Pro"][selectedPresetIndex] || "Growth";
    
    const testPhone = "966534394509";
    const text = encodeURIComponent(`*FAZ Business Inquiry*\n\n*Name:* ${clientName}\n*Email:* ${clientEmail}\n*Selected Plan Level:* ${levelSelected}\n*Plan Bracket:* ${planName} (${customTermMonths} Months Term)\n*Customization (SLA Add-on):* ${addSlaGuarantee ? "Yes" : "No"}\n*Calculated Estimate:* ${calculateDerivedPricing().toLocaleString()} ⃁\n\n*Details & Business Notes:*\n${clientProposalNotes || "None specified"}`);
    const whatsAppUrl = `https://wa.me/${testPhone}?text=${text}`;
    
    try {
      const newWin = window.open(whatsAppUrl, "_blank");
      if (!newWin || newWin.closed || typeof newWin.closed === "undefined") {
        window.location.href = whatsAppUrl;
      }
    } catch (err) {
      window.location.href = whatsAppUrl;
    }

    confetti({
      particleCount: 140,
      spread: 75,
      origin: { y: 0.6 },
      colors: ["#00D4FF", "#10b981", "#1e1b4b"]
    });
    setProposalSubmitted(true);
  };

  const resetProposalState = () => {
    setProposalSubmitted(false);
    setClientName("");
    setClientEmail("");
    setClientProposalNotes("");
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden font-sans select-none text-zinc-300">
      
      {/* Dynamic Background Noise and Grid lines */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-[0.25] z-0" />
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-[#00D4FF]/5 rounded-full filter blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-purple-500/5 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Luxury Reactive Cursor Glow */}
      <div 
        id="cursor-glow"
        className="fixed w-[280px] h-[280px] bg-gradient-to-r from-[#00D4FF]/10 to-indigo-500/10 rounded-full filter blur-[60px] pointer-events-none z-10 transition-transform duration-200 ease-out"
        style={{
          left: cursorPos.x - 140,
          top: cursorPos.y - 140
        }}
      />

      {/* Top Reading Tracker */}
      <motion.div 
        id="top-scroll-progress"
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#00D4FF] via-zinc-300 to-indigo-600 origin-left z-50"
        style={{ scaleX }}
      />

      {/* CENTERING WRAPPER FOR DYNAMIC ISLAND NAVBAR */}
      <div className="fixed top-4 left-0 right-0 z-50 w-full flex justify-center px-4 pointer-events-none">
        <motion.div
          layout
          onHoverStart={() => {
            setIsHovered(true);
            triggerTickAudio(1200, 0.03);
          }}
          onHoverEnd={() => setIsHovered(false)}
          onClick={() => {
            if (isScrolled && !isHovered && !isMobile) {
              triggerTickAudio(900, 0.04);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className={`pointer-events-auto backdrop-blur-md transition-all duration-300 ease-out flex items-center justify-between shadow-2xl ${
            isScrolled && !isHovered && !isMobile
              ? "rounded-full w-[190px] h-10 px-4 border border-zinc-800/90 bg-black shadow-[#00D4FF]/10 cursor-pointer hover:border-[#00D4FF]/40" 
              : "rounded-full max-w-4xl w-full h-[46px] sm:h-[56px] px-2 sm:px-6 border border-zinc-900 bg-zinc-950/95"
          }`}
        >
          <AnimatePresence mode="wait">
            {isScrolled && !isHovered && !isMobile ? (
              <motion.div 
                key="compact-island"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center justify-between w-full font-mono text-xs"
              >
                <div className="flex items-center gap-1.5">
                  <Infinity className="w-3.5 h-3.5 text-[#00D4FF]" />
                  <span className="text-white font-extrabold tracking-wider">FAZ INT</span>
                </div>
                <div className="flex items-center gap-1.5 bg-zinc-900/80 px-2 py-0.5 rounded-full border border-zinc-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="expanded-island"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between w-full h-full gap-2"
              >
                {/* Brand Logo */}
                <div 
                  id="brand-logo"
                  className="flex items-center gap-1 sm:gap-2 cursor-pointer group shrink-0"
                  onClick={() => {
                    triggerTickAudio(900, 0.05);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 flex items-center justify-center shadow-md shadow-[#00D4FF]/10 transition-all group-hover:border-[#00D4FF]/30">
                    <Infinity className="w-3 h-3 sm:w-4 sm:h-4 text-[#00D4FF]" />
                  </div>
                  <div>
                    <span className="font-extrabold text-[8px] xs:text-[9px] sm:text-xs tracking-wider text-white">
                      FAZ INT<span className="hidden sm:inline">ERNATIONAL</span>
                    </span>
                  </div>
                </div>

                {/* Magnetic Central Navigation Menu */}
                <nav className="flex items-center gap-1 sm:gap-4 md:gap-6 text-[8px] sm:text-xs font-semibold text-zinc-400">
                  {["Home", "Plans", "Services", "Capabilities", "About", "Contact"].map((sec) => (
                    <a
                      id={`nav-${sec.toLowerCase()}`}
                      key={sec}
                      href={sec === "Home" ? "#" : sec === "About" ? "#about" : `#${sec.toLowerCase()}`}
                      onClick={(e) => {
                        triggerTickAudio(1100, 0.05);
                        if (sec === "Home") {
                          e.preventDefault();
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          window.history.pushState("", document.title, window.location.pathname + window.location.search);
                        } else if (sec === "About") {
                          e.preventDefault();
                          setShowAbout(true);
                        }
                      }}
                      className="hover:text-[#00D4FF] transition-all relative py-1 hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.4)]"
                    >
                      {sec}
                    </a>
                  ))}
                </nav>

                {/* Interactive Secure Action Portal */}
                <div className="flex items-center shrink-0">
                  <a 
                    id="cta-broadcast"
                    href="#contact" 
                    onClick={() => triggerTickAudio(1300, 0.05)}
                    className="bg-zinc-900/60 border border-zinc-800 text-[#00D4FF] hover:border-[#00D4FF]/50 text-[7.5px] sm:text-[11px] px-1.5 py-1 sm:px-4 sm:py-2 rounded-full font-mono flex items-center gap-1 transition-all focus:ring focus:ring-[#00D4FF]/30 hover:bg-zinc-900 font-bold tracking-tight"
                  >
                    <Cpu className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="hidden sm:inline">GET STARTED</span>
                    <span className="inline sm:hidden">START</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* HERO & DYNAMIC DASHBOARD AREA (HOME) */}
      <section id="home" className="relative w-full overflow-hidden border-b border-zinc-900/50 z-20">
        {/* PCB Circuit Board Animated Background */}
        <div className="absolute inset-0 z-0 opacity-[0.25] pointer-events-none">
          <PCBCircuitBackground />
        </div>

        <div className="relative z-10 pt-32 sm:pt-36 pb-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <motion.div 
            variants={animSoftSlideRight}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-8"
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Let AI Run Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-neutral-100 to-[#00D4FF]">Business.</span> <br />
              You Run Your Vision.
            </h1>

            <p className="text-zinc-400 text-lg max-w-xl leading-relaxed font-normal">
              FAZ International is a technology company delivering AI Agents, software development, and automated accounting systems — built to make your business smarter, faster, and unstoppable.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                id="btn-plans-scroll"
                href="#plans" 
                onClick={() => triggerTickAudio(950, 0.07)}
                className="bg-gradient-to-r from-[#00D4FF]/95 to-indigo-600/95 hover:from-[#00D4FF] hover:to-indigo-600 text-white font-bold text-xs px-6 py-3.5 rounded-md flex items-center gap-2 shadow-lg shadow-[#00D4FF]/10 transition-all hover:-translate-y-0.5"
              >
                <span>CHOOSE ENGAGEMENT PLAN</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a 
                id="btn-services-scroll"
                href="#services" 
                onClick={() => triggerTickAudio(800, 0.05)}
                className="bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 font-semibold text-xs px-6 py-3.5 rounded-md flex items-center gap-2 transition-all hover:bg-zinc-900"
              >
                <span>CORE SERVICES</span>
                <Layers className="w-4 h-4" />
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-900 text-left font-mono">
              <div>
                <p className="text-xl font-bold text-white font-mono">100+</p>
                <p className="text-xs text-zinc-500 uppercase font-semibold">WORK FLOWS</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white font-mono">99%</p>
                <p className="text-xs text-zinc-500 uppercase font-semibold">TRUST SUCCESS</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white font-mono">100+</p>
                <p className="text-xs text-zinc-500 uppercase font-semibold">LANGUAGES AND FEATURES</p>
              </div>
            </div>
          </motion.div>

          {/* HIGH-PRECISION CHARTS DEPICTING LIVE DATA INTERACTIVES */}
          <motion.div 
            variants={animPopIn}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="relative p-6 rounded-2xl bg-zinc-950 border border-zinc-900 shadow-xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#00D4FF]" />
                  <span className="font-mono text-xs font-bold text-white">SYS_INCLUDES.LOG</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                </div>
              </div>

              {/* Live Metric Readout inside home header */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-900">
                  <span className="text-[10px] text-zinc-500 block">Integration</span>
                  <span className="text-lg font-bold text-white font-mono">Customisable</span>
                </div>
                <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-900">
                  <span className="text-[10px] text-zinc-500 block">Capables</span>
                  <span className="text-lg font-bold text-[#00D4FF] font-mono">24/7 AI Service</span>
                </div>
              </div>

              {/* Recharts Radar Frame */}
              <div className="h-[210px] w-full bg-black/40 rounded-lg p-2 border border-zinc-900 flex items-center justify-center min-w-0 min-h-0">
                <ResponsiveContainer width="100%" height={190}>
                  <RadarChart cx="50%" cy="50%" outerRadius="62%" data={radarData}>
                    <PolarGrid stroke="#27272a" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: "#a1a1aa", fontSize: 9, fontFamily: "monospace", fontWeight: 700 }} 
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]} 
                      tick={false} 
                      axisLine={false} 
                    />
                    <Radar 
                      name="Score" 
                      dataKey="score" 
                      stroke="#00D4FF" 
                      fill="#00D4FF" 
                      fillOpacity={0.2} 
                      strokeWidth={2} 
                      isAnimationActive={false}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[10px] text-zinc-600 font-mono text-center flex items-center justify-center gap-1">
                <span>AI Solution Agent</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>

      {/* INTERACTIVE ENGAGEMENT PLANS SECTION */}
      <section id="plans" className="relative py-24 bg-zinc-950/40 border-y border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-6">
          
          <motion.div 
            variants={animTextContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-10%" }}
            className="mb-14 text-center"
          >
            <motion.span variants={animTextChild} className="text-xs font-bold text-[#00D4FF] tracking-widest uppercase block">ENGAGEMENT LAYERS</motion.span>
            <motion.h2 variants={animTextChild} className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Choose Plan Presets</motion.h2>
            <motion.p variants={animTextChild} className="text-zinc-500 text-sm max-w-lg mx-auto mt-2">
              Every plan includes AI Voice Agent, WhatsApp automation, email automation, Google CRM, and calendar management — everything your business needs to run on autopilot.
            </motion.p>
          </motion.div>

          {/* DYNAMIC CALCULATOR MODIFIER CONTROLS */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 mb-12 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#00D4FF]">
                  <Sliders className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold tracking-wider uppercase">Interactive Plan Customizer</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Choose your plan and we'll set everything up for you — no technical knowledge needed.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {/* commitment duration slider */}
                <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800 flex flex-col gap-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-mono">TERM</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="range"
                      min="1"
                      max="12"
                      value={customTermMonths}
                      onChange={(e) => {
                        setCustomTermMonths(parseInt(e.target.value));
                        triggerTickAudio(1050, 0.04);
                      }}
                      className="cursor-pointer accent-[#00D4FF]"
                    />
                    <span className="text-xs font-mono font-bold text-white min-w-[50px]">{customTermMonths} Months</span>
                  </div>
                </div>

                {/* extra SLA safety checkpoint trigger toggle */}
                <button
                  id="toggle-sla"
                  type="button"
                  onClick={() => {
                    setAddSlaGuarantee(!addSlaGuarantee);
                    triggerTickAudio(970, 0.05);
                  }}
                  className={`px-3 py-2.5 rounded-lg border text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                    addSlaGuarantee 
                      ? "bg-[#00D4FF]/20 border-[#00D4FF] text-white" 
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-300"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Customisation {addSlaGuarantee ? "[ON]" : "[OFF]"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* THREE-TIER PRODUCT CARDS */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-8%" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {planPresets.map((planPreset) => {
              const isSelected = selectedPlanId === planPreset.id;
              return (
                <motion.div
                  variants={animPopIn}
                  whileHover={{ 
                    scale: isSelected ? 1.04 : 1.02, 
                    y: -5
                  }}
                  whileTap={{ scale: 0.98 }}
                  id={`plan-${planPreset.id}`}
                  key={planPreset.id}
                  onClick={() => {
                    setSelectedPlanId(planPreset.id);
                    triggerTickAudio(1150, 0.06);
                  }}
                  className={`relative p-8 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between border ${
                    isSelected 
                      ? "bg-zinc-900 border-[#00D4FF] shadow-lg shadow-[#00D4FF]/5" 
                      : "bg-zinc-950 border-zinc-900 hover:border-[#00D4FF]/40"
                  }`}
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900/60 px-2.5 py-1 rounded">
                        {planPreset.badge}
                      </span>
                      {planPreset.popular && (
                        <span className="text-[9px] font-mono text-white bg-gradient-to-r from-[#00D4FF] to-indigo-600 px-2 py-0.5 rounded-full font-bold">
                          RECOMMENDED
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{planPreset.name}</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">{planPreset.description}</p>
                    </div>

                    <div className="p-4 bg-black/40 rounded-xl border border-zinc-900/80">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-mono font-extrabold text-white">
                          {calculateDerivedPricing(planPreset.id).toLocaleString()} ⃁
                        </span>
                        <span className="text-xs text-zinc-500">per month</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Delivery: <b>{planPreset.delivery}</b></span>
                      </div>
                    </div>

                    <ul className="space-y-3 pt-2">
                      {planPreset.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-400">
                          <CheckCircle className="w-4 h-4 text-[#00D4FF] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <button
                      id={`btn-select-plan-${planPreset.id}`}
                      type="button"
                      className={`w-full py-2.5 rounded-md font-semibold text-xs transition-all relative overflow-hidden ${
                        isSelected 
                          ? "bg-gradient-to-r from-[#00D4FF]/90 to-indigo-600/90 hover:from-[#00D4FF] hover:to-indigo-600 text-white shadow-md" 
                          : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <span>{isSelected ? "Selected" : "Select"}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>



        </div>
      </section>

      {/* PROFESSIONAL SERVICES MILESTONE SECTION */}
      <section id="services" className="relative py-28 max-w-7xl mx-auto px-6 z-20">
        
        <motion.div 
          variants={animTextContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-10%" }}
          className="mb-14 text-center mx-auto"
        >
          <motion.span variants={animTextChild} className="text-xs font-bold text-[#00D4FF] tracking-widest uppercase block text-center">CORE CAPABILITIES</motion.span>
          <motion.h2 variants={animTextChild} className="text-3xl sm:text-4xl font-extrabold text-white mt-1 text-center">Our High-Performance Services</motion.h2>
          <motion.p variants={animTextChild} className="text-zinc-400 text-sm max-w-2xl mt-2 mx-auto text-center leading-relaxed">
            Leveraging cutting-edge AI systems to build intelligent products, automate workflows, and transform your business operations at scale.
          </motion.p>
        </motion.div>

        {/* HIGH-END SERVICES GRID ROW */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-8%" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          
          <motion.div 
            variants={animSoftSlideUp}
            whileHover={{ y: -6 }}
            className="p-8 rounded-2xl bg-zinc-950/60 border border-zinc-900 hover:border-[#00D4FF]/25 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#00D4FF] mb-5 group-hover:scale-105 transition-all">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Automation Pipelines</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed font-normal">
              We design and deploy end-to-end automation systems that eliminate manual bottlenecks — reducing operational overhead by up to 40% while keeping your processes fast, reliable, and scalable.
            </p>
          </motion.div>

          <motion.div 
            variants={animSoftSlideUp}
            whileHover={{ y: -6 }}
            className="p-8 rounded-2xl bg-zinc-950/60 border border-zinc-900 hover:border-indigo-400/25 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-105 transition-all">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Custom AI Interfaces</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed font-normal">
              We engineer bespoke AI-powered dashboards and user interfaces built around clarity and performance — giving your team real-time insight without the noise.
            </p>
          </motion.div>

          <motion.div 
            variants={animSoftSlideUp}
            whileHover={{ y: -6 }}
            className="p-8 rounded-2xl bg-zinc-950/60 border border-zinc-900 hover:border-purple-400/25 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-855 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-105 transition-all">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Intelligent Agent Systems</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed font-normal">
              From autonomous research agents to customer-facing AI assistants, we build LLM-powered systems that think, act, and deliver results with minimal human intervention.
            </p>
          </motion.div>

        </motion.div>

        {/* REAL-TIME CLIENT ACCREDITATIONS */}
        <div className="mt-16 bg-zinc-950 rounded-2xl p-8 border border-zinc-900 relative overflow-hidden">
          <div className="absolute right-0 top-0 text-[100px] font-black text-white/[0.01] pointer-events-none select-none">FAZ</div>
          <p className="text-sm font-semibold text-[#00D4FF] mb-4 flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span>OUR VISION</span>
          </p>
          <p className="text-zinc-300 text-sm leading-relaxed max-w-4xl italic">
            "We believe every business deserves access to intelligent technology. That's why we don't just consult — we build. We develop. We deliver. FAZ INT exists to close the gap between where you are and where AI can take you."
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-xs font-mono font-bold text-[#00D4FF]">
              FZ
            </div>
            <div>
              <p className="text-xs text-white font-bold">FAZ-international CEO & Founder</p>
              <p className="text-[10px] text-zinc-500">AI automation Agency</p>
            </div>
          </div>
        </div>

      </section>

      {/* BRAND ABOUT STORY SECTION (ABOUT) AS MODAL */}
      <AnimatePresence>
        {showAbout && (
          <section id="about" className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 pointer-events-auto">
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-2xl max-w-2xl w-full relative space-y-5 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <Infinity className="w-5 h-5 text-[#00D4FF]" />
                  <span>FAZ International Profile</span>
                </h3>
                <button
                  id="btn-close-about-top"
                  type="button"
                  onClick={() => {
                    triggerTickAudio(900, 0.05);
                    setShowAbout(false);
                  }}
                  className="text-zinc-500 hover:text-white transition-all text-sm font-semibold p-1 hover:bg-zinc-905"
                >
                  ✕
                </button>
              </div>

              <div className="text-sm text-zinc-300 overflow-y-auto max-h-[60vh] leading-relaxed space-y-6 pr-2 custom-scrollbar">
                {/* Our Story */}
                <div className="space-y-2">
                  <h4 className="text-sm font-mono font-bold text-[#00D4FF] uppercase tracking-widest">Our Story</h4>
                  <p className="text-white font-extrabold text-base leading-snug">Every great company starts with a problem worth solving.</p>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    In 2019, Mahammed Fayiz began as FCO Influencer — a digital presence built on one simple belief: that technology should work harder than people. What started as a platform for digital influence quickly evolved into something far more ambitious. By 2020, FAZ International was born — not just as a company, but as a vision for what business could become when artificial intelligence and human ingenuity work together.
                  </p>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    From a single desk in Dammam, Saudi Arabia, to becoming one of the region's most forward-thinking technology agencies, the journey of FAZ International is one of relentless curiosity, bold experimentation, and an unshakeable commitment to building solutions that have never existed before.
                  </p>
                </div>

                {/* Who We Are */}
                <div className="space-y-2 pt-2 border-t border-zinc-900">
                  <h4 className="text-sm font-mono font-bold text-[#00D4FF] uppercase tracking-widest">Who We Are</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    FAZ International is a Saudi-based AI and technology agency founded and led by Mahammed Fayiz, CEO and Developer. We don't just build software — we reimagine how businesses operate from the ground up.
                  </p>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    We are engineers, designers, and problem solvers who believe that every business — regardless of size — deserves access to the kind of intelligent automation that was once reserved only for global corporations.
                  </p>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    Based in Dammam, Eastern Province, Saudi Arabia, we serve clients across the Kingdom and beyond, delivering technology solutions that are not just functional, but genuinely transformational.
                  </p>
                </div>

                {/* The Man Behind */}
                <div className="space-y-2 pt-2 border-t border-zinc-900">
                  <h4 className="text-sm font-mono font-bold text-[#00D4FF] uppercase tracking-widest">The Man Behind FAZ International</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    <strong className="text-white">Mahammed Fayiz</strong> is a self-driven developer, entrepreneur, and technology visionary who founded FAZ International with one mission: to build solutions that no one else has dared to imagine.
                  </p>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    With deep expertise in AI development, system architecture, automation engineering, and business software, Fayiz has spent years mastering the tools that shape the future — and then building entirely new ones. He doesn't follow trends. He creates them.
                  </p>
                  <p className="text-zinc-400 text-xs sm:text-sm italic">
                    His philosophy is simple: "if it can be automated, it should be. If it doesn't exist yet, build it."
                  </p>
                </div>

                {/* What We Do */}
                <div className="space-y-3 pt-2 border-t border-zinc-900">
                  <h4 className="text-sm font-mono font-bold text-[#00D4FF] uppercase tracking-widest">What We Do</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    FAZ International specialises in a suite of technology solutions that sit at the intersection of artificial intelligence, business automation, and digital transformation:
                  </p>
                  <div className="grid grid-cols-1 gap-3 text-xs sm:text-sm">
                    <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/60">
                      <strong className="text-white block mb-1">🤖 AI & Automation</strong>
                      <span className="text-zinc-400 text-xs">We build AI voice receptionists that answer every call, book every appointment, generate every quotation, and update every CRM record — without a single human touch. Our AI systems work 24 hours a day, 7 days a week, never taking a break, never missing a message.</span>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/60">
                      <strong className="text-white block mb-1">💻 Web Development</strong>
                      <span className="text-zinc-400 text-xs">From sleek corporate websites to complex web applications, we craft digital experiences that are fast, modern, and built to convert.</span>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/60">
                      <strong className="text-white block mb-1">📊 ERP & CRM Systems</strong>
                      <span className="text-zinc-400 text-xs">Custom enterprise resource planning and customer relationship management systems designed specifically for the way Saudi businesses operate.</span>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/60">
                      <strong className="text-white block mb-1">💸 Accounting Software</strong>
                      <span className="text-zinc-400 text-xs">Intelligent accounting systems that eliminate manual data entry, automate financial reporting, and give business owners real-time visibility into their numbers.</span>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/60">
                      <strong className="text-white block mb-1">📦 Inventory Management</strong>
                      <span className="text-zinc-400 text-xs">Real-time stock tracking, purchase order automation, and warehouse management tools that keep your operations running without the chaos.</span>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/60">
                      <strong className="text-white block mb-1">⚙️ Custom Software Development</strong>
                      <span className="text-zinc-400 text-xs">When off-the-shelf software simply isn't enough, we build from scratch. Tailored, powerful, and built exclusively for your business needs.</span>
                    </div>
                  </div>
                </div>

                {/* Why FAZ International */}
                <div className="space-y-2 pt-2 border-t border-zinc-900">
                  <h4 className="text-sm font-mono font-bold text-[#00D4FF] uppercase tracking-widest">Why FAZ International</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    The world is full of software companies. What makes us different is not just what we build — it's how we think.
                  </p>
                  <p className="text-zinc-300 text-xs sm:text-sm">
                    We don't arrive with templates and tick-boxes. We arrive with questions. We study your business, understand your pain points, and then design solutions that fit your operations like they were always meant to be there.
                  </p>
                  <p className="text-zinc-400 text-xs sm:text-sm italic">
                    We have built AI systems that have made entire departments obsolete. We have automated workflows that once required full-time teams. We have created tools that our clients never knew they needed — until they couldn't imagine working without them. This is not arrogance. This is our track record.
                  </p>
                </div>

                {/* Our Values */}
                <div className="space-y-2 pt-2 border-t border-zinc-900">
                  <h4 className="text-sm font-mono font-bold text-[#00D4FF] uppercase tracking-widest">Our Values</h4>
                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <p><strong className="text-white">🚀 Innovation Without Limits:</strong> We challenge the assumption that things must work the way they always have. Every project we take on begins with the question: what if this could be done better?</p>
                    <p><strong className="text-white">🎯 Precision in Every Detail:</strong> Great technology is invisible. It works so seamlessly that users forget it is even there. We build with that standard in mind — every time.</p>
                    <p><strong className="text-white">🤝 Partnership Over Transaction:</strong> When you work with FAZ International, you are not buying a product. You are gaining a technology partner invested in the growth of your business.</p>
                    <p><strong className="text-white">🇸🇦 Saudi Vision, Global Standard:</strong> We are proud to be based in Saudi Arabia and even prouder to build at a standard that competes with the best technology companies anywhere in the world.</p>
                  </div>
                </div>

                {/* The Numbers That Define Us */}
                <div className="space-y-3 pt-2 border-t border-zinc-900">
                  <h4 className="text-sm font-mono font-bold text-[#00D4FF] uppercase tracking-widest">The Numbers That Define Us</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-900">
                      <span className="text-zinc-500 text-[10px] block uppercase font-bold">Founded</span>
                      <strong className="text-[#00D4FF] text-sm font-mono">2020</strong>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-900">
                      <span className="text-zinc-500 text-[10px] block uppercase font-bold">Headquarters</span>
                      <strong className="text-white text-xs">Dammam, Saudi Arabia</strong>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-900 col-span-2">
                      <span className="text-zinc-500 text-[10px] block uppercase font-bold">Specialisation</span>
                      <strong className="text-zinc-300 text-xs">AI Automation, Business Software, Web Development</strong>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-900">
                      <span className="text-zinc-500 text-[10px] block uppercase font-bold">Availability</span>
                      <strong className="text-zinc-300 text-xs font-mono">24h / 365 days a year</strong>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-900">
                      <span className="text-zinc-500 text-[10px] block uppercase font-bold">Mission</span>
                      <strong className="text-white text-xs">Build solutions not yet imagined</strong>
                    </div>
                  </div>
                </div>

                {/* Let's Build Something Extraordinary */}
                <div className="space-y-3 pt-2 border-t border-zinc-900">
                  <h4 className="text-sm font-mono font-bold text-[#00D4FF] uppercase tracking-widest">Let's Build Something Extraordinary</h4>
                  <p className="text-zinc-300 text-xs sm:text-sm">
                    If you are a business owner who believes that the way things have always been done is not necessarily the way they should be done — we want to talk to you.
                  </p>
                  <p className="text-white text-xs sm:text-sm font-bold">
                    The future of your business is automated, intelligent, and more profitable than you currently imagine. FAZ International will help you get there.
                  </p>
                </div>

                {/* Get in touch */}
                <div className="space-y-2 pt-3 border-t border-zinc-900 bg-zinc-900/40 p-3 rounded-xl border border-zinc-900">
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider">Get in touch:</h5>
                  <ul className="space-y-2 text-xs sm:text-sm text-zinc-400">
                    <li className="flex items-center gap-2">
                      <span>📧</span>
                      <a href="mailto:info@faz-international.com" className="hover:text-[#00D4FF] transition-all">info@faz-international.com</a>
                      <span>/</span>
                      <a href="mailto:mfzinternational@gmail.com" className="hover:text-[#00D4FF] transition-all">mfzinternational@gmail.com</a>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>📞💬</span>
                      <a href="https://wa.me/966534394509" target="_blank" rel="noreferrer" className="hover:text-[#00D4FF] transition-all">+966 53 439 4509</a>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>🌐</span>
                      <a href="https://www.faz-international.com" target="_blank" rel="noreferrer" className="hover:text-[#00D4FF] transition-all">www.faz-international.com</a>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>📍</span>
                      <span>Dammam, Eastern Province, Saudi Arabia</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-zinc-900">
                <button
                  id="btn-close-about"
                  type="button"
                  onClick={() => {
                    triggerTickAudio(900, 0.05);
                    setShowAbout(false);
                  }}
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-xs text-white px-5 py-2 rounded-lg font-semibold transition-all hover:text-[#00D4FF]"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </section>
        )}
      </AnimatePresence>

      {/* RE-ARCHITECTED FILTERABLE ABOUT MATRIX (ABOUT) */}
      <section id="capabilities" className="relative py-24 bg-zinc-950/40 border-y border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div
              variants={animTextContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-10%" }}
            >
              <motion.span variants={animTextChild} className="text-xs font-bold text-[#00D4FF] tracking-widest uppercase block">ABOUT & STRUCT MATRIX</motion.span>
              <motion.h2 variants={animTextChild} className="text-3xl sm:text-4xl font-extrabold text-white mt-1">Capabilities List</motion.h2>
              <motion.p variants={animTextChild} className="text-zinc-505 text-sm max-w-md mt-2">
                Our AI solutions carry a proven success rate built on real deployments and live business automation. Every score reflects our technical depth and delivery.
              </motion.p>
            </motion.div>

            {/* CATEGORY SELECTOR FILTERS */}
            <div className="flex flex-wrap gap-2.5">
              {["All", "AI Solutions", "Accounting", "Software"].map((cat) => {
                let btnId = `btn-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`;
                if (cat === "AI Solutions") btnId = "btn-filter-engineering";
                if (cat === "Accounting") btnId = "btn-filter-creative";
                if (cat === "Software") btnId = "btn-filter-software";
                return (
                  <button
                    id={btnId}
                    key={cat}
                    onClick={() => {
                      setActiveTab(cat);
                      triggerTickAudio(1250, 0.05);
                    }}
                    className={`px-3 py-2 text-xs font-mono font-bold rounded-md transition-all ${
                      activeTab === cat 
                        ? "bg-gradient-to-r from-[#00D4FF]/20 to-indigo-500/20 text-[#00D4FF] border border-[#00D4FF]/40" 
                        : "bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-500"
                    }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC RENDER OF FILTERED SKILL ITEMS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((sk) => (
                <motion.div
                  key={sk.name}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="p-6 rounded-xl bg-zinc-950 border border-zinc-900 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-bold text-white">{sk.name}</span>
                      <span className="text-xs font-mono font-semibold text-[#00D4FF] tracking-widest bg-zinc-900 px-2 py-0.5 rounded">
                        {sk.level}%
                      </span>
                    </div>
                    <p className="text-xs text-zinc-501 text-zinc-400 leading-relaxed font-normal">{sk.desc}</p>
                  </div>

                  {/* CUSTOM METRIC BAR */}
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full mt-4 overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[#00D4FF] to-indigo-500"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${sk.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.85, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* SECURE SUBMISSIONS COORDINATION PROTOCOL (CONTACT) */}
      <section id="contact" className="relative py-28 max-w-7xl mx-auto px-6 z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <motion.div 
            variants={animTextContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-10%" }}
            className="lg:col-span-5 space-y-6"
          >
            <motion.span variants={animTextChild} className="text-xs font-bold text-[#00D4FF] tracking-widest uppercase block">GET IN TOUCH</motion.span>
            <motion.h2 variants={animTextChild} className="text-3xl sm:text-4xl font-extrabold text-white">Let's Build Your AI System</motion.h2>
            <motion.p variants={animTextChild} className="text-zinc-500 text-sm leading-relaxed">
              Fill in your details and we'll get back to you within 24 hours with a full demo and setup plan tailored to your business.
            </motion.p>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-4 font-mono text-xs">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#00D4FF]" />
                <span className="text-white font-bold">DETAILS</span>
              </div>
              <p className="text-zinc-500">
                Email: <span className="text-white">info@faz-international.com</span> <br />
                Phone: <span className="text-white">+966 534 394 509</span> <br />
                Selected Plan Target: <span className="text-[#00D4FF] uppercase font-bold">{selectedPlanId === "standard" ? "starter" : selectedPlanId === "platinum" ? "growth" : "pro"}</span> <br />
                Estimated Scope Cost: <span className="text-emerald-400 font-bold">{calculateDerivedPricing().toLocaleString()} ⃁</span>
              </p>
            </div>
          </motion.div>

          <div className="lg:col-span-7">
            <div className="bg-zinc-950 p-8 rounded-2xl border border-zinc-900 relative shadow-xl">
              
              <AnimatePresence mode="wait">
                {!proposalSubmitted ? (
                  <motion.form 
                    key="proposal-form"
                    onSubmit={handleProposalSubmit} 
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-zinc-400 block font-semibold">Full Name *</label>
                        <input 
                          id="input-name"
                          type="text" 
                          required
                          placeholder="John"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00D4FF] focus:ring focus:ring-[#00D4FF]/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-zinc-400 block font-semibold">Email *</label>
                        <input 
                          id="input-email"
                          type="email" 
                          required
                          placeholder="john123@gmail.com"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00D4FF] focus:ring focus:ring-[#00D4FF]/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-mono text-zinc-400 block font-semibold">Select Plan</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Starter", "Growth", "Pro"].map((opt, ind) => (
                          <button
                            id={`btn-blueprint-${ind}`}
                            key={opt}
                            type="button"
                            onClick={() => {
                              setSelectedPresetIndex(ind);
                              triggerTickAudio(1000 + (ind * 100), 0.05);
                            }}
                            className={`py-2 px-1 text-[10px] sm:text-xs font-bold rounded border transition-all text-center ${
                              selectedPresetIndex === ind 
                                ? "bg-[#00D4FF]/20 border-[#00D4FF] text-white" 
                                : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-400"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono text-zinc-400 block font-semibold">Tell us about your business</label>
                      <textarea 
                        id="textarea-notes"
                        rows={4}
                        placeholder="Detail payment modules, UI contrast system needs, blockchain ledger speed metrics, etc..."
                        value={clientProposalNotes}
                        onChange={(e) => setClientProposalNotes(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00D4FF] focus:ring focus:ring-[#00D4FF]/20"
                      />
                    </div>

                    <div className="flex items-center gap-3 bg-zinc-900/60 p-3 rounded-lg border border-zinc-800">
                      <CheckCircle className={`w-5 h-5 shrink-0 transition-all duration-300 ${clientName.trim() && clientEmail.trim() ? "text-emerald-500 scale-110 opacity-100" : "text-zinc-650 opacity-20"}`} />
                      <p className="text-[10px] text-zinc-400 leading-normal">
                        We will contact you within <b className="text-white">24 hours</b> 
                      </p>
                    </div>

                    <button
                      id="btn-submit-proposal"
                      type="submit"
                      className="w-full py-3.5 rounded-md bg-gradient-to-r from-[#00D4FF] to-indigo-600 hover:opacity-90 font-bold text-xs text-white flex items-center justify-center gap-2 shadow-lg shadow-[#00D4FF]/10 hover:shadow-[#00D4FF]/25 transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </button>

                  </motion.form>
                ) : (
                  <motion.div 
                    key="proposal-success"
                    className="text-center py-12 space-y-6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-md">
                      <Zap className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">Proposal Stream Synced</h3>
                      <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                        Your custom fintech parameters have been encrypted & secure-broadcast directly to FAZ's workspace pipeline. A coordinator response has been queued for execution shortly.
                      </p>
                    </div>

                    <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-left max-w-sm mx-auto space-y-1.5 text-[11px] font-mono">
                      <p><span className="text-zinc-500">Transferred name:</span> <span className="text-white">{clientName}</span></p>
                      <p><span className="text-zinc-500">Secure link address:</span> <span className="text-white">{clientEmail}</span></p>
                      <p><span className="text-zinc-500">Allocated cost tier:</span> <span className="text-emerald-400 font-bold">{calculateDerivedPricing().toLocaleString()} ⃁</span></p>
                    </div>

                    <div className="pt-4">
                      <button
                        id="btn-submit-reset"
                        type="button"
                        onClick={() => {
                          triggerTickAudio(900, 0.04);
                          resetProposalState();
                        }}
                        className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs px-5 py-2.5 rounded text-white font-mono transition-colors"
                      >
                        [ INITIALIZE NEW PROPOSAL ]
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </section>

      {/* STATIC FOOTER (NOT FLOATING, PERMANENTLY EXPANDED) */}
      <footer className="border-t border-zinc-900 bg-black/90 py-8 px-6 relative z-20 mt-12 w-full flex justify-center">
        <div className="max-w-4xl w-full backdrop-blur-md rounded-2xl p-6 border border-zinc-800 bg-zinc-950/70 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[11px] text-zinc-400">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
            <div className="flex items-center gap-2">
              <Infinity className="w-4 h-4 text-[#00D4FF]" />
              <span className="text-white font-extrabold tracking-wider">FAZ INTERNATIONAL</span>
            </div>
            <span className="text-zinc-600 hidden md:inline">|</span>
            <span className="text-zinc-500">&copy; 2026. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6">
            <a href="#capabilities" onClick={() => triggerTickAudio(800, 0.05)} className="hover:text-[#00D4FF] hover:translate-x-0.5 transition-all duration-200">Capabilities</a>
            <a href="#plans" onClick={() => triggerTickAudio(800, 0.05)} className="hover:text-[#00D4FF] hover:translate-x-0.5 transition-all duration-200">Engagement Parameters</a>
            <a 
              href="#about" 
              onClick={(e) => {
                e.preventDefault();
                triggerTickAudio(800, 0.05);
                setShowAbout(true);
              }} 
              className="hover:text-[#00D4FF] hover:translate-x-0.5 transition-all duration-200"
            >
              About
            </a>
            <a 
              href="#terms" 
              onClick={(e) => {
                e.preventDefault();
                triggerTickAudio(800, 0.05);
                setShowTerms(true);
              }} 
              className="hover:text-[#00D4FF] hover:translate-x-0.5 transition-all duration-200"
            >
              Terms
            </a>

            <span className="text-zinc-800 hidden md:inline">|</span>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a 
                href="https://www.facebook.com/share/1aoJXZkEBo/" 
                target="_blank" 
                rel="noreferrer"
                onClick={() => triggerTickAudio(950, 0.06)}
                className="text-zinc-500 hover:text-[#00D4FF] hover:scale-110 transition-all duration-200 p-1 rounded hover:bg-zinc-900"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/fz.international?igsh=MTd0YzBlbnRubDhlaA==" 
                target="_blank" 
                rel="noreferrer"
                onClick={() => triggerTickAudio(950, 0.06)}
                className="text-zinc-500 hover:text-[#00D4FF] hover:scale-110 transition-all duration-200 p-1 rounded hover:bg-zinc-900"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://www.threads.com/@fz.international" 
                target="_blank" 
                rel="noreferrer"
                onClick={() => triggerTickAudio(950, 0.06)}
                className="text-zinc-500 hover:text-[#00D4FF] hover:scale-110 transition-all duration-200 p-1 rounded hover:bg-zinc-900"
                title="Threads"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12.427 14.5a2.531 2.531 0 0 1-1.002-.195 2.5 2.5 0 0 1-1.39-1.803c-.24-.997-.09-2.065.414-2.996a2.57 2.57 0 0 1 2.308-1.63c.137-.015.275-.028.411-.035v-.05c0-.986-.441-1.92-1.222-2.583a3.523 3.523 0 0 0-2.454-.73 3.733 3.733 0 0 0-2.174 1.071l-.782-.705A4.757 4.757 0 0 1 9.195 4.5c1.134-.117 2.235.197 3.125.914 1.002.836 1.562 2.057 1.562 3.348v3.188c0 .7.514 1.288 1.192 1.346a1.455 1.455 0 0 0 1.564-1.272c.01-.132.01-.266.01-.397V9.69a6.837 6.837 0 0 0-5.323-6.911c-3.619-.785-7.247 1.253-8.237 4.881-.93 3.424.747 6.942 3.962 8.277a8.55 8.55 0 0 0 3.253.46c.99-.108 1.93-.491 2.731-1.09l.635.794a9.92 9.92 0 0 1-3.183 1.258 10.15 10.15 0 0 1-3.791-.532C1.48 15.228-.49 11.127.57 7.195 1.63 3.262 5.72.31 9.9 1.157c3.642.747 6.069 4.015 6.069 7.742v1.1c-.01 1.282-.969 2.368-2.247 2.507a2.531 2.531 0 0 1-2.732-1.78l-.133.226c-.754.996-1.933 1.39-1.933 1.39l-.027.019a3.83 3.83 0 0 1-1.5-.361zm-.124-5.08c-.522.023-.953.27-1.218.704-.325.5-.395 1.121-.235 1.688.134.444.432.793.839.975.452.2.97.16 1.385-.098.428-.27.693-.736.693-1.26v-.931a3.67 3.67 0 0 0-1.464-.078z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Dynamic Terms Modal */}
      <AnimatePresence>
        {showTerms && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 pointer-events-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-2xl max-w-2xl w-full relative space-y-5 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#00D4FF]" />
                  <span>Terms &amp; Conditions</span>
                </h3>
                <button
                  id="btn-close-terms-top"
                  type="button"
                  onClick={() => {
                    triggerTickAudio(900, 0.05);
                    setShowTerms(false);
                  }}
                  className="text-zinc-500 hover:text-white transition-all text-sm font-semibold p-1"
                >
                  ✕
                </button>
              </div>

              <div className="text-sm text-zinc-300 overflow-y-auto max-h-[60vh] leading-relaxed space-y-6 pr-2 custom-scrollbar">
                
                {/* Header Information */}
                <div className="space-y-1 bg-zinc-900/40 p-4 rounded-xl border border-zinc-900">
                  <h4 className="text-sm font-mono font-bold text-[#00D4FF] uppercase tracking-wider">FAZ International — AI Automation Agency</h4>
                  <p className="text-xs text-zinc-400">Website: <a href="https://www.faz-international.com" target="_blank" rel="noreferrer" className="text-[#00D4FF] hover:underline">faz-international.com</a></p>
                  <p className="text-xs text-zinc-400">Effective Date: June 1, 2026</p>
                </div>

                {/* Section 1 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono"><span className="text-[#00D4FF]">01.</span> Introduction</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    Welcome to FAZ International. By accessing or using our website and services, you agree to be bound by these Terms &amp; Conditions. Please read them carefully before submitting any information or booking any service through faz-international.com.
                  </p>
                  <p className="text-zinc-400 text-xs sm:text-sm font-semibold italic text-zinc-500">
                    If you do not agree with any part of these terms, please do not use our website.
                  </p>
                </div>

                {/* Section 2 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono"><span className="text-[#00D4FF]">02.</span> Who We Are</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    FAZ International is an AI Automation Agency based in the Middle East, providing intelligent technology solutions including automation systems, AI-powered tools, and digital development services to businesses locally and internationally.
                  </p>
                  <ul className="text-zinc-400 text-xs space-y-1 pl-4 list-disc">
                    <li>Contact: <a href="https://www.faz-international.com" className="text-[#00D4FF] hover:underline">faz-international.com</a></li>
                    <li>Governing Jurisdiction: Kingdom of Saudi Arabia</li>
                  </ul>
                </div>

                {/* Section 3 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono"><span className="text-[#00D4FF]">03.</span> Information We Collect</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    When you contact us or book a service through our website, we collect the following personal information:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300 pl-4">
                    <div className="bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800/50">• Full Name</div>
                    <div className="bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800/50">• Email Address</div>
                    <div className="bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800/50">• Phone Number</div>
                    <div className="bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800/50">• Physical Address (required for delivery)</div>
                  </div>
                  <p className="text-zinc-400 text-xs sm:text-sm mt-2">
                    We only collect information that is necessary to deliver our services effectively and communicate with you professionally, including any additional information you voluntarily provide through our contact or booking forms.
                  </p>
                </div>

                {/* Section 4 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono"><span className="text-[#00D4FF]">04.</span> How We Use Your Information</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    Your personal information is used strictly for the following purposes:
                  </p>
                  <ul className="text-zinc-400 text-xs sm:text-sm space-y-1.5 pl-4 list-decimal">
                    <li>Responding to your inquiries submitted via our contact form</li>
                    <li>Processing and confirming your service bookings</li>
                    <li>Scheduling and managing appointments through our calendar system</li>
                    <li>Sending service-related updates and communications</li>
                    <li>Delivering the agreed AI automation services</li>
                    <li>Sending occasional newsletters or updates via email marketing (you may opt out at any time)</li>
                  </ul>
                  <p className="text-zinc-400 text-xs sm:text-sm italic">
                    We do not sell, rent, or trade your personal information to any third party for marketing purposes.
                  </p>
                </div>

                {/* Section 5 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono"><span className="text-[#00D4FF]">05.</span> Third-Party Tools We Use</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    To operate our services effectively, we use the following trusted third-party platforms:
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800"><strong className="text-white">Google Sheets &amp; Calendar</strong> — for organizing and managing client data, bookings, schedules, and appointment management.</div>
                    <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800"><strong className="text-white">Mailchimp</strong> — for regular, secure email communications and newsletters.</div>
                    <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800"><strong className="text-white">Other AI &amp; Automation Tools</strong> — used as part of the systems we engineer, build, and deliver for our clients.</div>
                  </div>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    Each of these platforms has its own privacy policy and data handling practices. By using our services, you acknowledge that your data may be processed through these tools as part of normal service delivery.
                  </p>
                </div>

                {/* Section 6 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono"><span className="text-[#00D4FF]">06.</span> Data Storage &amp; Security</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    Your data is stored securely within the platforms listed above. We take reasonable technical and organizational measures to protect your personal information from unauthorized access, loss, or misuse.
                  </p>
                  <p className="text-zinc-400 text-xs sm:text-sm italic">
                    However, no method of transmission over the internet is 100% secure. While we do our best to protect your data, we cannot guarantee absolute security.
                  </p>
                </div>

                {/* Section 7 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono"><span className="text-[#00D4FF]">07.</span> Your Rights</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    You have the right to:
                  </p>
                  <ul className="text-zinc-400 text-xs sm:text-sm space-y-1 pl-4 list-disc">
                    <li>Access the personal information we hold about you</li>
                    <li>Request correction of any inaccurate information</li>
                    <li>Request deletion of your personal data, subject to any legal or contractual obligations</li>
                    <li>Opt out of marketing emails at any time by clicking the unsubscribe link in any email we send</li>
                  </ul>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    To exercise any of these rights, contact us directly through <a href="https://www.faz-international.com" className="text-[#00D4FF] hover:underline">faz-international.com</a>.
                  </p>
                </div>

                {/* Section 8 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono"><span className="text-[#00D4FF]">08.</span> Refund Policy</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    At FAZ International, client satisfaction is our priority. We offer refunds under the following conditions:
                  </p>
                  <ul className="text-zinc-400 text-xs sm:text-sm space-y-1.5 pl-4 list-decimal">
                    <li>A refund may be requested if you are not satisfied with the service delivered.</li>
                    <li>Refund requests must be submitted within 14 days of service delivery.</li>
                    <li>Each request will be reviewed on a case-by-case basis by our team.</li>
                    <li>Refunds will be processed within 7–10 business days upon approval.</li>
                    <li>Services that have been fully delivered and approved by the client are not eligible for refund.</li>
                  </ul>
                  <p className="text-zinc-300 text-xs sm:text-sm font-bold">
                    We are committed to working with every client to reach a fair resolution.
                  </p>
                </div>

                {/* Section 9 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono"><span className="text-[#00D4FF]">09.</span> Booking &amp; Cancellations</h4>
                  <ul className="text-zinc-400 text-xs sm:text-sm space-y-1.5 pl-4 list-disc">
                    <li>Bookings are confirmed upon receipt of your submitted form and our written confirmation.</li>
                    <li>Cancellations must be requested at least 48 hours before the scheduled session.</li>
                    <li>Late cancellations may be subject to a rescheduling fee at our discretion.</li>
                    <li>No-shows without prior notice will forfeit any deposits paid.</li>
                  </ul>
                </div>

                {/* Section 10 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono"><span className="text-[#00D4FF]">10.</span> Intellectual Property</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    All content on faz-international.com including text, design, graphics, and service materials are the property of FAZ International. You may not copy, reproduce, or distribute any content without our written permission.
                  </p>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    AI systems, tools, and automations built specifically for a client become the property of that client upon full payment and project completion.
                  </p>
                </div>

                {/* Section 11 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono"><span className="text-[#00D4FF]">11.</span> Limitation of Liability</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    FAZ International will not be held liable for:
                  </p>
                  <ul className="text-zinc-400 text-xs sm:text-sm space-y-1 pl-4 list-disc">
                    <li>Any indirect or consequential loss resulting from use of our services</li>
                    <li>Technical failures of third-party platforms used in service delivery</li>
                    <li>Losses resulting from information provided inaccurately by the client</li>
                  </ul>
                  <p className="text-zinc-405 text-xs text-zinc-500 mt-2">
                    Our total liability in any case shall not exceed the amount paid for the specific service in question.
                  </p>
                </div>

                {/* Section 12 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono"><span className="text-[#00D4FF]">12.</span> Changes to These Terms</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    We reserve the right to update these Terms &amp; Conditions at any time. Changes will be posted on this page with an updated effective date. Continued use of our website or services after changes are posted constitutes your acceptance of the new terms.
                  </p>
                </div>

                {/* Section 13 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono"><span className="text-[#00D4FF]">13.</span> Governing Law</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    These Terms &amp; Conditions are governed by the laws of the Kingdom of Saudi Arabia. Any disputes will be resolved under Saudi jurisdiction unless otherwise agreed in writing.
                  </p>
                </div>

                {/* Section 14 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono"><span className="text-[#00D4FF]">14.</span> Contact Us</h4>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    If you have any questions about these Terms &amp; Conditions or how we handle your data, please reach out through our website:
                  </p>
                  <p className="text-[#00D4FF] font-bold text-xs sm:text-sm font-mono">
                    www.faz-international.com
                  </p>
                  <p className="text-zinc-400 text-xs font-mono">
                    FAZ International — AI Automation Agency
                  </p>
                </div>

              </div>

              <div className="flex justify-end pt-2 border-t border-zinc-900">
                <button
                  id="btn-close-terms"
                  type="button"
                  onClick={() => {
                    triggerTickAudio(900, 0.05);
                    setShowTerms(false);
                  }}
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-xs text-white px-5 py-2 rounded-lg font-semibold transition-all hover:text-[#00D4FF]"
                >
                  Close Terms
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
