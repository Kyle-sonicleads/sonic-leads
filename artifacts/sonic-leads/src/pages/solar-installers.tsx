import React, { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { X, Menu, Zap } from "lucide-react";

// ─── Booking form ─────────────────────────────────────────────────────────────
type BookingErrors = { firstName?: string; phone?: string; email?: string };

const solarInputBase: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  fontSize: "0.9rem",
  outline: "none",
};

function SolarField({
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
          ...solarInputBase,
          border: error
            ? "1px solid rgba(248,113,113,0.6)"
            : "1px solid rgba(255,255,255,0.12)",
        }}
      />
      {error && (
        <p className="text-xs mt-1.5 ml-1" style={{ color: "#f87171" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function SolarBookingSection() {
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<BookingErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ((window as any).Calendly) return;
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const clearError = (field: keyof BookingErrors) =>
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: BookingErrors = {};
    if (!firstName.trim()) newErrors.firstName = "Please fill in this field";
    if (!phone.trim()) newErrors.phone = "Please fill in this field";
    if (!email.trim()) newErrors.email = "Please fill in this field";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setSubmitted(true);

    const initCalendly = () => {
      const el = document.getElementById("solar-calendly-embed");
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
      {/* Left: form */}
      <div
        className="rounded-xl p-8"
        style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <h3 className="font-bold text-white text-lg mb-1">Your details</h3>
        <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
          Fill these in and we'll show you our available slots.
        </p>
        <form onSubmit={handleSubmit} noValidate>
          <SolarField
            label="First name" type="text" placeholder="First name"
            value={firstName} onChange={v => { setFirstName(v); clearError("firstName"); }}
            error={errors.firstName}
          />
          <SolarField
            label="Phone number" type="tel" placeholder="Phone number"
            value={phone} onChange={v => { setPhone(v); clearError("phone"); }}
            error={errors.phone}
          />
          <SolarField
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

      {/* Right: calendar */}
      <div
        ref={calendarRef}
        className="rounded-xl overflow-hidden"
        style={{
          background: "#111827",
          border: "1px solid rgba(255,255,255,0.07)",
          minHeight: "700px",
        }}
      >
        {!submitted ? (
          <div
            className="flex flex-col items-center justify-center h-full min-h-[700px]"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            <div className="text-5xl mb-4">📅</div>
            <p className="text-sm font-medium">Fill in your details to see available slots</p>
          </div>
        ) : (
          <div
            id="solar-calendly-embed"
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
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    ref.current?.querySelectorAll(".fade-up-element").forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 80}ms`;
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return ref;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SolarInstallers() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fadeUpRef = useFadeUp();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen font-sans text-white"
      style={{ background: "#0A0F1E" }}
      ref={fadeUpRef}
    >
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
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <Zap className="w-7 h-7" style={{ color: "#006DB7" }} />
            <span className="font-heading font-bold text-xl tracking-wide uppercase text-white">
              Sonic Leads
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
            <button
              onClick={() => scrollTo("solar-how-it-works")}
              className="hover:text-white transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo("solar-why")}
              className="hover:text-white transition-colors"
            >
              Why Sonic
            </button>
            <Link
              href="/trades"
              className="font-semibold px-5 py-2 rounded-md transition-all"
              style={{
                color: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(255,255,255,0.25)",
                background: "transparent",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = "transparent")}
            >
              For Trades
            </Link>
            <button
              onClick={() => scrollTo("solar-book")}
              className="text-white font-semibold px-5 py-2 rounded-md transition-all"
              style={{ background: "#006DB7" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#005a9a")}
              onMouseLeave={e => (e.currentTarget.style.background = "#006DB7")}
            >
              Book a call
            </button>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            className="md:hidden absolute top-full left-0 w-full py-6 flex flex-col items-center gap-5"
            style={{
              background: "rgba(10,15,30,0.98)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Link href="/trades" className="text-white/80 hover:text-white text-base font-medium">
              For Trades
            </Link>
            <button
              onClick={() => scrollTo("solar-how-it-works")}
              className="text-white/80 hover:text-white text-base font-medium"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo("solar-why")}
              className="text-white/80 hover:text-white text-base font-medium"
            >
              Why Sonic
            </button>
            <button
              onClick={() => scrollTo("solar-book")}
              className="text-white font-semibold px-8 py-3 rounded-md w-3/4 text-center"
              style={{ background: "#006DB7" }}
            >
              Book a call
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 50%, rgba(0,109,183,0.12) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl fade-up-element">
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-8 px-3 py-1.5 rounded-full"
              style={{
                border: "1px solid rgba(0,168,232,0.35)",
                color: "#00A8E8",
                background: "rgba(0,168,232,0.07)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A8E8] animate-pulse inline-block" />
              Exclusive Lead Generation · UK Solar
            </div>

            <h1
              className="font-heading font-bold uppercase leading-[0.88] tracking-wide mb-8"
              style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
            >
              <span className="text-white">Stop Competing<br /></span>
              <span style={{ color: "#00A8E8" }}>For The<br />Same Lead.</span>
            </h1>

            <p
              className="text-lg md:text-xl font-sans max-w-[580px] mb-3 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              Most lead providers sell the same enquiry to 4 or 5 installers. You're not buying
              a lead — you're entering a race. Sonic Leads works differently.
            </p>

            <p className="text-sm mb-10" style={{ color: "rgba(255,255,255,0.35)" }}>
              No contract. No minimum spend. Pay per lead.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollTo("solar-how-it-works")}
                className="text-white font-bold text-base px-8 py-4 rounded-md transition-all"
                style={{ background: "#006DB7" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#005a9a")}
                onMouseLeave={e => (e.currentTarget.style.background = "#006DB7")}
              >
                See How It Works →
              </button>
              <button
                onClick={() => scrollTo("solar-book")}
                className="text-white font-medium text-base px-8 py-4 rounded-md transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.2)", background: "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                Book a 15-Min Call
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pain Points ── */}
      <section className="py-24" style={{ background: "#080D19" }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 fade-up-element">
            <span
              className="font-bold tracking-widest text-sm uppercase mb-3 block"
              style={{ color: "#006DB7" }}
            >
              The Problem
            </span>
            <h2 className="font-heading font-bold text-5xl md:text-6xl uppercase text-white">
              Sound familiar?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Shared leads killing your margins",
                body: "You buy a lead for £40. So do four of your competitors. The homeowner gets five calls in an hour. They go with the cheapest quote. You've wasted time, money and resource.",
              },
              {
                title: "Chasing cold, unqualified enquiries",
                body: "Half don't answer. A quarter are renters. Some are just browsing. You're paying for data, not demand — and your sales team is burning out chasing leads that were never going to convert.",
              },
              {
                title: "Locked into monthly contracts",
                body: "Retainers whether leads come in or not. Minimum spends. 12-month tie-ins. You're funding someone else's business whether it works for you or not.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="p-8 rounded-xl fade-up-element"
                style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-6 text-lg font-bold"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}
                >
                  ✗
                </div>
                <h3 className="text-lg font-bold mb-3 text-white">{card.title}</h3>
                <p className="leading-relaxed text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="solar-how-it-works" className="py-24" style={{ background: "#0A0F1E" }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 fade-up-element">
            <span
              className="font-bold tracking-widest text-sm uppercase mb-3 block"
              style={{ color: "#006DB7" }}
            >
              How It Works
            </span>
            <h2 className="font-heading font-bold text-5xl md:text-6xl uppercase text-white mb-4">
              Qualified demand.<br />Delivered exclusively.
            </h2>
            <p className="text-lg" style={{ color: "rgba(255,255,255,0.45)" }}>
              Three steps. No complexity.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                n: "01",
                title: "We find homeowners actively looking for solar",
                body: "We run targeted digital campaigns to UK homeowners who are actively researching solar installation. Not cold audiences — people who have raised their hand and want to know more.",
              },
              {
                n: "02",
                title: "We qualify every enquiry",
                body: "Every lead goes through our qualification process. We capture property type, roof orientation, energy bill, shading, battery interest and more — before it reaches you. No renters. No flats. No tyre-kickers.",
              },
              {
                n: "03",
                title: "You receive it exclusively",
                body: "Your lead goes to you and only you. It is never sold to another installer. You call first, you quote first, you win more. Real-time delivery direct to your CRM or phone.",
              },
            ].map((step, i) => (
              <div key={i} className="fade-up-element">
                <div
                  className="font-heading font-bold text-7xl mb-6"
                  style={{ color: "#00A8E8", lineHeight: 1 }}
                >
                  {step.n}
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">{step.title}</h3>
                <p className="leading-relaxed text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-20 fade-up-element">
            <p
              className="text-xl font-bold py-8 inline-block px-8"
              style={{ borderTop: "1px solid rgba(0,109,183,0.3)", color: "#00A8E8" }}
            >
              No subscription. No shared data. No minimum spend. Pay per lead.
            </p>
          </div>
        </div>
      </section>

      {/* ── Sample Lead Card ── */}
      <section className="py-24" style={{ background: "#080D19" }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 fade-up-element">
            <span
              className="font-bold tracking-widest text-sm uppercase mb-3 block"
              style={{ color: "#006DB7" }}
            >
              What You Receive
            </span>
            <h2 className="font-heading font-bold text-4xl md:text-5xl uppercase text-white mb-3">
              Every lead looks like this.
            </h2>
            <p className="text-base" style={{ color: "rgba(255,255,255,0.45)" }}>
              Captured in real time. Delivered instantly. Exclusively yours.
            </p>
          </div>

          <div className="max-w-md mx-auto fade-up-element">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "#111827",
                border: "1px solid rgba(0,168,232,0.3)",
                boxShadow: "0 0 40px rgba(0,168,232,0.08)",
              }}
            >
              {/* Header */}
              <div
                className="px-6 py-4 flex items-center gap-3"
                style={{
                  background: "rgba(0,168,232,0.1)",
                  borderBottom: "1px solid rgba(0,168,232,0.2)",
                }}
              >
                <span className="text-lg">⚡</span>
                <span
                  className="font-bold text-sm tracking-widest uppercase"
                  style={{ color: "#00A8E8" }}
                >
                  New Lead — Delivered Now
                </span>
              </div>

              {/* Fields */}
              <div
                className="px-6 py-5 space-y-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                {[
                  ["Name", "Sarah M."],
                  ["Phone", "074•• ••• •••"],
                  ["Postcode", "DL3 — Darlington"],
                  ["Property", "Detached house"],
                  ["Roof facing", "South / SW"],
                  ["Energy bill", "£180–£220 / month"],
                  ["Battery", "Interested"],
                  ["Shading", "None"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center text-sm">
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
                    <span className="font-medium text-white">{value}</span>
                  </div>
                ))}
              </div>

              {/* Qualifications */}
              <div
                className="px-6 py-5 space-y-2.5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                {[
                  "Homeowner confirmed",
                  "Not on MCS installer list",
                  "Ready for quote",
                ].map(item => (
                  <div key={item} className="flex items-center gap-2.5 text-sm">
                    <span style={{ color: "#4ade80" }}>✅</span>
                    <span style={{ color: "rgba(255,255,255,0.7)" }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Delivered pulse */}
              <div className="px-6 py-4 flex items-center gap-2.5">
                <span
                  className="w-2 h-2 rounded-full inline-block shrink-0"
                  style={{
                    background: "#4ade80",
                    boxShadow: "0 0 6px #4ade80",
                    animation: "pulse-green 1.5s ease-in-out infinite",
                  }}
                />
                <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Delivered:{" "}
                  <span className="text-white font-semibold">14 seconds ago</span>
                </span>
              </div>
            </div>

            <p
              className="text-center mt-6 text-sm font-medium"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              This lead belongs to{" "}
              <strong className="text-white">one installer</strong>. Not two. Not five.{" "}
              <strong className="text-white">One.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── Why Sonic Leads ── */}
      <section id="solar-why" className="py-24" style={{ background: "#006DB7" }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 fade-up-element">
            <span
              className="font-bold tracking-widest text-sm uppercase mb-3 block"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Why Sonic Leads
            </span>
            <h2 className="font-heading font-bold text-5xl md:text-6xl uppercase text-white">
              Built differently<br />from day one.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: "Exclusive by default",
                body: "Every lead is sold once. Your competition never sees it.",
              },
              {
                title: "Fully qualified",
                body: "Property type, roof data, energy spend and intent — all captured before delivery.",
              },
              {
                title: "No contracts or minimums",
                body: "Order when you need leads. Pause when you don't. No lock-ins. Ever.",
              },
              {
                title: "Real-time delivery",
                body: "Leads delivered the moment they qualify. Speed matters — we don't sit on your enquiries.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 rounded-xl fade-up-element"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <h3 className="text-lg font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Booking ── */}
      <section id="solar-book" className="py-24" style={{ background: "#0A0F1E" }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16 fade-up-element">
            <span
              className="font-bold tracking-widest text-sm uppercase mb-3 block"
              style={{ color: "#006DB7" }}
            >
              Get Started
            </span>
            <h2 className="font-heading font-bold text-4xl md:text-5xl uppercase text-white mb-4">
              Every day you wait is another<br />shared lead you didn't have to take.
            </h2>
            <p
              className="text-base max-w-xl mx-auto mb-8 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Book a free 15-minute call. We'll show you exactly what our leads look like, walk
              you through how pay-per-lead works, and tell you whether your area is available.
              No hard sell. Just straight answers.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              {[
                "Free 15-min demo call",
                "See real lead examples",
                "No commitment required",
              ].map(item => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  <span style={{ color: "#4ade80" }}>✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <SolarBookingSection />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-10"
        style={{ background: "#080D19", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" style={{ color: "#006DB7" }} />
            <span className="font-heading font-bold text-sm tracking-wide uppercase text-white">
              Sonic Leads
            </span>
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            © 2025 Sonic Leads. All rights reserved.
          </p>
          <Link
            href="/"
            className="text-xs transition-colors hover:text-white"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            ← Back to main site
          </Link>
        </div>
      </footer>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse-green {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.75); }
        }
      `}</style>
    </div>
  );
}
