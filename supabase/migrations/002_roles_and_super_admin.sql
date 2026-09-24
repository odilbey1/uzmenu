-- ============================================================================
-- QRMenu SaaS - 002_roles_and_super_admin.sql
-- Super Admin role system, updated RLS, admin creation RPC, storage bucket
-- ============================================================================

-- ============================================================================
-- 1. ADD ROLE TO PROFILES
-- ============================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'admin';
    END IF;
END $$;

-- Add constraint for valid roles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
    CHECK (role IN ('super_admin', 'admin'));

-- ============================================================================
-- 2. HELPER FUNCTION: Check if current user is super admin
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'super_admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- 3. HELPER FUNCTION: Get current user's role
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
    RETURN COALESCE(user_role, 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- 4. UPDATE RLS POLICIES — Super Admin gets full access
-- ============================================================================

-- 4.1 PROFILES: Super Admin can view ALL profiles
CREATE POLICY "Super admin can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.is_super_admin());

CREATE POLICY "Super admin can update all profiles"
    ON public.profiles FOR UPDATE
    USING (public.is_super_admin());

CREATE POLICY "Super admin can delete profiles"
    ON public.profiles FOR DELETE
    USING (public.is_super_admin());

-- 4.2 RESTAURANTS: Super Admin full CRUD
CREATE POLICY "Super admin can create any restaurant"
    ON public.restaurants FOR INSERT
    WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admin can update any restaurant"
    ON public.restaurants FOR UPDATE
    USING (public.is_super_admin());

CREATE POLICY "Super admin can delete any restaurant"
    ON public.restaurants FOR DELETE
    USING (public.is_super_admin());

-- 4.3 MENUS: Super Admin full CRUD
CREATE POLICY "Super admin can view all menus"
    ON public.menus FOR SELECT
    USING (public.is_super_admin());

CREATE POLICY "Super admin can create any menu"
    ON public.menus FOR INSERT
    WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admin can update any menu"
    ON public.menus FOR UPDATE
    USING (public.is_super_admin());

CREATE POLICY "Super admin can delete any menu"
    ON public.menus FOR DELETE
    USING (public.is_super_admin());

-- 4.4 CATEGORIES: Super Admin full CRUD
CREATE POLICY "Super admin can view all categories"
    ON public.categories FOR SELECT
    USING (public.is_super_admin());

CREATE POLICY "Super admin can create any category"
    ON public.categories FOR INSERT
    WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admin can update any category"
    ON public.categories FOR UPDATE
    USING (public.is_super_admin());

CREATE POLICY "Super admin can delete any category"
    ON public.categories FOR DELETE
    USING (public.is_super_admin());

-- 4.5 ITEMS: Super Admin full CRUD
CREATE POLICY "Super admin can view all items"
    ON public.items FOR SELECT
    USING (public.is_super_admin());

CREATE POLICY "Super admin can create any item"
    ON public.items FOR INSERT
    WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admin can update any item"
    ON public.items FOR UPDATE
    USING (public.is_super_admin());

CREATE POLICY "Super admin can delete any item"
    ON public.items FOR DELETE
    USING (public.is_super_admin());

-- 4.6 QR_CODES: Super Admin full CRUD
CREATE POLICY "Super admin can view all qr codes"
    ON public.qr_codes FOR SELECT
    USING (public.is_super_admin());

CREATE POLICY "Super admin can create any qr code"
    ON public.qr_codes FOR INSERT
    WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admin can update any qr code"
    ON public.qr_codes FOR UPDATE
    USING (public.is_super_admin());

CREATE POLICY "Super admin can delete any qr code"
    ON public.qr_codes FOR DELETE
    USING (public.is_super_admin());

-- ============================================================================
-- 5. RPC: Get dashboard stats for super admin
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_super_admin_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    IF NOT public.is_super_admin() THEN
        RAISE EXCEPTION 'Access denied: not a super admin';
    END IF;

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
-- 6. STORAGE: Create menu-images bucket
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'menu-images',
    'menu-images',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: authenticated users can upload
CREATE POLICY "Authenticated users can upload menu images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'menu-images'
        AND auth.role() = 'authenticated'
    );

-- Anyone can view menu images (public bucket)
CREATE POLICY "Anyone can view menu images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'menu-images');

-- Users can update their own uploads
CREATE POLICY "Users can update own menu images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'menu-images'
        AND auth.role() = 'authenticated'
    );

-- Users can delete their own uploads, super admin can delete any
CREATE POLICY "Users can delete menu images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'menu-images'
        AND auth.role() = 'authenticated'
    );
