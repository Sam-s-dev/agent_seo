"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Bot, 
  Search, 
  Sparkles, 
  Send, 
  TrendingUp, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle,
  Menu,
  X
} from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("audit");

  const steps = {
    audit: {
      title: "Audit de site IA",
      desc: "RankPilot analyse la structure de votre site, sa vitesse de chargement et son autorité actuelle pour cartographier vos opportunités SEO manquées.",
      details: ["Analyse de structure de page", "Recherche de pages cassées", "Rapport d'indexation Google Search Console"]
    },
    keywords: {
      title: "Recherche de Mots-clés Rentables",
      desc: "Notre agent IA trouve les requêtes à fort volume et faible difficulté spécifiques à votre domaine de niche, en calculant le ROI estimé de chaque mot-clé.",
      details: ["Calcul de Keyword Difficulty (KD)", "Volumes de recherche locaux et globaux", "Extraction des intentions de recherche"]
    },
    writing: {
      title: "Rédaction IA & Optimisation",
      desc: "Générez des articles longs (1500+ mots) structurés, intégrant intelligemment vos mots-clés cibles, des tables de matière et des maillages internes automatiques.",
      details: ["Prompt structuré avec LLaMA 3.3", "Score de lisibilité RankPilot", "Insertion automatique de backlinks internes"]
    },
    publishing: {
      title: "Publication WordPress Autonome",
      desc: "L'IA publie directement en brouillon ou en direct sur votre site WordPress via l'API REST. Elle configure les balises de métadonnées, le slug, la catégorie et les tags.",
      details: ["Authentification sécurisée AES-256", "Balises Meta-Title & Meta-Description optimisées", "Planification automatique du calendrier"]
    }
  };

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-violet-600 selection:text-white">
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[800px] right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-violet-600 to-indigo-500 rounded-xl shadow-lg shadow-violet-600/20">
              <Bot className="w-6 h-6 text-white animate-pulse-subtle" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
              RankPilot
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#demo" className="hover:text-white transition-colors">Démo IA</a>
            <a href="#pricing" className="hover:text-white transition-colors">Tarifs</a>
            <a href="#security" className="hover:text-white transition-colors">Sécurité 🛡️</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold hover:text-white transition-colors">
              Connexion
            </Link>
            <Link href="/login" className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white text-neutral-950 hover:bg-neutral-200 transition-all hover:scale-[1.02] shadow-lg shadow-white/5">
              Essai Gratuit
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 md:hidden text-neutral-400 hover:text-white">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-neutral-950 bg-neutral-950 px-6 py-6 flex flex-col gap-5 text-neutral-400">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">Démo IA</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">Tarifs</a>
            <a href="#security" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">Sécurité</a>
            <hr className="border-neutral-900" />
            <Link href="/login" className="text-center font-medium hover:text-white transition-colors">Connexion</Link>
            <Link href="/login" className="py-3 text-center bg-white text-neutral-950 rounded-xl font-bold">Essai Gratuit</Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-pulse-subtle">
          <Sparkles className="w-3.5 h-3.5" />
          RankPilot v1.0 — Agent SEO Autonome IA
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
          Votre employé SEO virtuel qui génère du
          <span className="bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent block mt-2">
            trafic organique en continu.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10">
          RankPilot analyse votre site WordPress, trouve les opportunités de mots-clés, rédige des articles SEO de premier ordre et les publie automatiquement. Zéro configuration requise.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-xl shadow-violet-600/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group">
            Commencer maintenant
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 text-white transition-all">
            Voir les fonctionnalités
          </a>
        </div>

        {/* Dashboard Live Preview Card */}
        <div className="relative mx-auto max-w-5xl rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 md:p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500/80" />
              <span className="w-3.5 h-3.5 rounded-full bg-yellow-500/80" />
              <span className="w-3.5 h-3.5 rounded-full bg-green-500/80" />
            </div>
            <div className="text-xs font-mono text-neutral-500 px-3 py-1 bg-neutral-950/60 rounded-md border border-neutral-900">
              rankpilot-dashboard.cloud
            </div>
            <div className="w-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-neutral-950/40 border border-neutral-800 rounded-xl p-5 text-left">
              <div className="text-sm text-neutral-500 mb-1 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-violet-400" />
                Articles Rédigés
              </div>
              <div className="text-3xl font-bold">54 <span className="text-xs text-green-400 font-normal">+12 ce mois</span></div>
            </div>
            <div className="bg-neutral-950/40 border border-neutral-800 rounded-xl p-5 text-left">
              <div className="text-sm text-neutral-500 mb-1 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Trafic SEO Mensuel
              </div>
              <div className="text-3xl font-bold">12 450 <span className="text-xs text-green-400 font-normal">+24% vs M-1</span></div>
            </div>
            <div className="bg-neutral-950/40 border border-neutral-800 rounded-xl p-5 text-left">
              <div className="text-sm text-neutral-500 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Score RankPilot Moyen
              </div>
              <div className="text-3xl font-bold">87/100 <span className="text-xs text-neutral-400 font-normal">Niveau Optimal</span></div>
            </div>
          </div>

          <div className="bg-neutral-950/60 rounded-xl border border-neutral-800 p-5 text-left">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-sm">Dernières publications de l'agent</h4>
              <span className="text-xs px-2.5 py-1 rounded bg-violet-950/50 border border-violet-900/50 text-violet-400 font-medium animate-pulse-subtle">
                Statut : Actif
              </span>
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-2 border-b border-neutral-900 text-neutral-400">
                <span>[10:24] Analyse SEO complète de general-agency.com terminée.</span>
                <span className="text-green-400">Succès</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-900 text-neutral-400">
                <span>[10:25] Recherche mots-clés : &quot;agence seo autonome ia&quot; identifié (KD 18, Vol 2100).</span>
                <span className="text-green-400">Trouvé</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-900 text-neutral-400">
                <span>[10:26] Rédaction de l&apos;article structuré (1642 mots) terminée - Lisibilité 92/100.</span>
                <span className="text-violet-400">Prêt</span>
              </div>
              <div className="flex justify-between py-2 text-neutral-400">
                <span>[10:27] Publication envoyée sur WordPress (ID #3428) sous statut Draft.</span>
                <span className="text-green-400">Publié (WP)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="py-24 border-t border-neutral-900 bg-neutral-950/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              Le cycle SEO complet, automatisé
            </h2>
            <p className="text-neutral-400">
              RankPilot n&apos;est pas qu&apos;un simple outil d&apos;aide à la rédaction. C&apos;est un agent autonome qui s&apos;occupe de tout.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Nav tabs */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {Object.keys(steps).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`p-5 rounded-2xl text-left border transition-all ${
                    activeTab === key
                      ? "bg-neutral-900 border-neutral-800 shadow-lg text-white"
                      : "border-transparent text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/20"
                  }`}
                >
                  <div className="flex items-center gap-3 font-bold mb-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeTab === key ? 'bg-violet-500' : 'bg-neutral-700'}`} />
                    {steps[key as keyof typeof steps].title}
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 font-normal line-clamp-2">
                    {steps[key as keyof typeof steps].desc}
                  </p>
                </button>
              ))}
            </div>

            {/* Content view */}
            <div className="lg:col-span-7 bg-neutral-900/60 border border-neutral-800 rounded-3xl p-8 min-h-[350px] flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-2 block">
                  Étape active
                </span>
                <h3 className="text-2xl font-bold mb-4">
                  {steps[activeTab as keyof typeof steps].title}
                </h3>
                <p className="text-neutral-400 mb-6 text-sm leading-relaxed">
                  {steps[activeTab as keyof typeof steps].desc}
                </p>
                <div className="space-y-2">
                  {steps[activeTab as keyof typeof steps].details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-neutral-300">
                      <CheckCircle className="w-4 h-4 text-violet-500 shrink-0" />
                      {detail}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-800/60 mt-8 flex justify-end">
                <Link href="/login" className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1">
                  Tester cette fonctionnalité <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section (Defense in Depth) */}
      <section id="security" className="py-24 border-t border-neutral-900 bg-neutral-900/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-6">
                <ShieldCheck className="w-4 h-4" />
                Sécurité de Niveau Bancaire
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
                Sécurité par défaut.<br />Vos credentials WordPress chiffrés.
              </h2>
              <p className="text-neutral-400 leading-relaxed mb-8">
                Nous comprenons la valeur et le risque de l&apos;accès à votre site. C&apos;est pourquoi chaque couche de RankPilot est isolée. Vos mots de passe d&apos;application WordPress ne sont jamais stockés en clair : ils sont chiffrés à l&apos;aide d&apos;un algorithme robuste **AES-256-GCM** avec une clé stockée hors-base. De plus, nos connexions utilisent une **Row Level Security (RLS)** hermétique.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-medium text-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-emerald-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  Chiffrement AES-256-GCM
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  Row Level Security (RLS)
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-emerald-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  Audit Logs d&apos;Activités
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              Tarifs simples, sans surprise
            </h2>
            <p className="text-neutral-400">
              Des plans adaptés, que vous commenciez ou gériez plusieurs dizaines de sites d&apos;agences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 flex flex-col justify-between hover:border-neutral-700 transition-all">
              <div>
                <h3 className="text-lg font-bold text-neutral-400 mb-2">🚀 Starter</h3>
                <div className="text-4xl font-extrabold mb-4">$29<span className="text-sm text-neutral-500 font-normal">/mois</span></div>
                <p className="text-xs text-neutral-400 mb-6">Parfait pour tester l&apos;autonomie SEO sur un site personnel.</p>
                <hr className="border-neutral-800 mb-6" />
                <ul className="space-y-3.5 text-xs text-neutral-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-violet-500" /> 4 articles rédigés par mois
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-violet-500" /> 1 site WordPress connecté
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-violet-500" /> Audit SEO de base
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-violet-500" /> Publication automatique WP
                  </li>
                </ul>
              </div>
              <Link href="/login" className="w-full text-center py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl text-xs mt-8 transition-colors">
                Choisir Starter
              </Link>
            </div>

            {/* Pro Plan (Best Seller) */}
            <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 border-2 border-violet-600 rounded-3xl p-8 flex flex-col justify-between relative shadow-xl shadow-violet-600/5 hover:scale-[1.01] transition-all">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-violet-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow-lg">
                Recommandé
              </div>
              <div>
                <h3 className="text-lg font-bold text-violet-400 mb-2">⭐ Pro</h3>
                <div className="text-4xl font-extrabold mb-4">$49<span className="text-sm text-neutral-500 font-normal">/mois</span></div>
                <p className="text-xs text-neutral-400 mb-6">Pour les créateurs sérieux et les PMEs en pleine croissance.</p>
                <hr className="border-neutral-800 mb-6" />
                <ul className="space-y-3.5 text-xs text-neutral-300">
                  <li className="flex items-center gap-2 font-medium text-white">
                    <CheckCircle className="w-4 h-4 text-violet-500" /> 8 articles rédigés par mois
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-violet-500" /> 3 sites WordPress connectés
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-violet-500" /> Analyse approfondie de la concurrence
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-violet-500" /> Mise à jour automatique d&apos;articles anciens
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-violet-500" /> Dashboard Analytics Avancé
                  </li>
                </ul>
              </div>
              <Link href="/login" className="w-full text-center py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-xs mt-8 shadow-lg shadow-violet-600/20 transition-all">
                Choisir Pro
              </Link>
            </div>

            {/* Agency Plan */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 flex flex-col justify-between hover:border-neutral-700 transition-all">
              <div>
                <h3 className="text-lg font-bold text-neutral-400 mb-2">🏢 Agency</h3>
                <div className="text-4xl font-extrabold mb-4">$99<span className="text-sm text-neutral-500 font-normal">/mois</span></div>
                <p className="text-xs text-neutral-400 mb-6">Pour les agences gérant des dizaines de portefeuilles clients.</p>
                <hr className="border-neutral-800 mb-6" />
                <ul className="space-y-3.5 text-xs text-neutral-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-violet-500" /> Articles rédigés illimités
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-violet-500" /> 10 sites WordPress connectés
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-violet-500" /> Mode White-Label pour vos clients
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-violet-500" /> Support Premium Prioritaire
                  </li>
                </ul>
              </div>
              <Link href="/login" className="w-full text-center py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl text-xs mt-8 transition-colors">
                Choisir Agency
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-neutral-500">
          <div>
            &copy; 2026 RankPilot. Développé par Mohamed Sams Deen Camara &times; Antigravity. Conakry, Guinée.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-300">Mentions légales</a>
            <a href="#" className="hover:text-neutral-300">Politique de Confidentialité</a>
            <a href="#" className="hover:text-neutral-300">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
