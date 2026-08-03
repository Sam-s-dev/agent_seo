"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Bot, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Globe,
  ChevronDown,
  Languages,
  Check,
  Search,
  BookOpen,
  Link2,
  Zap
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function Home() {
  const { language, setLanguage, t } = useTranslation();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en");
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Pricing plans
  const pricingPlans = [
    {
      name: t("priceStarterTitle"),
      price: "$29",
      desc: t("priceStarterDesc"),
      features: [
        t("priceStarterDetail1"),
        t("priceStarterDetail2"),
        t("priceStarterDetail3"),
        t("priceStarterDetail4"),
      ],
      buttonText: t("ctaStarter"),
      popular: false,
    },
    {
      name: t("priceProTitle"),
      price: "$49",
      desc: t("priceProDesc"),
      features: [
        t("priceProDetail1"),
        t("priceProDetail2"),
        t("priceProDetail3"),
        t("priceProDetail4"),
        t("priceProDetail5"),
      ],
      buttonText: t("ctaPro"),
      popular: true,
    },
    {
      name: t("priceAgencyTitle"),
      price: "$99",
      desc: t("priceAgencyDesc"),
      features: [
        t("priceAgencyDetail1"),
        t("priceAgencyDetail2"),
        t("priceAgencyDetail3"),
        t("priceAgencyDetail4"),
      ],
      buttonText: t("ctaAgency"),
      popular: false,
    }
  ];

  // FAQ Items
  const faqItems = [
    {
      q: language === "en" ? "Is AI content safe for Google ranking?" : "Le contenu rédigé par l'IA est-il sûr pour mon référencement Google ?",
      a: language === "en" 
        ? "Yes. Google rewards high-quality, helpful content regardless of how it is created. RankPilot generates structured, natural, and facts-based long-form articles that meet Google's E-E-A-T criteria."
        : "Oui. Google récompense le contenu utile et de haute qualité, quelle que soit la façon dont il a été créé. RankPilot génère des articles longs, structurés et factuels qui respectent parfaitement les critères E-E-A-T de Google."
    },
    {
      q: language === "en" ? "How does WordPress auto-publishing work?" : "Comment fonctionne la publication automatique sur WordPress ?",
      a: language === "en"
        ? "RankPilot connects to your WordPress site securely using application passwords. We encrypt your credentials using AES-256-GCM. Articles are posted as drafts or live posts based on your preference."
        : "RankPilot se connecte en toute sécurité à votre site WordPress via des mots de passe d'application. Nous chiffrons vos identifiants à l'aide de l'algorithme AES-256-GCM. Les articles sont publiés sous forme de brouillons ou de posts en direct selon vos préférences."
    },
    {
      q: language === "en" ? "Can I customize the keywords targeted by the AI?" : "Puis-je personnaliser les mots-clés ciblés par l'IA ?",
      a: language === "en"
        ? "Absolutely. You can let the autonomous agent discover keywords for you based on its crawling audit, or you can manually enter your own target keywords inside the dashboard."
        : "Absolument. Vous pouvez laisser l'agent autonome découvrir des opportunités de mots-clés pour vous suite à son audit, ou saisir manuellement vos propres mots-clés cibles directement dans le tableau de bord."
    },
    {
      q: language === "en" ? "What is the RankPilot score?" : "Qu'est-ce que le score RankPilot ?",
      a: language === "en"
        ? "It is an real-time optimization rating out of 100 calculated by our algorithm. It scores keyword density, heading hierarchy, readability, word count, and internal links integration."
        : "C'est une note d'optimisation sur 100 calculée en temps réel par notre algorithme. Elle évalue la densité de mots-clés, la structure des titres, la lisibilité, le nombre de mots et l'intégration des liens internes."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#1a1a3e] selection:bg-[#6C63FF] selection:text-white">
      
      {/* ────────────────────────────────────────────────────────
         HEADER / NAVIGATION
         ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[rgba(108,99,255,0.12)] bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Real Logo from public folder */}
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-[rgba(108,99,255,0.2)] shadow-md hover:scale-105 transition-transform duration-200">
              <img src="/logo.jpeg" alt="RankPilot Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1a1a3e] hover:text-[#6C63FF] transition-colors">
              {t("brand")}
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#555580]">
            <a href="#problem" className="hover:text-[#6C63FF] transition-colors">{language === "en" ? "Why Us" : "Pourquoi nous"}</a>
            <a href="#how-it-works" className="hover:text-[#6C63FF] transition-colors">{language === "en" ? "Process" : "Processus"}</a>
            <a href="#features" className="hover:text-[#6C63FF] transition-colors">{t("features")}</a>
            <a href="#pricing" className="hover:text-[#6C63FF] transition-colors">{t("pricing")}</a>
            <a href="#faq" className="hover:text-[#6C63FF] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage} 
              className="p-2 rounded-lg border border-[rgba(108,99,255,0.12)] hover:bg-[#F8F7FF] text-xs font-bold text-[#6C63FF] flex items-center gap-1.5 transition-colors"
            >
              <Languages className="w-4 h-4" />
              {language === "en" ? "FR" : "EN"}
            </button>
            
            <Link href="/login" className="hidden sm:inline-block text-sm font-semibold hover:text-[#6C63FF] transition-colors">
              {t("login")}
            </Link>
            <Link href="/login" className="btn-primary">
              {t("freeTrial")}
            </Link>
          </div>
        </div>
      </header>

      {/* ────────────────────────────────────────────────────────
         1. HERO SECTION (Light Gradient Background)
         ──────────────────────────────────────────────────────── */}
      <section className="bg-hero-light pt-20 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="badge-purple animate-pulse-subtle flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              {t("subTitleBadge")}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold tracking-tight text-[#1a1a3e] leading-[1.15]">
              {t("heroTitle1")} <br />
              <span className="text-[#6C63FF]">{t("heroTitle2")}</span> {t("heroTitle3")}
            </h1>
            <p className="text-base md:text-lg text-[#555580] max-w-xl leading-relaxed">
              {t("heroSubtitle")}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/login" className="btn-primary group">
                {t("ctaStart")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#how-it-works" className="btn-ghost">
                {t("ctaFeatures")}
              </a>
            </div>
          </div>

          {/* Premium Preview Widget */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#6C63FF] to-[#1A6FE8] rounded-2xl blur-xl opacity-20 animate-pulse-subtle" />
            <div className="relative bg-white border border-[rgba(108,99,255,0.12)] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0F0FA] mb-5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-450" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-450" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-450" />
                </div>
                <span className="text-[10px] font-mono text-[#8888a8]">rankpilot.ai/live</span>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#F8F7FF] rounded-xl border border-[rgba(108,99,255,0.06)] flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-[#8888a8] uppercase font-bold tracking-wider">{t("previewArticlesWritten")}</div>
                    <div className="text-2xl font-extrabold text-[#1a1a3e] mt-1">48 <span className="text-xs text-green-500 font-bold ml-1">+12 {language === "en" ? "this month" : "ce mois"}</span></div>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-[#EDE9FF] border border-[rgba(108,99,255,0.2)] text-[#6C63FF] flex items-center justify-center animate-float">
                    <Zap className="w-5 h-5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#F8F7FF] rounded-xl border border-[rgba(108,99,255,0.06)]">
                    <div className="text-[10px] text-[#8888a8] uppercase font-bold tracking-wider">{t("previewTraffic")}</div>
                    <div className="text-lg font-bold text-[#1a1a3e] mt-1">+24%</div>
                  </div>
                  <div className="p-4 bg-[#F8F7FF] rounded-xl border border-[rgba(108,99,255,0.06)]">
                    <div className="text-[10px] text-[#8888a8] uppercase font-bold tracking-wider">{t("previewScore")}</div>
                    <div className="text-lg font-bold text-[#6C63FF] mt-1">87 / 100</div>
                  </div>
                </div>

                <div className="bg-[#13132A] rounded-xl p-4 text-left font-mono text-[10px] text-[#A0A0C0] space-y-2">
                  <div>[10:24] Complete site audit done.</div>
                  <div>[10:25] Target keyword identified: &quot;seo automation&quot;</div>
                  <div className="text-[#9B96FF] animate-pulse-subtle">[10:26] Drafting: 1,642 words generated.</div>
                  <div>[10:27] Draft auto-published to WordPress.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
         2. TRUST BAND (Bande de confiance)
         ──────────────────────────────────────────────────────── */}
      <section className="py-12 border-y border-[#F0F0FA] bg-[#F8F7FF]">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <div className="text-xs font-semibold text-[#8888a8] uppercase tracking-[0.08em]">
            {language === "en" ? "INTEGRATED SECURELY WITH YOUR TOOLS" : "INTÉGRATION SÉCURISÉE AVEC VOS OUTILS PRÉFÉRÉS"}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-60 text-sm font-bold text-[#555580]">
            <span>WordPress</span>
            <span>Google Search Console</span>
            <span>DataForSEO</span>
            <span>Groq / LLaMA 3.3</span>
            <span>Supabase</span>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
         3. PROBLEM / SOLUTION SECTION
         ──────────────────────────────────────────────────────── */}
      <section id="problem" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="section-label">{language === "en" ? "THE HARD TRUTH" : "LA TRISTE RÉALITÉ"}</span>
            <h2 className="text-3xl md:text-[36px] font-bold text-[#1a1a3e] tracking-tight leading-tight">
              {language === "en" 
                ? "SEO agencies are expensive. Doing it manually is slow." 
                : "Les agences SEO coûtent cher. Le faire à la main prend un temps fou."}
            </h2>
            <p className="text-base text-[#555580] leading-relaxed">
              {language === "en"
                ? "Hiring an agency costs upwards of $3,000/month with zero guarantees. Writing articles yourself takes hours of researching keywords, structuring content, adding internal links, and configuring WordPress."
                : "Embaucher une agence coûte plus de 3 000 $/mois sans aucune garantie. Rédiger vous-même demande des heures de recherche de mots-clés, de structuration, de maillage interne et de configuration."}
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-red-100 text-red-500 shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-[#555580]">{language === "en" ? "Waste of budget on generic agencies" : "Perte de budget dans des agences génériques"}</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-red-100 text-red-500 shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-[#555580]">{language === "en" ? "Unproductive hours spent formatting and publishing" : "Heures improductives passées à mettre en page et publier"}</span>
              </div>
            </div>
          </div>

          <div className="card-violet p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#6C63FF]/5 rounded-full blur-[80px]" />
            <div className="space-y-6 relative">
              <span className="badge-purple">{language === "en" ? "THE RANKPILOT SOLUTION" : "LA SOLUTION RANKPILOT"}</span>
              <h3 className="text-xl md:text-2xl font-bold text-[#1a1a3e]">{language === "en" ? "An autonomous AI employee doing 100% of the work" : "Un employé IA autonome qui fait 100% du travail"}</h3>
              <p className="text-sm text-[#555580] leading-relaxed">
                {language === "en"
                  ? "RankPilot connects to your website, runs daily audits, finds highly-profitable keywords, writes structured 1,500+ word articles, inserts your internal links automatically, and posts directly to WordPress."
                  : "RankPilot se connecte à votre site, effectue des audits quotidiens, identifie les opportunités de mots-clés, rédige des articles complets de plus de 1500 mots, gère votre maillage interne et publie le tout."}
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[rgba(108,99,255,0.12)]">
                <div>
                  <div className="text-2xl font-extrabold text-[#6C63FF] group-hover:scale-105 transition-transform duration-200">10x</div>
                  <div className="text-[11px] text-[#8888a8] mt-1 font-semibold uppercase">{language === "en" ? "FASTER GROWTH" : "CROISSANCE PLUS RAPIDE"}</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#6C63FF] group-hover:scale-105 transition-transform duration-200">95%</div>
                  <div className="text-[11px] text-[#8888a8] mt-1 font-semibold uppercase">{language === "en" ? "LESS EXPENSIVE" : "MOINS CHER"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
         4. HOW IT WORKS (Comment ça marche)
         ──────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 border-t border-[#F0F0FA] bg-[#F8F7FF]">
        <div className="max-w-7xl mx-auto text-center space-y-4 mb-16">
          <span className="section-label">{language === "en" ? "WORKFLOW" : "MÉTHODE"}</span>
          <h2 className="text-3xl md:text-[36px] font-bold text-[#1a1a3e] tracking-tight">{language === "en" ? "How RankPilot automates your SEO in 4 steps" : "Comment RankPilot automatise votre SEO en 4 étapes"}</h2>
          <p className="text-sm text-[#555580] max-w-xl mx-auto">{language === "en" ? "Set it up once, let it run forever." : "Configurez une fois, laissez tourner indéfiniment."}</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 text-left group">
            <div className="w-12 h-12 rounded-full bg-[#EDE9FF] border border-[rgba(108, 99, 255, 0.2)] text-[#6C63FF] font-extrabold flex items-center justify-center text-base shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              1
            </div>
            <h4 className="font-bold text-[#1a1a3e] text-base">{t("step1Title")}</h4>
            <p className="text-xs text-[#555580] leading-relaxed">{t("step1Desc")}</p>
          </div>

          <div className="space-y-4 text-left group">
            <div className="w-12 h-12 rounded-full bg-[#EDE9FF] border border-[rgba(108, 99, 255, 0.2)] text-[#6C63FF] font-extrabold flex items-center justify-center text-base shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              2
            </div>
            <h4 className="font-bold text-[#1a1a3e] text-base">{t("step2Title")}</h4>
            <p className="text-xs text-[#555580] leading-relaxed">{t("step2Desc")}</p>
          </div>

          <div className="space-y-4 text-left group">
            <div className="w-12 h-12 rounded-full bg-[#EDE9FF] border border-[rgba(108, 99, 255, 0.2)] text-[#6C63FF] font-extrabold flex items-center justify-center text-base shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              3
            </div>
            <h4 className="font-bold text-[#1a1a3e] text-base">{t("step3Title")}</h4>
            <p className="text-xs text-[#555580] leading-relaxed">{t("step3Desc")}</p>
          </div>

          <div className="space-y-4 text-left group">
            <div className="w-12 h-12 rounded-full bg-[#EDE9FF] border border-[rgba(108, 99, 255, 0.2)] text-[#6C63FF] font-extrabold flex items-center justify-center text-base shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              4
            </div>
            <h4 className="font-bold text-[#1a1a3e] text-base">{t("step4Title")}</h4>
            <p className="text-xs text-[#555580] leading-relaxed">{t("step4Desc")}</p>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
         5. FEATURES SECTION (Dark background section)
         ──────────────────────────────────────────────────────── */}
      <section id="features" className="bg-dark-section py-24 px-6 text-white relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="section-label-dark">{t("features")}</span>
            <h2 className="text-3xl md:text-[36px] font-bold tracking-tight leading-tight">{t("featuresTitle")}</h2>
            <p className="text-sm text-[#A0A0C0] leading-relaxed">{t("featuresSubtitle")}</p>
            
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[rgba(255,255,255,0.1)]">
              {/* Vibrant & alive icon 1 */}
              <div className="space-y-2 group">
                <div className="p-2 w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-800 text-[#9B96FF] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:text-white shadow-lg">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm">Keyword Research</h4>
                <p className="text-[11px] text-[#8080A0]">Calculates KD, search volume, and ROI opportunities.</p>
              </div>

              {/* Vibrant & alive icon 2 */}
              <div className="space-y-2 group">
                <div className="p-2 w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-800 text-[#9B96FF] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:text-white shadow-lg">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm">AI Content Writer</h4>
                <p className="text-[11px] text-[#8080A0]">Generates 1500+ words with H1/H2 structure and FAQ.</p>
              </div>

              {/* Vibrant & alive icon 3 */}
              <div className="space-y-2 group">
                <div className="p-2 w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-800 text-[#9B96FF] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:text-white shadow-lg">
                  <Link2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm">Internal Linking</h4>
                <p className="text-[11px] text-[#8080A0]">Auto-inserts relevant anchor links to existing pages.</p>
              </div>

              {/* Vibrant & alive icon 4 */}
              <div className="space-y-2 group">
                <div className="p-2 w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-800 text-[#9B96FF] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:text-white shadow-lg">
                  <Globe className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm">WordPress Native</h4>
                <p className="text-[11px] text-[#8080A0]">Connects securely to your site via REST API.</p>
              </div>
            </div>
          </div>

          <div className="card-glass border-[rgba(255,255,255,0.15)] bg-white/5 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              {language === "en" ? "Security Core Features" : "Sécurité & Robustesse"}
            </h3>
            <p className="text-xs text-[#A0A0C0] leading-relaxed">{t("secDesc")}</p>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t("secCheck1")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t("secCheck2")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t("secCheck3")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
         6. PRICING SECTION
         ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="section-label">{t("pricing")}</span>
          <h2 className="text-3xl md:text-[36px] font-bold text-[#1a1a3e] tracking-tight">{t("priceTitle")}</h2>
          <p className="text-sm text-[#555580]">{t("priceSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`p-8 rounded-2xl flex flex-col justify-between transition-all ${
                plan.popular 
                  ? "bg-gradient-to-b from-[#EDE9FF] to-white border-2 border-[#6C63FF] shadow-lg hover:scale-[1.01]" 
                  : "bg-white border border-[#F0F0FA] hover:border-[#6C63FF] shadow-sm"
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-base font-bold text-[#1a1a3e]">{plan.name}</h3>
                  {plan.popular && <span className="badge-purple">{t("priceProBadge")}</span>}
                </div>
                <div className="text-4xl font-extrabold text-[#1a1a3e] mb-4">
                  {plan.price}<span className="text-sm text-[#8888a8] font-normal">/mo</span>
                </div>
                <p className="text-xs text-[#555580] mb-6">{plan.desc}</p>
                <hr className="border-[#F0F0FA] mb-6" />
                <ul className="space-y-3.5 text-xs text-[#555580]">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#6C63FF] shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                href="/login" 
                className={`w-full text-center py-3 font-bold rounded-xl text-xs mt-8 transition-colors ${
                  plan.popular 
                    ? "bg-[#6C63FF] hover:bg-[#5B53D6] text-white" 
                    : "bg-[#F8F7FF] hover:bg-[#EDE9FF] text-[#6C63FF]"
                }`}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
         7. FAQ SECTION
         ──────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-6 border-t border-[#F0F0FA] bg-[#F8F7FF]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <span className="section-label">FAQ</span>
            <h2 className="text-3xl md:text-[36px] font-bold text-[#1a1a3e] tracking-tight">{language === "en" ? "Frequently Asked Questions" : "Questions Fréquemment Posées"}</h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className="bg-white border border-[#F0F0FA] rounded-xl overflow-hidden shadow-sm"
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between font-bold text-sm text-[#1a1a3e] hover:text-[#6C63FF] text-left transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${activeFaq === index ? 'rotate-180 text-[#6C63FF]' : 'text-[#8888a8]'}`} />
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-5 pt-1 text-xs text-[#555580] leading-relaxed border-t border-[#F0F0FA]">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
         FOOTER
         ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#F0F0FA] bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#8888a8]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#F0F0FA] shadow-sm">
              <img src="/logo.jpeg" alt="RankPilot Logo" className="w-full h-full object-cover" />
            </div>
            <span>{t("footerText")}</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#6C63FF]">{t("footerLegal")}</a>
            <a href="#" className="hover:text-[#6C63FF]">{t("footerPrivacy")}</a>
            <a href="#" className="hover:text-[#6C63FF]">{t("footerContact")}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
