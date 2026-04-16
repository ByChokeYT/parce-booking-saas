import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Plus, UserPlus, LogOut, Sparkles, Scissors, Users, TrendingUp, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSocket } from '../hooks/useSocket';

export default function HomePage() {
    const { token, logout, user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        todayCount: 0,
        upcomingCount: 0,
        nextAppointments: []
    });
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            // Fetch Today's Stats
            const todayRes = await fetch('/api/turnos/today', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const todayData = await todayRes.json();

            // Fetch Upcoming Stats
            const upcomingRes = await fetch('/api/turnos/upcoming', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const upcomingData = await upcomingRes.json();

            if (todayData.success && upcomingData.success) {
                setStats({
                    todayCount: todayData.todayCount,
                    upcomingCount: upcomingData.upcomingCount,
                    nextAppointments: todayData.upcoming || []
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [token]);

    // Escuchar cambios en tiempo real
    useSocket((type, data) => {
        fetchDashboardData();
        if (type === 'created') {
            toast.success('Nueva reserva detectada');
        }
    });

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse p-4">
                <div className="flex justify-between items-center mb-8">
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-zinc-800 rounded"></div>
                        <div className="h-8 w-48 bg-zinc-800 rounded"></div>
                    </div>
                    <div className="w-12 h-12 bg-zinc-800 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 bg-zinc-800 rounded-[28px]"></div>
                    <div className="h-32 bg-zinc-800 rounded-[28px]"></div>
                </div>
                <div className="h-48 bg-zinc-800 rounded-[32px]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in pb-24">

            {/* 1. HEADER MOBILE-FIRST */}
            <div className="flex justify-between items-start pt-2 mb-4">
                <div className="flex flex-col">
                    <h1 className="text-xl font-black text-white uppercase italic tracking-tighter font-outfit leading-none">
                        HOLA, {user?.full_name?.split(' ')[0] || 'OPERADOR'}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                            {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' }).replace('.', '')}
                        </p>
                        <div className="w-0.5 h-0.5 rounded-full bg-zinc-600"></div>
                        <div className="flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">ABIERTO</span>
                        </div>
                    </div>
                </div>

                {/* Profile Quick Access */}
                <button
                    onClick={() => navigate('/perfil')}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-amber-500 shadow-lg active:scale-95 transition-transform"
                >
                    <Users size={20} strokeWidth={2.5} />
                </button>
            </div>

            {/* 2. METRICS ROW (PREMIUM REMASTER) */}
            <div className="grid grid-cols-2 gap-3">
                {/* Turnos Hoy - Detail View */}
                <div className="bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 border border-white/10 p-4 rounded-[28px] relative overflow-hidden group shadow-xl">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Calendar size={40} />
                    </div>

                    <div className="flex flex-col h-full justify-between relative z-10">
                        <div>
                            <div className="flex items-center gap-1.5 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Daily_Ops</p>
                            </div>
                            <span className="text-5xl font-black text-white font-outfit tracking-tighter drop-shadow-lg">{stats.todayCount}</span>
                        </div>

                        <div className="space-y-2 mt-2">
                            {/* Mini Progress */}
                            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full w-[65%] shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                            </div>
                            <div className="flex justify-between text-[8px] font-bold uppercase tracking-wider text-zinc-500">
                                <span>Completed: 65%</span>
                                <span className="text-white">Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ingresos - Detail View */}
                <div className="bg-gradient-to-br from-emerald-900/40 via-zinc-900 to-black border border-emerald-500/20 p-4 rounded-[28px] relative overflow-hidden group shadow-xl">
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>

                    <div className="flex flex-col h-full justify-between relative z-10">
                        <div>
                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">Gross_Revenue</p>
                            <span className="text-3xl font-black text-white font-outfit tracking-tighter leading-none">$45,200</span>
                            <p className="text-[9px] text-zinc-500 font-bold tracking-widest uppercase mt-0.5">Ticket Prom: $8.5k</p>
                        </div>

                        <div className="mt-3">
                            <div className="flex items-end gap-1 mb-1 h-8">
                                <div className="w-1/5 bg-emerald-500/20 h-[40%] rounded-t-sm"></div>
                                <div className="w-1/5 bg-emerald-500/40 h-[60%] rounded-t-sm"></div>
                                <div className="w-1/5 bg-emerald-500/30 h-[30%] rounded-t-sm"></div>
                                <div className="w-1/5 bg-emerald-500/60 h-[80%] rounded-t-sm"></div>
                                <div className="w-1/5 bg-emerald-500 h-[100%] rounded-t-sm shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
                            </div>
                            <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest flex items-center gap-1">
                                <TrendingUp size={10} /> +15.2% Growth
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. HERO CARD: NEXT APPOINTMENT */}
            {stats.nextAppointments.length > 0 ? (
                <div className="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-[32px] p-6 text-black relative overflow-hidden shadow-2xl border border-white/20">
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                        <Scissors size={80} strokeWidth={1} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-black/10 px-2 py-1 rounded-lg">PRÓXIMO EN 20 MIN</span>
                        </div>

                        <div>
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none mb-1">{stats.nextAppointments[0].user.full_name}</h2>
                            <p className="text-black/70 font-bold text-xs uppercase tracking-wider">{stats.nextAppointments[0].service.name}</p>
                        </div>

                        <div className="mt-8 flex items-end justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center text-[10px] font-bold">
                                    {stats.nextAppointments[0].barber?.name?.charAt(0) || 'N'}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{stats.nextAppointments[0].barber?.name || 'Nico'}</span>
                            </div>
                            <span className="text-4xl font-black tracking-tighter font-outfit opacity-100">
                                {new Date(stats.nextAppointments[0].start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                // Empty State Placehoder matching style
                <div className="bg-zinc-900/30 border border-white/5 border-dashed rounded-[32px] p-8 flex flex-col items-center justify-center text-center opacity-50 min-h-[160px]">
                    <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Sin próximos turnos</p>
                </div>
            )}

            {/* 4. QUICK ACTIONS (REFINED 2x2 GRID) */}
            <div className="grid grid-cols-2 gap-3 py-2">
                <QuickActionButton icon={Plus} label="Turno" color="amber" onClick={() => navigate('/agenda')} />
                <QuickActionButton icon={UserPlus} label="Cliente" color="blue" onClick={() => navigate('/clientes')} />
                <QuickActionButton icon={TrendingUp} label="Caja" color="emerald" onClick={() => navigate('/finanzas')} />
                <QuickActionButton icon={Bell} label="Aviso" color="purple" onClick={() => toast('Módulo de avisos próximamente')} />
            </div>

            {/* 4. AGENDA LIST */}
            <div>
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">AGENDA TARDE</h3>
                    <button onClick={() => navigate('/agenda')} className="text-[10px] font-bold text-amber-500 hover:text-white uppercase tracking-widest transition-colors">
                        Ver Todo
                    </button>
                </div>

                <div className="space-y-3">
                    {/* Mock Data Loop (using existing stats if available, else static for demo) */}
                    {(stats.nextAppointments.length > 0 ? stats.nextAppointments.slice(1) : [1, 2, 3]).map((item, i) => {
                        const apt = typeof item === 'object' ? item : {
                            id: i,
                            start_time: new Date().setHours(15 + i, i * 45),
                            user: { full_name: ['Carlos M.', 'Luis R.', 'Mario G.'][i] },
                            service: { name: ['Fade', 'Barba', 'Completo'][i] },
                            status: ['PENDIENTE', 'PENDIENTE', 'CANCELADO'][i],
                            barber: { name: 'Nico' }
                        };

                        return (
                            <div key={apt.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                <span className="font-black text-sm text-zinc-500 w-12 pt-1 self-start">
                                    {new Date(apt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>

                                <div className="flex-1 px-4">
                                    <h4 className="text-base font-bold text-white leading-tight">{apt.user.full_name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[9px] font-black uppercase tracking-wider ${apt.status === 'CANCELADO' ? 'text-red-500' : 'text-amber-500'}`}>
                                            {apt.status || 'PENDIENTE'}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-zinc-400 mt-0.5">{apt.service.name}</p>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">• {apt.barber?.name || 'Nico'}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function QuickActionButton({ icon: Icon, label, onClick, color }) {
    const colorStyles = {
        amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    };

    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border ${colorStyles[color]} active:scale-90 transition-all shadow-lg`}
        >
            <div className="p-2 rounded-xl bg-white/5 mb-1">
                <Icon size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
        </button>
    );
}
