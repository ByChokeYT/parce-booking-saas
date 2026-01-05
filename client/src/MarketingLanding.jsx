import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import {
    Scissors, Calendar, User, ArrowRight, Star,
    MapPin, Phone, Instagram, X, Shield, Clock,
    Award, Lock, Mail, MessageCircle, Navigation,
    ChevronRight, Facebook, Twitter, Zap,
    ExternalLink, Menu
} from 'lucide-react';
import logo from '../assets/001logo-1.png';

/* =============================================================================
  🎨 DESIGN SYSTEM: "SHARP & BOLD" (v2.0 - Industrial Premium)
  ============================================================================= 
*/

const Text = ({ variant = 'body', className, children, ...props }) => {
    const styles = {
        hero: 'text-6xl md:text-9xl font-black tracking-tighter text-white leading-[0.8] uppercase italic drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] font-outfit',
        h2: 'text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic leading-[0.85] font-outfit',
        h3: 'text-2xl font-black text-white uppercase tracking-tight font-outfit',
        body: 'text-zinc-400 text-sm md:text-base leading-relaxed font-medium tracking-wide',
        label: 'text-[10px] md:text-xs text-amber-500 font-black uppercase tracking-[0.6em] mb-2 block text-glow-amber',
    };
    return <p className={`${styles[variant]} ${className || ''}`} {...props}>{children}</p>;
};

