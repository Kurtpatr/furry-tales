import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  Bell,
  CalendarBlank,
  CaretRight,
  CheckCircle,
  Clock,
  House,
  List,
  MapPin,
  PawPrint,
  Plus,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  SignOut,
  Stethoscope,
  UserCircle,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { useLocation } from "wouter";

type DashboardTab = "overview" | "pets" | "services" | "profile";
type PetForm = { name: string; animal: "dog" | "cat" | "other"; breed: string; age: string; tracker: string; photoUrl: string; notes: string };

const blankPet: PetForm = { name: "", animal: "dog", breed: "", age: "", tracker: "", photoUrl: "", notes: "" };

function initials(name?: string | null) {
  return (name || "K").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const utils = trpc.useUtils();
  const petsQuery = trpc.account.pets.useQuery(undefined, { enabled: isAuthenticated });
  const profileMutation = trpc.account.updateProfile.useMutation({ onSuccess: () => { utils.auth.me.invalidate(); setNotice("Profile saved"); }, onError: (error) => setNotice(error.message) });
  const addPetMutation = trpc.account.addPet.useMutation({ onSuccess: () => { utils.account.pets.invalidate(); setNotice("Pet added to your family"); setPetForm(blankPet); setEditingPetId(null); }, onError: (error) => setNotice(error.message) });
  const updatePetMutation = trpc.account.updatePet.useMutation({ onSuccess: () => { utils.account.pets.invalidate(); setNotice("Pet details updated"); setPetForm(blankPet); setEditingPetId(null); }, onError: (error) => setNotice(error.message) });
  const archivePetMutation = trpc.account.archivePet.useMutation({ onSuccess: () => { utils.account.pets.invalidate(); setNotice("Pet archived"); }, onError: (error) => setNotice(error.message) });

  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [petForm, setPetForm] = useState<PetForm>(blankPet);
  const [editingPetId, setEditingPetId] = useState<number | null>(null);

  useEffect(() => {
    if (user) setProfileForm({ name: user.name ?? "", email: user.email ?? "" });
  }, [user]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2800);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function openPetForm(pet?: NonNullable<typeof petsQuery.data>[number]) {
    setActiveTab("pets");
    setEditingPetId(pet?.id ?? null);
    setPetForm(pet ? { name: pet.name, animal: pet.animal, breed: pet.breed ?? "", age: pet.age ?? "", tracker: pet.tracker ?? "", photoUrl: pet.photoUrl ?? "", notes: pet.notes ?? "" } : blankPet);
  }

  function savePet() {
    if (editingPetId) updatePetMutation.mutate({ ...petForm, id: editingPetId });
    else addPetMutation.mutate(petForm);
  }

  function selectTab(tab: DashboardTab) {
    setActiveTab(tab);
    setSidebarOpen(false);
  }

  if (loading) return <div className="dashboard-loading"><PawPrint size={30} weight="fill" /><span>Opening your dashboard…</span></div>;
  if (!isAuthenticated) return <div className="dashboard-gate"><div className="dashboard-gate-card"><div className="dashboard-gate-icon"><PawPrint size={32} weight="fill" /></div><span className="eyebrow">Furry Tales account</span><h1>Your pet's care, all in one place.</h1><p>Log in to manage your profile, add pets, and keep every upcoming service close at hand.</p><button className="button button--primary" onClick={startLogin}>Log in to continue <CaretRight size={18} /></button><button className="back-link" onClick={() => navigate("/")}>Back to Furry Tales</button></div></div>;

  const pets = petsQuery.data ?? [];
  const tabLabel = { overview: "Overview", pets: "My pets", services: "Services", profile: "Profile" }[activeTab];

  return (
    <div className="dashboard-shell">
      <aside className={`dashboard-sidebar ${sidebarOpen ? "dashboard-sidebar--open" : ""}`}>
        <div className="dashboard-brand"><button onClick={() => navigate("/")}><span className="brand-icon"><PawPrint size={20} weight="fill" /></span><strong>furry<span>tales</span></strong></button><button className="dashboard-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={20} /></button></div>
        <div className="dashboard-user"><span className="dashboard-avatar">{initials(user?.name)}</span><div><strong>{user?.name || "Pet parent"}</strong><small>{user?.email || "Welcome back"}</small></div></div>
        <nav className="dashboard-nav" aria-label="Dashboard navigation">
          <span className="dashboard-nav-label">Workspace</span>
          <button className={activeTab === "overview" ? "is-active" : ""} onClick={() => selectTab("overview")}><House size={19} /> Overview</button>
          <button className={activeTab === "pets" ? "is-active" : ""} onClick={() => selectTab("pets")}><PawPrint size={19} /> My pets <b>{pets.length}</b></button>
          <button className={activeTab === "services" ? "is-active" : ""} onClick={() => selectTab("services")}><CalendarBlank size={19} /> Services</button>
          <button onClick={() => navigate("/cart")}><ShoppingBag size={19} /> Store & cart</button>
          <span className="dashboard-nav-label dashboard-nav-label--spaced">Account</span>
          <button className={activeTab === "profile" ? "is-active" : ""} onClick={() => selectTab("profile")}><UserCircle size={19} /> Profile</button>
          <button onClick={() => setNotice("Notifications are all caught up")}><Bell size={19} /> Notifications <span className="notification-dot" /></button>
        </nav>
        <div className="dashboard-sidebar-bottom"><button className="home-link" onClick={() => navigate("/")}><CaretRight size={17} /> Back to site</button><button className="logout-link" onClick={() => logout()}><SignOut size={18} /> Log out</button></div>
      </aside>
      {sidebarOpen && <button className="dashboard-overlay" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}

      <main className="dashboard-main">
        <header className="dashboard-topbar"><button className="dashboard-menu" onClick={() => setSidebarOpen(true)} aria-label="Open dashboard menu"><List size={24} /></button><div><span className="dashboard-breadcrumb">Workspace / </span><strong>{tabLabel}</strong></div><div className="dashboard-top-actions"><button className="top-icon" onClick={() => setNotice("You're all caught up")} aria-label="Notifications"><Bell size={20} /></button><span className="top-avatar">{initials(user?.name)}</span></div></header>
        <div className="dashboard-content">
          <div className="dashboard-heading"><div><span className="eyebrow"><span className="eyebrow-dot" /> {activeTab === "overview" ? "Your calm corner" : "Furry Tales workspace"}</span><h1>{activeTab === "overview" ? <>Good morning, <em>{user?.name?.split(" ")[0] || "pet parent"}.</em></> : tabLabel}</h1><p>{activeTab === "overview" ? "A little overview of what your furry family needs next." : activeTab === "pets" ? "Keep your pet profiles ready for every visit." : activeTab === "services" ? "Book thoughtful care and keep upcoming visits in view." : "Keep your details current for smoother care updates."}</p></div>{activeTab === "pets" && <button className="button button--primary" onClick={() => openPetForm()}><Plus size={18} /> Add a pet</button>}</div>

          {activeTab === "overview" && <section className="dashboard-tab-content">
            <div className="dashboard-stat-grid"><div className="dashboard-stat dashboard-stat--lavender"><span><PawPrint size={21} weight="duotone" /></span><small>My pets</small><strong>{pets.length}</strong><em>Profiles ready</em></div><div className="dashboard-stat dashboard-stat--mint"><span><CalendarBlank size={21} weight="duotone" /></span><small>Next visit</small><strong>14 days</strong><em>Vaccination reminder</em></div><div className="dashboard-stat dashboard-stat--peach"><span><ShieldCheck size={21} weight="duotone" /></span><small>Care status</small><strong>Good</strong><em>Everything on track</em></div></div>
            <div className="dashboard-panel-grid"><section className="dashboard-panel"><div className="panel-heading"><div><span className="eyebrow">Your furry family</span><h2>My pets</h2></div><button className="panel-link" onClick={() => selectTab("pets")}>View all <CaretRight size={16} /></button></div>{pets.length ? <div className="dashboard-pet-list">{pets.slice(0, 3).map((pet) => <div className="dashboard-pet-row" key={pet.id}><span className="pet-symbol"><PawPrint size={19} weight="fill" /></span><div><strong>{pet.name}</strong><small>{pet.breed || pet.animal} · {pet.age || "Age not added"}</small></div><button onClick={() => openPetForm(pet)} aria-label={`Edit ${pet.name}`}><CaretRight size={18} /></button></div>)}</div> : <div className="empty-panel"><PawPrint size={24} /><p>No pet profiles yet.</p><button className="text-button" onClick={() => openPetForm()}>Add your first pet <Plus size={16} /></button></div>}</section><section className="dashboard-panel"><div className="panel-heading"><div><span className="eyebrow">Coming up</span><h2>Care calendar</h2></div><button className="panel-link" onClick={() => selectTab("services")}>Services <CaretRight size={16} /></button></div><div className="appointment-card"><span className="appointment-icon"><Scissors size={21} /></span><div><strong>Grooming appointment</strong><small>Friday, September 26 · 10:30 AM</small><span className="status-pill status-pill--pending">Pending confirmation</span></div></div><div className="appointment-card"><span className="appointment-icon appointment-icon--mint"><Stethoscope size={21} /></span><div><strong>Vaccination reminder</strong><small>Next checkup in 14 days</small><span className="status-pill status-pill--ready">Due soon</span></div></div></section></div>
          </section>}

          {activeTab === "pets" && <section className="dashboard-tab-content"><div className="pets-layout"><div className="dashboard-panel pets-list-panel"><div className="panel-heading"><div><span className="eyebrow">Saved profiles</span><h2>{pets.length} {pets.length === 1 ? "pet" : "pets"}</h2></div><UsersThree size={25} className="panel-heading-icon" /></div>{pets.length ? pets.map((pet) => <div className={`full-pet-row ${editingPetId === pet.id ? "is-selected" : ""}`} key={pet.id}><span className="full-pet-symbol"><PawPrint size={22} weight="fill" /></span><div className="full-pet-copy"><strong>{pet.name}</strong><span>{pet.animal} · {pet.breed || "Breed not added"}</span><small>{pet.age || "Age not added"}{pet.tracker ? ` · Tracker ${pet.tracker}` : ""}</small></div><div className="full-pet-actions"><button onClick={() => openPetForm(pet)}>Edit</button><button className="danger-text" onClick={() => archivePetMutation.mutate({ id: pet.id })}>Archive</button></div></div>) : <div className="empty-panel empty-panel--large"><PawPrint size={34} /><h3>Build your pet's profile</h3><p>Add their details once, then keep every future visit more personal.</p><button className="button button--primary" onClick={() => openPetForm()}><Plus size={18} /> Add a pet</button></div>}</div><div className="dashboard-panel pet-help-panel"><span className="pet-help-icon"><ShieldCheck size={28} /></span><h3>Why add a pet profile?</h3><p>We use these details to help you prepare for services and keep care history easy to find.</p><div className="help-item"><CheckCircle size={17} weight="fill" /> Faster booking</div><div className="help-item"><CheckCircle size={17} weight="fill" /> Better reminders</div><div className="help-item"><CheckCircle size={17} weight="fill" /> More thoughtful care</div></div></div></section>}

          {activeTab === "services" && <section className="dashboard-tab-content"><div className="service-tab-grid"><div className="dashboard-panel service-menu-panel"><div className="panel-heading"><div><span className="eyebrow">Book a visit</span><h2>Choose care</h2></div></div><button className="service-option" onClick={() => setNotice("Veterinary booking is ready for the next step")}><span className="service-option-icon service-option-icon--lavender"><Stethoscope size={22} /></span><span><strong>Veterinary</strong><small>Checkups, vaccines, deworming</small></span><CaretRight size={18} /></button><button className="service-option" onClick={() => setNotice("Grooming booking is ready for the next step")}><span className="service-option-icon service-option-icon--peach"><Scissors size={22} /></span><span><strong>Grooming</strong><small>Baths, trims, nails, packages</small></span><CaretRight size={18} /></button><button className="service-option" onClick={() => setNotice("Daycare booking is ready for the next step")}><span className="service-option-icon service-option-icon--mint"><House size={22} /></span><span><strong>Daycare</strong><small>Half-day, full-day, drop-off</small></span><CaretRight size={18} /></button></div><div className="dashboard-panel service-upcoming-panel"><div className="panel-heading"><div><span className="eyebrow">Your care plan</span><h2>Upcoming</h2></div><Clock size={25} className="panel-heading-icon" /></div><div className="service-timeline"><div className="timeline-line" /><div className="timeline-item"><span className="timeline-dot timeline-dot--violet" /><div><strong>Grooming</strong><small>Friday, September 26 · 10:30 AM</small><span className="status-pill status-pill--pending">Pending confirmation</span></div></div><div className="timeline-item"><span className="timeline-dot timeline-dot--mint" /><div><strong>Veterinary checkup</strong><small>Due in 14 days</small><span className="status-pill status-pill--ready">Reminder set</span></div></div></div><div className="service-note"><Bell size={18} /><span>We’ll notify you before each visit.</span></div></div></div></section>}

          {activeTab === "profile" && <section className="dashboard-tab-content"><div className="profile-layout"><section className="dashboard-panel profile-panel"><div className="profile-header"><span className="profile-large-avatar">{initials(user?.name)}</span><div><span className="eyebrow">Personal details</span><h2>Your profile</h2><p>Used for reservations and care updates.</p></div></div><div className="profile-form"><label>Full name<input value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} placeholder="Your name" /></label><label>Email address<input type="email" value={profileForm.email} onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })} placeholder="you@example.com" /></label><label>Contact number<input placeholder="Add a contact number" /></label><label>Home location<div className="input-with-icon"><MapPin size={18} /><input placeholder="City or neighborhood" /></div></label><button className="button button--primary" disabled={profileMutation.isPending} onClick={() => profileMutation.mutate(profileForm)}>{profileMutation.isPending ? "Saving…" : "Save profile"} <CheckCircle size={18} /></button></div></section><section className="dashboard-panel profile-side-panel"><ShieldCheck size={28} /><h3>Your information is yours.</h3><p>We only use your details to make bookings and reminders smoother.</p><div className="secure-line"><CheckCircle size={16} weight="fill" /> Account protected by secure sign-in</div></section></div></section>}
        </div>
      </main>
      {notice && <div className="toast" role="status"><CheckCircle size={19} weight="fill" /> {notice}</div>}
    </div>
  );
}
