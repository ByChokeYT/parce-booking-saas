import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Lock, Mail, ChevronRight, AlertCircle, X, ArrowRight } from 'lucide-react';
import logo from '../assets/001logo-1.png';

/* =============================================================================
  🔐 ACCESS PORTAL: "PURE LOGIN" (Tactical Edition)
  - Componente exclusivo de Login.
  - Estética táctica FLOW_SYSTEM.
  ============================================================================= 
*/

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
            <div className={`absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform -translate-x-full group-hover:translate-x-0 ${isPrimary ? 'bg-white' : 'bg-amber-500'}`}></div>
            {isPrimary && <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-400"></div>}
            <span className={`relative z-10 flex items-center gap-3 transition-colors duration-500 ${isPrimary ? 'group-hover:text-black' : 'group-hover:text-black'}`}>
                <span>{children}</span>
                {Icon && <Icon size={16} className="transition-all duration-500 group-hover:rotate-45" />}
            </span>
            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 group-hover:left-[100%] transition-all duration-1000"></div>
        </button>
    );
};

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const email = e.target.email.value.toLowerCase();
        const password = e.target.password.value;

        let result;
        if (isLogin) {
            result = await login(email, password);
        } else {
            const fullName = e.target.fullName?.value;
            const phone = e.target.phone?.value;
            const barbershopName = e.target.barbershopName?.value;
            result = await register(email, password, fullName, phone, barbershopName);
        }

        if (!result.success) {
            setError(result.error);
        }
        // Si es exitoso, App.jsx / AuthContext redirigirá automáticamente
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center relative overflow-hidden font-sans selection:bg-amber-500 selection:text-black">

            {/* 1. Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/40 z-10" />
                <div className="absolute inset-0 bg-black/60 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1503951914875-befbb7470d03?auto=format&fit=crop&q=80&w=2000"
                    className="w-full h-full object-cover grayscale contrast-125 scale-105 opacity-40 animate-pulse-slow"
                    alt="Tactical Background"
                />
            </div>

            {/* 2. Tactical Grid Overlay */}
            <div className="absolute inset-0 z-[5] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"></div>

            {/* 3. Main Access Card */}
            <div className="relative z-20 w-full max-w-md p-6">

                {/* Header Branding */}
                <div className="text-center mb-10 space-y-4 animate-slide-up">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-amber-500 blur-3xl opacity-20 animate-pulse"></div>
                            <img src={logo} alt="FLOW_SYSTEM" className="w-24 h-24 object-contain relative z-10 drop-shadow-2xl" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black text-white italic tracking-tighter font-outfit uppercase">FLOW_SYSTEM</h1>
                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em]">Gestiona_Tu_Barbería_En_Piloto_Automático</p>
                    </div>
                </div>

                {/* Login/Register Container */}
                <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group animate-fade-in delay-200">

                    {/* Glow Effects */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-xl font-black text-white uppercase italic tracking-tight font-outfit">
                            {isLogin ? 'AUTH_REQUIRED' : 'NEW_ID_REGISTRY'}
                        </h2>
                        <div className="flex gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse delay-75"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse delay-150"></div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 animate-shake">
                                <AlertCircle size={16} className="text-red-500 shrink-0" />
                                <p className="text-xs font-bold text-red-500 uppercase tracking-wide">{error}</p>
                            </div>
                        )}

                        {!isLogin && (
                            <>
                                <div className="space-y-2 animate-slide-in-from-right">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Business_Name (Barbershop)</label>
                                    <input name="barbershopName" type="text" required placeholder="IMPERIAL CUTS"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-base font-bold tracking-wider focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-700 uppercase" />
                                </div>
                                <div className="space-y-2 animate-slide-in-from-right delay-50">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Operator_Name</label>
                                    <input name="fullName" type="text" required placeholder="JOHN DOE"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-base font-bold tracking-wider focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-700" />
                                </div>
                                <div className="space-y-2 animate-slide-in-from-right delay-75">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Comms_Link (Phone)</label>
                                    <input name="phone" type="tel" required placeholder="+54 9 11..."
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-base font-bold tracking-wider focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-700" />
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Identity_Key (Email)</label>
                            <div className="relative group">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-amber-500 transition-colors" />
                                <input name="email" type="email" required placeholder="USER@FLOW.SYSTEM"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white text-base font-bold tracking-wider focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-700 uppercase" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Security_Token (Password)</label>
                            <div className="relative group">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-amber-500 transition-colors" />
                                <input name="password" type="password" required placeholder="••••••••"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white text-sm font-bold tracking-wider focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-700" />
                            </div>
                        </div>

                        <div className="pt-2">
                            <BarberButton type="submit" variant="primary" fullWidth className="!py-4 text-xs">
                                {loading ? 'PROCESSING...' : (isLogin ? 'INITIATE_SESSION' : 'ESTABLISH_UPLINK')}
                            </BarberButton>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center flex justify-center">
                        <button onClick={() => { setIsLogin(!isLogin); setError(null); }}
                            className="text-[9px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2 group">
                            {isLogin ? 'NO_ACCESS_KEY? [REQUEST_PERMIT]' : 'ALREADY_OPERATIONAL? [LOGIN]'}
                            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Footer Status */}
                <div className="mt-8 text-center space-y-2 opacity-50 animate-fade-in delay-500">
                    <p className="text-[8px] font-black text-zinc-600 tracking-[0.3em] uppercase">SYSTEM_STATUS: OPERATIONAL</p>
                    <p className="text-[8px] font-bold text-zinc-700 tracking-widest">FLOW_SYSTEM_v2.0 • ENCRYPTED</p>
                </div>

            </div>
        </div>
    );
}
