-- ============================================================================
-- QRMenu SaaS - 001_initial_schema.sql
-- PostgreSQL / Supabase Schema with Complete Tables, Triggers, & RLS Policies
-- ============================================================================

-- 0. Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. TABLES DEFINITION
-- ============================================================================

-- 1.1 PROFILES (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
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
-- 2. PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_restaurants_user_id ON public.restaurants(user_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON public.restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_menus_restaurant_id ON public.menus(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_categories_menu_id ON public.categories(menu_id);
CREATE INDEX IF NOT EXISTS idx_items_category_id ON public.items(category_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_menu_id ON public.qr_codes(menu_id);

-- ============================================================================
-- 3. AUTOMATIC PROFILE CREATION TRIGGER (AUTH -> PUBLIC.PROFILES)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to allow safe re-running
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 4. RPC FUNCTION: INCREMENT QR SCANS COUNT (ANONYMOUS & AUTHENTICATED)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.increment_qr_scan(p_qr_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.qr_codes
    SET scans_count = scans_count + 1
    WHERE id = p_qr_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 5.1 PROFILES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- 5.2 RESTAURANTS POLICIES
-- Owners have full CRUD. Anyone (public/anon) can view a restaurant by slug to browse its menu.
-- ----------------------------------------------------------------------------
CREATE POLICY "Public can view restaurants"
    ON public.restaurants FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own restaurants"
    ON public.restaurants FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own restaurants"
    ON public.restaurants FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own restaurants"
    ON public.restaurants FOR DELETE
    USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 5.3 MENUS POLICIES
-- Public can view active menus. Owners have full CRUD over their menus.
-- ----------------------------------------------------------------------------
CREATE POLICY "Public can view active menus"
    ON public.menus FOR SELECT
    USING (is_active = true);

CREATE POLICY "Restaurant owners can view all their menus"
    ON public.menus FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.restaurants r
            WHERE r.id = menus.restaurant_id AND r.user_id = auth.uid()
        )
    );

CREATE POLICY "Restaurant owners can create menus"
    ON public.menus FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.restaurants r
            WHERE r.id = restaurant_id AND r.user_id = auth.uid()
        )
    );

CREATE POLICY "Restaurant owners can update their menus"
    ON public.menus FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.restaurants r
            WHERE r.id = menus.restaurant_id AND r.user_id = auth.uid()
        )
    );

CREATE POLICY "Restaurant owners can delete their menus"
    ON public.menus FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.restaurants r
            WHERE r.id = menus.restaurant_id AND r.user_id = auth.uid()
        )
    );

-- ----------------------------------------------------------------------------
-- 5.4 CATEGORIES POLICIES
-- Public can view categories of active menus. Owners have full CRUD.
-- ----------------------------------------------------------------------------
CREATE POLICY "Public can view categories of active menus"
    ON public.categories FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.menus m
            WHERE m.id = categories.menu_id AND m.is_active = true
        )
    );

CREATE POLICY "Owners can view all categories"
    ON public.categories FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.menus m
            JOIN public.restaurants r ON r.id = m.restaurant_id
            WHERE m.id = categories.menu_id AND r.user_id = auth.uid()
        )
    );

CREATE POLICY "Owners can insert categories"
    ON public.categories FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.menus m
            JOIN public.restaurants r ON r.id = m.restaurant_id
            WHERE m.id = menu_id AND r.user_id = auth.uid()
        )
    );

CREATE POLICY "Owners can update categories"
    ON public.categories FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.menus m
            JOIN public.restaurants r ON r.id = m.restaurant_id
            WHERE m.id = categories.menu_id AND r.user_id = auth.uid()
        )
    );

CREATE POLICY "Owners can delete categories"
    ON public.categories FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.menus m
            JOIN public.restaurants r ON r.id = m.restaurant_id
            WHERE m.id = categories.menu_id AND r.user_id = auth.uid()
        )
    );

-- ----------------------------------------------------------------------------
-- 5.5 ITEMS POLICIES
-- Public can view available items of active menus. Owners have full CRUD.
-- ----------------------------------------------------------------------------
CREATE POLICY "Public can view items of active menus"
    ON public.items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.categories c
            JOIN public.menus m ON m.id = c.menu_id
            WHERE c.id = items.category_id AND m.is_active = true
        )
    );

CREATE POLICY "Owners can view all items"
    ON public.items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.categories c
            JOIN public.menus m ON m.id = c.menu_id
            JOIN public.restaurants r ON r.id = m.restaurant_id
            WHERE c.id = items.category_id AND r.user_id = auth.uid()
        )
    );

CREATE POLICY "Owners can insert items"
    ON public.items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.categories c
            JOIN public.menus m ON m.id = c.menu_id
            JOIN public.restaurants r ON r.id = m.restaurant_id
            WHERE c.id = category_id AND r.user_id = auth.uid()
        )
    );

CREATE POLICY "Owners can update items"
    ON public.items FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.categories c
            JOIN public.menus m ON m.id = c.menu_id
            JOIN public.restaurants r ON r.id = m.restaurant_id
            WHERE c.id = items.category_id AND r.user_id = auth.uid()
        )
    );

CREATE POLICY "Owners can delete items"
    ON public.items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.categories c
            JOIN public.menus m ON m.id = c.menu_id
            JOIN public.restaurants r ON r.id = m.restaurant_id
            WHERE c.id = items.category_id AND r.user_id = auth.uid()
        )
    );

-- ----------------------------------------------------------------------------
-- 5.6 QR_CODES POLICIES
-- Owners have full CRUD over QR codes for their menus.
-- ----------------------------------------------------------------------------
CREATE POLICY "Public can view qr codes for active menus"
    ON public.qr_codes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.menus m
            WHERE m.id = qr_codes.menu_id AND m.is_active = true
        )
    );

CREATE POLICY "Owners can view all their qr codes"
    ON public.qr_codes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.menus m
            JOIN public.restaurants r ON r.id = m.restaurant_id
            WHERE m.id = qr_codes.menu_id AND r.user_id = auth.uid()
        )
    );

CREATE POLICY "Owners can insert qr codes"
    ON public.qr_codes FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.menus m
            JOIN public.restaurants r ON r.id = m.restaurant_id
            WHERE m.id = menu_id AND r.user_id = auth.uid()
        )
    );

CREATE POLICY "Owners can update qr codes"
    ON public.qr_codes FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.menus m
            JOIN public.restaurants r ON r.id = m.restaurant_id
            WHERE m.id = qr_codes.menu_id AND r.user_id = auth.uid()
        )
    );

CREATE POLICY "Owners can delete qr codes"
    ON public.qr_codes FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.menus m
            JOIN public.restaurants r ON r.id = m.restaurant_id
            WHERE m.id = qr_codes.menu_id AND r.user_id = auth.uid()
        )
    );
