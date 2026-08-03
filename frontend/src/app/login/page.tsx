"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bot, Mail, Lock, AlertCircle, ShieldCheck, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Veuillez remplir tous les champs / Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      // Dynamic API URL from env or fallback
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      const response = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Échec de l'authentification / Authentication failed");
      }

      const data = await response.json();
      
      // Store JWT token inside the secure httpOnly context (cookie mock)
      document.cookie = `sb-access-token=${data.access_token}; path=/; max-age=900; SameSite=Strict; Secure`;

      // Redirect to the workspace dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Impossible de se connecter / Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center px-6 relative">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex flex-col items-center gap-2 mb-2">
            <div className="w-24 h-24 rounded-xl overflow-hidden border border-white shadow-md hover:scale-105 transition-transform duration-200">
              <img src="/logo.jpeg" alt="RankPilot Logo" className="w-full h-full object-cover" />
            </div>
          </Link>
          <p className="text-xs text-neutral-500 font-mono">{t("loginSecurityFooter")}</p>
        </div>

        {/* Login form card */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative">
          <h2 className="text-xl font-bold text-white mb-6 text-center">{t("loginTitle")}</h2>

          {error && (
            <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wide">
                {t("loginLabelEmail")}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("loginPlaceholderEmail")}
                  className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-violet-600 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  {t("loginLabelPassword")}
                </label>
                <a href="#" className="text-xs text-violet-400 hover:text-violet-300">
                  {t("loginForgotPassword")}
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-violet-600 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-lg shadow-violet-600/10 transition-all hover:scale-[1.01] flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("loginLoading")}
                </>
              ) : (
                t("loginButton")
              )}
            </button>
          </form>

          {/* Quick Demo Credentials note */}
          <div className="mt-6 pt-5 border-t border-neutral-800/80 text-[11px] text-neutral-500 leading-relaxed text-center">
            <span className="font-semibold text-neutral-400 block mb-1">{t("loginDemoTitle")}</span>
            Email: <span className="font-mono text-neutral-400 font-semibold">admin@example.com</span> &bull; Pass: <span className="font-mono text-neutral-400 font-semibold">admin123</span>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="mt-8 flex justify-center items-center gap-2 text-xs text-neutral-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{t("loginSecurityFooter")}</span>
        </div>
      </div>
    </div>
  );
}
