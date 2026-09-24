-- ============================================================================
-- QRMenu SaaS - Full Database Schema & Security Policies (All-in-One)
-- Run this in Supabase Dashboard -> SQL Editor -> New query -> Run
-- ============================================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. TABLES DEFINITION
-- ============================================================================

-- 1.1 PROFILES (extends auth.users with roles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 1.2 RESTAURANTS
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    address TEXT,
    phone TEXT,
    currency TEXT NOT NULL DEFAULT 'UZS',
    languages TEXT[] NOT NULL DEFAULT ARRAY['uz', 'ru', 'en'],
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 1.3 MENUS
CREATE TABLE IF NOT EXISTS public.menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 1.4 CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID NOT NULL REFERENCES public.menus(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 1.5 ITEMS (Menu dishes / products)
CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    image_url TEXT,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 1.6 QR_CODES
CREATE TABLE IF NOT EXISTS public.qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID NOT NULL REFERENCES public.menus(id) ON DELETE CASCADE,
    scans_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- 2. INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_restaurants_user_id ON public.restaurants(user_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON public.restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_menus_restaurant_id ON public.menus(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_categories_menu_id ON public.categories(menu_id);
CREATE INDEX IF NOT EXISTS idx_items_category_id ON public.items(category_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_menu_id ON public.qr_codes(menu_id);

-- ============================================================================
-- 3. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Automatic Profile Creation Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RPC: Increment QR scan count
CREATE OR REPLACE FUNCTION public.increment_qr_scan(p_qr_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.qr_codes
    SET scans_count = scans_count + 1
    WHERE id = p_qr_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper: Check if current user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'super_admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RPC: Get dashboard stats for super admin
CREATE OR REPLACE FUNCTION public.get_super_admin_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_restaurants', (SELECT COUNT(*) FROM public.restaurants),
        'total_admins', (SELECT COUNT(*) FROM public.profiles WHERE role = 'admin'),
        'total_menus', (SELECT COUNT(*) FROM public.menus),
        'total_items', (SELECT COUNT(*) FROM public.items),
        'total_categories', (SELECT COUNT(*) FROM public.categories),
        'total_qr_scans', (SELECT COALESCE(SUM(scans_count), 0) FROM public.qr_codes)
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;

-- 4.1 Profiles Policies
CREATE POLICY "Public profiles select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 4.2 Restaurants Policies
CREATE POLICY "Public can view restaurants" ON public.restaurants FOR SELECT USING (true);
CREATE POLICY "Admins can manage their restaurants" ON public.restaurants FOR ALL USING (auth.uid() = user_id OR public.is_super_admin());

-- 4.3 Menus Policies
CREATE POLICY "Public can view active menus" ON public.menus FOR SELECT USING (is_active = true OR public.is_super_admin());
CREATE POLICY "Admins can manage their menus" ON public.menus FOR ALL USING (
    EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = menus.restaurant_id AND r.user_id = auth.uid())
    OR public.is_super_admin()
);

-- 4.4 Categories Policies
CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.menus m WHERE m.id = categories.menu_id AND m.is_active = true)
    OR public.is_super_admin()
);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (
    EXISTS (SELECT 1 FROM public.menus m JOIN public.restaurants r ON r.id = m.restaurant_id WHERE m.id = categories.menu_id AND r.user_id = auth.uid())
    OR public.is_super_admin()
);

-- 4.5 Items Policies
CREATE POLICY "Public can view items" ON public.items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.categories c JOIN public.menus m ON m.id = c.menu_id WHERE c.id = items.category_id AND m.is_active = true)
    OR public.is_super_admin()
);
CREATE POLICY "Admins can manage items" ON public.items FOR ALL USING (
    EXISTS (SELECT 1 FROM public.categories c JOIN public.menus m ON m.id = c.menu_id JOIN public.restaurants r ON r.id = m.restaurant_id WHERE c.id = items.category_id AND r.user_id = auth.uid())
    OR public.is_super_admin()
);

-- 4.6 QR Codes Policies
CREATE POLICY "Public can view qr codes" ON public.qr_codes FOR SELECT USING (true);
CREATE POLICY "Admins can manage qr codes" ON public.qr_codes FOR ALL USING (
    EXISTS (SELECT 1 FROM public.menus m JOIN public.restaurants r ON r.id = m.restaurant_id WHERE m.id = qr_codes.menu_id AND r.user_id = auth.uid())
    OR public.is_super_admin()
);

-- ============================================================================
-- 5. STORAGE BUCKET (for dish and logo images)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'menu-images',
    'menu-images',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view menu images" ON storage.objects FOR SELECT USING (bucket_id = 'menu-images');
CREATE POLICY "Authenticated users can upload menu images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'menu-images');
CREATE POLICY "Authenticated users can update menu images" ON storage.objects FOR UPDATE USING (bucket_id = 'menu-images');
CREATE POLICY "Authenticated users can delete menu images" ON storage.objects FOR DELETE USING (bucket_id = 'menu-images');
