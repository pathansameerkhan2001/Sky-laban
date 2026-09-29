-- ====================================================================
-- Sky Laban - Production Supabase Database Schema & Storage Setup
-- Project: https://gioxrotqpuzmgtoayfre.supabase.co
-- Storage Bucket: sky-laban-media
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- 2. TABLE: admin_users (Authorized Admin Allowlist & Roles)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Admin' CHECK (role IN ('Super Admin', 'Admin', 'Editor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Function & Trigger: Automatically link auth.users(id) to admin_users when an invited admin signs in
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.admin_users
    SET user_id = NEW.id
    WHERE email = LOWER(NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_user();

-- ====================================================================
-- 3. TABLE: categories (Dessert & Drink Categories)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    image_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 1,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 4. TABLE: products (Desserts & Beverages)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    category TEXT NOT NULL DEFAULT 'Salankatia',
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    badge TEXT,
    image_url TEXT NOT NULL,
    price TEXT DEFAULT 'Available in Store',
    display_order INTEGER NOT NULL DEFAULT 1,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    is_hero BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 5. TABLE: hero_slides
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    title TEXT NOT NULL,
    subtitle TEXT,
    desktop_image_url TEXT NOT NULL,
    mobile_image_url TEXT,
    alt_text TEXT,
    display_order INTEGER NOT NULL DEFAULT 1,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 6. TABLE: instagram_reels
-- ====================================================================
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

-- ====================================================================
-- 7. TABLE: outlets
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.outlets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Telangana',
    address TEXT,
    image_url TEXT,
    maps_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 8. TABLE: site_content
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    content_key TEXT UNIQUE NOT NULL,
    title TEXT,
    description TEXT,
    image_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 9. TABLE: founders
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.founders (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT NOT NULL,
    quote TEXT,
    display_order INTEGER NOT NULL DEFAULT 1,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 10. SECURITY HELPER FUNCTION: is_admin()
-- ====================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
           OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
    ) OR (
        (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.founders ENABLE ROW LEVEL SECURITY;

-- 11.1 Public Read Policies (Only published/active content)
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

-- 11.2 Authenticated Admin Full Access Policies
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
-- 12. STORAGE BUCKET: sky-laban-media
-- ====================================================================

-- Create 'sky-laban-media' storage bucket with 50MB file size limit
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'sky-laban-media',
    'sky-laban-media',
    TRUE,
    52428800,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/x-icon', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO UPDATE SET public = TRUE;

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
-- 13. SEED FOUNDERS DATA
-- ====================================================================
INSERT INTO public.founders (id, name, title, image_url, description, quote, display_order, is_published)
VALUES
(
    'founder-akram',
    'B. Akram Ali Khan',
    'Founder & Chief Visionary',
    '/images/founders/akram-ali-khan-hd.jpg',
    'B. Akram Ali Khan is the Founder and Chief Visionary of Sky Laban, helping shape the brand’s vision and its journey in bringing distinctive dessert experiences to more communities. With a deep passion for premium desserts and quality craftsmanship, he guides Sky Laban’s growth from our first outlet in Shaikpet to 15 outlets across Hyderabad and beyond.',
    'Turning a simple dream into a shared happiness across the city.',
    1,
    TRUE
),
(
    'founder-aslam',
    'B. Aslam Ali Khan',
    'Co-Founder & Operations Leader',
    '/images/Founder2(1).png',
    'B. Aslam Ali Khan is the Co-Founder and Operations Leader of Sky Laban, contributing to the brand’s operations, consistency, and customer experience as it continues to grow. His dedication, hands-on approach, and strong focus on people and processes ensure excellence at every outlet.',
    'Building quality, consistency and a brighter tomorrow.',
    2,
    TRUE
)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    title = EXCLUDED.title,
    image_url = EXCLUDED.image_url,
    description = EXCLUDED.description,
    quote = EXCLUDED.quote;

-- ====================================================================
-- 14. SEED CATEGORIES (Desserts & Drinks)
-- ====================================================================
INSERT INTO public.categories (id, name, image_url, display_order, is_published)
VALUES
('gulstha', 'Gulstha', '/products/chocolate-almond-bowl.jpg', 1, TRUE),
('salankatia', 'Salankatia', '/products/salankatia-pistachio-lotus.jpg', 2, TRUE),
('koushiri', 'Koushiri', '/products/koushiri-lotus.jpg', 3, TRUE),
('ruh-hayati', 'Ruh Hayati', '/products/aseera-pistachio-bottle.jpg', 4, TRUE),
('lou-a', 'Lou''a', '/products/salankatia-kinder.jpg', 5, TRUE),
('hiba-cake', 'Hiba Cake', '/products/heba-cake.jpg', 6, TRUE),
('cakes', 'Cakes', '/products/fazea-chocola-cake.jpg', 7, TRUE),
('kunafa-pastry', 'Kunafa & Pastry', '/products/koushri-box-cake.jpg', 8, TRUE),
('kabsa', 'Kabsa', '/products/kabsa-dessert-tray.jpg', 9, TRUE),
('traditional-desserts', 'Traditional Desserts', '/products/muhallabia-pudding-pot.jpg', 10, TRUE),
('special', 'Special', '/products/chocolate-sphere-gift.jpg', 11, TRUE),
('aseera', 'Aseera', '/products/aseera-pistachio-bottle.jpg', 12, TRUE),
('traditional-drinks', 'Traditional Drinks', '/products/aseera-nutella-bottle.jpg', 13, TRUE)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    image_url = EXCLUDED.image_url,
    display_order = EXCLUDED.display_order;
