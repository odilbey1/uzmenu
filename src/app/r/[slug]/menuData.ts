export interface MenuItem {
  id: string
  name: string
  description?: string | null
  price: number
  image_url?: string | null
  is_available: boolean
  sort_order?: number
  is_popular?: boolean
  badge?: string
}

export interface VisualCategory {
  id: string
  name: string
  image: string
  badge?: {
    type: 'top' | 'chef' | 'aksiya' | 'yangi'
    text: string
    icon: string
  }
  iconType?: 'child' | 'family' | 'sauce' | 'about'
  items: MenuItem[]
}

export const VISUAL_CATEGORIES: VisualCategory[] = [
  // ROW 1
  {
    id: 'top-dishes',
    name: 'Bizning\nTop taomlarimiz',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    badge: { type: 'top', text: 'TOP', icon: '🔥' },
    items: [
      {
        id: 'top-1',
        name: 'Grand Royal Double Burger',
        description: 'Ikkita 100% barra mol go‘shti kotleti, erigan cheddar pishlog‘i, qovurilgan piyoz, karsildoq bodring va maxsus sous',
        price: 52000,
        image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        is_popular: true,
      },
      {
        id: 'top-2',
        name: 'Maxsus Go‘shtli Lavash Big',
        description: 'Tandirda pishirilgan xamir, marinadlangan lahm go‘sht, qizartirilgan fri va xushbo‘y sous',
        price: 42000,
        image_url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        is_popular: true,
      },
      {
        id: 'top-3',
        name: 'Pepperoni Supreme Pizza (32cm)',
        description: 'To‘yimli italyan pepperoni kolbasasi, xushbo‘y mozzarella pishlog‘i va rayhon sousi',
        price: 78000,
        image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        is_popular: true,
      },
    ],
  },
  {
    id: 'chef-choice',
    name: 'Chef tanlovi',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    badge: { type: 'chef', text: 'CHEF', icon: '⭐' },
    items: [
      {
        id: 'chef-1',
        name: 'Shef Ribeye Steak (350g)',
        description: 'Olovda toblangan sersuv ribay steyk, sariyog‘, rozmarin va sarimsoqli qayla bilan',
        price: 110000,
        image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        is_popular: true,
      },
      {
        id: 'chef-2',
        name: 'Truffle Burger Gourmet',
        description: 'Yumshoq briosh noni, qora tryufel sousi, karamellangan piyoz va rukkola',
        price: 65000,
        image_url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
    ],
  },
  {
    id: 'combos',
    name: 'Kombolar',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop&q=80',
    badge: { type: 'aksiya', text: 'AKSIYA', icon: '💥' },
    items: [
      {
        id: 'combo-1',
        name: 'Mega Burger Combo',
        description: 'Klassik chizburger + Oltin rang qarsildoq fri kartoshkasi + 0.5L Muzdek Coca-Cola',
        price: 49000,
        image_url: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        is_popular: true,
      },
      {
        id: 'combo-2',
        name: 'Lavash Combo Set',
        description: 'Mol go‘shtli standart lavash + Fri kartoshkasi + 0.5L Fanta',
        price: 46000,
        image_url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
      {
        id: 'combo-3',
        name: 'Tovuqli Qarsildoq Strips Combo',
        description: '5 dona xurmo qanotchalar + Ketchup + Fri + Coca-Cola',
        price: 45000,
        image_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
    ],
  },
  {
    id: 'new-dishes',
    name: 'Yangi taomlar',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    badge: { type: 'yangi', text: 'YANGI', icon: '🌿' },
    items: [
      {
        id: 'new-1',
        name: 'T-Bone Steak Premium',
        description: 'T-suyakli marinadlangan lahm go‘sht, grilda pishirilgan sabzavotlar bilan',
        price: 125000,
        image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
      {
        id: 'new-2',
        name: 'Smoked BBQ Burger',
        description: 'Dudlangan mol go‘shti, dudli barbekyu sousi va krispi piyoz halqalari',
        price: 54000,
        image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
    ],
  },

  // ROW 2
  {
    id: 'burgers',
    name: 'Burgerlar',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'b-1',
        name: 'Klassik Chizburger',
        description: 'Mol go‘shti kotleti, erigan cheddar, marinadlangan bodring va xantal sousi',
        price: 36000,
        image_url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
      {
        id: 'b-2',
        name: 'Double Cheeseburger',
        description: 'Ikkita suvli go‘sht kotleti, ikki qavat cheddar pishlog‘i va maxsus burger sousi',
        price: 48000,
        image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        is_popular: true,
      },
      {
        id: 'b-3',
        name: 'Qarsildoq Tovuqli Burger',
        description: 'Tillarang qovurilgan tovuq filesi, aysberg salat bargi va mayonezli sous',
        price: 32000,
        image_url: 'https://images.unsplash.com/photo-1525164286253-04e68b9d94c6?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
    ],
  },
  {
    id: 'lavash',
    name: 'Lavash',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'l-1',
        name: 'Mol go‘shtli Lavash (Standart)',
        description: 'Yupqa xamir, yumshoq go‘sht, pomidor, bodring, chipslar va tomat sousi',
        price: 35000,
        image_url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        is_popular: true,
      },
      {
        id: 'l-2',
        name: 'Pishloqli Go‘shtli Lavash Big',
        description: 'Eritilgan mozzarella pishlog‘i, ko‘p go‘sht va maxsus qaymoqli sous',
        price: 44000,
        image_url: 'https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
      {
        id: 'l-3',
        name: 'Tovuqli Lavash Pishloq bilan',
        description: 'Tovuq go‘shti, barra sabzavotlar, pishloq va oq sarimsoqli sous',
        price: 32000,
        image_url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
    ],
  },
  {
    id: 'hot-dog',
    name: 'Hot-Dog',
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'hd-1',
        name: 'Klassik Daniya Hot-Dogi',
        description: 'Grilda pishgan sosiska, qovurilgan qarsildoq piyoz, marinadlangan bodring va xantal',
        price: 24000,
        image_url: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
      {
        id: 'hd-2',
        name: 'Double Sosiskali Chizdog',
        description: 'Ikkita mol go‘shti sosiskasi, cheddar pishlog‘i va achchiq jalapeno',
        price: 32000,
        image_url: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
    ],
  },
  {
    id: 'sandwiches',
    name: 'Sendvichlar',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'sw-1',
        name: 'Klab Sendvich Tovuq bilan',
        description: 'Qovurilgan tost nonlari, tovuq filesi, pishloq, tuxum, pomidor va aysberg',
        price: 38000,
        image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        is_popular: true,
      },
      {
        id: 'sw-2',
        name: 'Gouda va Go‘shtli Panini',
        description: 'Grilda bosilgan italyan panini noni, lahm go‘sht va erigan gouda pishlog‘i',
        price: 40000,
        image_url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
    ],
  },

  // ROW 3
  {
    id: 'pizzas',
    name: 'Pitsalar',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'pz-1',
        name: 'Pepperoni Pizza (30cm)',
        description: 'Achchiq pepperoni kolbasalari, mozzarella va tomat sousi',
        price: 72000,
        image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        is_popular: true,
      },
      {
        id: 'pz-2',
        name: 'Margarita Klassik (30cm)',
        description: 'Italyan pomidorlari, yangi mozzarella pishlog‘i va xushbo‘y rayhon',
        price: 58000,
        image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
      {
        id: 'pz-3',
        name: 'Kombinatsiyalangan 4 Fasl',
        description: 'Go‘sht, qo‘ziqorin, kurka filesi, zaytun va to‘rt xil pishloq',
        price: 85000,
        image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
    ],
  },
  {
    id: 'chicken-dishes',
    name: 'Tovuq taomlari',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'ch-1',
        name: 'Qarsildoq Stripslar (5 dona)',
        description: 'Tovuq ko‘krak filesidan qarsildoq panirlangan stripslar, sous bilan',
        price: 30000,
        image_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        is_popular: true,
      },
      {
        id: 'ch-2',
        name: 'Achchiq Qanotlar Hot BBQ (6 dona)',
        description: 'Olovda pishirilgan tovuq qanotlari, achchiq barbekyu sirlanishi bilan',
        price: 34000,
        image_url: 'https://images.unsplash.com/photo-1527477378378-0c6753065d64?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
    ],
  },
  {
    id: 'french-fries',
    name: 'Fri kartoshka',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'ff-1',
        name: 'Klassik Fri (Standart)',
        description: 'Oltin rang, ichi mayin va sirti qarsildoq kartoshka, dengiz tuzi bilan',
        price: 16000,
        image_url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
      {
        id: 'ff-2',
        name: 'Qishloqcha Kartoshka (Derevenskiy)',
        description: 'Pechda rozmarin va xushbo‘y ziravorlar bilan qovurilgan kartoshka bo‘laklari',
        price: 20000,
        image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
    ],
  },
  {
    id: 'donar',
    name: 'Donar',
    image: 'https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'dn-1',
        name: 'Turkcha Donar Kebab Lenta',
        description: 'Maxsus pishirilgan donar go‘shti, barra salat, qizil karam va ayron sousi',
        price: 36000,
        image_url: 'https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
      {
        id: 'dn-2',
        name: 'Iskandar Kebab Tarelkada',
        description: 'Issiq non bo‘laklari ustida donar go‘shti, sariyog‘, tomat qaylasi va suzma',
        price: 52000,
        image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
    ],
  },

  // ROW 4
  {
    id: 'hot-dishes',
    name: 'Issiq taomlar',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'ht-1',
        name: 'Maxsus Choyxona Oshi (1 porsiya)',
        description: 'Lazer guruch, mayin barra go‘sht, qazi, noxot, mayiz va bedana tuxumi',
        price: 45000,
        image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        is_popular: true,
      },
      {
        id: 'ht-2',
        name: 'Qozon Kabob (Qo‘zichoq)',
        description: 'Qozonda toblangan barra go‘sht va qizargan qarsildoq kartoshkalar',
        price: 68000,
        image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
    ],
  },
  {
    id: 'soups',
    name: 'Sho‘rvalar',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'sp-1',
        name: 'Mastava (Go‘shtli)',
        description: 'Yosh mol go‘shti, guruch, sabzavotlar va qatiq bilan boyitilgan sho‘rva',
        price: 32000,
        image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
      {
        id: 'sp-2',
        name: 'Kosa Sho‘rva Qo‘zichoqdan',
        description: 'Qaynab pishgan mayin go‘sht, sabzi, noxot va toza tiniq bulyon',
        price: 36000,
        image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
    ],
  },
  {
    id: 'salads',
    name: 'Salatlar',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'sl-1',
        name: 'Sezar Salati Tovuq bilan',
        description: 'Aysberg, grilda toblangan tovuq filesi, parmezan, suxariklar va sezar sousi',
        price: 38000,
        image_url: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        is_popular: true,
      },
      {
        id: 'sl-2',
        name: 'Yunoncha Salat (Greek)',
        description: 'Yangi bodring, pomidor, qizil piyoz, zaytun va feta pishlog‘i, zaytun moyi bilan',
        price: 32000,
        image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
      {
        id: 'sl-3',
        name: 'Achchiq-Chuchuk (Shakarob)',
        description: 'Sersuv pomidor, ingichka archilgan piyoz va mayin achchiq qalampir',
        price: 18000,
        image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
    ],
  },
  {
    id: 'sets',
    name: 'Setlar',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'st-1',
        name: 'Mix Gril Set (2 kishilik)',
        description: 'Qiyma kabob, kuskovoy kabob, tovuq qanotlari, guruch, sabzavotlar va 2 ta sous',
        price: 145000,
        image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        is_popular: true,
      },
      {
        id: 'st-2',
        name: 'Burger & Strips Party Set',
        description: '2 ta Chizburger, 6 dona tovuq stripslari, 2 ta fri kartoshkasi va 2 ta sous',
        price: 98000,
        image_url: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
    ],
  },

  // ROW 5
  {
    id: 'cold-drinks',
    name: 'Sovuq ichimliklar',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'cd-1',
        name: 'Coca-Cola / Fanta / Sprite (0.5L)',
        description: 'Shisha idishdagi muzdek gazlangan salqin ichimlik',
        price: 12000,
        image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
      {
        id: 'cd-2',
        name: 'Muzdek Qatiqli Ayron Yalpiz bilan (1L)',
        description: 'Tabiiy qatiq, tog‘ yalpizi va barra bodring bilan salqinlatuvchi ayron',
        price: 18000,
        image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
    ],
  },
  {
    id: 'coffee',
    name: 'Kofe',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'cf-1',
        name: 'Kapuchino (300ml)',
        description: 'Yangi maydalangan arabika donalari va ipakdek mayin sut ko‘pigi',
        price: 22000,
        image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
      {
        id: 'cf-2',
        name: 'Latte Karamelli (350ml)',
        description: 'Espresso, issiq sut va fransuz karamel siropi',
        price: 26000,
        image_url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
    ],
  },
  {
    id: 'cocktails',
    name: 'Kokteyllar',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'ck-1',
        name: 'Klassik Moxito (Limon & Yalpiz)',
        description: 'Laym sharbati, xushbo‘y yangi yalpiz, shakar qiyomi va muz',
        price: 25000,
        image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        is_popular: true,
      },
      {
        id: 'ck-2',
        name: 'Qulupnayli Yangi Smuzi',
        description: 'Tabiiy yangi qulupnay, banan va apelsin sharbati',
        price: 28000,
        image_url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
    ],
  },
  {
    id: 'desserts',
    name: 'Desertlar',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'ds-1',
        name: 'Chizkeyk San-Sebastyan',
        description: 'Ispancha qaymoqli kuydirilgan chizkeyk, issiq shokoladli qayla bilan',
        price: 36000,
        image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        is_popular: true,
      },
      {
        id: 'ds-2',
        name: 'Shokoladli Fondan',
        description: 'Issiq shokolad yurakchasi va yonida bir shar vanil muzqaymog‘i',
        price: 32000,
        image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
    ],
  },

  // ROW 6
  {
    id: 'kids-menu',
    name: 'Bolalar menyusi',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
    iconType: 'child',
    items: [
      {
        id: 'kd-1',
        name: 'Junior Naggets Box',
        description: '6 dona oltin naggets, kichik fri, sharbat va syurpriz sovg‘a',
        price: 32000,
        image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
      {
        id: 'kd-2',
        name: 'Mitti Burger',
        description: 'Yumshoq non, 100% toza mol go‘shti va yengil pishloq',
        price: 25000,
        image_url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
    ],
  },
  {
    id: 'family-sets',
    name: 'Oilaviy setlar',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    iconType: 'family',
    items: [
      {
        id: 'fs-1',
        name: 'Katta Oila Platter (4-5 kishi)',
        description: 'Gril go‘shtlar to‘plami, shashliklar, 2 xil salat, 2 ta katta fri va 1.5L Coca-Cola',
        price: 280000,
        image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        is_popular: true,
      },
      {
        id: 'fs-2',
        name: 'Pizza & Burger Oila To‘plami',
        description: '2 ta katta pizza (Pepperoni + Margarita), 3 ta burger, fri va ichimliklar',
        price: 220000,
        image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
    ],
  },
  {
    id: 'add-ons',
    name: 'Qo‘shimcha\nmahsulotlar',
    image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=600&auto=format&fit=crop&q=80',
    iconType: 'sauce',
    items: [
      {
        id: 'ao-1',
        name: 'Pishloqli Sous (Cheddar Dip)',
        description: 'Haqiqiy cheddar pishlog‘idan iliq qaymoqli sous',
        price: 6000,
        image_url: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
      {
        id: 'ao-2',
        name: 'Sarimsoqli Oq Sous',
        description: 'Mayin sarimsoq va ko‘katli uy sousi',
        price: 5000,
        image_url: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
      {
        id: 'ao-3',
        name: 'Achchiq Jalapeno Qalampirlari',
        description: 'Marinadlangan qarsildoq meksikancha qalampir bo‘laklari',
        price: 7000,
        image_url: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=600&auto=format&fit=crop&q=80',
        is_available: true,
      },
    ],
  },
  {
    id: 'about-us',
    name: 'Biz haqimizda',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    iconType: 'about',
    items: [],
  },
]
