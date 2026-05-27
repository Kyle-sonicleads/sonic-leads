import React, { useEffect, useState, useRef } from "react";
import { X, Menu, Zap, MapPin, Lock, CreditCard, PhoneCall, Check } from "lucide-react";

// ─── Trade data ───────────────────────────────────────────────────────────────
const TRADES = {
  plumber:     { key: "plumber",     emoji: "🔧", label: "Plumber",        firstName: "Dave",  defaultAvgJob: 350,  closeOutOf10: 6 },
  electrician: { key: "electrician", emoji: "⚡", label: "Electrician",    firstName: "Terry", defaultAvgJob: 380,  closeOutOf10: 6 },
  roofer:      { key: "roofer",      emoji: "🏠", label: "Roofer",         firstName: "Kev",   defaultAvgJob: 850,  closeOutOf10: 5 },
  builder:     { key: "builder",     emoji: "🧱", label: "Builder",        firstName: "Mick",  defaultAvgJob: 1200, closeOutOf10: 5 },
  plasterer:   { key: "plasterer",   emoji: "🪣", label: "Plasterer",      firstName: "Lee",   defaultAvgJob: 550,  closeOutOf10: 7 },
  waste:       { key: "waste",       emoji: "🚛", label: "Waste Removal",  firstName: "Scott", defaultAvgJob: 200,  closeOutOf10: 8 },
  kitchen:     { key: "kitchen",     emoji: "🍳", label: "Kitchen Fitter", firstName: "Craig", defaultAvgJob: 2200, closeOutOf10: 5 },
  other:       { key: "other",       emoji: "❓", label: "Other",          firstName: null,    defaultAvgJob: 500,  closeOutOf10: 6 },
} as const;

type TradeKey = keyof typeof TRADES;

function fmt(n: number) {
  return "£" + Math.round(n).toLocaleString("en-GB");
}

function getFullName(key: TradeKey): string {
  const names: Partial<Record<TradeKey, string>> = {
    plumber:     "Dave's plumbing company",
    electrician: "Terry's electrical company",
    roofer:      "Kev's roofing company",
    builder:     "Mick's building company",
    plasterer:   "Lee's plastering company",
    waste:       "Scott's waste removal company",
    kitchen:     "Craig's kitchen fitting company",
  };
  return names[key] ?? "";
}

