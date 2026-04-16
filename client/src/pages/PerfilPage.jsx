import { useState, useEffect } from 'react';
import { User, Store, CreditCard, Save, LogOut, Camera, Landmark, Smartphone, QrCode } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function PerfilPage() {
    const { user, logout, token } = useAuth();
    const [activeTab, setActiveTab] = useState('perfil');
    const [loading, setLoading] = useState(false);

    // States for forms
    const [userData, setUserData] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });

    const [barbershopData, setBarbershopData] = useState({
        name: '',
        address: '',
        phone: '',
        logo_url: '',
        currency: 'ARS'
    });

    const [paymentMethods, setPaymentMethods] = useState([]);
    const [newMethod, setNewMethod] = useState({
        display_name: '',
        method_type: 'transfer',
        account_info: '',
        qr_code_url: ''
    });

    useEffect(() => {
        fetchBarbershop();
        fetchPaymentMethods();
    }, []);

    const fetchBarbershop = async () => {
        try {
            const res = await fetch(`/api/config/barbershop/${user.barbershop_id || 1}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setBarbershopData(data.data);
        } catch (error) {
            console.error('Error fetching barbershop:', error);
        }
    };

    const fetchPaymentMethods = async () => {
        try {
            const res = await fetch('/api/config/payment-methods', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setPaymentMethods(data.data);
        } catch (error) {
            console.error('Error fetching payment methods:', error);
        }
    };

    const handleUpdateBarbershop = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/config/barbershop/${user.barbershop_id || 1}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(barbershopData)
            });
            if (res.ok) toast.success('Negocio actualizado correctamente');
        } catch (error) {
            toast.error('Error al actualizar negocio');
        } finally {
            setLoading(false);
        }
    };

    const handleAddPaymentMethod = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/config/payment-methods', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newMethod)
            });
            if (res.ok) {
                toast.success('Método de pago añadido');
                fetchPaymentMethods();
                setNewMethod({ display_name: '', method_type: 'transfer', account_info: '', qr_code_url: '' });
            }
        } catch (error) {
            toast.error('Error al añadir método de pago');
        }
    };

    const tabs = [
        { id: 'perfil', label: 'Mi Perfil', icon: User },
        { id: 'negocio', label: 'Barbería', icon: Store, hidden: user?.role !== 'owner' && user?.role !== 'admin' },
        { id: 'pagos', label: 'Pagos/Cobros', icon: CreditCard },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Header Perfil */}
            <div className="flex flex-col md:flex-row items-center gap-6 bg-zinc-900/50 p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                <div className="relative group">
                    <div className="w-24 h-24 bg-zinc-800 rounded-2xl flex items-center justify-center border-2 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                        <span className="text-4xl font-black text-amber-500 tracking-tighter">{user?.full_name?.charAt(0)}</span>
                    </div>
                </div>
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{user?.full_name}</h2>
                    <p className="text-amber-500 text-xs font-black uppercase tracking-[0.3em]">{user?.role} @ {barbershopData.name || 'Cargando...'}</p>
                </div>
                <button onClick={logout} className="md:ml-auto flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase italic tracking-tighter transition-all shadow-lg active:scale-95">
                    <LogOut size={16} /> Salir
                </button>
            </div>

            {/* Navegación por Tabs */}
            <div className="flex gap-2 p-1 bg-zinc-900/80 rounded-2xl border border-white/5">
                {tabs.filter(t => !t.hidden).map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-amber-500 text-black' : 'text-zinc-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={14} strokeWidth={3} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Contenido de Tabs */}
            <div className="bg-zinc-900/30 rounded-3xl border border-white/5 overflow-hidden">

                {/* TAB: PERFIL */}
                {activeTab === 'perfil' && (
                    <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nombre_Completo</label>
                                <input
                                    type="text" value={userData.full_name} disabled
                                    className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl p-4 text-zinc-400 font-bold outline-none cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Email_Contacto</label>
                                <input
                                    type="email" value={userData.email} disabled
                                    className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl p-4 text-zinc-400 font-bold outline-none cursor-not-allowed"
                                />
                            </div>
                        </div>
                        <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-start gap-4">
                            <Smartphone className="text-amber-500 mt-1" size={20} />
                            <div>
                                <p className="text-amber-500 text-xs font-black uppercase tracking-wider">Modo Lectura</p>
                                <p className="text-zinc-500 text-[10px]">Para cambiar tus datos personales básicos, contacta con soporte técnico de FLOW.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: NEGOCIO */}
                {activeTab === 'negocio' && (
                    <form onSubmit={handleUpdateBarbershop} className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nombre_del_Local</label>
                                <input
                                    type="text" value={barbershopData.name} onChange={e => setBarbershopData({ ...barbershopData, name: e.target.value })}
                                    className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-amber-500/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Dirección_Física</label>
                                <input
                                    type="text" value={barbershopData.address} onChange={e => setBarbershopData({ ...barbershopData, address: e.target.value })}
                                    className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-amber-500/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Teléfono_Negocio</label>
                                <input
                                    type="text" value={barbershopData.phone} onChange={e => setBarbershopData({ ...barbershopData, phone: e.target.value })}
                                    className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-amber-500/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Moneda ($)</label>
                                <select
                                    value={barbershopData.currency} onChange={e => setBarbershopData({ ...barbershopData, currency: e.target.value })}
                                    className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-amber-500/50"
                                >
                                    <option value="ARS">Peso Argentino (ARS)</option>
                                    <option value="USD">Dólar (USD)</option>
                                    <option value="EUR">Euro (EUR)</option>
                                    <option value="MXN">Peso Mexicano (MXN)</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full py-4 bg-white hover:bg-amber-500 text-black rounded-2xl font-black text-xs uppercase italic tracking-tighter transition-all flex items-center justify-center gap-2">
                            <Save size={18} /> {loading ? 'Actualizando...' : 'Guardar_Configuración'}
                        </button>
                    </form>
                )}

                {/* TAB: PAGOS */}
                {activeTab === 'pagos' && (
                    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
                        {/* Listado de Métodos Existentes */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 ml-1">Métodos_de_Cobro_Activos</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {paymentMethods.map((m, idx) => (
                                    <div key={idx} className="p-4 bg-zinc-950/50 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-amber-500/20 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-zinc-900 rounded-xl text-amber-500 group-hover:scale-110 transition-transform">
                                                {m.method_type === 'transfer' ? <Landmark size={20} /> : <Smartphone size={20} />}
                                            </div>
                                            <div>
                                                <p className="text-white text-xs font-black uppercase tracking-wider">{m.display_name}</p>
                                                <p className="text-zinc-600 text-[10px] truncate max-w-[150px]">{m.account_info}</p>
                                            </div>
                                        </div>
                                        <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.3)]"></div>
                                    </div>
                                ))}
                                {paymentMethods.length === 0 && (
                                    <div className="md:col-span-2 py-10 text-center text-zinc-600 text-xs italic bg-zinc-950/20 rounded-2xl border border-dashed border-white/5">
                                        No se han configurado métodos de cobro electrónicos aun.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Formulario Añadir Nuevo */}
                        <form onSubmit={handleAddPaymentMethod} className="pt-8 border-t border-white/5 space-y-6">
                            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 ml-1">Nuevo_Canal_de_Pago</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Etiqueta (Ej: Alias Mercado Pago)</label>
                                    <input
                                        type="text" required placeholder="Escribe un nombre..."
                                        value={newMethod.display_name} onChange={e => setNewMethod({ ...newMethod, display_name: e.target.value })}
                                        className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-amber-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Tipo de Cuenta</label>
                                    <select
                                        value={newMethod.method_type} onChange={e => setNewMethod({ ...newMethod, method_type: e.target.value })}
                                        className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-amber-500/50"
                                    >
                                        <option value="transfer">Transferencia Bancaria (CBU/Alias)</option>
                                        <option value="qr">Billetera Digital / QR</option>
                                        <option value="card">Terminal de Tarjeta</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Información de la Cuenta / CBU / Alias</label>
                                    <textarea
                                        required placeholder="Pega aquí los datos para que el cliente los vea..."
                                        value={newMethod.account_info} onChange={e => setNewMethod({ ...newMethod, account_info: e.target.value })}
                                        className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-amber-500/50 h-24 resize-none"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4 bg-zinc-100 hover:bg-white text-black rounded-2xl font-black text-xs uppercase italic tracking-tighter transition-all flex items-center justify-center gap-2">
                                <CreditCard size={18} /> Registrar_Nuevo_Canal
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
