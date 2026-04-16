import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Plus, ChevronLeft, ChevronRight, Clock, User, Scissors, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import CreateAppointmentModal from '../components/CreateAppointmentModal';
import { useSocket } from '../hooks/useSocket';
import PaymentRecordModal from '../components/PaymentRecordModal';

export default function AgendaPage() {
    const { token } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/turnos?fecha=${selectedDate}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setAppointments(data.data);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            toast.error('Error al cargar la agenda');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [selectedDate]);

    // Escuchar cambios en tiempo real
    useSocket(() => {
        fetchAppointments();
    });

    const openPaymentModal = (appointment) => {
        setSelectedAppointment(appointment);
        setIsPaymentModalOpen(true);
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/turnos/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Cita ${newStatus === 'completed' ? 'completada' : 'cancelada'}`);
                fetchAppointments();
            }
        } catch (error) {
            toast.error('Error al actualizar estado');
        }
    };

    const changeDate = (days) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + days);
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header & Date Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Agenda de Turnos</h2>
                    <p className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase">Secuencia Temporal Operativa</p>
                </div>

                <div className="flex items-center gap-2 bg-zinc-900/50 backdrop-blur-md p-1 rounded-xl border border-white/5 shadow-inner">
                    <button onClick={() => changeDate(-1)} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 active:scale-90 transition-all">
                        <ChevronLeft size={18} />
                    </button>
                    <div className="px-4 py-1 text-center min-w-[140px]">
                        <p className="text-[8px] font-black uppercase text-amber-500 tracking-[0.2em] mb-0.5">Fecha Seleccionada</p>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent text-white font-bold text-xs focus:outline-none uppercase tracking-wider"
                        />
                    </div>
                    <button onClick={() => changeDate(1)} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 active:scale-90 transition-all">
                        <ChevronRight size={18} />
                    </button>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-xl font-black text-xs uppercase italic tracking-tighter transition-all active:scale-[0.98]"
                >
                    <Plus size={16} strokeWidth={3} />
                    Agendar_Cita
                </button>
            </div>

            {/* Appointments List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : appointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/30 border border-dashed border-white/5 rounded-3xl">
                    <Calendar size={48} className="text-zinc-800 mb-4" />
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No_Appointments_Found</p>
                    <p className="text-zinc-600 text-[10px] mt-1">El servidor no detecta señales en esta fecha.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {appointments.map((apt) => (
                        <div key={apt.id} className="group relative bg-gradient-to-br from-zinc-900 via-zinc-900 to-black border border-white/5 rounded-2xl p-4 hover:border-amber-500/30 transition-all shadow-lg">
                            {/* Status Indicator */}
                            <div className={`absolute top-0 left-0 bottom-0 w-1.5 rounded-l-2xl ${apt.status === 'completed' ? 'bg-gradient-to-b from-green-400 to-green-600' :
                                apt.status === 'cancelled' ? 'bg-gradient-to-b from-red-400 to-red-600' : 'bg-gradient-to-b from-amber-400 to-amber-600'
                                }`} />

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Time */}
                                    <div className="flex flex-row md:flex-col items-center justify-center gap-1 min-w-[80px]">
                                        <Clock size={16} className="text-amber-500" />
                                        <span className="text-2xl font-black text-white tracking-tighter">
                                            {new Date(apt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                        </span>
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                            {apt.service.duration_minutes}m
                                        </span>
                                    </div>

                                    {/* Divider */}
                                    <div className="hidden md:block w-px h-12 bg-white/5" />

                                    {/* Info */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-zinc-950 rounded-lg">
                                                <User size={18} className="text-zinc-400" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Cliente</p>
                                                    {apt.client.reputation && (
                                                        <div className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${apt.client.reputation.trust_score >= 80 ? 'bg-green-500/10 text-green-500' :
                                                                apt.client.reputation.trust_score >= 50 ? 'bg-amber-500/10 text-amber-500' :
                                                                    'bg-red-500/10 text-red-500'
                                                            }`}>
                                                            Rep: {apt.client.reputation.trust_score}%
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-white font-bold text-lg uppercase italic tracking-tight">{apt.client.full_name}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4">
                                            <div className="flex items-center gap-2">
                                                <Scissors size={14} className="text-amber-500/50" />
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{apt.service.name} / ${apt.service.price}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-blue-500/50" />
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Barbero: {apt.barber.user.full_name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {apt.status === 'confirmed' && (
                                        <>
                                            <button
                                                onClick={() => openPaymentModal(apt)}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all border border-green-500/20"
                                            >
                                                <CheckCircle size={16} />
                                                Finalizar
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(apt.id, 'cancelled')}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all border border-red-500/20"
                                            >
                                                <XCircle size={16} />
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(apt.id, 'no_show')}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all border border-white/5"
                                            >
                                                <XCircle size={14} className="opacity-50" />
                                                No_Show
                                            </button>
                                        </>
                                    )}
                                    {apt.status !== 'confirmed' && (
                                        <div className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] border ${apt.status === 'completed' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-red-500 border-red-500/20 bg-red-500/5'
                                            }`}>
                                            Status: {apt.status}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Notes if exist */}
                            {apt.notes && (
                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Sitrep_Update:</p>
                                    <p className="text-zinc-400 text-xs italic">{apt.notes}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <CreateAppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreated={fetchAppointments}
                initialDate={new Date(selectedDate)}
            />

            <PaymentRecordModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                appointment={selectedAppointment}
                onPaymentRecorded={fetchAppointments}
            />
        </div>
    );
}
