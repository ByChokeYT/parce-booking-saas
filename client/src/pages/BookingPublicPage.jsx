import { useState, useEffect } from 'react';
import { Scissors, Clock, User, Calendar, CheckCircle2, MapPin, Phone, Instagram, ChevronRight, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BookingPublicPage() {
    const [step, setStep] = useState(1);
    const [services, setServices] = useState([]);
    const [barbers, setBarbers] = useState([]);
    const [barbershop, setBarbershop] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [selectedService, setSelectedService] = useState(null);
    const [selectedBarber, setSelectedBarber] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [resServices, resBarbers, resConfig] = await Promise.all([
                fetch('/api/services'),
                fetch('/api/barbers'),
                fetch('/api/config/barbershop/1') // Mostramos la barbería principal
            ]);

            const [dataServices, dataBarbers, dataConfig] = await Promise.all([
                resServices.json(),
                resBarbers.json(),
                resConfig.json()
            ]);

            if (dataServices.success) setServices(dataServices.data);
            if (dataBarbers.success) setBarbers(dataBarbers.data);
            if (dataConfig.success) setBarbershop(dataConfig.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Error al conectar con la barbería');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmBooking = async () => {
        if (!clientName || !clientPhone) return toast.error('Ingresa tu nombre y teléfono');

        setLoading(true);
        try {
            // Lógica de reserva sin login (Se crea cliente temporal o se busca por teléfono)
            // Para la demo, usamos el endpoint de citas convencional si estuviera abierto, 
            // pero aquí simulamos la creación.
            const res = await fetch('/api/appointments/public', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: selectedService.id,
                    barber_id: selectedBarber.id,
                    start_time: `${selectedDate}T${selectedTime}:00Z`,
                    client_name: clientName,
                    client_phone: clientPhone
                })
            });
            const data = await res.json();
            if (data.success) {
                setStep(5); // Éxito
            } else {
                toast.error(data.error || 'No se pudo agendar');
            }
        } catch (error) {
            toast.error('Error en el servidor');
        } finally {
            setLoading(false);
        }
    };

    if (loading && step === 1) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-amber-500 selection:text-black">

            {/* Header Hero */}
            <header className="relative h-[40vh] flex items-end p-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-40 hover:scale-105 transition-transform duration-1000" />

                <div className="relative z-20 space-y-2 animate-fade-in">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/80 italic font-outfit">Gestiona_Tu_Barbería_En_Piloto_Automático</span>
                    </div>
                    <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none drop-shadow-2xl font-outfit">FLOW_SYSTEM</h1>
                    <div className="flex items-center gap-4 text-zinc-400 text-xs font-medium">
                        <span className="flex items-center gap-1"><MapPin size={12} className="text-amber-500" /> {barbershop?.address || 'Buenos Aires, ARG'}</span>
                    </div>
                </div>
            </header>

            {/* Stepper Content */}
            <main className="max-w-xl mx-auto p-6 pb-32">

                {/* STEP 1: Seleccionar Servicio */}
                {step === 1 && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black uppercase italic tracking-tight font-outfit">Elige_tu_Servicio</h2>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">STEP_01</span>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {services.map(service => (
                                <button
                                    key={service.id}
                                    onClick={() => { setSelectedService(service); setStep(2); }}
                                    className="group text-left p-5 bg-zinc-900/50 border border-white/5 rounded-3xl hover:border-amber-500/30 transition-all flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-zinc-800 rounded-2xl group-hover:bg-amber-500 group-hover:text-black transition-colors">
                                            <Scissors size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white uppercase italic tracking-tight">{service.name}</p>
                                            <p className="text-zinc-500 text-[10px] font-medium">{service.duration} MIN • ${service.price}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-zinc-700 group-hover:text-amber-500 transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 2: Seleccionar Barbero */}
                {step === 2 && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <button onClick={() => setStep(1)} className="text-xs text-zinc-500 hover:text-white uppercase font-black tracking-widest">← Volver</button>
                            <h2 className="text-xl font-black uppercase italic tracking-tight">Tu_Experto</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {barbers.map(barber => (
                                <button
                                    key={barber.id}
                                    onClick={() => { setSelectedBarber(barber); setStep(3); }}
                                    className="group text-left p-5 bg-zinc-900/50 border border-white/5 rounded-3xl hover:border-amber-500/30 transition-all flex items-center gap-4"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-zinc-800 overflow-hidden border border-white/10 group-hover:border-amber-500/50 transition-colors">
                                        <img src={`https://ui-avatars.com/api/?name=${barber.user.full_name}&background=18181b&color=f59e0b&bold=true`} alt={barber.user.full_name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-white uppercase italic tracking-tight">{barber.user.full_name}</p>
                                        <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-widest">{barber.specialties || 'Senior Barber'}</p>
                                    </div>
                                    <ChevronRight size={20} className="text-zinc-700 group-hover:text-amber-500 transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 3: Fecha y Hora */}
                {step === 3 && (
                    <div className="space-y-6 animate-fade-in text-left">
                        <div className="flex items-center justify-between">
                            <button onClick={() => setStep(2)} className="text-xs text-zinc-500 hover:text-white uppercase font-black tracking-widest">← Volver</button>
                            <h2 className="text-xl font-black uppercase italic tracking-tight">Cuando</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="p-6 bg-zinc-900/50 rounded-3xl border border-white/5 space-y-4">
                                <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                                    <Calendar size={14} /> Seleccionar_Día
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full bg-transparent text-2xl font-black text-white outline-none [color-scheme:dark]"
                                />
                            </div>

                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4 block">Horarios_Disponibles</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['10:00', '11:00', '12:00', '16:00', '17:00', '18:00', '19:00'].map(hour => (
                                    <button
                                        key={hour}
                                        onClick={() => { setSelectedTime(hour); setStep(4); }}
                                        className={`py-4 rounded-2xl font-bold text-sm transition-all ${selectedTime === hour ? 'bg-amber-500 text-black' : 'bg-zinc-900 text-zinc-400 border border-white/5'
                                            }`}
                                    >
                                        {hour}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4: Confirmación Final */}
                {step === 4 && (
                    <div className="space-y-8 animate-fade-in text-left">
                        <div className="flex items-center justify-between">
                            <button onClick={() => setStep(3)} className="text-xs text-zinc-500 hover:text-white uppercase font-black tracking-widest">← Volver</button>
                            <h2 className="text-xl font-black uppercase italic tracking-tight">Tus_Datos</h2>
                        </div>

                        {/* Summary Card */}
                        <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Resumen_de_Turno</h4>
                                <Scissors size={14} className="text-amber-500" />
                            </div>
                            <div>
                                <p className="text-lg font-black text-white uppercase italic">{selectedService?.name}</p>
                                <p className="text-zinc-400 text-xs">Con {selectedBarber?.user.full_name}</p>
                                <div className="flex items-center gap-4 mt-2 text-white font-bold text-xs">
                                    <span className="flex items-center gap-1 uppercase tracking-widest"><Calendar size={12} /> {selectedDate}</span>
                                    <span className="flex items-center gap-1 uppercase tracking-widest"><Clock size={12} /> {selectedTime}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">¿Cómo te llamas?</label>
                                <input
                                    type="text" placeholder="Tu nombre..."
                                    value={clientName} onChange={(e) => setClientName(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-amber-500/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Teléfono_WhatsApp</label>
                                <input
                                    type="tel" placeholder="Ej: +54 9 11..."
                                    value={clientPhone} onChange={(e) => setClientPhone(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-amber-500/50"
                                />
                            </div>
                            <button
                                onClick={handleConfirmBooking}
                                disabled={loading}
                                className="w-full py-5 bg-white hover:bg-amber-500 text-black rounded-3xl font-black text-sm uppercase italic tracking-tighter transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                {loading ? 'DEPLOYING...' : 'INITIATE_SYNC_PROTOCOL'} <CheckCircle2 size={20} />
                            </button>
                            <p className="text-center text-[8px] text-zinc-600 uppercase font-bold tracking-widest">Al confirmar, acepto los términos de la barbería.</p>
                        </div>
                    </div>
                )}

                {/* STEP 5: ÉXITO */}
                {step === 5 && (
                    <div className="py-20 text-center space-y-6 animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto border-2 border-green-500/20">
                            <CheckCircle2 size={40} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter">¡Listo,_Rey!</h2>
                            <p className="text-zinc-500 text-sm max-w-[250px] mx-auto font-medium">Reserva confirmada. Te esperamos en el horario indicado.</p>
                        </div>
                        <div className="pt-10 flex flex-col gap-4">
                            <button onClick={() => window.location.reload()} className="text-amber-500 font-black text-[10px] uppercase tracking-[0.3em] hover:text-white transition-colors">Volver_al_Inicio</button>
                            <a href={`https://wa.me/${barbershop?.phone}?text=Hola,%20tengo%20un%20turno%20confirmado%20para%20el%20${selectedDate}`} className="bg-zinc-900 hover:bg-zinc-800 p-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border border-white/5">
                                <Instagram size={16} /> Seguir en Instagram
                            </a>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
