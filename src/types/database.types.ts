export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'super_admin' | 'admin'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string
          logo_url: string | null
          address: string | null
          phone: string | null
          currency: string
          languages: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          slug: string
          logo_url?: string | null
          address?: string | null
          phone?: string | null
          currency?: string
          languages?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          address?: string | null
          phone?: string | null
          currency?: string
          languages?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'restaurants_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      menus: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'menus_restaurant_id_fkey'
            columns: ['restaurant_id']
            isOneToOne: false
            referencedRelation: 'restaurants'
            referencedColumns: ['id']
          }
        ]
      }
      categories: {
        Row: {
          id: string
          menu_id: string
          name: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          menu_id: string
          name: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          menu_id?: string
          name?: string
          sort_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'categories_menu_id_fkey'
            columns: ['menu_id']
            isOneToOne: false
            referencedRelation: 'menus'
            referencedColumns: ['id']
          }
        ]
      }
      items: {
        Row: {
          id: string
          category_id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          is_available: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          description?: string | null
          price?: number
          image_url?: string | null
          is_available?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          is_available?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'items_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          }
        ]
      }
      qr_codes: {
        Row: {
          id: string
          menu_id: string
          scans_count: number
          created_at: string
        }
        Insert: {
          id?: string
          menu_id: string
          scans_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          menu_id?: string
          scans_count?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'qr_codes_menu_id_fkey'
            columns: ['menu_id']
            isOneToOne: false
            referencedRelation: 'menus'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_qr_scan: {
        Args: {
          p_qr_id: string
        }
        Returns: void
      }
      is_super_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      get_user_role: {
        Args: Record<string, never>
        Returns: string
      }
      get_super_admin_stats: {
        Args: Record<string, never>
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenient Model Type Aliases
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Restaurant = Database['public']['Tables']['restaurants']['Row']
export type Menu = Database['public']['Tables']['menus']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Item = Database['public']['Tables']['items']['Row']
export type QrCode = Database['public']['Tables']['qr_codes']['Row']

// Extended types with relations
export type RestaurantWithProfile = Restaurant & {
  profiles?: Profile
}

export type RestaurantWithMenus = Restaurant & {
  menus?: Pick<Menu, 'id' | 'name' | 'is_active'>[]
}

export type CategoryWithItems = Category & {
  items?: Item[]
}

export type MenuWithCategories = Menu & {
  categories?: CategoryWithItems[]
}

// Super Admin Stats
export type SuperAdminStats = {
  total_restaurants: number
  total_admins: number
  total_menus: number
  total_items: number
  total_categories: number
  total_qr_scans: number
}
