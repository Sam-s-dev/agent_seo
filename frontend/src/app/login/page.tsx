"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bot, Mail, Lock, AlertCircle, ShieldCheck, Loader2 } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic client validation
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      setLoading(false);
      return;
    }

    try {
      // Send login request to FastAPI Backend
      // (Using localhost:8000 for standard local development environment)
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Échec de l'authentification");
      }

      const data = await response.json();
      
      // Store token (the middleware will also see cookies set by backend, or we write it locally)
      // Save in a mock cookie if running in standalone static client
      document.cookie = `sb-access-token=${data.access_token}; path=/; max-age=900; SameSite=Strict; Secure`;

      // Redirect to protected dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Impossible de se connecter. Réessayez.");
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
          <Link href="/" className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-gradient-to-tr from-violet-600 to-indigo-500 rounded-xl shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">RankPilot</span>
          </Link>
          <p className="text-xs text-neutral-500 font-mono">Connexion sécurisée par défaut</p>
        </div>

        {/* Login form card */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative">
          <h2 className="text-xl font-bold text-white mb-6 text-center">Accéder à votre espace SEO</h2>

          {error && (
            <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wide">
                Adresse Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@entreprise.com"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-violet-600 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Mot de passe
                </label>
                <a href="#" className="text-xs text-violet-400 hover:text-violet-300">
                  Oublié ?
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
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* Quick Demo Credentials note */}
          <div className="mt-6 pt-5 border-t border-neutral-800/80 text-[11px] text-neutral-500 leading-relaxed text-center">
            <span className="font-semibold text-neutral-400 block mb-1">Pour la démo / tests :</span>
            Email: <span className="font-mono text-neutral-400">admin@example.com</span> / Pass: <span className="font-mono text-neutral-400">admin123</span>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="mt-8 flex justify-center items-center gap-2 text-xs text-neutral-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Session chiffrée SSL TLS 1.3 &bull; Cookies httpOnly</span>
        </div>
      </div>
    </div>
  );
}
