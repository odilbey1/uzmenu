import Link from 'next/link'
import { ArrowUpRight, ArrowRight, QrCode, UtensilsCrossed, Smartphone, Globe2, SlidersHorizontal, Check, ChefHat } from 'lucide-react'
import s from './page.module.css'

const dishes = [
  { name: 'Grand Royal Burger', category: 'Burgerlar', price: '52 000', image: 'photo-1568901346375-23c9450c58cd' },
  { name: 'Pepperoni Supreme', category: 'Pitsalar', price: '78 000', image: 'photo-1513104890138-7c749659a591' },
]
export default function LandingPage() {
  return <div className={s.page}>
    <header className={s.header}>
      <Link href="/" className={s.brand}><span className={s.brandIcon}><UtensilsCrossed size={21}/></span>QRMenu<span className={s.brandSuffix}>.ai</span></Link>
      <nav aria-label="Asosiy navigatsiya" className={s.nav}><a href="#features">Imkoniyatlar</a><a href="#how-it-works">Qanday ishlaydi?</a><Link href="/r/demo">Menyu namunasi <ArrowUpRight size={14}/></Link></nav>
      <Link href="/login" className={s.navButton}>Admin panel <ArrowUpRight size={16}/></Link>
    </header>
    <main>
      <section className={s.hero}>
        <div className={s.heroCopy}>
          <div className={s.eyebrow}><span/> RESTORANINGIZ UCHUN RAQAMLI MENYU</div>
          <h1>Yaxshi taom.<br/>Ajoyib taassurot.</h1>
          <p>Menyuingiz ham taomlaringizdek jozibali bo‘lsin. Mehmonlaringiz uchun qulay QR menyu, siz uchun oson boshqaruv.</p>
          <div className={s.actions}><Link href="/r/demo" className={s.primary}>Menyuni sinab ko‘rish <ArrowUpRight size={19}/></Link><Link href="/login" className={s.secondary}>Tizimga kirish <ArrowRight size={17}/></Link></div>
          <div className={s.checks}><span><Check size={15}/> Ilova talab qilinmaydi</span><span><Check size={15}/> Mobilga mos</span></div>
          <div className={s.heroNote}><QrCode size={35} strokeWidth={1.5}/><div><strong>Bitta QR kod. Butun menyuingiz.</strong><span>Skanerlang. Tanlang. Marhamat!</span></div></div>
        </div>
        <div className={s.showcase}>
          <div className={s.showcaseLabel}><span>MEHMONINGIZ KO‘RADIGAN MENYU</span><ArrowUpRight size={18}/></div>
          <div className={s.menuPreview}>
            <div className={s.restaurantCover}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000&auto=format&fit=crop&q=85" alt="Restorandagi nafis taom taqdimoti" fetchPriority="high"/>
              <span className={s.demoTag}>NAMUNA</span>
              <div><span>TA’M VA AN’ANA</span><h2>Rayhon</h2><p>Har bir taomda mehr.</p></div>
            </div>
            <div className={s.previewBody}>
              <div className={s.previewTitle}><strong>Bugun nima tanlaysiz?</strong><UtensilsCrossed size={18}/></div>
              <div className={s.tabs}><span>Ommabop</span><span>Asosiy taomlar</span><span>Ichimliklar</span></div>
              <div className={s.dishes}>{dishes.map(dish=><Link href="/r/demo" key={dish.name} className={s.dish}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://images.unsplash.com/${dish.image}?w=500&auto=format&fit=crop&q=85`} alt={dish.name}/>
                <div><span>{dish.category}</span><h3>{dish.name}</h3><p>{dish.price} <small>so‘m</small><ArrowUpRight size={17}/></p></div>
              </Link>)}</div>
              <Link className={s.fullMenu} href="/r/demo">To‘liq menyuni ochish <ArrowRight size={16}/></Link>
            </div>
          </div>
          <div className={s.previewCaption}><span className={s.statusDot}/> Telefon, planshet va kompyuterda birdek qulay</div>
        </div>
      </section>
      <section id="features" className={s.features}>
        <div className={s.featureIntro}><span className={s.kicker}>KAMROQ TASHVISH.</span><h2>Ko‘proq mehmondo‘stlik.</h2></div>
        {[{icon:SlidersHorizontal,title:'Boshqarish oson',text:'Taomlar, narxlar va mavjudlikni bitta paneldan yangilang.'},{icon:Smartphone,title:'Har doim qo‘l ostida',text:'Mehmonlar QR kod orqali menyuni o‘z telefonida ochadi.'},{icon:Globe2,title:'Ulashish qulay',text:'Menyuga havolani ijtimoiy tarmoqlarda yoki xabarda yuboring.'}].map(f=><div key={f.title} className={s.feature}><f.icon size={23} strokeWidth={1.6}/><h3>{f.title}</h3><p>{f.text}</p></div>)}
      </section>
      <section id="how-it-works" className={s.stepsSection}>
        <div className={s.sectionHeading}><div><span className={s.kicker}>QANDAY ISHLAYDI?</span><h2>Yangi menyu. Uch oddiy qadam.</h2></div><Link href="/login">Boshlash <ArrowUpRight size={18}/></Link></div>
        <div className={s.steps}>{[{title:'Menyuni yarating',text:'Boshqaruv panelida bo‘limlar, taomlar va suratlarni qo‘shing.'},{title:'O‘zingizga moslang',text:'Restoran ma’lumotlarini kiriting va menyuni ko‘rib chiqing.'},{title:'Mehmonlarga ulashing',text:'QR kodni yuklab oling va stollarga joylashtiring.'}].map((step,i)=><article key={step.title}><span className={s.stepNumber}>0{i+1}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
      </section>
      <section className={s.cta}><ChefHat size={36} strokeWidth={1.4}/><div><h2>Taomlaringiz e’tibor markazida.</h2><p>Restoraningizning raqamli menyusini yangi bosqichga olib chiqing.</p></div><Link href="/r/demo" className={s.primary}>Namunani ko‘rish <ArrowUpRight size={19}/></Link></section>
    </main>
    <footer className={s.footer}><Link href="/" className={s.brand}><UtensilsCrossed size={19}/> QRMenu.ai</Link><span>Restoranlar uchun. Mehmonlar uchun.</span><span>© {new Date().getFullYear()} QRMenu</span></footer>
  </div>
}