// Botón de "Corte Profesional"
const BarberButton = ({ variant = 'primary', icon: Icon, children, className, fullWidth, onClick, type = "button" }) => {
    const isPrimary = variant === 'primary';

    return (
        <button
            type={type}
            onClick={onClick}
            className={`
        group relative px-10 py-5 font-black uppercase tracking-[0.2em] text-[10px] overflow-hidden transition-all duration-300
        ${fullWidth ? 'w-full' : 'inline-flex'} items-center justify-center gap-4
        ${isPrimary ? 'text-black glow-amber hover:glow-amber-strong' : 'text-white border border-white/10 glass hover:border-amber-500/50'}
        active:scale-95 rounded-xl
        ${className || ''}
      `}
        >
            {/* Background Layers */}
            <div className={`absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform -translate-x-full group-hover:translate-x-0 ${isPrimary ? 'bg-white' : 'bg-amber-500'}`}></div>
            {isPrimary && <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-400"></div>}

            {/* Text/Icon */}
            <span className={`relative z-10 flex items-center gap-3 transition-colors duration-500 ${isPrimary ? 'group-hover:text-black' : 'group-hover:text-black'}`}>
                <span>{children}</span>
                {Icon && <Icon size={16} className="transition-all duration-500 group-hover:rotate-45" />}
            </span>

            {/* Shine Edge */}
            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 group-hover:left-[100%] transition-all duration-1000"></div>
        </button>
    );
};

/* =============================================================================
  🔐 AUTH MODAL (Integrated)
  =============================================================================
*/
const AuthModal = ({ mode, onClose, onToggle }) => {
    const isLogin = mode === 'login';
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setLoginError(null);

        const email = e.target.email.value.toLowerCase();
        const password = e.target.password.value;

        const result = await login(email, password);

        if (result.success) {
            console.log("Login exitoso");
            // No need to alert, the redirect will happen automatically
            // via PublicRoute in App.jsx
            onClose();
        } else {
            setLoginError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Cinematic Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl animate-fade-in" onClick={onClose} />

            {/* Premium Industrial Container */}
            <div className="relative w-full max-w-xl bg-zinc-950/80 glass glow-amber shadow-[0_0_100px_rgba(245,158,11,0.1)] overflow-hidden animate-slide-up rounded-3xl">

                {/* Decorative Grid Layer */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-grid-white"></div>

                {/* Industrial Accents */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>

                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 text-white/20 hover:text-amber-500 transition-all duration-300 p-2 hover:bg-white/5 rounded-full"
                >
                    <X size={24} />
                </button>

                <div className="relative z-10 p-12 md:p-16">
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 bg-amber-500 animate-pulse rounded-full"></div>
                            <Text variant="label" className="!mb-0">Secure_Entry_System</Text>
                        </div>
                        <Text variant="h2" className="text-4xl md:text-6xl tracking-tighter">
                            {isLogin ? 'AUTH_REQUIRED' : 'NEW_IDENTITY'}
                        </Text>
                        <div className="w-12 h-[2px] bg-amber-500 mt-4"></div>
                    </div>

                    <form className="space-y-10" onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {loginError && (
                                <div className="bg-red-500/10 border border-red-500/50 p-4 text-[10px] text-red-500 font-black tracking-widest uppercase animate-shake">
                                    ERROR: {loginError}
                                </div>
                            )}
                            {!isLogin && (
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="relative group">
                                        <label className="text-[9px] font-black text-zinc-500 tracking-[0.3em] uppercase mb-4 block group-focus-within:text-amber-500 transition-colors">First_Name</label>
                                        <input
                                            name="first_name"
                                            required
                                            placeholder="ENTER_NAME"
                                            className="w-full bg-white/5 border border-white/10 px-8 py-6 text-base font-bold tracking-widest outline-none focus:border-amber-500/50 focus:bg-white/[0.08] transition-all text-white rounded-2xl placeholder:text-zinc-800 font-outfit"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <label className="text-[10px] font-black text-zinc-500 tracking-[0.4em] uppercase mb-5 block group-focus-within:text-amber-500 transition-colors">Last_Name</label>
                                        <input
                                            name="last_name"
                                            required
                                            placeholder="ENTER_SURNAME"
                                            className="w-full bg-white/5 border border-white/10 px-8 py-6 text-base font-bold tracking-widest outline-none focus:border-amber-500/50 focus:bg-white/[0.08] transition-all text-white rounded-2xl placeholder:text-zinc-800 font-outfit"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="relative group">
                                <label className="text-[10px] font-black text-zinc-500 tracking-[0.4em] uppercase mb-5 block group-focus-within:text-amber-500 transition-colors">Access_Credential</label>
                                <div className="relative">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-amber-500 transition-colors" size={20} />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="NAME@DOMAIN.COM"
                                        className="w-full bg-white/5 border border-white/10 pl-16 pr-8 py-6 text-base font-bold tracking-widest outline-none focus:border-amber-500/50 focus:bg-white/[0.08] transition-all text-white rounded-2xl placeholder:text-zinc-800 font-outfit"
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <label className="text-[10px] font-black text-zinc-500 tracking-[0.4em] uppercase mb-5 block group-focus-within:text-amber-500 transition-colors">Security_Code</label>
                                <div className="relative">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-amber-500 transition-colors" size={20} />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="••••••••••••"
                                        className="w-full bg-white/5 border border-white/10 pl-16 pr-8 py-6 text-base font-bold tracking-widest outline-none focus:border-amber-500/50 focus:bg-white/[0.08] transition-all text-white rounded-2xl placeholder:text-zinc-800 font-outfit"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <BarberButton fullWidth variant="primary" type="submit">
                                {loading ? 'INITIALIZING_UPLOADS...' : (isLogin ? 'BYPASS_SECURITY' : 'ESTABLISH_CONNECTION')}
                            </BarberButton>
                        </div>
                    </form>

                    <div className="mt-16 flex items-center justify-between border-t border-zinc-900 pt-8">
                        <div className="flex items-center gap-2">
                            <div className="w-1 l-1 bg-zinc-800 rounded-full"></div>
                            <span className="text-[8px] font-black text-zinc-800 tracking-[0.2em] uppercase italic">Quantum_Encrypted</span>
                        </div>
                        <button
                            onClick={onToggle}
                            className="text-[9px] font-black tracking-[0.3em] text-zinc-600 hover:text-amber-500 transition-colors uppercase flex items-center gap-2 group"
                        >
                            {isLogin ? 'Need registration?' : 'Existing user?'}
                            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Tactical Scan Line (Internal) */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                    <div className="w-full h-1 bg-amber-500/50 blur-sm animate-[scan_4s_linear_infinite]" />
                </div>
            </div>
        </div>
    );
};

/* =============================================================================
  🚀 PAGE COMPONENTS
  =============================================================================
*/

const TeamSection = () => {
    const barbers = [
        { name: "Nico 'The Blade'", role: "Master Artisan", img: "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?auto=format&fit=crop&q=80&w=800" },
        { name: "Dante Rossi", role: "Beard Engineer", img: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?auto=format&fit=crop&q=80&w=800" },
        { name: "Maxi Stone", role: "Fade specialist", img: "https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?auto=format&fit=crop&q=80&w=800" },
    ];

    return (
        <section id="equipo" className="py-32 bg-zinc-950 px-6 relative overflow-hidden">
            {/* Background Text */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] font-black text-white/[0.02] uppercase pointer-events-none select-none italic tracking-tighter">
                MAKERS
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-32 flex flex-col md:flex-row md:items-end justify-between border-l-8 border-amber-500 pl-12">
                    <div>
                        <Text variant="label">Precision Squad</Text>
                        <Text variant="h2">LOS <span className="text-amber-500 text-glow-amber">ARTESANOS</span></Text>
                    </div>
                    <Text variant="body" className="max-w-md mt-10 md:mt-0 opacity-60 text-lg">
                        No somos barberos, somos ingenieros de tu imagen. Milímetros de perfección al servicio de tu estilo.
                    </Text>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {barbers.map((b, i) => (
                        <div key={i} className="group relative">
                            <div className="aspect-[4/5] bg-zinc-900 overflow-hidden relative">
                                <img
                                    src={b.img}
                                    alt={b.name}
                                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                                />
                                {/* Industrial HUD Overlay */}
                                <div className="absolute inset-0 border-[20px] border-zinc-950/20 group-hover:border-transparent transition-all duration-500" />
                                <div className="absolute top-6 left-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-2 h-2 bg-amber-500 animate-pulse"></div>
                                    <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase">Active_Session</span>
                                </div>

                                <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black to-transparent">
                                    <Text variant="label" className="text-white brightness-150 mb-1">{b.role}</Text>
                                    <Text variant="h3" className="text-white italic group-hover:text-amber-500 transition-colors uppercase">{b.name}</Text>
                                </div>
                            </div>
                            {/* Decorative Edge */}
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 border-r-2 border-b-2 border-zinc-800 group-hover:border-amber-500/50 transition-colors -z-10"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const ServiceSection = () => {
    const services = [
        { id: "01", name: "SHARP_CUT", price: "3.5", note: "Classic scissor & clipper work" },
        { id: "02", name: "ENGINEERED_BEARD", price: "2.5", note: "Steam & precision razor profile" },
        { id: "03", name: "ROYAL_PROTOCOL", price: "6.0", note: "Full service + hot towel massage" },
        { id: "04", name: "URBAN_FADE", price: "4.0", note: "High contrast gradient technique" },
    ];

    return (
        <section id="servicios" className="py-32 bg-zinc-950 border-y border-zinc-800 relative">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1fr_2fr] gap-20">
                <div className="relative">
                    <div className="sticky top-40">
                        <Text variant="label">Menu_Protocol</Text>
                        <Text variant="h2" className="mb-12">COSTO DE <br />LA <span className="text-amber-500 text-glow-amber">GLORIA</span></Text>
                        <div className="w-32 h-2 bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]"></div>
                        <Text variant="body" className="mt-12 italic uppercase text-sm tracking-[0.3em] font-bold">
                            "Quality is never an accident. It is always the result of high intention."
                        </Text>
                    </div>
                </div>

                <div className="space-y-4">
                    {services.map((s, i) => (
                        <div key={i} className="group relative flex items-center justify-between p-12 border border-white/5 glass hover:border-amber-500/30 transition-all hover:-translate-y-2 cursor-default overflow-hidden rounded-2xl">
                            {/* Number BG */}
                            <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-[10rem] font-black text-white/[0.02] group-hover:text-amber-500/5 transition-colors italic">{s.id}</span>

                            <div className="relative z-10">
                                <h4 className="text-3xl font-black uppercase tracking-tighter text-white group-hover:text-amber-500 transition-colors italic font-outfit">{s.name}</h4>
                                <p className="text-xs text-zinc-500 uppercase tracking-[0.3em] font-bold mt-2">{s.note}</p>
                            </div>

                            <div className="relative z-10 flex flex-col items-end">
                                <span className="text-4xl font-black text-amber-500 tracking-tighter text-glow-amber">${s.price}K</span>
                                <div className="h-[3px] w-full bg-amber-500/20 mt-2 origin-right transition-transform group-hover:scale-x-150"></div>
                            </div>
                        </div>
                    ))}
                    <div className="pt-8">
                        <BarberButton variant="outline" fullWidth icon={ArrowRight}>FULL_INTEL_REPORT</BarberButton>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* =============================================================================
  🚀 MAIN COMPONENT: FLOW PRO
  =============================================================================
*/

export default function LandingBarber() {
    const [authMode, setAuthMode] = useState(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="bg-zinc-950 min-h-screen text-white font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden">

            {/* HUD NAVBAR */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'h-16 bg-zinc-950/95 border-b border-zinc-800' : 'h-24 bg-transparent'}`}>
                <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src={logo} alt="FLOW Logo" className="w-12 h-12 object-contain" />
                        <div className="hidden sm:block">
                            <span className="font-outfit font-black text-2xl tracking-tighter uppercase italic block leading-none">FLOW_SYSTEM</span>
                            <span className="text-[7px] font-black tracking-[0.2em] text-zinc-500 uppercase">Gestiona_Tu_Barbería_En_Piloto_Automático</span>
                        </div>
                    </div>

                    <div className="hidden lg:flex gap-12">
                        {[
                            { label: 'INTEL_REPORTS', href: '#servicios' },
                            { label: 'ACTIVE_SQUAD', href: '#equipo' },
                            { label: 'DEPLOYMENT_POINT', href: '#ubicacion' }
                        ].map(item => (
                            <a key={item.label} href={item.href} className="text-[10px] font-black tracking-[0.4em] text-zinc-500 hover:text-amber-500 transition-colors uppercase">{item.label}</a>
                        ))}
                    </div>

                    <div className="flex items-center gap-6">
                        <button onClick={() => setAuthMode('login')} className="text-[10px] font-black tracking-[0.4em] hover:text-amber-500 transition-colors uppercase">AUTH_REQUIRED</button>
                        <BarberButton onClick={() => setAuthMode('register')} variant="primary" className="!px-6 !py-3">
                            RESERVE_SLOT
                        </BarberButton>
                    </div>
                </div>
            </nav>

            {/* HERO SECTION: THE MONOLITH */}
            <header className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Cinematic BG */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/40 to-black z-10" />
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1503951914875-befbb7470d03?auto=format&fit=crop&q=80&w=2000"
                        className="w-full h-full object-cover grayscale contrast-125 scale-105"
                        alt="Flow Monolith"
                    />
                </div>

                {/* Floating HUD Elements */}
                <div className="absolute inset-0 z-20 pointer-events-none opacity-30">
                    <div className="absolute top-40 left-10 w-40 h-1 bg-white/20"></div>
                    <div className="absolute bottom-40 right-10 w-1 h-40 bg-white/20"></div>
                    <div className="absolute top-1/2 right-[5%] flex flex-col gap-4">
                        {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 border border-white/50"></div>)}
                    </div>
                </div>

                <div className="relative z-30 container mx-auto px-6 text-center space-y-12">
                    <div className="space-y-4 animate-in fade-in duration-1000 slide-in-from-bottom-12">
                        <Text variant="label" className="flex items-center justify-center gap-4 uppercase italic">
                            <span className="w-12 h-[1px] bg-amber-500"></span>
                            Gestiona_Tu_Barbería_En_Piloto_Automático
                            <span className="w-12 h-[1px] bg-amber-500"></span>
                        </Text>
                        <Text variant="hero">
                            FLOW_SYSTEM <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-100 to-white italic">PRECISION.</span>
                        </Text>
                        <p className="text-zinc-400 text-sm md:text-lg font-medium tracking-wide max-w-2xl mx-auto mt-6">
                            Sistema todo-en-uno para gestionar citas, pagos, barberos y clientes sin complicaciones.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-8 animate-in fade-in duration-1000 delay-500 slide-in-from-bottom-6">
                        <BarberButton icon={Calendar} onClick={() => setAuthMode('register')}>INITIATE_SYNC_PROTOCOL</BarberButton>
                        <BarberButton variant="outline" icon={Shield} onClick={() => setAuthMode('login')}>CORE_IDENTITY_AUTH</BarberButton>
                    </div>
                </div>

                {/* Sidebar Sidebar Socials */}
                <div className="absolute bottom-12 left-10 hidden md:flex flex-col gap-8 z-30">
                    <a href="#"><Instagram className="text-zinc-600 hover:text-amber-500 transition-colors" size={20} /></a>
                    <a href="#"><Facebook className="text-zinc-600 hover:text-amber-500 transition-colors" size={20} /></a>
                    <div className="h-24 w-[1px] bg-zinc-800 mx-auto"></div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 right-1/2 translate-x-1/2 flex flex-col items-center gap-4 z-30">
                    <span className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase italic">Deploy_Scroll</span>
                    <div className="w-[2px] h-12 bg-zinc-800 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-amber-500 animate-[bounce_2s_infinite]"></div>
                    </div>
                </div>
            </header>

            <TeamSection />

            <ServiceSection />

            {/* LOCATION SECTION (Industrial Map) */}
            <section id="ubicacion" className="grid lg:grid-cols-2 min-h-[600px] border-b border-zinc-800">
                <div className="bg-amber-500 p-16 md:p-32 flex flex-col justify-center text-black relative group overflow-hidden">
                    {/* Grain texture */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                    <Scissors size={64} className="mb-12 text-black transition-transform group-hover:rotate-45" />
                    <h2 className="text-5xl md:text-8xl font-black uppercase italic leading-[0.85] tracking-tighter mb-10">
                        LOGISTICS <br />BASE_HQ
                    </h2>
                    <div className="space-y-6 font-black text-xl border-l-[6px] border-black pl-8 mb-12">
                        <p className="tracking-tighter">AV. SIEMPRE VIVA 742</p>
                        <p className="tracking-tighter italic opacity-60">NORTH_SECTOR_UNIT</p>
                        <p className="text-xs tracking-[0.3em] font-black mt-10">HOURS: 10:00 - 20:00 [SAT_OPEN]</p>
                    </div>
                    <button
                        onClick={() => window.open('https://maps.google.com', '_blank')}
                        className="bg-black text-white px-10 py-5 font-black uppercase tracking-[0.3em] text-xs hover:bg-white hover:text-black transition-all self-start flex items-center gap-4 group"
                    >
                        <Navigation size={16} className="group-hover:translate-x-1" /> INITIATE_GPS_LINK
                    </button>
                </div>

                <div className="relative bg-zinc-900 group overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=1600"
                        alt="HQ Environment"
                        className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-[0.5] contrast-125"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-700"></div>
                    {/* Target Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-64 border border-amber-500/20 rounded-full flex items-center justify-center animate-[ping_3s_infinite]">
                            <div className="w-32 h-32 border border-amber-500/40 rounded-full flex items-center justify-center">
                                <div className="w-4 h-4 bg-amber-500"></div>
                            </div>
                        </div>
                        <div className="absolute bg-zinc-950/90 backdrop-blur border border-zinc-800 p-6 text-center mt-40">
                            <MapPin className="mx-auto text-amber-500 mb-2" size={24} />
                            <span className="text-[10px] text-white font-black uppercase tracking-[0.4em]">DEPLOYMENT_POINT</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER: TERMINAL STYLE */}
            <footer className="bg-zinc-950 pt-32 pb-16 px-6 relative">
                <div className="max-w-7xl mx-auto border-t border-zinc-900 pt-16">
                    <div className="grid md:grid-cols-4 gap-16 mb-24">
                        <div className="space-y-8">
                            <div className="w-14 h-14 bg-white flex items-center justify-center text-black font-black text-3xl">R</div>
                            <Text variant="body" className="max-w-xs text-xs">
                                Industrial grooming strictly for the high tier. Precision tools. Master artisans. Royal lifestyle.
                            </Text>
                        </div>
                        <div>
                            <Text variant="label">Directory</Text>
                            <div className="flex flex-col gap-4 mt-6">
                                {['HOME', 'SERVICES', 'TEAM', 'BOOKING_INTEL'].map(l => (
                                    <a key={l} href="#" className="text-[10px] font-black text-zinc-600 hover:text-white transition-colors tracking-[0.2em]">{l}</a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Text variant="label">Comm_Links</Text>
                            <div className="flex flex-col gap-4 mt-6">
                                {['INSTAGRAM_FEED', 'WHATSAPP_UNIT', 'TELEGRAM_SECURE'].map(l => (
                                    <a key={l} href="#" className="text-[10px] font-black text-zinc-600 hover:text-white transition-colors tracking-[0.2em]">{l}</a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Text variant="label">Status</Text>
                            <div className="mt-6 flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
                                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Server_Online_v2.0</span>
                            </div>
                            <p className="text-zinc-800 text-[8px] font-black mt-8 uppercase tracking-[0.5em]">System_Up_Time: 99.9%</p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-zinc-900 pt-8 mt-16">
                        <span className="text-[10px] font-black text-zinc-800 tracking-[0.8em]">FLOW_SYSTEM_©2026</span>
                        <div className="flex gap-12 font-black text-[8px] text-zinc-800 tracking-[0.3em]">
                            <a href="#" className="hover:text-white transition-colors">PRIVACY_PROTOCOL</a>
                            <a href="#" className="hover:text-white transition-colors">TERMS_OF_SERVICE</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* WHATSAPP FLOAT: TACTICAL GREEN */}
            <a href="https://wa.me/123" target="_blank" className="fixed bottom-10 right-10 z-[60] group">
                <div className="absolute -top-14 right-0 bg-white text-black text-[8px] font-black uppercase px-4 py-2 opacity-0 group-hover:opacity-100 transition-all border-l-4 border-amber-500 translate-x-4 group-hover:translate-x-0">
                    SECURE_LINE_OPEN
                </div>
                <div className="bg-[#25D366] w-16 h-16 flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.3)] hover:scale-110 active:scale-95 transition-all duration-300 relative">
                    <MessageCircle size={32} className="text-white fill-white" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-bounce"></div>
                </div>
            </a>

            {/* MODAL SYSTEM */}
            {authMode && (
                <AuthModal
                    mode={authMode}
                    onClose={() => setAuthMode(null)}
                    onToggle={() => setAuthMode(m => m === 'login' ? 'register' : 'login')}
                />
            )}

            {/* GLOBAL SCANLINE EFFECT */}
            <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
        </div>
    );
}
