import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    Home, Calendar, Users, User, LogOut, Scissors, TrendingUp, Megaphone, Menu as MenuIcon, X, Plus, Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../../assets/001logo-1.png';
import toast from 'react-hot-toast';

export default function MainLayout() {
    const { logout, user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const navItems = [
        { to: "/home", icon: Home, label: "Inicio" },
        { to: "/agenda", icon: Calendar, label: "Agenda" },
        { to: "/calendario", icon: Calendar, label: "Calendario" },
        { to: "/clientes", icon: Users, label: "Clientes" },
        { to: "/marketing", icon: Megaphone, label: "Marketing" },
        { to: "/finanzas", icon: TrendingUp, label: "Finanzas" },
        { to: "/perfil", icon: User, label: "Perfil" },
    ];

    return (
        <div className="min-h-screen flex bg-zinc-950 text-white font-sans selection:bg-amber-500 selection:text-black">

            {/* =========================================
          DESKTOP SIDEBAR (Hidden on mobile)
          ========================================= */}
            <aside className="hidden lg:flex flex-col w-72 bg-zinc-900 border-r border-white/5 sticky top-0 h-screen p-6">
                {/* Brand */}
                <div className="flex items-center gap-4 mb-12 px-2">
                    <img src={logo} alt="FLOW Logo" className="w-12 h-12 object-contain" />
                    <div>
                        <h1 className="text-amber-500 font-bold text-lg tracking-wider leading-none font-outfit uppercase">FLOW_SYSTEM</h1>
                        <p className="text-zinc-500 text-[8px] tracking-widest font-medium uppercase mt-1 italic">Gestiona_Tu_Barbería_En_Piloto_Automático</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                                    ? 'bg-amber-500 text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon size={20} className={isActive ? 'stroke-[2.5px]' : 'stroke-2'} />
                                    <span className="tracking-wide text-sm uppercase">{item.label}</span>

                                    {/* Active Indicator Line */}
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-black/20 rounded-r-full opacity-0 group-[.active]:opacity-100"></div>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* SUBSCRIPTION STATUS (TRIAL) */}
                <div className="mb-6 px-2">
                    <div className="bg-gradient-to-br from-zinc-800 to-black border border-amber-500/30 rounded-xl p-4 relative overflow-hidden group">
                        {/* Background Pulse */}
                        <div className="absolute inset-0 bg-amber-500/5 animate-pulse"></div>

                        <div className="flex items-center justify-between mb-2 relative z-10">
                            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">TRIAL_MODE</span>
                            <span className="text-[9px] font-bold text-white bg-amber-500/20 px-2 py-0.5 rounded text-amber-500">v2.0 Beta</span>
                        </div>

                        <div className="space-y-1 relative z-10">
                            <div className="flex justify-between text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                                <span>Tiempo Restante</span>
                                <span className="text-white font-bold">1 DÍA</span>
                            </div>
                            {/* Progress Bar */}
                            <div className="h-1.5 w-full bg-zinc-700 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 w-[90%] shadow-[0_0_10px_rgba(245,158,11,0.8)] animate-pulse"></div>
                            </div>
                            <p className="text-[8px] text-zinc-500 mt-2 italic">Actualiza para acceso total.</p>
                        </div>
                    </div>
                </div>

                {/* User Footer */}
                <div className="mt-auto pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 px-2 mb-6">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
                            <span className="font-bold text-amber-500">{user?.full_name?.charAt(0) || 'U'}</span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{user?.full_name}</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-500/10 py-3 rounded-lg transition-colors text-xs font-bold uppercase tracking-widest"
                    >
                        <LogOut size={14} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* =========================================
          MAIN CONTENT AREA
          ========================================= */}
            <main className="flex-1 flex flex-col min-w-0"> {/* min-w-0 prevents flex overflow */}

                {/* Mobile Header (Hidden on Desktop) */}
                {/* Mobile Header (Global Brand Bar) */}
                <header className="lg:hidden bg-zinc-950/80 backdrop-blur-md border-b border-white/5 p-4 sticky top-0 z-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center p-1 shadow-lg overflow-hidden">
                            <img src={logo} alt="Flow" className="w-full h-full object-cover rounded-full" />
                        </div>
                        <span className="text-xl font-black text-white italic tracking-tighter font-outfit">FLOW</span>
                    </div>

                    <button
                        onClick={() => toast('Sin notificaciones nuevas', { icon: '🔔' })}
                        className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors relative active:scale-95"
                    >
                        <Bell size={20} />
                        <div className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-zinc-950 animate-pulse"></div>
                    </button>
                </header>

                {/* Content Outlet */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-10 pb-24 lg:pb-10">
                    <div className="max-w-6xl mx-auto w-full">
                        <Outlet />
                    </div>
                </div>

                {/* Floating Action Button (FAB) - Mobile Only */}
                <button
                    onClick={() => { navigate('/agenda'); toast('Nuevo Turno', { icon: '✨' }); }}
                    className="lg:hidden fixed bottom-24 right-4 w-14 h-14 bg-amber-500 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center text-black z-40 active:scale-90 transition-transform animate-bounce-slow"
                >
                    <Plus size={32} strokeWidth={3} />
                </button>

                {/* Mobile Bottom Nav (Royal Design) */}
                {/* Mobile Bottom Nav (Royal Design) */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-xl border-t border-white/5 pb-safe z-50">
                    <div className="grid grid-cols-4 h-16 items-center">
                        <MobileNavItem to="/home" icon={Home} label="Inicio" />
                        <MobileNavItem to="/agenda" icon={Calendar} label="Agenda" />
                        <MobileNavItem to="/clientes" icon={Users} label="Clientes" />
                        <MobileNavItem to="/perfil" icon={User} label="Perfil" />
                    </div>
                </nav>
            </main>
        </div>
    );
}

function MobileNavItem({ to, icon: Icon, label }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex flex-col items-center justify-center relative group ${isActive ? 'text-amber-500' : 'text-zinc-600 hover:text-zinc-400'}`
            }
        >
            {({ isActive }) => (
                <>
                    {/* Light Indicator */}
                    <div className={`absolute top-0 w-8 h-1 bg-amber-500 rounded-b-full shadow-[0_0_15px_rgba(245,158,11,0.6)] transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}></div>

                    <div className={`transition-all duration-300 ${isActive ? 'scale-110 -translate-y-1' : ''}`}>
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    {/* 
                    <span className={`text-[9px] font-black uppercase tracking-widest mt-1 ${isActive ? 'opacity-100' : 'opacity-0 hidden'}`}>
                        {label}
                    </span>
                    */}
                </>
            )}
        </NavLink>
    );
}

function MenuLink({ to, icon: Icon, label, onClick }) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-5 rounded-[24px] text-xs font-black uppercase italic tracking-wider transition-all ${isActive ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:bg-white/5'
                }`
            }
        >
            <Icon size={18} />
            {label}
        </NavLink>
    );
}

