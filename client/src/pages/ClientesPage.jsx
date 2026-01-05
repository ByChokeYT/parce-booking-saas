import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Mail, Search, Plus, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ClientesPage() {
    const { token } = useAuth();
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newClient, setNewClient] = useState({ full_name: '', phone: '', email: '', notes: '', birthday: '' });

    const fetchClients = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/clients?search=${search}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setClients(data.data);
            }
        } catch (error) {
            toast.error('Error al cargar clientes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchClients();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const handleAddClient = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newClient)
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Cliente registrado');
                setIsAdding(false);
                setNewClient({ full_name: '', phone: '', email: '', notes: '' });
                fetchClients();
            } else {
                toast.error(data.error || 'Error al registrar');
            }
        } catch (error) {
            toast.error('Error de conexión');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Client_Database</h2>
                    <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase">Target_Registry_Monitor</p>
                </div>

                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 rounded-xl font-black text-xs uppercase italic tracking-tighter transition-all active:scale-[0.98] border border-white/5"
                >
                    <UserPlus size={16} strokeWidth={3} />
                    {isAdding ? 'Cancelar_Registro' : 'Nuevo_Cliente'}
                </button>
            </div>

            {/* Formulario Nuevo Cliente */}
            {isAdding && (
                <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-6 animate-slide-up">
                    <form onSubmit={handleAddClient} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Nombre_Completo</label>
                            <input
                                required
                                value={newClient.full_name}
                                onChange={e => setNewClient({ ...newClient, full_name: e.target.value })}
                                className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:border-amber-500/50 focus:outline-none"
                                placeholder="Ej: Juan Pérez"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Teléfono</label>
                            <input
                                required
                                value={newClient.phone}
                                onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
                                className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:border-amber-500/50 focus:outline-none"
                                placeholder="Ej: 1122334455"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Fecha de Cumpleaños</label>
                            <input
                                type="date"
                                value={newClient.birthday}
                                onChange={e => setNewClient({ ...newClient, birthday: e.target.value })}
                                className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:border-amber-500/50 focus:outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black uppercase italic py-3 rounded-xl transition-colors">
                                Registrar_Cliente_Sequence
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Filtrar por nombre o teléfono..."
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:border-amber-500/30 focus:outline-none transition-all"
                />
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clients.map(client => (
                        <div key={client.id} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5 hover:bg-zinc-900 transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-amber-500 font-black text-xl border border-white/5 group-hover:border-amber-500/50 transition-colors">
                                    {client.full_name.charAt(0)}
                                </div>
                                <div className="text-right flex gap-3">
                                    <div>
                                        <p className="text-[8px] font-black uppercase text-zinc-600 tracking-widest">Puntos</p>
                                        <p className="text-amber-500 font-black text-sm">{client.loyalty?.points || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black uppercase text-zinc-600 tracking-widest">Visitas</p>
                                        <p className="text-white font-black text-sm">{client._count.appointments}</p>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-white font-black uppercase italic tracking-tighter text-lg leading-tight mb-4">{client.full_name}</h3>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-zinc-500 group-hover:text-zinc-300 transition-colors">
                                    <Phone size={14} />
                                    <span className="text-xs font-bold">{client.phone}</span>
                                </div>
                                {client.email && (
                                    <div className="flex items-center gap-2 text-zinc-500 group-hover:text-zinc-300 transition-colors">
                                        <Mail size={14} />
                                        <span className="text-xs font-bold">{client.email}</span>
                                    </div>
                                )}
                            </div>

                            <button className="w-full mt-6 py-2 bg-zinc-950 border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-amber-500 hover:border-amber-500/30 transition-all">
                                Ver_Historial_Cmd
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
