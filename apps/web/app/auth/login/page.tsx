"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../../components/landing/Navbar";
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Zap, Globe } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (!email || !password) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Invalid credentials");
      }

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        window.dispatchEvent(new Event("auth-changed"));
      }

      router.push(data.redirect_url || "/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex h-screen w-full items-center justify-center bg-[#050505] p-4 md:p-6 lg:p-14 selection:bg-[#5B6EFF]/30 overflow-hidden">

        {/* Animated Background Orbs */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-15%] right-[-10%] h-[550px] w-[550px] rounded-full bg-[#5B6EFF]/10 blur-[140px] animate-pulse"></div>
          <div className="absolute bottom-[-15%] left-[-10%] h-[450px] w-[450px] rounded-full bg-[#5B6EFF]/6 blur-[130px]"></div>
          <div className="absolute top-[40%] left-[30%] h-[300px] w-[300px] rounded-full bg-[#5B6EFF]/4 blur-[100px]"></div>
        </div>

        {/* Outer glass card */}
        <div className="relative z-10 flex h-[88vh] min-h-[580px] max-h-[800px] w-full max-w-[1300px] items-stretch overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.02] backdrop-blur-2xl shadow-[0_8px_80px_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(255,255,255,0.06)]">

          {/* Inner top-edge glass highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
          {/* Inner bottom-edge subtle glow */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#5B6EFF]/20 to-transparent pointer-events-none"></div>

          {/* ── LEFT PANEL 55% ── */}
          <div className="relative hidden w-[55%] flex-col justify-between overflow-hidden border-r border-white/5 p-16 lg:flex">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <Image 
                src="/authimg/login_bg.jpg" 
                alt="Login background" 
                fill
                className="object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#5B6EFF]/20 via-black/80 to-black/90"></div>
            </div>

            <div className="relative z-10 flex flex-col gap-12">
              {/* Logo */}
              <div className="flex items-center gap-3">
                 
                <span className="text-2xl font-black tracking-tighter text-white"><span className="text-3xl tracking-tighter text-[#5B6EFF]">R</span>EVORA</span>
              </div>

              {/* Hero text */}
              <div className="mt-3 space-y-4">
                <h1 className="font-syne text-5xl font-bold tracking-tight leading-[1.05] text-white">
                  The Future of <br />
                  <span className="bg-gradient-to-r from-[#5B6EFF] to-[#ff8c42] bg-clip-text text-transparent">
                    Intelligent
                  </span>{" "}
                  <br />
                  Workspace.
                </h1>
                <p className="max-w-md text-sm leading-relaxed text-white/35 font-medium font-syne">
                  Join 10,000+ teams automating their workflows with Revora&apos;s next-gen autonomous agents.
                </p>
              </div>

              {/* Glass feature cards */}
              <div className="grid grid-cols-2 gap-4 pr-8 mt-1">
                {[
                  {
                    icon: <Globe className="h-5 w-5 text-[#5B6EFF]" />,
                    title: "Global Scale",
                    desc: "Deploy agents across 40+ regions instantly.",
                  },
                  {
                    icon: <ShieldCheck className="h-5 w-5 text-[#5B6EFF]" />,
                    title: "Security",
                    desc: "SOC2 Type II certified infrastructure.",
                  },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.07] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] group hover:bg-white/[0.07] hover:border-[#5B6EFF]/20 transition-all duration-300"
                  >
                    <div className="mt-0.5 p-1.5 rounded-lg bg-[#5B6EFF]/10 border border-[#5B6EFF]/15">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-[#5B6EFF] transition-colors">{card.title}</h3>
                      <p className="text-xs text-white/30 leading-relaxed mt-0.5">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 flex items-center justify-between border-t border-white/[0.06] pt-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
              <div>© 2026 Revora Autonomous Inc.</div>
              <div className="flex gap-6">
                <Link href="#" className="hover:text-[#5B6EFF] transition-colors">Documentation</Link>
                <Link href="#" className="hover:text-[#5B6EFF] transition-colors">Privacy Policy</Link>
              </div>
            </div>

            <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          </div>

          {/* ── RIGHT PANEL 45% ── */}
          <div className="flex w-full flex-col justify-center lg:w-[45%] overflow-y-auto relative px-8 py-6 md:px-12">

            {/* Right panel glass background */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-xl pointer-events-none"></div>
            {/* Subtle right panel inner top highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>

            <div className="w-full max-w-[390px] mx-auto relative z-10">

              <div className="mb-7">
                <h2 className="text-3xl font-bold tracking-tight text-white mb-1.5">Welcome back</h2>
                <p className="text-white/35 font-medium text-sm leading-relaxed">
                  Access your autonomous operations cluster.
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/[0.08] backdrop-blur-xl px-4 py-3 text-xs text-red-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] flex items-center gap-2.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_red] shrink-0"></div>
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">Access Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[#5B6EFF] transition-all duration-300 z-10" />
                    <input
                      className="w-full rounded-xl border border-white/[0.07] bg-white/[0.04] backdrop-blur-sm py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/10 outline-none transition-all duration-300 focus:border-[#5B6EFF]/40 focus:bg-[#5B6EFF]/[0.06] focus:ring-4 focus:ring-[#5B6EFF]/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                      name="email"
                      type="email"
                      placeholder="alex@revora.ai"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">Security Key</label>
                    <Link href="#" className="text-[10px] font-bold text-[#5B6EFF]/50 hover:text-[#5B6EFF] transition-colors uppercase tracking-wider">Forgot?</Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[#5B6EFF] transition-all duration-300 z-10" />
                    <input
                      className="w-full rounded-xl border border-white/[0.07] bg-white/[0.04] backdrop-blur-sm py-3 pl-11 pr-11 text-sm text-white placeholder:text-white/10 outline-none transition-all duration-300 focus:border-[#5B6EFF]/40 focus:bg-[#5B6EFF]/[0.06] focus:ring-4 focus:ring-[#5B6EFF]/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  className="group relative mt-2 w-full overflow-hidden rounded-xl bg-[#5B6EFF]/90 backdrop-blur-sm py-3.5 text-sm font-black text-white border border-[#5B6EFF]/50 shadow-[0_8px_32px_rgba(240,90,40,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_12px_40px_rgba(240,90,40,0.45)] transition-all active:scale-[0.98] disabled:opacity-60"
                  type="submit"
                  disabled={loading}
                >
                  {/* Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
                  {/* Top glass edge */}
                  <div className="absolute inset-x-0 top-0 h-px bg-white/20 pointer-events-none"></div>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                      INITIALIZING...
                    </span>
                  ) : (
                    "INITIALIZE LOGIN"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-5 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/15 px-2 py-1 rounded-full border border-white/[0.05] bg-white/[0.02] backdrop-blur-sm">
                  Network Nodes
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              </div>

              {/* OAuth Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Google",
                    icon: (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.187 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                      </svg>
                    ),
                  },
                  {
                    label: "Github",
                    icon: (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.01 1.741 2.66 1.258 3.328.961.101-.743.398-1.258.726-1.548-2.664-.316-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.803 5.623-5.476 5.922.43.371.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    ),
                  },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    type="button"
                    className="flex items-center justify-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm py-3 text-[11px] font-black uppercase tracking-widest text-white/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all hover:bg-white/[0.07] hover:border-white/10 hover:text-white active:scale-95"
                  >
                    {btn.icon}
                    {btn.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-white/25 font-medium">
                  New to the network?{" "}
                  <Link
                    href="/auth/signup"
                    className="font-bold text-[#5B6EFF] hover:text-[#ff8c42] transition-colors ml-1.5 uppercase tracking-widest border-b border-[#5B6EFF]/30 pb-0.5 whitespace-nowrap"
                  >
                    Begin Onboarding
                  </Link>
                </p>
              </div>
            </div>

            {/* Glow behind form */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] bg-[#5B6EFF]/5 blur-[90px] pointer-events-none"></div>
          </div>
        </div>
      </div>
    </>
  );
}