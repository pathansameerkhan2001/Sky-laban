-- ====================================================================
-- Sky Laban - Production Supabase Database Schema & Storage Setup
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Table: admin_users
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Admin' CHECK (role IN ('Super Admin', 'Admin', 'Editor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Table: categories
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    image_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 1,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Table: products
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    price TEXT,
    display_order INTEGER NOT NULL DEFAULT 1,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Table: hero_slides
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 1,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Table: instagram_reels
CREATE TABLE IF NOT EXISTS public.instagram_reels (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    title TEXT NOT NULL,
    instagram_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 1,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Table: outlets
CREATE TABLE IF NOT EXISTS public.outlets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    address TEXT,
    image_url TEXT,
    map_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Table: site_content
CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    content_key TEXT UNIQUE NOT NULL,
    title TEXT,
    description TEXT,
    image_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Table: founders
CREATE TABLE IF NOT EXISTS public.founders (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 1,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.founders ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Public Read Policies (Only published/active content)
DROP POLICY IF EXISTS "Public can view published categories" ON public.categories;
CREATE POLICY "Public can view published categories" ON public.categories
    FOR SELECT USING (is_published = TRUE);

DROP POLICY IF EXISTS "Public can view published products" ON public.products;
CREATE POLICY "Public can view published products" ON public.products
    FOR SELECT USING (is_published = TRUE);

DROP POLICY IF EXISTS "Public can view published hero_slides" ON public.hero_slides;
CREATE POLICY "Public can view published hero_slides" ON public.hero_slides
    FOR SELECT USING (is_published = TRUE);

DROP POLICY IF EXISTS "Public can view published instagram_reels" ON public.instagram_reels;
CREATE POLICY "Public can view published instagram_reels" ON public.instagram_reels
    FOR SELECT USING (is_published = TRUE);

DROP POLICY IF EXISTS "Public can view active outlets" ON public.outlets;
CREATE POLICY "Public can view active outlets" ON public.outlets
    FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public can view site content" ON public.site_content;
CREATE POLICY "Public can view site content" ON public.site_content
    FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public can view published founders" ON public.founders;
CREATE POLICY "Public can view published founders" ON public.founders
    FOR SELECT USING (is_published = TRUE);

-- 2. Authenticated Admin Full Access Policies
DROP POLICY IF EXISTS "Admins have full access to admin_users" ON public.admin_users;
CREATE POLICY "Admins have full access to admin_users" ON public.admin_users
    FOR ALL TO authenticated USING (public.is_admin() OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins have full access to categories" ON public.categories;
CREATE POLICY "Admins have full access to categories" ON public.categories
    FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to products" ON public.products;
CREATE POLICY "Admins have full access to products" ON public.products
    FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to hero_slides" ON public.hero_slides;
CREATE POLICY "Admins have full access to hero_slides" ON public.hero_slides
    FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to instagram_reels" ON public.instagram_reels;
CREATE POLICY "Admins have full access to instagram_reels" ON public.instagram_reels
    FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to outlets" ON public.outlets;
CREATE POLICY "Admins have full access to outlets" ON public.outlets
    FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to site_content" ON public.site_content;
CREATE POLICY "Admins have full access to site_content" ON public.site_content
    FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to founders" ON public.founders;
CREATE POLICY "Admins have full access to founders" ON public.founders
    FOR ALL TO authenticated USING (public.is_admin());

-- ====================================================================
-- STORAGE BUCKETS SETUP
-- ====================================================================

-- Create 'sky-laban-media' storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('sky-laban-media', 'sky-laban-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies: Public can read files
DROP POLICY IF EXISTS "Public Access Sky Laban Media" ON storage.objects;
CREATE POLICY "Public Access Sky Laban Media" ON storage.objects
    FOR SELECT USING (bucket_id = 'sky-laban-media');

-- Storage Policies: Only Admins can upload/modify/delete
DROP POLICY IF EXISTS "Admin Upload Sky Laban Media" ON storage.objects;
CREATE POLICY "Admin Upload Sky Laban Media" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'sky-laban-media' AND public.is_admin());

DROP POLICY IF EXISTS "Admin Update Sky Laban Media" ON storage.objects;
CREATE POLICY "Admin Update Sky Laban Media" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'sky-laban-media' AND public.is_admin());

DROP POLICY IF EXISTS "Admin Delete Sky Laban Media" ON storage.objects;
CREATE POLICY "Admin Delete Sky Laban Media" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'sky-laban-media' AND public.is_admin());

-- ====================================================================
-- SEED INITIAL FOUNDERS DATA
-- ====================================================================

INSERT INTO public.founders (id, name, title, image_url, description, display_order, is_published)
VALUES
(
    'founder-akram',
    'B. Akram Ali Khan',
    'Founder & Chief Visionary',
    '/images/Founder1(1).png',
    'B. Akram Ali Khan is the Founder and Chief Visionary of Sky Laban. With a passion for premium desserts and a vision to build a trusted brand, he has helped shape Sky Laban’s identity, customer experience, and continued growth.',
    1,
    TRUE
),
(
    'founder-aslam',
    'B. Aslam Ali Khan',
    'Founder & Operations Leader',
    '/images/Founder2(1).png',
    'B. Aslam Ali Khan is the Founder and Operations Leader of Sky Laban. He focuses on operational consistency, quality, team coordination, and delivering a welcoming experience across Sky Laban outlets.',
    2,
    TRUE
)
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- SEED INITIAL CATEGORIES
-- ====================================================================

INSERT INTO public.categories (id, name, image_url, display_order, is_published)
VALUES
('gulstha', 'Gulstha', '/products/chocolate-almond-bowl.jpg', 1, TRUE),
('salankatia', 'Salankatia', '/products/salankatia-pistachio-lotus.jpg', 2, TRUE),
('koushiri', 'Koushiri', '/products/koushiri-pistachio.jpg', 3, TRUE),
('ruh-hayati', 'Ruh Hayati', '/products/aseera-pistachio-bottle.jpg', 4, TRUE),
('lou-a', 'Lou''a', '/products/salankatia-duo-cafe.jpg', 5, TRUE),
('hiba-cake', 'Hiba Cake', '/products/heba-cake.jpg', 6, TRUE),
('cakes', 'Cakes', '/products/fazea-chocola-cake.jpg', 7, TRUE),
('kunafa-pastry', 'Kunafa & Pastry', '/products/kabsa-dessert-tray.jpg', 8, TRUE),
('traditional-desserts', 'Traditional Desserts', '/products/muhallabia-pudding-pot.jpg', 9, TRUE),
('special', 'Special', '/products/chocolate-sphere-gift.jpg', 10, TRUE)
ON CONFLICT (id) DO NOTHING;