// ─── Per-trade persona narrative ──────────────────────────────────────────────
function PersonaNarrative({
  tradeKey, leads, avgJobValue, closes, monthlyRev, annualRev,
}: {
  tradeKey: TradeKey; leads: number; avgJobValue: number;
  closes: number; monthlyRev: number; annualRev: number;
}) {
  const t = TRADES[tradeKey];
  const fullName = getFullName(tradeKey);

  const closerLine = (
    <p className="pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      No Checkatrade subscription. No shared leads. No quiet months wondering where the next job's coming from.{" "}
      <strong className="text-white">Just work — consistently.</strong>
    </p>
  );

  const annualLine = (
    <p>
      Over a year — assuming he stays consistent — that's{" "}
      <strong className="text-white">{fmt(annualRev)} in additional turnover</strong>{" "}
      from leads that cost a fraction of what he makes back.
    </p>
  );

  if (tradeKey === "other") {
    return (
      <div className="text-sm leading-relaxed space-y-3" style={{ color: "rgba(255,255,255,0.7)" }}>
        <p>
          Every trade is different. These numbers use a typical job value of{" "}
          <strong className="text-white">{fmt(avgJobValue)}</strong> — adjust it above to match your own average
          and see what a consistent pipeline of leads could do for your business.
        </p>
        <p>
          With <strong className="text-white">{leads} leads a month</strong> and closing{" "}
          <strong className="text-white">{t.closeOutOf10} out of every 10</strong>, you'd bring in an extra{" "}
          <strong style={{ color: "#00A8E8", fontSize: "1.1em" }}>{fmt(monthlyRev)}/month</strong> —{" "}
          that's <strong className="text-white">{fmt(annualRev)} a year</strong> in additional turnover.
        </p>
        {closerLine}
      </div>
    );
  }

  const leadWord = tradeKey === "roofer" ? "exclusive local roofing leads" : "exclusive local leads";

  const perTradeBody: Record<Exclude<TradeKey, "other">, React.ReactNode> = {
    plumber: (
      <>Dave owns a plumbing company and gets <strong className="text-white">{leads} {leadWord}</strong> from Sonic Leads every month. He wins roughly <strong className="text-white">{t.closeOutOf10} out of every 10 jobs he quotes</strong>. At <strong className="text-white">{fmt(avgJobValue)} a job</strong>, that's an extra <strong style={{ color: "#00A8E8", fontSize: "1.1em" }}>{fmt(monthlyRev)}/month</strong> in work he wouldn't have had without Sonic Leads.</>
    ),
    electrician: (
      <>Terry owns an electrical company and gets <strong className="text-white">{leads} {leadWord}</strong> every month. He wins roughly <strong className="text-white">{t.closeOutOf10} out of every 10 jobs he quotes</strong>. At <strong className="text-white">{fmt(avgJobValue)} a job</strong>, that's an extra <strong style={{ color: "#00A8E8", fontSize: "1.1em" }}>{fmt(monthlyRev)}/month</strong> flowing straight into the business.</>
    ),
    roofer: (
      <>Kev owns a roofing company and gets <strong className="text-white">{leads} {leadWord}</strong> every month. He wins roughly <strong className="text-white">{t.closeOutOf10} out of every 10 jobs he quotes</strong>. At <strong className="text-white">{fmt(avgJobValue)} a job</strong>, that's an extra <strong style={{ color: "#00A8E8", fontSize: "1.1em" }}>{fmt(monthlyRev)}/month</strong> in additional work to keep the lads busy.</>
    ),
    builder: (
      <>Mick owns a building company and gets <strong className="text-white">{leads} {leadWord}</strong> every month. He wins roughly <strong className="text-white">{t.closeOutOf10} out of every 10 jobs he quotes</strong>. At <strong className="text-white">{fmt(avgJobValue)} a job</strong>, that's an extra <strong style={{ color: "#00A8E8", fontSize: "1.1em" }}>{fmt(monthlyRev)}/month</strong> he wouldn't have had otherwise.</>
    ),
    plasterer: (
      <>Lee owns a plastering company and gets <strong className="text-white">{leads} {leadWord}</strong> every month. He wins roughly <strong className="text-white">{t.closeOutOf10} out of every 10 jobs he quotes</strong>. At <strong className="text-white">{fmt(avgJobValue)} a job</strong>, that's an extra <strong style={{ color: "#00A8E8", fontSize: "1.1em" }}>{fmt(monthlyRev)}/month</strong> of consistent work keeping the diary full.</>
    ),
    waste: (
      <>Scott owns a waste removal company and gets <strong className="text-white">{leads} exclusive local leads</strong> from Sonic Leads every month. He wins roughly <strong className="text-white">{t.closeOutOf10} out of every 10 jobs he quotes</strong> — people with waste to shift aren't shopping around, they just want it gone. At <strong className="text-white">{fmt(avgJobValue)} a job</strong>, that's an extra <strong style={{ color: "#00A8E8", fontSize: "1.1em" }}>{fmt(monthlyRev)}/month</strong>.</>
    ),
    kitchen: (
      <>Craig owns a kitchen fitting company and gets <strong className="text-white">{leads} {leadWord}</strong> every month. He wins roughly <strong className="text-white">{t.closeOutOf10} out of every 10 jobs he quotes</strong>. At <strong className="text-white">{fmt(avgJobValue)} a kitchen fit</strong>, that's an extra <strong style={{ color: "#00A8E8", fontSize: "1.1em" }}>{fmt(monthlyRev)}/month</strong> in work he wouldn't have had otherwise.</>
    ),
  };

  return (
    <div className="text-sm leading-relaxed space-y-3" style={{ color: "rgba(255,255,255,0.7)" }}>
      <p>{perTradeBody[tradeKey as Exclude<TradeKey, "other">]}</p>
      {annualLine}
      {closerLine}
    </div>
  );
}

