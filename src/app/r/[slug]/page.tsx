import { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import PublicMenuClient, { PublicRestaurantData } from './PublicMenuClient'

// Mock fallback restaurant for instant live demo testing
const DEMO_RESTAURANT: PublicRestaurantData = {
  id: 'demo-restaurant-id',
  name: 'Rayhon Burger & Lounge',
  slug: 'demo',
  logo_url: null,
  address: 'Toshkent sh., Chilonzor 9-mavze, 24-uy',
  phone: '+998 71 200 11 22',
  currency: 'UZS',
  categories: [
    {
      id: 'cat-1',
      name: 'Milliy Taomlar',
      sort_order: 0,
      items: [
        {
          id: 'item-1',
          name: 'To‘y Oshi (Maxsus Choyxona)',
          description: 'Lazer saralangan guruch, mayin barra go‘sht, qazi, noxot, mayiz va bedana tuxumi bilan',
          price: 45000,
          image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
          is_available: true,
          is_popular: true,
        },
        {
          id: 'item-2',
          name: 'Qozon Kabob (Qo‘zichoq)',
          description: 'Qozonda qovurilgan mayin qo‘y go‘shti va tillarang qarsildoq kartoshkalar',
          price: 68000,
          image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
          is_available: true,
          is_popular: true,
        },
        {
          id: 'item-3',
          name: 'Chuchvara Sho‘rva',
          description: 'Qo‘lda tugilgan mol go‘shtli mitti chuchvaralar, barra ko‘katlar va smetana',
          price: 36000,
          image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&auto=format&fit=crop&q=80',
          is_available: true,
        },
        {
          id: 'item-4',
          name: 'Uy Lag‘moni (G‘ujduvon uslubida)',
          description: 'Cho‘zma xamir, yosh mol go‘shti, sabzavotlar va boy lazzatli qayla',
          price: 42000,
          image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80',
          is_available: true,
        },
      ],
    },
    {
      id: 'cat-2',
      name: 'Shashlik & Kaboblar',
      sort_order: 1,
      items: [
        {
          id: 'item-5',
          name: 'Qiyma Lyulya Kabob',
          description: 'Xushbo‘y ziravorlar bilan toblangan mayin qiyma go‘sht, piyoz va lavash bilan',
          price: 22000,
          image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80',
          is_available: true,
          is_popular: true,
        },
        {
          id: 'item-6',
          name: 'Kuskovoy Go‘sht Shashlik',
          description: 'Dumbasi bilan marinadlangan tanlangan lahm mol go‘shti',
          price: 25000,
          image_url: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=500&auto=format&fit=crop&q=80',
          is_available: true,
        },
        {
          id: 'item-7',
          name: 'Tovuq Qanotchalari BBQ',
          description: 'Olovda qovurilgan qarsildoq tovuq qanotlari, maxsus sous bilan',
          price: 20000,
          image_url: 'https://images.unsplash.com/photo-1527477378378-0c6753065d64?w=500&auto=format&fit=crop&q=80',
          is_available: true,
        },
      ],
    },
    {
      id: 'cat-3',
      name: 'Salatlar & Gazaklar',
      sort_order: 2,
      items: [
        {
          id: 'item-8',
          name: 'Achchiq-Chuchuk (Shakarob)',
          description: 'Yozgi sersuv pomidor, yupqa archilgan piyoz va achchiq qalampir',
          price: 18000,
          image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
          is_available: true,
        },
        {
          id: 'item-9',
          name: 'Suzma (Ko‘katlar bilan)',
          description: 'Qaymoqli suzma, barra kashnich, arpabodiyon va chesnok',
          price: 15000,
          image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80',
          is_available: true,
        },
      ],
    },
    {
      id: 'cat-4',
      name: 'Ichimliklar',
      sort_order: 3,
      items: [
        {
          id: 'item-10',
          name: 'Choyxona Ko‘k Choyi (95-sonli)',
          description: 'Chinni choynakda damlangan tog‘ giyohlari va yalpizli ko‘k choy',
          price: 8000,
          image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80',
          is_available: true,
        },
        {
          id: 'item-11',
          name: 'Muzdek Qatiqli Ayron (1L)',
          description: 'Yalpiz va mayin bodring bilan tayyorlangan salqin ichimlik',
          price: 18000,
          image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80',
          is_available: true,
          is_popular: true,
        },
        {
          id: 'item-12',
          name: 'Yangi Siqilgan Anor Sharbati',
          description: '100% tabiiy, shakar qo‘shilmagan toza anor sharbati (300ml)',
          price: 30000,
          image_url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&auto=format&fit=crop&q=80',
          is_available: true,
        },
      ],
    },
  ],
}

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  if (slug === 'demo') {
    return {
      title: `${DEMO_RESTAURANT.name} — Onlayn Menyu`,
      description: 'Taomlar, narxlar va taomnoma',
    }
  }

  return {
    title: `Restoran Menyusi — QRMenu.ai`,
    description: 'Onlayn raqamli menyu',
  }
}

export default async function PublicMenuPage({ params }: PageProps) {
  const { slug } = await params

  // If user requests /r/demo, immediately return demo data
  if (slug === 'demo') {
    return <PublicMenuClient restaurant={DEMO_RESTAURANT} />
  }

  try {
    const supabase = await createClient()

    // 1. Fetch restaurant and its active menu with categories and items
    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .select(`
        id,
        name,
        slug,
        logo_url,
        address,
        phone,
        currency,
        menus (
          id,
          name,
          is_active,
          categories (
            id,
            name,
            sort_order,
            items (
              id,
              name,
              description,
              price,
              image_url,
              is_available,
              sort_order
            )
          )
        )
      `)
      .eq('slug', slug)
      .maybeSingle()

    if (error || !restaurant) {
      // If restaurant not found in database, show demo restaurant with requested slug name
      return (
        <PublicMenuClient
          restaurant={{
            ...DEMO_RESTAURANT,
            slug,
            name: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Restoran`,
          }}
        />
      )
    }

    // Find active menu
    const rawMenus = (restaurant as unknown as {
      menus: Array<{
        id: string
        name: string
        is_active: boolean
        categories: Array<{
          id: string
          name: string
          sort_order: number
          items: Array<{
            id: string
            name: string
            description: string | null
            price: number
            image_url: string | null
            is_available: boolean
            sort_order: number
          }>
        }>
      }>
    }).menus

    const activeMenu = rawMenus?.find((m) => m.is_active) || rawMenus?.[0]

    if (!activeMenu || !activeMenu.categories || activeMenu.categories.length === 0) {
      return (
        <PublicMenuClient
          restaurant={{
            ...DEMO_RESTAURANT,
            name: restaurant.name,
            slug: restaurant.slug,
            address: restaurant.address,
            phone: restaurant.phone,
            currency: restaurant.currency || 'UZS',
          }}
        />
      )
    }

    // Sort categories and items
    const formattedCategories = activeMenu.categories
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        sort_order: cat.sort_order,
        items: (cat.items || [])
          .filter((item) => item.is_available)
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
      }))

    const restaurantData: PublicRestaurantData = {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      logo_url: restaurant.logo_url,
      address: restaurant.address,
      phone: restaurant.phone,
      currency: restaurant.currency || 'UZS',
      categories: formattedCategories,
    }

    return <PublicMenuClient restaurant={restaurantData} />
  } catch {
    return <PublicMenuClient restaurant={DEMO_RESTAURANT} />
  }
}
