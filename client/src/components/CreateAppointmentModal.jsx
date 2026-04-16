import { useState, useEffect } from 'react';
import { X, Calendar, User, Scissors, Clock, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function CreateAppointmentModal({ isOpen, onClose, onCreated, initialData = null }) {
    const { token } = useAuth();
    const [barbers, setBarbers] = useState([]);
    const [services, setServices] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        client_id: '',
        barber_id: '',
        service_id: '',
        start_time: '',
        notes: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchBarbers();
            fetchServices();
            fetchClients();

            // Pre-llenar si vienen datos (ej. desde el calendario)
            if (initialData) {
                setFormData(prev => ({
                    ...prev,
                    start_time: initialData.start_time ? new Date(initialData.start_time).toISOString().slice(0, 16) : '',
                    barber_id: initialData.barber_id || ''
                }));
            }
        }
    }, [isOpen, initialData]);

    const fetchBarbers = async () => {
        try {
            const res = await fetch('/api/barbers', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await res.json();
            if (data.success) setBarbers(data.data);
        } catch (error) { console.error(error); }
    };

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/services', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await res.json();
            if (data.success) setServices(data.data);
        } catch (error) { console.error(error); }
    };

    const fetchClients = async () => {
        try {
            // Asumimos un endpoint de clientes o lo sacamos del seed
            const res = await fetch('/api/turnos', { headers: { 'Authorization': `Bearer ${token}` } });
            // Esto es un hack para demo, en realidad necesitamos /api/clients
            // Por ahora, usaremos IDs estáticos si falla
        } catch (error) { console.error(error); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/turnos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Turno agendado con éxito');
                onCreated();
                onClose();
            } else {
                toast.error(data.error || 'Error al agendar');
            }
        } catch (error) {
            toast.error('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center md:items-center justify-center p-0 md:p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in overflow-hidden">
            {/* Overlay background for mobile click-to-close */}
            <div className="absolute inset-0 md:hidden" onClick={onClose}></div>

            <div className="bg-zinc-900 border-t md:border border-white/10 w-full max-w-lg rounded-t-[32px] md:rounded-2xl overflow-hidden shadow-2xl relative translate-y-0 animate-slide-up md:animate-zoom-in mt-auto md:mt-0 max-h-[92vh] flex flex-col">
                {/* Drag Handle for Mobile */}
                <div className="md:hidden flex justify-center pt-3 pb-1" onClick={onClose}>
                    <div className="w-12 h-1.5 bg-zinc-800 rounded-full"></div>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div>
                        <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Reservar_Turno</h2>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">New_Appointment_Entry</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X size={20} className="text-zinc-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Cliente (Hardcoded por ahora o selector simple) */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Cliente_ID</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="number"
                                required
                                value={formData.client_id}
                                onChange={e => setFormData({ ...formData, client_id: e.target.value })}
                                placeholder="ID del Cliente (ej: 1)"
                                className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-amber-500/50 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Barbero */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Barbero</label>
                            <select
                                required
                                value={formData.barber_id}
                                onChange={e => setFormData({ ...formData, barber_id: e.target.value })}
                                className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:border-amber-500/50 focus:outline-none transition-colors appearance-none"
                            >
                                <option value="">Seleccionar...</option>
                                {barbers.map(b => (
                                    <option key={b.id} value={b.id}>{b.user.full_name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Servicio */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Servicio</label>
                            <select
                                required
                                value={formData.service_id}
                                onChange={e => setFormData({ ...formData, service_id: e.target.value })}
                                className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:border-amber-500/50 focus:outline-none transition-colors appearance-none"
                            >
                                <option value="">Seleccionar...</option>
                                {services.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} (${s.price})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Fecha y Hora */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Fecha_y_Hora</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="datetime-local"
                                required
                                value={formData.start_time}
                                onChange={e => setFormData({ ...formData, start_time: e.target.value })}
                                className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-amber-500/50 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Notas */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Notas_Adicionales</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 text-zinc-500" size={16} />
                            <textarea
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Detalles del corte, preferencias..."
                                rows={3}
                                className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-amber-500/50 focus:outline-none transition-colors resize-none"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black uppercase italic tracking-tighter py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>Confirmar_Reserva</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