// ─── Calculator ───────────────────────────────────────────────────────────────
function Calculator({ onBookCall }: { onBookCall: () => void }) {
  const [trade, setTrade] = useState<TradeKey>("roofer");
  const [leads, setLeads] = useState(15);
  const [avgJobValue, setAvgJobValue] = useState<number>(TRADES["roofer"].defaultAvgJob);

  const handleTradeChange = (newTrade: TradeKey) => {
    setTrade(newTrade);
    setAvgJobValue(TRADES[newTrade].defaultAvgJob);
  };

  const adjustJobValue = (delta: number) => {
    setAvgJobValue(prev => Math.min(5000, Math.max(50, Math.round((prev + delta) / 50) * 50)));
  };

  const handleJobValueInput = (raw: string) => {
    const n = parseInt(raw.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(n)) setAvgJobValue(Math.min(5000, Math.max(50, n)));
  };

  const t = TRADES[trade];
  const closes = Math.round(leads * (t.closeOutOf10 / 10));
  const monthlyRev = closes * avgJobValue;
  const annualRev = monthlyRev * 12;
  const fullName = getFullName(trade);
  const sliderPct = ((leads - 5) / 55) * 100;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#0D1424", border: "1px solid rgba(255,255,255,0.08)" }}>
      {/* Header */}
      <div className="px-8 pt-8 pb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="font-bold tracking-widest text-xs uppercase mb-3 block" style={{ color: "#006DB7" }}>The Maths</span>
        <h3 className="font-heading font-bold uppercase text-white leading-tight" style={{ fontSize: "clamp(1.6rem, 4vw, 2.25rem)" }}>
          How much could Sonic Leads make you?
        </h3>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
          Pick your trade and slide to your target leads. We'll show you exactly what that pipeline is worth.
        </p>
      </div>

      <div className="p-8">
        {/* Trade picker */}
        <div className="mb-7">
          <span className="text-xs font-semibold tracking-widest uppercase mb-3 block" style={{ color: "rgba(255,255,255,0.4)" }}>Pick your trade</span>
          <div className="flex flex-wrap gap-2">
            {(Object.values(TRADES) as typeof TRADES[TradeKey][]).map((tr) => {
              const active = trade === tr.key;
              return (
                <button
                  key={tr.key}
                  onClick={() => handleTradeChange(tr.key as TradeKey)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: active ? "#006DB7" : "rgba(255,255,255,0.05)",
                    border: active ? "1px solid #006DB7" : "1px solid rgba(255,255,255,0.1)",
                    color: active ? "#fff" : "rgba(255,255,255,0.55)",
                  }}
                >
                  {tr.emoji} {tr.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Leads slider */}
        <div className="mb-7">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>Leads per month</span>
            <span className="font-heading font-bold text-2xl" style={{ color: "#00A8E8" }}>{leads}</span>
          </div>
          <input
            type="range" min={5} max={60} step={5} value={leads}
            onChange={e => setLeads(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: "#006DB7", background: `linear-gradient(to right, #006DB7 ${sliderPct}%, rgba(255,255,255,0.1) ${sliderPct}%)` }}
          />
          <div className="flex justify-between mt-1.5 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            <span>5</span><span>60</span>
          </div>
        </div>

        {/* Avg job value control */}
        <div className="mb-8">
          <span className="text-xs font-semibold tracking-widest uppercase mb-3 block" style={{ color: "rgba(255,255,255,0.4)" }}>Average job value</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => adjustJobValue(-50)}
              className="w-10 h-10 rounded-lg font-bold text-lg flex items-center justify-center transition-all text-white"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
              aria-label="Decrease job value"
            >−</button>
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>£</span>
              <input
                type="text"
                inputMode="numeric"
                value={avgJobValue}
                onChange={e => handleJobValueInput(e.target.value)}
                className="w-full text-center font-heading font-bold text-xl rounded-lg py-2 outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", paddingLeft: "1.5rem" }}
              />
            </div>
            <button
              onClick={() => adjustJobValue(50)}
              className="w-10 h-10 rounded-lg font-bold text-lg flex items-center justify-center transition-all text-white"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
              aria-label="Increase job value"
            >+</button>
          </div>
          <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>
            {trade === "other" ? "Adjust to match your business" : "North England industry average — adjust to match your business"}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Leads / month",                        value: String(leads),                       sub: "from Sonic Leads",              green: false },
            { label: "Jobs won per 10 quoted",               value: `${t.closeOutOf10} out of 10`,       sub: "typical close rate",            green: false },
            { label: "Avg job value",                        value: fmt(avgJobValue),                    sub: "North England rates",           green: false },
            { label: "Additional revenue generated / month", value: fmt(monthlyRev),                     sub: "extra in your pocket each month", green: true  },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl p-4" style={{
              background: stat.green ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.04)",
              border: stat.green ? "1px solid rgba(74,222,128,0.25)" : "1px solid rgba(255,255,255,0.06)",
            }}>
              <div className="text-xs mb-1.5 font-medium leading-snug" style={{ color: stat.green ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)" }}>{stat.label}</div>
              <div className="font-heading font-bold text-lg leading-tight" style={{ color: stat.green ? "#4ade80" : "#fff" }}>{stat.value}</div>
              <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Narrative result */}
        <div className="rounded-xl p-6 mb-6" style={{ background: "rgba(0,109,183,0.12)", border: "1px solid rgba(0,109,183,0.25)" }}>
          <div className="font-bold text-white mb-4 text-sm">
            📈 Here's what {leads} leads a month does for {trade === "other" ? "your business" : trade === "waste" ? "Scott's waste removal business" : fullName}
          </div>
          <PersonaNarrative
            tradeKey={trade} leads={leads} avgJobValue={avgJobValue}
            closes={closes} monthlyRev={monthlyRev} annualRev={annualRev}
          />
        </div>

        {/* CTA strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            <strong className="text-white">Want results like this?</strong><br />
            Book a free 15-min call and find out if your area's available.
          </p>
          <button
            onClick={onBookCall}
            className="shrink-0 font-bold text-sm px-6 py-3 rounded-md transition-all text-white whitespace-nowrap"
            style={{ background: "#006DB7" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#005a9a")}
            onMouseLeave={e => (e.currentTarget.style.background = "#006DB7")}
          >
            Book a Free Call →
          </button>
        </div>

        <p className="text-xs text-center mt-5" style={{ color: "rgba(255,255,255,0.2)" }}>
          Based on industry-average close rates and North England job values. Your numbers depend on your trade, area and how sharp you are on the phone.
        </p>
      </div>
    </div>
  );
}

// ─── Booking section ──────────────────────────────────────────────────────────
type BookingErrors = { firstName?: string; phone?: string; email?: string };

// Defined OUTSIDE BookingSection so React never remounts it on state changes
const bookingInputBase: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  fontSize: "0.9rem",
  outline: "none",
};

function BookingField({
  label, type, placeholder, value, onChange, error,
}: {
  label: string; type: string; placeholder: string;
  value: string; onChange: (v: string) => void; error?: string;
}) {
  return (
    <div className="mb-4">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required
        aria-label={label}
        style={{
          ...bookingInputBase,
          border: error ? "1px solid rgba(248,113,113,0.6)" : "1px solid rgba(255,255,255,0.12)",
        }}
      />
      {error && <p className="text-xs mt-1.5 ml-1" style={{ color: "#f87171" }}>{error}</p>}
    </div>
  );
}

function BookingSection() {
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<BookingErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Load Calendly script once on mount
  useEffect(() => {
    if ((window as any).Calendly) return;
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const clearError = (field: keyof BookingErrors) =>
    setErrors(prev => { const next = { ...prev }; delete next[field]; return next; });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: BookingErrors = {};
    if (!firstName.trim()) newErrors.firstName = "Please fill in this field";
    if (!phone.trim())     newErrors.phone     = "Please fill in this field";
    if (!email.trim())     newErrors.email     = "Please fill in this field";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    console.log("Sonic Leads booking:", { firstName, phone, email });
    setSubmitted(true);

    const initCalendly = () => {
      const el = document.getElementById("calendly-embed");
      if (!el || !(window as any).Calendly) return;
      (window as any).Calendly.initInlineWidget({
        url: "https://calendly.com/kylelawson88/mocks",
        parentElement: el,
        prefill: { name: firstName, email },
        utm: {},
      });
      if (window.innerWidth < 768) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 400);
      }
    };

    if ((window as any).Calendly) {
      setTimeout(initCalendly, 100);
    } else {
      const poll = setInterval(() => {
        if ((window as any).Calendly) { clearInterval(poll); initCalendly(); }
      }, 150);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 items-start">

      {/* ── Left: form ── */}
      <div className="rounded-xl p-8" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)" }}>
        <h3 className="font-bold text-white text-lg mb-1">Your details</h3>
        <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
          Fill these in and we'll show you our available slots.
        </p>
        <form onSubmit={handleSubmit} noValidate>
          <BookingField
            label="First name" type="text" placeholder="First name"
            value={firstName} onChange={v => { setFirstName(v); clearError("firstName"); }}
            error={errors.firstName}
          />
          <BookingField
            label="Phone number" type="tel" placeholder="Phone number"
            value={phone} onChange={v => { setPhone(v); clearError("phone"); }}
            error={errors.phone}
          />
          <BookingField
            label="Email address" type="email" placeholder="Email address"
            value={email} onChange={v => { setEmail(v); clearError("email"); }}
            error={errors.email}
          />
          <button
            type="submit"
            disabled={submitted}
            className="w-full font-bold py-3.5 rounded-lg text-sm transition-all mt-2"
            style={{
              background: submitted ? "rgba(255,255,255,0.1)" : "#006DB7",
              color: submitted ? "rgba(255,255,255,0.45)" : "#fff",
              cursor: submitted ? "not-allowed" : "pointer",
              border: submitted ? "1px solid rgba(255,255,255,0.08)" : "none",
            }}
          >
            {submitted ? "Details submitted ✓" : "Check Availability →"}
          </button>
          <p className="text-xs mt-3 text-center" style={{ color: "rgba(255,255,255,0.25)" }}>
            We'll only use your details to confirm your booking. No spam, ever.
          </p>
        </form>
      </div>

      {/* ── Right: calendar ── */}
      <div
        ref={calendarRef}
        className="rounded-xl overflow-hidden"
        style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", minHeight: "700px" }}
      >
        {!submitted ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[700px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            <div className="text-5xl mb-4">📅</div>
            <p className="text-sm font-medium">Fill in your details to see available slots</p>
          </div>
        ) : (
          <div
            id="calendly-embed"
            className="calendly-inline-widget"
            style={{ minHeight: "650px", width: "100%" }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Fade-up hook ─────────────────────────────────────────────────────────────
function useFadeUp() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    const elements = containerRef.current?.querySelectorAll(".fade-up-element");
    elements?.forEach((el, index) => {
      (el as HTMLElement).style.transitionDelay = `${index * 80}ms`;
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return containerRef;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fadeUpRef = useFadeUp();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen font-sans text-white" style={{ background: "#0A0F1E" }} ref={fadeUpRef}>

      {/* ── Navigation ── */}
      <nav
        className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{
          background: isScrolled ? "rgba(10,15,30,0.97)" : "transparent",
          borderBottom: isScrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          backdropFilter: isScrolled ? "blur(12px)" : "none",
          paddingTop: isScrolled ? "14px" : "20px",
          paddingBottom: isScrolled ? "14px" : "20px",
        }}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <Zap className="w-7 h-7" style={{ color: "#006DB7" }} />
            <span className="font-heading font-bold text-xl tracking-wide uppercase text-white">Sonic Leads</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
            <button onClick={() => scrollTo("how-it-works")} className="hover:text-white transition-colors">Our Process</button>
            <button onClick={() => scrollTo("calculator")} className="hover:text-white transition-colors">The Maths</button>
            <button
              onClick={() => scrollTo("book-call")}
              className="text-white font-semibold px-5 py-2 rounded-md transition-all"
              style={{ background: "#006DB7" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#005a9a")}
              onMouseLeave={e => (e.currentTarget.style.background = "#006DB7")}
            >Book a call</button>
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full py-6 flex flex-col items-center gap-5"
            style={{ background: "rgba(10,15,30,0.98)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <button onClick={() => scrollTo("how-it-works")} className="text-white/80 hover:text-white text-base font-medium">Our Process</button>
            <button onClick={() => scrollTo("calculator")} className="text-white/80 hover:text-white text-base font-medium">The Maths</button>
            <button onClick={() => scrollTo("book-call")} className="text-white font-semibold px-8 py-3 rounded-md w-3/4 text-center" style={{ background: "#006DB7" }}>Book a call</button>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden pt-20" data-testid="hero-section">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, rgba(0,109,183,0.12) 0%, transparent 60%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl fade-up-element">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-8 px-3 py-1.5 rounded-full"
              style={{ border: "1px solid rgba(0,168,232,0.35)", color: "#00A8E8", background: "rgba(0,168,232,0.07)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A8E8] animate-pulse inline-block" />
              Q4 Capacity: 2 Slots Open
            </div>

            <h1 className="font-heading font-bold uppercase leading-[0.88] tracking-wide mb-8" style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}>
              <span className="text-white">Real Jobs. </span>
              <span style={{ color: "#00A8E8" }}>Real<br />Customers.</span>
              <span className="text-white"> Straight<br />To Your Phone.</span>
            </h1>

            <p className="text-lg md:text-xl font-sans max-w-[560px] mb-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
              Sonic Leads gets plumbers, sparkies, roofers, plasterers, builders, kitchen fitters and waste removal in front of customers who are ready to book. No retainers. No contracts. No messing. Pay for the jobs you want — as many or as few as you can handle.
            </p>

            <p className="text-sm mb-10" style={{ color: "rgba(255,255,255,0.35)" }}>
              Not on the list?{" "}
              <button onClick={() => scrollTo("book-call")} className="underline underline-offset-2 hover:text-white/60 transition-colors" style={{ color: "rgba(255,255,255,0.35)" }}>
                Other trades may work too — book a call and let's have a chat.
              </button>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollTo("book-call")}
                className="text-white font-bold text-base px-8 py-4 rounded-md transition-all"
                style={{ background: "#006DB7" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#005a9a")}
                onMouseLeave={e => (e.currentTarget.style.background = "#006DB7")}
                data-testid="hero-primary-cta"
              >Book a call with Sonic today</button>
              <button
                onClick={() => scrollTo("how-it-works")}
                className="text-white font-medium text-base px-8 py-4 rounded-md transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.2)", background: "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                data-testid="hero-secondary-cta"
              >See how it works</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pain Points ── */}
      <section id="pain-points" className="py-24" style={{ background: "#080D19" }} data-testid="pain-points-section">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 fade-up-element">
            <span className="font-bold tracking-widest text-sm uppercase mb-3 block" style={{ color: "#006DB7" }}>The Problem</span>
            <h2 className="font-heading font-bold text-5xl md:text-6xl uppercase text-white">Sound familiar?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Paying for leads shared with 4 other lads", body: "By the time you call, they've already had three other quotes. You're racing to the bottom on price before you've even said hello." },
              { title: "Monthly fees whether work comes in or not", body: "Quiet January? Still paying. Bad patch? Still paying. It's their win either way." },
              { title: "Chasing cold enquiries that go nowhere", body: "Half of them won't answer. The other half just wanted a ballpark. Your time's worth more than that." },
            ].map((card, i) => (
              <div key={i} className="p-8 rounded-xl fade-up-element transition-all" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }} data-testid={`pain-card-${i + 1}`}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-6 text-lg font-bold" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>✗</div>
                <h3 className="text-lg font-bold mb-3 text-white">{card.title}</h3>
                <p className="leading-relaxed text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24" style={{ background: "#0A0F1E" }} data-testid="how-it-works-section">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 fade-up-element">
            <span className="font-bold tracking-widest text-sm uppercase mb-3 block" style={{ color: "#006DB7" }}>The Process</span>
            <h2 className="font-heading font-bold text-5xl md:text-6xl uppercase text-white mb-4">Here's how it works</h2>
            <p className="text-lg" style={{ color: "rgba(255,255,255,0.45)" }}>Three steps. No messing about.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { n: "01", title: "We find homeowners ready to spend", body: "We run targeted ads to homeowners in your area who are actively looking for your trade right now — not browsing, ready to book." },
              { n: "02", title: "We qualify and verify every lead", body: "Before it reaches you, we check it's real. Genuine name, address, job details. No time-wasters." },
              { n: "03", title: "You get the job details. Exclusively.", body: "Straight to your phone via WhatsApp or call. One tradesman per lead. You quote, you win, you get paid." },
            ].map((step, i) => (
              <div key={i} className="fade-up-element" data-testid={`step-${i + 1}`}>
                <div className="font-heading font-bold text-7xl mb-6" style={{ color: "#00A8E8", lineHeight: 1 }}>{step.n}</div>
                <h3 className="text-xl font-bold mb-4 text-white">{step.title}</h3>
                <p className="leading-relaxed text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{step.body}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-20 fade-up-element">
            <p className="text-xl font-bold py-8 inline-block px-8" style={{ borderTop: "1px solid rgba(0,109,183,0.3)", color: "#00A8E8" }}>
              No subscription. No minimum spend. Pay per lead.
            </p>
          </div>
        </div>
      </section>

      {/* ── Do the Numbers Stack Up ── */}
      <section id="the-numbers" className="py-24" style={{ background: "#080D19" }} data-testid="numbers-section">
        <div className="container mx-auto px-6">
          <div className="mb-14 fade-up-element">
            <h2 className="font-heading font-bold uppercase text-white mb-3" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", lineHeight: 1.05 }}>
              Do the numbers stack up?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", maxWidth: "460px" }} className="text-base leading-relaxed">
              Have a look at what the lads are pulling in. Real-world examples — not pie in the sky promises.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Dave the Plumber */}
            <div className="rounded-2xl p-8 fade-up-element" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)" }} data-testid="example-dave">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="font-heading font-bold text-2xl text-white uppercase">Dave's Plumbing Co.</h3>
                  <span className="text-xs font-semibold tracking-widest uppercase mt-1 block" style={{ color: "#00A8E8" }}>Plumbing &amp; Heating</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold tracking-wider uppercase mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Avg Job</div>
                  <div className="font-heading font-bold text-xl text-white">£350</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
                Dave owns a plumbing company and takes 10 leads from us this month. He wins roughly 7 out of 10 jobs he quotes. At £350 a job, that's £2,450 of extra work in the diary.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Leads Bought</div>
                  <div className="font-heading font-bold text-2xl text-white">10</div>
                </div>
                <div className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Jobs Won per 10 Quoted</div>
                  <div className="font-heading font-bold text-2xl text-white">7 out of 10</div>
                </div>
              </div>
              <div className="pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-xs font-semibold tracking-wider uppercase mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Revenue from Just 10 Leads</div>
                <div className="font-heading font-bold" style={{ fontSize: "2.5rem", color: "#00A8E8", lineHeight: 1.1 }}>£2,450</div>
                <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>Repeat monthly — that's an extra £29,400 additional turnover over 12 months</p>
              </div>
            </div>

            {/* Rob the Roofer */}
            <div className="rounded-2xl p-8 fade-up-element" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)" }} data-testid="example-rob">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="font-heading font-bold text-2xl text-white uppercase">Rob's Roofing Co.</h3>
                  <span className="text-xs font-semibold tracking-widest uppercase mt-1 block" style={{ color: "#00A8E8" }}>Roofing</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold tracking-wider uppercase mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Avg Job</div>
                  <div className="font-heading font-bold text-xl text-white">£850</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
                Rob owns a roofing company and takes 10 leads — repairs, re-roofs, fascias and soffits. He wins roughly 6 out of 10 jobs he quotes. At £850 a job, that's £5,100 of extra work he wouldn't have had otherwise.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Leads Bought</div>
                  <div className="font-heading font-bold text-2xl text-white">10</div>
                </div>
                <div className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Jobs Won per 10 Quoted</div>
                  <div className="font-heading font-bold text-2xl text-white">6 out of 10</div>
                </div>
              </div>
              <div className="pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-xs font-semibold tracking-wider uppercase mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Revenue from Just 10 Leads</div>
                <div className="font-heading font-bold" style={{ fontSize: "2.5rem", color: "#00A8E8", lineHeight: 1.1 }}>£5,100</div>
                <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>Repeat monthly — that's an extra £61,200 additional turnover over 12 months</p>
              </div>
            </div>
          </div>

          <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            Examples for illustration. Your numbers depend on your trade, area and how sharp you are on the phone.
          </p>
        </div>
      </section>

      {/* ── Calculator ── */}
      <section id="calculator" className="py-24" style={{ background: "#0A0F1E" }} data-testid="calculator-section">
        <div className="container mx-auto px-6 max-w-4xl">
          <Calculator onBookCall={() => scrollTo("book-call")} />
        </div>
      </section>

      {/* ── Why Sonic ── */}
      <section id="why-sonic" className="py-24" style={{ background: "#080D19" }} data-testid="why-sonic-section">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 fade-up-element">
            <span className="font-bold tracking-widest text-sm uppercase mb-3 block" style={{ color: "#006DB7" }}>Why Us</span>
            <h2 className="font-heading font-bold text-5xl md:text-6xl uppercase text-white">Why trades use Sonic</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: <Lock className="w-5 h-5" />, title: "Exclusive leads", body: "Your lead goes to you. Not you and four others. One job, one tradesman." },
              { icon: <MapPin className="w-5 h-5" />, title: "Local jobs only", body: "We target your area. Every job is reachable. No driving two hours for a quote." },
              { icon: <CreditCard className="w-5 h-5" />, title: "No contracts. No subscriptions.", body: "Pay per lead, simple as that. Busy period? Take more. Quiet? Pause. You're in control." },
              { icon: <PhoneCall className="w-5 h-5" />, title: "Verified before it reaches you", body: "Every enquiry is checked before we send it. Real people, real jobs, real addresses." },
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 rounded-xl fade-up-element transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.07)", background: "#111827" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,168,232,0.4)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(0,168,232,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                data-testid={`benefit-${i + 1}`}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5" style={{ background: "rgba(0,168,232,0.1)", color: "#00A8E8" }}>{item.icon}</div>
                <h3 className="text-lg font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-24" style={{ background: "#0A0F1E" }} data-testid="testimonials-section">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 fade-up-element">
            <span className="font-bold tracking-widest text-sm uppercase mb-3 block" style={{ color: "#006DB7" }}>Results</span>
            <h2 className="font-heading font-bold text-5xl md:text-6xl uppercase text-white">Don't take our word for it</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { quote: '"I was spending £180 a month on Checkatrade and winning maybe one job. First week with Sonic I had three jobs booked in. Genuinely not looked back."', name: "Dave T.", trade: "Roofer — Sunderland" },
              { quote: '"Straight talking, no messing about. They told me exactly what I\'d get and that\'s what I got. My diary\'s been solid for three months running."', name: "Lee M.", trade: "Plasterer — Leeds" },
              { quote: '"Other lead sites send you the same lead as five other roofers. These lot send it to you and you alone. Makes all the difference when you\'re quoting."', name: "Karl B.", trade: "Roofer — Newcastle" },
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-xl fade-up-element" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)" }} data-testid={`testimonial-${i + 1}`}>
                <div className="text-lg tracking-widest mb-5" style={{ color: "#F59E0B" }}>★★★★★</div>
                <p className="italic mb-8 leading-relaxed text-sm min-h-[100px]" style={{ color: "rgba(255,255,255,0.65)" }}>{t.quote}</p>
                <div className="font-bold text-white text-sm">{t.name}</div>
                <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{t.trade}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs fade-up-element" style={{ color: "rgba(255,255,255,0.25)" }}>
            Results may vary. Testimonials are representative of typical partner experiences.
          </p>
        </div>
      </section>

      {/* ── Scale Section ── */}
      <section className="py-24" style={{ background: "#006DB7" }} data-testid="scale-section">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="font-bold tracking-widest text-sm uppercase mb-4 block fade-up-element" style={{ color: "rgba(255,255,255,0.6)" }}>The Bigger Picture</span>
            <h2 className="font-heading font-bold text-5xl md:text-7xl uppercase mb-10 fade-up-element text-white">Stop chasing work. Start scaling.</h2>

            <div className="text-lg text-left space-y-5 mb-16 fade-up-element max-w-3xl mx-auto" style={{ color: "rgba(255,255,255,0.85)" }}>
              <p>Most tradesmen are brilliant at what they do. But running a business is a different skill. And the biggest killer isn't bad work — it's inconsistency. Busy one month, dead the next. You forget about marketing when you're grafting, then panic when the phone goes quiet.</p>
              <p>A steady pipeline changes everything. When the work keeps coming in, you can plan. Hire a mate. Get another van on the road. Stop being a one-man band and start building something proper.</p>
              <p className="font-bold text-white">That's what Sonic Leads does. We keep the leads coming so you can focus on what you're good at — doing the job.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 py-12 fade-up-element" style={{ borderTop: "1px solid rgba(255,255,255,0.2)", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
              <div>
                <div className="font-heading font-bold text-6xl mb-2 text-white">18+</div>
                <div className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>avg. leads delivered per trade partner, per month</div>
              </div>
              <div>
                <div className="font-heading font-bold text-6xl mb-2 text-white">6x</div>
                <div className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>average return on lead spend across all trades</div>
              </div>
              <div>
                <div className="font-heading font-bold text-6xl mb-2 text-white">2–3</div>
                <div className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>max trades per area — one of each trade type</div>
              </div>
            </div>

            <button
              onClick={() => scrollTo("book-call")}
              className="font-bold text-lg px-10 py-4 rounded-md transition-all fade-up-element"
              style={{ background: "#fff", color: "#006DB7" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f0f4ff")}
              onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
              data-testid="scale-cta"
            >See if your area is available →</button>
          </div>
        </div>
      </section>

      {/* ── Book a Call ── */}
      <section id="book-call" className="py-24" style={{ background: "#080D19" }} data-testid="book-call-section">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12 fade-up-element">
            <span className="font-bold tracking-widest text-sm uppercase mb-3 block" style={{ color: "#006DB7" }}>Get Started</span>
            <h2 className="font-heading font-bold text-5xl md:text-6xl uppercase text-white mb-6">Let's see if we're a fit</h2>
            <p className="text-lg max-w-[560px] mx-auto mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              It's a free 15-minute call. No hard sell, no pressure. We'll find out if your area's available, what trades we're looking for, and whether Sonic Leads makes sense for your business.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm font-medium text-white/70">
              {["Free call", "No commitment", "Straight answers"].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="w-4 h-4" style={{ color: "#00A8E8" }} /> {item}
                </div>
              ))}
            </div>
          </div>

          <BookingSection />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="pt-16 pb-10" style={{ background: "#040710", borderTop: "1px solid rgba(255,255,255,0.06)" }} data-testid="footer">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start pb-10 mb-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                <Zap className="w-7 h-7" style={{ color: "#006DB7" }} />
                <span className="font-heading font-bold text-2xl tracking-wide uppercase text-white">Sonic Leads</span>
              </div>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Fast leads. Full calendar. No messing about.</p>
            </div>
            <button
              onClick={() => scrollTo("book-call")}
              className="font-bold text-sm px-6 py-3 rounded-md transition-all text-white"
              style={{ background: "#006DB7" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#005a9a")}
              onMouseLeave={e => (e.currentTarget.style.background = "#006DB7")}
              data-testid="footer-cta"
            >Book a Free Call</button>
          </div>
          <div className="text-center text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            <p className="mb-2">Sonic Leads is a UK lead generation service for local trades businesses.</p>
            <p>© {new Date().getFullYear()} Sonic Leads. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
