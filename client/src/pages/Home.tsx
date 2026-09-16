import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import {
  ArrowRight,
  ArrowUpRight,
  CaretLeft,
  CaretRight,
  CalendarBlank,
  CheckCircle,
  Clock,
  Envelope,
  FacebookLogo,
  Heart,
  House,
  List,
  MapPin,
  Pause,
  PawPrint,
  Phone,
  Play,
  Plus,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  Sparkle,
  Stethoscope,
  Tag,
  UserCircle,
  X,
  InstagramLogo,
} from "@phosphor-icons/react";

type IconType = typeof PawPrint;

type AssetImageProps = {
  name: string;
  fallback: string;
  alt: string;
  className?: string;
};

const assets = {
  Dog1: "/assets/Dog1.jpg",
  Dog2: "/assets/Dog2.jpg",
  Dog3: "/assets/Dog3.jpg",
  Cat1: "/assets/Cat1.jpg",
  Cat2: "/assets/Cat2.jpg",
  Cat3: "/assets/Cat3.jpg",
  Promo1: "/assets/Promo1.jpg",
  Promo2: "/assets/Promo2.jpg",
  Promo3: "/assets/Promo3.jpg",
  Promo4: "/assets/Promo4.jpg",
  Promo5: "/assets/Promo5.jpg",
  Mascot1: "/assets/Mascot1.jpg",
  Mascot2: "/assets/Mascot2.jpg",
};

const fallbackImages = {
  Dog1: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=85",
  Dog2: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1200&q=85",
  Dog3: "https://images.unsplash.com/photo-1583511655826-05700442b31b?auto=format&fit=crop&w=1200&q=85",
  Cat1: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1200&q=85",
  Cat2: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1200&q=85",
  Cat3: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=1200&q=85",
  Promo1: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1600&q=85",
  Promo2: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1600&q=85",
  Promo3: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1600&q=85",
  Promo4: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1600&q=85",
  Promo5: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1600&q=85",
  Mascot1: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=85",
  Mascot2: "https://images.unsplash.com/photo-1546238232-20216dec9f72?auto=format&fit=crop&w=1200&q=85",
};

