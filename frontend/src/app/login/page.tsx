"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, AlertCircle, Loader2, User, ArrowRight, Languages } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function Login() {
  const { language, setLanguage, t } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError(language === "en" ? "Please fill in all fields." : "Veuillez remplir tous les champs.");
      setLoading(false);
      return;
    }

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || (language === "en" ? "Authentication failed" : "Échec de l'authentification"));
      }

      const data = await response.json();
      document.cookie = `sb-access-token=${data.access_token}; path=/; max-age=900; SameSite=Strict; Secure`;
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || (language === "en" ? "Connection failed." : "Impossible de se connecter."));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      setError(language === "en" ? "Please fill in all fields." : "Veuillez remplir tous les champs.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(language === "en" ? "Passwords do not match." : "Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError(language === "en" ? "Password must be at least 8 characters." : "Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiBase}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name: name }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || (language === "en" ? "Registration failed" : "Échec de l'inscription"));
      }

      const data = await response.json();
      document.cookie = `sb-access-token=${data.access_token}; path=/; max-age=900; SameSite=Strict; Secure`;
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || (language === "en" ? "Registration failed." : "Échec de l'inscription."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-light flex flex-col relative">

      {/* ── Top bar ── */}
      <div className="w-full flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-white shadow-md group-hover:scale-105 transition-transform duration-200">
            <img src="/logo.jpeg" alt="RankPilot Logo" className="w-full h-full object-cover" />
          </div>
        </Link>
        <button
          onClick={toggleLanguage}
          className="p-2 rounded-lg border border-[rgba(108,99,255,0.12)] hover:bg-white text-xs font-bold text-[#6C63FF] flex items-center gap-1.5 transition-colors"
        >
          <Languages className="w-4 h-4" />
          {language === "en" ? "FR" : "EN"}
        </button>
      </div>

      {/* ── Main centered content ── */}
      <div className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md space-y-8">

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a1a3e] tracking-tight">
              {activeTab === "login" ? t("loginTitle") : t("signupTitle")}
            </h1>
            <p className="text-sm text-[#555580]">
              {activeTab === "login" ? t("loginSubtitle") : t("signupSubtitle")}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-white border border-[rgba(108,99,255,0.12)] rounded-full p-1 shadow-sm">
            <button
              onClick={() => { setActiveTab("login"); setError(""); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all duration-200 ${
                activeTab === "login"
                  ? "bg-[#6C63FF] text-white shadow-md"
                  : "text-[#555580] hover:text-[#6C63FF]"
              }`}
            >
              {t("tabLogin")}
            </button>
            <button
              onClick={() => { setActiveTab("signup"); setError(""); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all duration-200 ${
                activeTab === "signup"
                  ? "bg-[#6C63FF] text-white shadow-md"
                  : "text-[#555580] hover:text-[#6C63FF]"
              }`}
            >
              {t("tabSignup")}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-600 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white border border-[rgba(108,99,255,0.12)] rounded-2xl p-8 shadow-lg">

            {activeTab === "login" ? (
              /* ── LOGIN FORM ── */
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[#555580] mb-2 uppercase tracking-wide">
                    {t("loginLabelEmail")}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8888a8]">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("loginPlaceholderEmail")}
                      className="w-full pl-10 pr-4 py-3 bg-[#F8F7FF] border border-[rgba(108,99,255,0.12)] rounded-xl text-sm text-[#1a1a3e] placeholder-[#8888a8] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/10 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold text-[#555580] uppercase tracking-wide">
                      {t("loginLabelPassword")}
                    </label>
                    <a href="#" className="text-xs text-[#6C63FF] hover:text-[#5B53D6] font-medium">
                      {t("loginForgotPassword")}
                    </a>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8888a8]">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-[#F8F7FF] border border-[rgba(108,99,255,0.12)] rounded-xl text-sm text-[#1a1a3e] placeholder-[#8888a8] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/10 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#6C63FF] hover:bg-[#5B53D6] disabled:opacity-50 text-white font-bold rounded-full text-sm shadow-lg shadow-[#6C63FF]/20 transition-all hover:scale-[1.01] flex justify-center items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("loginLoading")}
                    </>
                  ) : (
                    <>
                      {t("loginButton")}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-[#8888a8] pt-2">
                  {t("switchToSignup")}{" "}
                  <button type="button" onClick={() => { setActiveTab("signup"); setError(""); }} className="text-[#6C63FF] font-bold hover:underline">
                    {t("tabSignup")}
                  </button>
                </p>
              </form>
            ) : (
              /* ── SIGNUP FORM ── */
              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[#555580] mb-2 uppercase tracking-wide">
                    {t("signupLabelName")}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8888a8]">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("signupPlaceholderName")}
                      className="w-full pl-10 pr-4 py-3 bg-[#F8F7FF] border border-[rgba(108,99,255,0.12)] rounded-xl text-sm text-[#1a1a3e] placeholder-[#8888a8] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/10 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#555580] mb-2 uppercase tracking-wide">
                    {t("loginLabelEmail")}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8888a8]">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("loginPlaceholderEmail")}
                      className="w-full pl-10 pr-4 py-3 bg-[#F8F7FF] border border-[rgba(108,99,255,0.12)] rounded-xl text-sm text-[#1a1a3e] placeholder-[#8888a8] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/10 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#555580] mb-2 uppercase tracking-wide">
                    {t("loginLabelPassword")}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8888a8]">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-[#F8F7FF] border border-[rgba(108,99,255,0.12)] rounded-xl text-sm text-[#1a1a3e] placeholder-[#8888a8] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/10 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#555580] mb-2 uppercase tracking-wide">
                    {t("signupLabelConfirmPassword")}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8888a8]">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-[#F8F7FF] border border-[rgba(108,99,255,0.12)] rounded-xl text-sm text-[#1a1a3e] placeholder-[#8888a8] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/10 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#6C63FF] hover:bg-[#5B53D6] disabled:opacity-50 text-white font-bold rounded-full text-sm shadow-lg shadow-[#6C63FF]/20 transition-all hover:scale-[1.01] flex justify-center items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("signupLoading")}
                    </>
                  ) : (
                    <>
                      {t("signupButton")}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-[#8888a8] pt-2">
                  {t("switchToLogin")}{" "}
                  <button type="button" onClick={() => { setActiveTab("login"); setError(""); }} className="text-[#6C63FF] font-bold hover:underline">
                    {t("tabLogin")}
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
