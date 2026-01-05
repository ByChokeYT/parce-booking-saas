import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import CreateAppointmentModal from '../components/CreateAppointmentModal';
import toast from 'react-hot-toast';
import { Calendar as CalendarIcon, Filter, Plus } from 'lucide-react';

export default function CalendarioPage() {
    const { token } = useAuth();
    const [events, setEvents] = useState([]);
    const [barbers, setBarbers] = useState([]);
    const [selectedBarber, setSelectedBarber] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const calendarRef = useRef(null);

    // Sync in real-time
    useSocket(() => fetchEvents());

    useEffect(() => {
        fetchBarbers();
        fetchEvents();
    }, [selectedBarber]);

    const fetchBarbers = async () => {
        try {
            const res = await fetch('/api/barbers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setBarbers(data.data);
        } catch (error) {
            console.error('Error fetching barbers:', error);
        }
    };

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/turnos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                const formattedEvents = data.data
                    .filter(apt => selectedBarber === 'all' || apt.barber_id === parseInt(selectedBarber))
                    .map(apt => ({
                        id: apt.id,
                        title: `${apt.client.full_name} (${apt.service.name})`,
                        start: apt.start_time,
                        end: apt.end_time,
                        backgroundColor: getStatusColor(apt.status),
                        borderColor: 'transparent',
                        extendedProps: { ...apt }
                    }));
                setEvents(formattedEvents);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#22c55e'; // green-500
            case 'cancelled': return '#ef4444'; // red-500
            case 'no_show': return '#71717a'; // zinc-500
            default: return '#f59e0b'; // amber-500
        }
    };

    const handleDateSelect = (selectInfo) => {
        setSelectedSlot({
            start: selectInfo.startStr,
            end: selectInfo.endStr
        });
        setIsModalOpen(true);
    };

    const handleEventDrop = async (dropInfo) => {
        const { event } = dropInfo;
        try {
            const res = await fetch(`/api/turnos/${event.id}/reschedule`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    start_time: event.startStr,
                    end_time: event.endStr
                })
            });
            if (res.ok) {
                toast.success('Turno reprogramado');
            } else {
                dropInfo.revert();
                toast.error('Error al reprogramar');
            }
        } catch (error) {
            dropInfo.revert();
            toast.error('Error de conexión');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header / Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
                        <CalendarIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Calendario_Táctico</h2>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Gestión Visual de Horarios</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-white/5">
                        <Filter size={14} className="ml-2 text-zinc-500" />
                        <select
                            value={selectedBarber}
                            onChange={(e) => setSelectedBarber(e.target.value)}
                            className="bg-transparent text-xs font-bold uppercase tracking-wider text-zinc-300 outline-none pr-4 py-2 cursor-pointer"
                        >
                            <option value="all">Todos los Barberos</option>
                            {barbers.map(b => (
                                <option key={b.id} value={b.id}>{b.user.full_name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={() => { setSelectedSlot(null); setIsModalOpen(true); }}
                        className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-2xl font-black text-xs uppercase italic tracking-tighter transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                    >
                        <Plus size={16} strokeWidth={3} /> Nuevo_Turno
                    </button>
                </div>
            </div>

            {/* Calendar Container */}
            <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5 calendar-container overflow-hidden">
                <style>{`
                    .fc { --fc-border-color: rgba(255,255,255,0.05); --fc-button-bg-color: #18181b; --fc-button-border-color: rgba(255,255,255,0.1); --fc-button-hover-bg-color: #27272a; --fc-button-active-bg-color: #f59e0b; --fc-button-active-text-color: #000; }
                    .fc-col-header-cell { padding: 12px 0 !important; background: rgba(0,0,0,0.2); }
                    .fc-col-header-cell-cushion { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 900; color: #71717a; }
                    .fc-timegrid-slot { height: 3em !important; border-bottom: 1px solid rgba(255,255,255,0.02) !important; }
                    .fc-timegrid-slot-label-cushion { font-size: 10px; font-weight: bold; color: #52525b; }
                    .fc-event { border-radius: 8px !important; padding: 4px 8px !important; font-size: 10px !important; font-weight: 900 !important; text-transform: uppercase !important; cursor: pointer !important; box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important; }
                `}</style>
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridDay"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    locales={[esLocale]}
                    locale="es"
                    events={events}
                    selectable={true}
                    editable={true}
                    nowIndicator={true}
                    expandRows={true}
                    allDaySlot={false}
                    slotMinTime="08:00:00"
                    slotMaxTime="21:00:00"
                    select={handleDateSelect}
                    eventDrop={handleEventDrop}
                    eventClick={(info) => {
                        // Podríamos abrir detalle aquí
                        toast(`Turno de ${info.event.title}`, { icon: '💈' });
                    }}
                    height="auto"
                />
            </div>

            <CreateAppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => { setIsModalOpen(false); fetchEvents(); }}
                initialData={selectedSlot ? { start_time: selectedSlot.start } : null}
            />
        </div>
    );
}
