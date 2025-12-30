import { Outlet, NavLink } from 'react-router-dom';
import { Home, Calendar, Users, User } from 'lucide-react';

export default function MobileLayout() {
    return (
        <div className="h-screen flex flex-col bg-zinc-950 text-white">
            {/* Header */}
            <header className="bg-zinc-900/80 backdrop-blur-md border-b border-white/5 p-4 sticky top-0 z-10 flex items-center justify-between">
                <div>
                    <h1 className="text-amber-500 font-bold text-lg tracking-wider">ROYAL BARBER</h1>
                    <p className="text-zinc-500 text-[10px] tracking-[0.2em] font-medium">TACTICAL SYSTEM</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse"></div>
            </header>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
                <div className="p-4">
                    <Outlet />
                </div>
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-lg border-t border-white/5 pb-safe pt-2">
                <div className="grid grid-cols-4 h-16">
                    <NavLink
                        to="/home"
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center transition-all duration-300 ${isActive ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-300'}`
                        }
                    >
                        <Home size={22} strokeWidth={2} />
                        <span className="text-[10px] mt-1 font-medium tracking-wide">Inicio</span>
                    </NavLink>

                    <NavLink
                        to="/agenda"
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center transition-all duration-300 ${isActive ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-300'}`
                        }
                    >
                        <Calendar size={22} strokeWidth={2} />
                        <span className="text-[10px] mt-1 font-medium tracking-wide">Agenda</span>
                    </NavLink>

                    <NavLink
                        to="/clientes"
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center transition-all duration-300 ${isActive ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-300'}`
                        }
                    >
                        <Users size={22} strokeWidth={2} />
                        <span className="text-[10px] mt-1 font-medium tracking-wide">Clientes</span>
                    </NavLink>

                    <NavLink
                        to="/perfil"
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center transition-all duration-300 ${isActive ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-300'}`
                        }
                    >
                        <User size={22} strokeWidth={2} />
                        <span className="text-[10px] mt-1 font-medium tracking-wide">Perfil</span>
                    </NavLink>
                </div>
            </nav>
        </div>
    );
}
