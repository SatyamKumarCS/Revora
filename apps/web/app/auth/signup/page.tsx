"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../../components/landing/Navbar";
import { Eye, EyeOff, Mail, Lock, User, Building } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("founder");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const full_name = form.get("full_name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const confirm_password = form.get("confirm_password") as string;
    const company_name = form.get("company_name") as string;

    if (!full_name || !email || !password || !confirm_password) {
      setError("Please fill all required fields");
      return;
    }

    if (password !== confirm_password) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name,
          email,
          password,
          confirm_password,
          company_name: company_name || "N/A",
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong during signup");
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
      <div className="flex h-screen w-full items-center justify-center bg-[#050505] p-4 md:p-6 lg:p-16 selection:bg-[#5B6EFF]/30 overflow-hidden">

        {/* Animated Background Elements */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-[#5B6EFF]/10 blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-[#5B6EFF]/5 blur-[120px]"></div>
        </div>

        {/* Main Glass Layout */}
        <div className="relative z-10 flex h-[88vh] min-h-[600px] max-h-[800px] w-full max-w-[1300px] items-stretch overflow-hidden rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)]">

          {/* Neon Border Glow */}
          <div className="absolute inset-0 pointer-events-none rounded-[32px] border border-[#5B6EFF]/20 shadow-[inset_0_0_20px_rgba(240,90,40,0.05)]"></div>

          {/* Left Side: Heavy Product Content (55% width) */}
          <div className="relative hidden w-[55%] flex-col justify-between overflow-hidden border-r border-white/5 p-16 lg:flex">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <Image 
                src="/authimg/signup_bg.jpg" 
                alt="Signup background" 
                fill
                className="object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-1000"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#5B6EFF]/20 via-black/80 to-black/95"></div>
            </div>

            <div className="relative z-10 flex flex-col gap-12">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black tracking-tighter text-white"><span className="text-3xl tracking-tighter text-[#5B6EFF]">R</span>EVORA</span>
              </div>

              <div className="mt-4 space-y-5">
                <h1 className="font-syne text-5xl font-bold tracking-tight leading-[1.05] text-white">
                  Build Your <br />
                  <span className="bg-gradient-to-r from-[#5B6EFF] to-[#ff8c42] bg-clip-text text-transparent">
                    Autonomous
                  </span>{" "}
                  <br />
                  Legacy.
                </h1>
                <p className="max-w-md text-base leading-relaxed text-white/40 font-medium font-syne">
                  Scale your operations beyond human limits with AI that understands your business intent.
                </p>
              </div>

              <div className="mt-1 space-y-2">
                {[
                  "Real-time adaptive neural networks",
                  "Zero-latency inference across nodes",
                  "Infinite horizontal scaling for agents",
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#5B6EFF] group-hover:scale-[2] transition-transform duration-500 shadow-[0_0_10px_#5B6EFF]"></div>
                    <span className="text-sm text-white/50 font-medium group-hover:text-white transition-colors duration-300 cursor-default">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
              <div>© 2026 Revora Autonomous Inc.</div>
              <div className="flex gap-6">
                <Link href="#" className="hover:text-[#5B6EFF] transition-colors">Documentation</Link>
                <Link href="#" className="hover:text-[#5B6EFF] transition-colors">Privacy Policy</Link>
              </div>
            </div>

            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          </div>

          {/* Right Side: 45% */}
          <div className="flex w-full flex-col justify-center bg-black/60 px-8 py-6 md:px-12 lg:w-[45%] overflow-y-auto relative">
            <div className="w-full max-w-[400px] mx-auto z-10">

              <div className="mb-7">
                <h2 className="text-3xl font-bold tracking-tight text-white mb-1.5">Create Account</h2>
                <p className="text-white/40 font-medium text-sm leading-relaxed">
                  Join the next wave of autonomous automation.
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400 backdrop-blur-xl flex items-center gap-2.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_red] shrink-0"></div>
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Full Name + Organization */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[#5B6EFF] transition-all duration-300" />
                      <input
                        className="w-full rounded-xl border border-white/5 bg-white/[0.03] py-3 pl-11 pr-3 text-sm text-white placeholder:text-white/10 outline-none transition-all duration-300 focus:border-[#5B6EFF]/40 focus:bg-[#5B6EFF]/5 focus:ring-4 focus:ring-[#5B6EFF]/10"
                        name="full_name"
                        placeholder="Alex Neo"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">Organization</label>
                    <div className="relative group">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[#5B6EFF] transition-all duration-300" />
                      <input
                        className="w-full rounded-xl border border-white/5 bg-white/[0.03] py-3 pl-11 pr-3 text-sm text-white placeholder:text-white/10 outline-none transition-all duration-300 focus:border-[#5B6EFF]/40 focus:bg-[#5B6EFF]/5 focus:ring-4 focus:ring-[#5B6EFF]/10"
                        name="company_name"
                        placeholder="Cyberdyne"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[#5B6EFF] transition-all duration-300" />
                    <input
                      className="w-full rounded-xl border border-white/5 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/10 outline-none transition-all duration-300 focus:border-[#5B6EFF]/40 focus:bg-[#5B6EFF]/5 focus:ring-4 focus:ring-[#5B6EFF]/10"
                      name="email"
                      type="email"
                      placeholder="alex@revora.ai"
                      required
                    />
                  </div>
                </div>

                {/* Password and Confirm Password */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">Security Key</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[#5B6EFF] transition-all duration-300" />
                      <input
                        className="w-full rounded-xl border border-white/5 bg-white/[0.03] py-3 pl-11 pr-11 text-sm text-white placeholder:text-white/10 outline-none transition-all duration-300 focus:border-[#5B6EFF]/40 focus:bg-[#5B6EFF]/5 focus:ring-4 focus:ring-[#5B6EFF]/10"
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
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5B6EFF] ml-1">Confirm Key</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[#5B6EFF] transition-all duration-300" />
                      <input
                        className="w-full rounded-xl border border-white/5 bg-white/[0.03] py-3 pl-11 pr-11 text-sm text-white placeholder:text-white/10 outline-none transition-all duration-300 focus:border-[#5B6EFF]/40 focus:bg-[#5B6EFF]/5 focus:ring-4 focus:ring-[#5B6EFF]/10"
                        name="confirm_password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Role Selector */}
                <div className="space-y-2 pt-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1 block">Node Protocol</label>
                  <div className="flex p-1 rounded-xl bg-white/[0.03] border border-white/5 gap-1.5">
                    {["founder", "recruiter", "developer"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`flex-1 rounded-lg py-2.5 text-[10px] font-black tracking-widest uppercase transition-all duration-500 ${
                          role === r
                            ? "bg-[#5B6EFF] text-white shadow-[0_4px_12px_rgba(240,90,40,0.4)] scale-[1.02]"
                            : "text-white/30 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  className="group relative mt-2 w-full overflow-hidden rounded-xl bg-[#5B6EFF] py-4 text-sm font-black text-white shadow-[0_15px_30px_rgba(240,90,40,0.3)] hover:shadow-[0_20px_40px_rgba(240,90,40,0.4)] transition-all active:scale-[0.98] disabled:opacity-60"
                  type="submit"
                  disabled={loading}
                >
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                      DEPLOYING...
                    </span>
                  ) : (
                    "DEPLOY PROTOCOL"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-white/30 font-medium">
                  Already registered?{" "}
                  <Link
                    href="/auth/login"
                    className="font-bold text-[#5B6EFF] hover:text-[#ff8c42] transition-colors ml-1.5 uppercase tracking-widest border-b border-[#5B6EFF]/30 pb-0.5 whitespace-nowrap"
                  >
                    Access Cluster
                  </Link>
                </p>
              </div>
            </div>

            {/* Subtle glow behind form */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-[#5B6EFF]/5 blur-[100px] pointer-events-none"></div>
          </div>
        </div>
      </div>
    </>
  );
}