function AssetImage({ name, fallback, alt, className = "" }: AssetImageProps) {
  const [src, setSrc] = useState(name);
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setSrc(fallback)}
    />
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-mark ${compact ? "brand-mark--compact" : ""}`} aria-label="Furry Tales home">
      <span className="brand-icon"><PawPrint size={20} weight="fill" /></span>
      <span>furry<span>tales</span></span>
    </div>
  );
}

const promos = [
  { title: "Fresh starts, softer coats", copy: "20% off a first grooming visit for new furry friends.", cta: "Book grooming", image: "Promo1" as const, tag: "NEW FRIEND OFFER" },
  { title: "Wellness check, worry less", copy: "Bundle a checkup and deworming visit for one gentle price.", cta: "View wellness", image: "Promo2" as const, tag: "VET CARE BUNDLE" },
  { title: "The good stuff is in", copy: "Stock up on treats and everyday supplies with free local delivery.", cta: "Shop essentials", image: "Promo3" as const, tag: "STORE PICK" },
  { title: "A little more playtime", copy: "Try a half-day of daycare and meet your pet's new favorite people.", cta: "Explore daycare", image: "Promo4" as const, tag: "DAYCARE DAYS" },
  { title: "Love looks good on every pet", copy: "Meet adoptable dogs and cats ready for a new chapter.", cta: "Meet the pets", image: "Promo5" as const, tag: "ADOPTION SPOTLIGHT" },
];

const services: { title: string; copy: string; price: string; Icon: IconType; accent: string }[] = [
  { title: "Veterinary", copy: "Gentle checkups, vaccinations, and everyday wellness.", price: "From $25", Icon: Stethoscope, accent: "mint" },
  { title: "Grooming", copy: "Fresh baths, tidy trims, and feel-good finishing touches.", price: "From $30", Icon: Scissors, accent: "peach" },
  { title: "Daycare", copy: "A safe, social place for play, rest, and new friends.", price: "From $18", Icon: House, accent: "lavender" },
];

const adoptablePets = [
  { name: "Buddy", details: "Golden retriever · 2 years", image: "Dog1" as const, note: "Playful & sunny" },
  { name: "Milo", details: "Tabby cat · 1 year", image: "Cat1" as const, note: "Curious & cuddly" },
  { name: "Luna", details: "Corgi mix · 3 years", image: "Dog2" as const, note: "Sweet & steady" },
];

const products = [
  { name: "Daily Joy Kibble", type: "Dog food · 2 kg", price: "$24", image: "Dog3" as const },
  { name: "Crunchy Little Bites", type: "All pets · 300 g", price: "$9", image: "Cat2" as const },
  { name: "Comfy Cloud Bed", type: "Small / medium", price: "$42", image: "Cat3" as const },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [promoIndex, setPromoIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [serviceModal, setServiceModal] = useState<string | null>(null);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setPromoIndex((current) => (current + 1) % promos.length);
    }, 1800);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const promo = promos[promoIndex];
  const greeting = useMemo(() => {
    if (!user?.name) return "there";
    return user.name.split(" ")[0];
  }, [user?.name]);

  function showToast(message: string) {
    setToast(message);
  }

  function handleLogin() {
    startLogin();
  }

  function handleProtectedAction(message: string) {
    if (!isAuthenticated) {
      showToast("Log in to continue — we'll bring you right back here.");
      window.setTimeout(handleLogin, 650);
      return;
    }
    showToast(message);
  }

  return (
    <div className="site-shell">
      <div className="top-ribbon">
        <div className="container ribbon-inner">
          <span><Sparkle size={14} weight="fill" /> New here? Get 20% off your first grooming visit.</span>
          <button onClick={() => scrollToId("promos")}>See offer <ArrowUpRight size={14} /></button>
        </div>
      </div>

      <header className="site-header">
        <div className="container nav-wrap">
          <button className="mobile-menu-button" onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle menu">
            {mobileOpen ? <X size={24} /> : <List size={24} />}
          </button>
          <button className="logo-button" onClick={() => scrollToId("top")}><Logo /></button>
          <nav className={`main-nav ${mobileOpen ? "main-nav--open" : ""}`} aria-label="Primary navigation">
            <button onClick={() => { scrollToId("top"); setMobileOpen(false); }}>Home</button>
            <button onClick={() => { scrollToId("services"); setMobileOpen(false); }}>Services</button>
            <button onClick={() => { scrollToId("adoption"); setMobileOpen(false); }}>Adoption</button>
            <button onClick={() => { scrollToId("store"); setMobileOpen(false); }}>Store</button>
            <button onClick={() => { scrollToId("about"); setMobileOpen(false); }}>About us</button>
          </nav>
          <div className="nav-actions">
            <button className="icon-button cart-button" onClick={() => scrollToId("store")} aria-label={`Cart with ${cartCount} items`}>
              <ShoppingBag size={21} weight="regular" />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
            {isAuthenticated ? (
              <button className="account-chip" onClick={() => scrollToId("dashboard")}>
                <span className="avatar">{greeting.slice(0, 1).toUpperCase()}</span>
                <span className="account-name">Hi, {greeting}</span>
              </button>
            ) : (
              <button className="button button--small button--dark" onClick={handleLogin}><UserCircle size={18} /> Log in</button>
            )}
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-dot" /> Care that feels like home</div>
              <h1>Big love for<br /><em>little paws.</em></h1>
              <p className="hero-lead">A softer, simpler place for pet parents to find care, discover new companions, and celebrate every tail wag.</p>
              <div className="hero-actions">
                <button className="button button--primary" onClick={() => scrollToId("services")}>Find care <ArrowRight size={19} weight="bold" /></button>
                <button className="text-button" onClick={() => scrollToId("adoption")}>Meet adoptable pets <ArrowUpRight size={18} /></button>
              </div>
              <div className="hero-proof"><div className="avatar-stack"><span>J</span><span>M</span><span>A</span><span>+</span></div><span>Loved by 2,000+ pet parents</span></div>
            </div>
            <div className="hero-art" aria-label="Happy dog and cat collage">
              <div className="hero-glow" />
              <div className="hero-image hero-image--main"><AssetImage name={assets.Dog1} fallback={fallbackImages.Dog1} alt="Happy golden dog" className="cover-image" /></div>
              <div className="hero-image hero-image--side"><AssetImage name={assets.Cat1} fallback={fallbackImages.Cat1} alt="Curious cat" className="cover-image" /></div>
              <div className="hero-sticker hero-sticker--heart"><Heart size={24} weight="fill" /></div>
              <div className="hero-sticker hero-sticker--paw"><PawPrint size={20} weight="fill" /></div>
              <div className="hero-note"><span className="note-icon"><CheckCircle size={18} weight="fill" /></span><span><strong>Good day guaranteed</strong><small>for every good boy & girl</small></span></div>
            </div>
          </div>
        </section>

        <section className="marquee-section" aria-label="Adoption announcement">
          <div className="marquee-track">
            {[0, 1].map((group) => <div className="marquee-content" key={group} aria-hidden={group === 1}>
              <span>Adopt now</span><PawPrint size={24} weight="fill" /><span>Change a life</span><Heart size={24} weight="fill" /><span>Find your forever friend</span><PawPrint size={24} weight="fill" />
            </div>)}
          </div>
        </section>

        <section className="section section--promos" id="promos">
          <div className="container">
            <div className="section-heading section-heading--split"><div><div className="eyebrow">A little something good</div><h2>Today at Furry Tales</h2></div><div className="carousel-controls"><button className="icon-button" onClick={() => setPromoIndex((promoIndex - 1 + promos.length) % promos.length)} aria-label="Previous promotion"><CaretLeft size={20} /></button><button className="icon-button" onClick={() => setPromoIndex((promoIndex + 1) % promos.length)} aria-label="Next promotion"><CaretRight size={20} /></button><button className="icon-button icon-button--pause" onClick={() => setIsPaused((paused) => !paused)} aria-label={isPaused ? "Play promotions" : "Pause promotions"}>{isPaused ? <Play size={17} weight="fill" /> : <Pause size={17} weight="fill" />}</button></div></div>
            <div className="promo-card">
              <div className="promo-copy"><span className="pill pill--light"><Tag size={14} weight="fill" /> {promo.tag}</span><h3>{promo.title}</h3><p>{promo.copy}</p><button className="button button--light" onClick={() => handleProtectedAction(`${promo.cta} selected`)}>{promo.cta} <ArrowRight size={18} /></button><div className="promo-progress"><span>{String(promoIndex + 1).padStart(2, "0")}</span><div className="progress-line"><span style={{ width: `${((promoIndex + 1) / promos.length) * 100}%` }} /></div><span>{String(promos.length).padStart(2, "0")}</span></div></div>
              <div className="promo-image"><AssetImage name={assets[promo.image]} fallback={fallbackImages[promo.image]} alt={promo.title} className="cover-image" /><div className="promo-image-overlay" /></div>
            </div>
          </div>
        </section>

        <section className="section section--services" id="services">
          <div className="container">
            <div className="section-heading"><div className="eyebrow">Here when you need us</div><h2>Care for every chapter.</h2><p>From the first checkup to the everyday moments, our friendly team makes pet care feel easy.</p></div>
            <div className="service-grid">{services.map(({ title, copy, price, Icon, accent }) => <article className={`service-card service-card--${accent}`} key={title}><div className="service-icon"><Icon size={28} weight="duotone" /></div><div><h3>{title}</h3><p>{copy}</p></div><div className="service-footer"><span>{price}</span><button onClick={() => setServiceModal(title)} aria-label={`Book ${title}`}><ArrowUpRight size={20} /></button></div></article>)}</div>
          </div>
        </section>

        <section className="section section--adoption" id="adoption">
          <div className="container">
            <div className="section-heading section-heading--split"><div><div className="eyebrow">Looking for your plus-one?</div><h2>Meet the newest<br /><em>chapter of your story.</em></h2></div><button className="text-button" onClick={() => handleProtectedAction("Adoption browsing opened")}>View all pets <ArrowRight size={18} /></button></div>
            <div className="pet-grid">{adoptablePets.map((pet) => <article className="pet-card" key={pet.name}><div className="pet-image"><AssetImage name={assets[pet.image]} fallback={fallbackImages[pet.image]} alt={`${pet.name}, an adoptable pet`} className="cover-image" /><button className="heart-button" aria-label={`Save ${pet.name}`} onClick={() => showToast(`${pet.name} saved to your favorites`)}><Heart size={18} /></button><span className="pet-note">{pet.note}</span></div><div className="pet-meta"><div><h3>{pet.name}</h3><p>{pet.details}</p></div><button className="round-arrow" onClick={() => handleProtectedAction(`Viewing ${pet.name}'s adoption details`)}><ArrowUpRight size={18} /></button></div></article>)}</div>
          </div>
        </section>

        <section className="section section--store" id="store">
          <div className="container">
            <div className="shop-header"><div><div className="eyebrow">Small joys, delivered</div><h2>Good things for<br /><em>good companions.</em></h2></div><button className="text-button" onClick={() => showToast("Full store coming next — these are our first picks!")}>Explore the store <ArrowRight size={18} /></button></div>
            <div className="product-grid">{products.map((product) => <article className="product-card" key={product.name}><div className="product-image"><AssetImage name={assets[product.image]} fallback={fallbackImages[product.image]} alt={product.name} className="cover-image" /><span className="product-tag">FURRY PICK</span></div><div className="product-info"><div><h3>{product.name}</h3><p>{product.type}</p></div><strong>{product.price}</strong></div><button className="add-button" onClick={() => { setCartCount((count) => count + 1); showToast(`${product.name} added to cart`); }}><Plus size={17} weight="bold" /> Add to cart</button></article>)}</div>
          </div>
        </section>

        <section className="section section--dashboard" id="dashboard">
          <div className="container dashboard-card"><div className="dashboard-copy"><div className="eyebrow eyebrow--light">Your pet's happy place</div><h2>Everything important,<br /><em>in one gentle place.</em></h2><p>Keep care plans, reservations, pet profiles, and little reminders together — so you can spend less time organising and more time cuddling.</p>{isAuthenticated ? <button className="button button--light" onClick={() => showToast("Dashboard is ready for you")}>Open my dashboard <ArrowRight size={18} /></button> : <button className="button button--light" onClick={handleLogin}>Create your account <ArrowRight size={18} /></button>}</div><div className="dashboard-preview"><div className="preview-top"><span className="preview-logo"><PawPrint size={13} weight="fill" /> dashboard</span><span className="preview-avatar">{isAuthenticated ? greeting.slice(0, 1).toUpperCase() : "K"}</span></div><div className="preview-body"><div className="preview-welcome">Good morning, {isAuthenticated ? greeting : "Kurt"} <span>✦</span></div><div className="preview-stats"><div><small>Next visit</small><strong>14 days</strong></div><div><small>My pets</small><strong>02</strong></div><div><small>Reservations</small><strong>01</strong></div></div><div className="preview-row"><span><CalendarBlank size={16} /> Grooming appointment</span><b>Fri, Sep 26</b></div><div className="preview-row"><span><ShieldCheck size={16} /> Vaccination reminder</span><b>Due soon</b></div></div></div></div>
        </section>

        <section className="section section--about" id="about">
          <div className="container about-grid"><div className="about-images"><div className="about-image about-image--large"><AssetImage name={assets.Mascot1} fallback={fallbackImages.Mascot1} alt="Furry Tales mascot with a dog" className="cover-image" /></div><div className="about-image about-image--small"><AssetImage name={assets.Mascot2} fallback={fallbackImages.Mascot2} alt="Furry Tales mascot with a pet" className="cover-image" /></div></div><div className="about-copy"><div className="eyebrow">A softer way to pet parent</div><h2>Made for the<br /><em>everyday magic.</em></h2><p>Furry Tales brings the pieces of pet life together — thoughtful care, kind people, good products, and the small reminders that make a big difference.</p><div className="value-list"><div><CheckCircle size={20} weight="fill" /><span><strong>Gentle by design</strong><small>Every interaction starts with care.</small></span></div><div><CheckCircle size={20} weight="fill" /><span><strong>Clear when it matters</strong><small>Simple prices, simple next steps.</small></span></div><div><CheckCircle size={20} weight="fill" /><span><strong>For all kinds of families</strong><small>More joy, no judgment.</small></span></div></div></div></div>
        </section>
      </main>

      <footer className="site-footer"><div className="container footer-grid"><div><Logo /><p className="footer-note">Big love for little paws.<br />Care, community, and good days.</p></div><div><h4>Explore</h4><button onClick={() => scrollToId("services")}>Services</button><button onClick={() => scrollToId("adoption")}>Adoption</button><button onClick={() => scrollToId("store")}>Store</button></div><div><h4>Need a hand?</h4><a href="mailto:hello@furrytales.example"><Envelope size={16} /> hello@furrytales.example</a><a href="tel:+10000000000"><Phone size={16} /> (000) 000-0000</a><span><MapPin size={16} /> Your neighborhood, everywhere</span></div><div><h4>Follow along</h4><div className="socials"><a href="#" aria-label="Instagram"><InstagramLogo size={20} /></a><a href="#" aria-label="Facebook"><FacebookLogo size={20} /></a></div></div></div><div className="container footer-bottom"><span>© 2025 Furry Tales. Made with care.</span><span>Privacy · Terms · Accessibility</span></div></footer>

      {toast && <div className="toast" role="status"><CheckCircle size={19} weight="fill" /> {toast}</div>}

      {serviceModal && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`${serviceModal} booking`} onClick={() => setServiceModal(null)}><div className="booking-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setServiceModal(null)} aria-label="Close"><X size={20} /></button><div className="modal-icon"><CalendarBlank size={24} weight="duotone" /></div><div className="eyebrow">Start your visit</div><h3>Book {serviceModal}</h3><p>Choose a pet and a preferred time. We’ll confirm the details with you before your visit.</p><label>Pet name<input placeholder="e.g. Buddy" /></label><label>Preferred date<input type="date" /></label><button className="button button--primary button--full" onClick={() => { setServiceModal(null); handleProtectedAction("Your reservation request is ready to finish"); }}>Continue to booking <ArrowRight size={18} /></button></div></div>}
    </div>
  );
}
