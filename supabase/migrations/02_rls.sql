-- RLS & Security Policies migration file for RankPilot
-- Tables configured: users, sites, keywords, articles, audit_logs

-- 1. Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. Policies for 'users'
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 3. Policies for 'sites'
CREATE POLICY "Users can manage their own sites" ON public.sites
    FOR ALL TO authenticated USING (auth.uid() = user_id);

-- 4. Policies for 'keywords'
CREATE POLICY "Users can manage keywords for their sites" ON public.keywords
    FOR ALL TO authenticated USING (
        site_id IN (SELECT id FROM public.sites WHERE user_id = auth.uid())
    );

-- 5. Policies for 'articles'
CREATE POLICY "Users can manage articles for their sites" ON public.articles
    FOR ALL TO authenticated USING (
        site_id IN (SELECT id FROM public.sites WHERE user_id = auth.uid())
    );

-- 6. Policies for 'audit_logs'
CREATE POLICY "Users can view their own audit logs" ON public.audit_logs
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users/System can insert audit logs" ON public.audit_logs
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 7. Database performance indexes for pagination and quick queries
CREATE INDEX IF NOT EXISTS idx_sites_user_id ON public.sites(user_id);
CREATE INDEX IF NOT EXISTS idx_keywords_site_id ON public.keywords(site_id);
CREATE INDEX IF NOT EXISTS idx_articles_site_created ON public.articles(site_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_site_status ON public.articles(site_id, status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created ON public.audit_logs(user_id, created_at DESC);
