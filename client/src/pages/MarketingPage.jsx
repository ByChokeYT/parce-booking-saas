import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { Megaphone, Gift, MessageSquare, Users, Sparkles, Send, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MarketingPage() {
    const { token } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useSocket((payload) => {
        if (payload?.type === 'marketing-sent') {
            fetchStats();
            toast(`Auto-Marketing: Mensaje enviado a ${payload.client}`, { icon: '📨' });
        }
    });

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/marketing/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching marketing stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRedeem = async (clientId) => {
        if (!confirm('¿Seguro que deseas canjear 100 puntos por un premio?')) return;
        try {
            const res = await fetch('/api/marketing/redeem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ client_id: clientId })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Puntos canjeados con éxito');
                fetchStats();
            } else {
                toast.error(data.error || 'Error al canjear');
            }
        } catch (error) {
            toast.error('Error de conexión');
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) return <div className="p-10 text-center text-zinc-500 font-black animate-pulse uppercase tracking-widest">Iniciando_Motores_Marketing...</div>;

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header Hero */}
            <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Megaphone size={120} className="-rotate-12" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="text-amber-500" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/80 italic">Flow_Growth_Engine</span>
                    </div>
                    <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">Marketing_&_Loyalty</h2>
                    <p className="text-zinc-500 text-sm max-w-xl font-medium">Automatiza la retención de tus clientes. Flow se encarga de saludar por cumpleaños y reactivar clientes inactivos automáticamente.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Ranking de Fidelidad */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
                            <Gift size={20} />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Top_Fidelidad</h3>
                    </div>

                    <div className="space-y-3">
                        {stats?.topLoyalty.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-zinc-950 border border-white/5 rounded-2xl group hover:border-amber-500/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 font-black text-xs group-hover:text-amber-500">
                                        #{idx + 1}
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm uppercase italic tracking-tight">{item.client.full_name}</p>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{item.client.phone}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-amber-500 font-black text-lg leading-none">{item.points}</p>
                                    <p className="text-[8px] text-zinc-600 font-black uppercase tracking-tighter">FLOW_POINTS</p>
                                    {item.points >= 100 && (
                                        <button
                                            onClick={() => handleRedeem(item.client_id)}
                                            className="mt-2 text-[8px] bg-amber-500 text-black px-2 py-1 rounded font-black hover:bg-white transition-colors uppercase italic"
                                        >
                                            Canjear_Premio
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Log de Acciones */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
                            <Bell size={20} />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Registro_Automático</h3>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {stats?.recentActions.map((action, idx) => (
                            <div key={idx} className="relative pl-6 border-l border-zinc-800 pb-4">
                                <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                                <div className="bg-zinc-950/50 p-4 rounded-2xl border border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${action.action_type === 'birthday_wish' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                                            }`}>
                                            {action.action_type === 'birthday_wish' ? 'Cumpleaños' : 'Reactivación'}
                                        </span>
                                        <span className="text-[9px] text-zinc-600 font-bold">
                                            {new Date(action.sent_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-white text-xs font-bold italic mb-1 uppercase tracking-tight">{action.client.full_name}</p>
                                    <p className="text-zinc-500 text-[10px] leading-relaxed mb-3">{action.content}</p>
                                    <div className="flex items-center gap-1.5 text-green-500 text-[8px] font-black uppercase tracking-widest">
                                        <MessageSquare size={10} /> Canal: WhatsApp_Simulado
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Manual Campaign (Fase 10.5) */}
            <div className="bg-amber-500 p-8 rounded-3xl group cursor-pointer hover:bg-amber-400 transition-all active:scale-[0.99]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex gap-6 items-center">
                        <div className="w-16 h-16 bg-black flex items-center justify-center text-amber-500 rounded-2xl shadow-xl group-hover:rotate-12 transition-transform">
                            <Send size={32} />
                        </div>
                        <div>
                            <h3 className="text-black font-black text-2xl uppercase italic tracking-tighter leading-none mb-1">Lanzar_Campaña_Express</h3>
                            <p className="text-black/60 text-xs font-bold uppercase tracking-widest">Enviar recordatorio manual a todos los clientes inactivos</p>
                        </div>
                    </div>
                    <button className="bg-black text-white px-10 py-5 font-black uppercase italic tracking-tighter text-xs rounded-xl shadow-2xl transition-all hover:translate-x-2">INICIAR_SEQUENCE</button>
                </div>
            </div>
        </div>
    );
}
