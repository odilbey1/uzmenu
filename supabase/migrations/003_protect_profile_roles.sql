-- Keep profile editing from granting platform administrator privileges.
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role
     AND auth.uid() IS NOT NULL
     AND COALESCE(auth.role(), '') <> 'service_role'
     AND NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Only a super admin can change account roles';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_profile_role
BEFORE UPDATE OF role ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();
