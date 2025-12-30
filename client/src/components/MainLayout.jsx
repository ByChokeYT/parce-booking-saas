import { Outlet, NavLink } from 'react-router-dom';
import { Home, Calendar, Users, User, LogOut, Scissors } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {
    const { logout, user } = useAuth();

    const navItems = [
        { to: "/home", icon: Home, label: "Inicio" },
        { to: "/agenda", icon: Calendar, label: "Agenda" },
        { to: "/clientes", icon: Users, label: "Clientes" },
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
                    <div className="w-10 h-10 bg-amber-500 flex items-center justify-center text-black font-black text-xl rounded-sm">R</div>
                    <div>
                        <h1 className="text-amber-500 font-bold text-lg tracking-wider leading-none">ROYAL</h1>
                        <p className="text-zinc-500 text-[10px] tracking-[0.3em] font-medium uppercase">System_v2.0</p>
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
                <header className="lg:hidden bg-zinc-900/80 backdrop-blur-md border-b border-white/5 p-4 sticky top-0 z-20 flex items-center justify-between">
                    <div>
                        <h1 className="text-amber-500 font-bold text-lg tracking-wider">ROYAL BARBER</h1>
                        <p className="text-zinc-500 text-[10px] tracking-[0.2em] font-medium">TACTICAL SYSTEM</p>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse"></div>
                </header>

                {/* Content Outlet */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-10 pb-24 lg:pb-10">
                    <div className="max-w-6xl mx-auto w-full">
                        <Outlet />
                    </div>
                </div>

                {/* Mobile Bottom Nav (Hidden on Desktop) */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-lg border-t border-white/5 pb-safe pt-2 z-20">
                    <div className="grid grid-cols-4 h-16">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex flex-col items-center justify-center transition-all duration-300 ${isActive ? 'text-amber-500' : 'text-zinc-600 hover:text-zinc-400'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? '-translate-y-1 transition-transform' : ''} />
                                        <span className="text-[9px] mt-1 font-black tracking-widest uppercase">{item.label}</span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </nav>
            </main>
        </div>
    );
}
