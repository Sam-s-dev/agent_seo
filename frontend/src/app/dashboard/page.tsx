"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Bot, 
  Sparkles, 
  LogOut, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  FileText,
  Globe,
  ArrowDown,
  Languages
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface Article {
  id: string;
  site_id: string;
  keyword: string;
  title: string;
  content: string;
  meta_title: string;
  meta_desc: string;
  score: number;
  status: string;
  created_at: string;
}

interface Site {
  id: string;
  url: string;
  wp_username: string;
  status: string;
}

export default function Dashboard() {
  const { language, setLanguage, t } = useTranslation();
  const router = useRouter();
  
  // Sites States
  const [sites, setSites] = useState<Site[]>([]);
  const [wpUrl, setWpUrl] = useState("");
  const [wpUsername, setWpUsername] = useState("");
  const [wpPassword, setWpPassword] = useState("");
  const [siteLoading, setSiteLoading] = useState(false);
  const [siteError, setSiteError] = useState("");
  const [siteSuccess, setSiteSuccess] = useState("");

  // Articles & Pagination States
  const [articles, setArticles] = useState<Article[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Article Generation States
  const [newKeyword, setNewKeyword] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [genSuccess, setGenSuccess] = useState("");

  // Session user email
  const [userEmail, setUserEmail] = useState("admin@example.com");

  // Get API Base URL
  const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  };

  // Load Initial Data
  useEffect(() => {
    fetchSites();
    fetchInitialArticles();
  }, [statusFilter]);

  const getAuthToken = () => {
    const name = "sb-access-token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };

  const fetchSites = async () => {
    const token = getAuthToken();
    try {
      const res = await fetch(`${getApiUrl()}/sites/`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSites(data);
      }
    } catch (e) {
      console.error("Error fetching sites", e);
    }
  };

  const fetchInitialArticles = async () => {
    setArticlesLoading(true);
    const token = getAuthToken();
    let url = `${getApiUrl()}/articles/?limit=10`;
    if (statusFilter !== "all") {
      url += `&status=${statusFilter}`;
    }
    
    try {
      const res = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setArticles(data.data);
        setCursor(data.next_cursor);
        setHasMore(data.has_more);
      }
    } catch (e) {
      console.error("Error fetching initial articles", e);
    } finally {
      setArticlesLoading(false);
    }
  };

  // Cursor-Based Pagination "Load More"
  const loadMoreArticles = async () => {
    if (!cursor || articlesLoading) return;
    setArticlesLoading(true);
    const token = getAuthToken();
    
    let url = `${getApiUrl()}/articles/?limit=10&cursor=${cursor}`;
    if (statusFilter !== "all") {
      url += `&status=${statusFilter}`;
    }
    
    try {
      const res = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setArticles((prev) => [...prev, ...data.data]);
        setCursor(data.next_cursor);
        setHasMore(data.has_more);
      }
    } catch (e) {
      console.error("Error loading more articles", e);
    } finally {
      setArticlesLoading(false);
    }
  };

  // Connect new WP Site
  const handleConnectSite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSiteError("");
    setSiteSuccess("");
    setSiteLoading(true);
    const token = getAuthToken();

    try {
      const res = await fetch(`${getApiUrl()}/sites/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          url: wpUrl,
          wp_username: wpUsername,
          wp_app_password: wpPassword
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Échec de connexion au site / WordPress connection failed");
      }

      const newSite = await res.json();
      setSites((prev) => [...prev, newSite]);
      setSiteSuccess("Site WordPress connecté avec succès ! / WordPress site successfully connected!");
      setWpUrl("");
      setWpUsername("");
      setWpPassword("");
    } catch (err: any) {
      setSiteError(err.message || "Erreur de connexion.");
    } finally {
      setSiteLoading(false);
    }
  };

  // Generate Article Trigger
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenSuccess("");
    if (!newKeyword) return;
    if (sites.length === 0) {
      alert("Veuillez d'abord connecter un site WordPress / Please connect a WordPress site first.");
      return;
    }
    setGenLoading(true);
    const token = getAuthToken();

    try {
      const res = await fetch(`${getApiUrl()}/articles/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          keyword: newKeyword,
          site_id: sites[0].id
        })
      });

      if (res.ok) {
        setGenSuccess(language === "en" ? `Generation started for: "${newKeyword}"` : `Génération lancée pour : "${newKeyword}"`);
        setNewKeyword("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenLoading(false);
    }
  };

  // Publish Draft trigger
  const handlePublish = async (id: string) => {
    const token = getAuthToken();
    try {
      const res = await fetch(`${getApiUrl()}/articles/publish/${id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        // Update local status
        setArticles((prev) => 
          prev.map((art) => art.id === id ? { ...art, status: "published" } : art)
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/");
  };

  // Helper for SEO Score Color HSL
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400 border-green-500/30 bg-green-500/10";
    if (score >= 50) return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-red-400 border-red-500/30 bg-red-500/10";
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      {/* Top Header */}
      <header className="border-b border-neutral-900 bg-neutral-950/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-violet-600 to-indigo-500 rounded-xl shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">{t("brand")}</span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-violet-950 border border-violet-900 text-violet-400">Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <button 
              onClick={toggleLanguage} 
              className="p-2 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1.5 transition-colors"
            >
              <Languages className="w-4 h-4" />
              {language === "en" ? "FR" : "EN"}
            </button>

            <div className="hidden sm:block text-right">
              <div className="text-xs text-neutral-400 font-medium">{userEmail}</div>
              <div className="text-[10px] font-mono text-emerald-400">Plan Starter</div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2.5 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-400 hover:text-white transition-all"
              title={t("logout")}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side Column: Wordpress Setup & Generate Trigger */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Section A: Generate Article IA */}
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 backdrop-blur-xl">
            <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400 animate-pulse-subtle" />
              {t("dashGenerateTitle")}
            </h3>
            
            {genSuccess && (
              <div className="mb-4 p-3 rounded-lg border border-green-500/20 bg-green-500/10 text-green-400 text-xs">
                {genSuccess}
              </div>
            )}

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder={t("dashKeywordPlaceholder")}
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-violet-600 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={genLoading}
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all flex justify-center items-center gap-2"
              >
                {genLoading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : t("dashButtonGenerate")}
              </button>
            </form>
          </div>

          {/* Section B: Connect WP Site */}
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 backdrop-blur-xl">
            <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              {t("dashConnectTitle")}
            </h3>

            {siteError && (
              <div className="mb-4 p-3.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{siteError}</span>
              </div>
            )}
            
            {siteSuccess && (
              <div className="mb-4 p-3.5 rounded-lg border border-green-500/20 bg-green-500/10 text-green-400 text-xs flex items-start gap-2">
                <CheckCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{siteSuccess}</span>
              </div>
            )}

            <form onSubmit={handleConnectSite} className="space-y-4">
              <div>
                <input
                  type="url"
                  value={wpUrl}
                  onChange={(e) => setWpUrl(e.target.value)}
                  placeholder={t("dashUrlPlaceholder")}
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-violet-600 transition-all"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  value={wpUsername}
                  onChange={(e) => setWpUsername(e.target.value)}
                  placeholder={t("dashWpUserPlaceholder")}
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-violet-600 transition-all"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  value={wpPassword}
                  onChange={(e) => setWpPassword(e.target.value)}
                  placeholder={t("dashWpPassPlaceholder")}
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-violet-600 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={siteLoading}
                className="w-full py-2.5 border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all flex justify-center items-center gap-2"
              >
                {siteLoading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : t("dashButtonConnect")}
              </button>
            </form>

            {/* List of Connected sites */}
            {sites.length > 0 && (
              <div className="mt-6 pt-5 border-t border-neutral-800/80 space-y-2">
                <h4 className="text-xs font-bold text-neutral-400 uppercase mb-2">{t("dashConnectedSites")} ({sites.length})</h4>
                {sites.map((s) => (
                  <div key={s.id} className="flex justify-between items-center p-2.5 bg-neutral-950/60 border border-neutral-900 rounded-lg text-xs">
                    <span className="font-medium truncate max-w-[150px]">{s.url.replace(/^https?:\/\//, "")}</span>
                    <span className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 font-mono text-[10px]">
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Column: Articles & Live Search */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header Filter Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-neutral-900/20 border border-neutral-850 rounded-2xl">
            <div>
              <h2 className="text-lg font-bold text-white">{t("dashWelcome")}</h2>
              <p className="text-xs text-neutral-500">{t("dashSubtitle")}</p>
            </div>
            
            {/* Status Filter buttons */}
            <div className="flex gap-2 bg-neutral-950 p-1 rounded-xl border border-neutral-850 self-stretch sm:self-auto">
              {["all", "published", "draft"].map((filt) => (
                <button
                  key={filt}
                  onClick={() => setStatusFilter(filt)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    statusFilter === filt
                      ? "bg-violet-600 text-white"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  {filt === "all" ? t("dashFilterAll") : filt === "published" ? t("dashFilterPublished") : t("dashFilterDrafts")}
                </button>
              ))}
            </div>
          </div>

          {/* Articles list */}
          <div className="space-y-4">
            {articles.length === 0 && !articlesLoading ? (
              <div className="p-12 text-center border border-neutral-900 rounded-2xl bg-neutral-900/10">
                <FileText className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-neutral-400">{t("dashNoArticles")}</h4>
                <p className="text-xs text-neutral-600 mt-1">{t("dashNoArticlesDesc")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {articles.map((art) => (
                  <div 
                    key={art.id} 
                    className="p-5 bg-neutral-900/30 border border-neutral-850 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-neutral-700 transition-all hover:bg-neutral-900/50 group"
                  >
                    <div className="space-y-1.5 text-left max-w-xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-neutral-950 text-neutral-400 text-[10px] font-mono border border-neutral-850">
                          {art.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          art.status === "published" 
                            ? "bg-green-500/10 border-green-500/20 text-green-400"
                            : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        }`}>
                          {art.status === "published" ? (language === "en" ? "Published" : "Publié") : (language === "en" ? "Draft" : "Brouillon")}
                        </span>
                        <span className="text-[10px] text-neutral-500">
                          {new Date(art.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-neutral-100 group-hover:text-violet-400 transition-colors">
                        {art.title}
                      </h4>
                      <p className="text-xs text-neutral-400 font-medium">
                        {language === "en" ? "Keyword" : "Mot-clé"} : <span className="text-violet-300 font-semibold">{art.keyword}</span>
                      </p>
                      <p className="text-[11px] text-neutral-500 line-clamp-2">
                        {art.meta_desc}
                      </p>
                    </div>

                    {/* SEO Score Gauge Component & Action */}
                    <div className="flex items-center gap-4 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-neutral-850">
                      {/* SEO Score Badge */}
                      <div className={`px-3 py-2 border rounded-xl flex flex-col items-center justify-center min-w-[70px] ${getScoreColor(art.score)}`}>
                        <span className="text-xs font-semibold text-neutral-400">{t("dashScoreText")}</span>
                        <span className="text-base font-extrabold">{art.score}</span>
                      </div>

                      {/* Action Publish draft */}
                      {art.status === "draft" && (
                        <button
                          onClick={() => handlePublish(art.id)}
                          className="px-4.5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-violet-600/10"
                        >
                          {t("dashPublishWp")}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {hasMore && (
              <div className="pt-6 text-center">
                <button
                  onClick={loadMoreArticles}
                  disabled={articlesLoading}
                  className="px-6 py-3 border border-neutral-800 bg-neutral-900 hover:bg-neutral-855 hover:text-white disabled:opacity-50 text-neutral-300 font-semibold rounded-xl text-xs transition-all inline-flex items-center gap-2 hover:scale-[1.02]"
                >
                  {articlesLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("dashLoadingMore")}
                    </>
                  ) : (
                    <>
                      {t("dashLoadMore")}
                      <ArrowDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
