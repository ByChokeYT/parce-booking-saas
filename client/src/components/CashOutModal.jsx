import { useState, useEffect } from 'react';
import { X, Calendar, Wallet, CreditCard, Smartphone, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CashOutModal({ isOpen, onClose }) {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [actualCash, setActualCash] = useState('');
    const [notes, setNotes] = useState('');

    const fetchPreview = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/payments/preview-corte?date=${date}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setPreview(data.data);
            }
        } catch (error) {
            toast.error('Error al cargar datos del corte');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) fetchPreview();
    }, [isOpen, date]);

    const handleSaveCashOut = async () => {
        if (!actualCash) return toast.error('Ingresa el efectivo real en caja');

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/payments/corte', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    expected_cash: preview.expected_cash,
                    actual_cash: parseFloat(actualCash),
                    total_card: preview.total_card,
                    total_transfer: preview.total_transfer,
                    total_qr: preview.total_qr,
                    notes
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success('Corte de caja guardado correctamente');
                onClose();
            }
        } catch (error) {
            toast.error('Error al guardar el corte');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const difference = preview ? (parseFloat(actualCash || 0) - preview.expected_cash) : 0;

    return (
        <div className="fixed inset-0 z-[999] flex items-center md:items-center justify-center p-0 md:p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in overflow-hidden">
            {/* Overlay background for mobile click-to-close */}
            <div className="absolute inset-0 md:hidden" onClick={onClose}></div>

            <div className="bg-zinc-900 border-t md:border border-white/10 w-full max-w-xl rounded-t-[32px] md:rounded-3xl overflow-hidden shadow-2xl relative translate-y-0 animate-slide-up md:animate-zoom-in mt-auto md:mt-0 max-h-[92vh] flex flex-col">
                {/* Drag Handle for Mobile */}
                <div className="md:hidden flex justify-center pt-3 pb-1" onClick={onClose}>
                    <div className="w-12 h-1.5 bg-zinc-800 rounded-full"></div>
                </div>
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-950/50">
                    <div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Corte_de_Caja</h3>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Financial_Reconciliation_v2</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-zinc-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Date Selector */}
                    <div className="flex items-center gap-4 p-4 bg-zinc-950/30 rounded-2xl border border-white/5">
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                            <Calendar size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fecha_del_Corte</p>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="bg-transparent text-white font-bold text-sm outline-none w-full [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    {loading && !preview ? (
                        <div className="py-20 flex justify-center">
                            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : preview && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-zinc-950/50 rounded-2xl border border-white/5">
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Citas_Finalizadas</p>
                                    <p className="text-2xl font-black text-white">{preview.total_appointments}</p>
                                </div>
                                <div className="p-4 bg-zinc-950/50 rounded-2xl border border-white/5">
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Efectivo_Esperado</p>
                                    <p className="text-2xl font-black text-amber-500">${preview.expected_cash}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-3 bg-zinc-950/30 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 text-zinc-500 mb-1">
                                        <CreditCard size={12} />
                                        <span className="text-[8px] font-bold uppercase tracking-wider">Tarjeta</span>
                                    </div>
                                    <p className="text-sm font-bold text-white">${preview.total_card}</p>
                                </div>
                                <div className="p-3 bg-zinc-950/30 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 text-zinc-500 mb-1">
                                        <Smartphone size={12} />
                                        <span className="text-[8px] font-bold uppercase tracking-wider">Transfer.</span>
                                    </div>
                                    <p className="text-sm font-bold text-white">${preview.total_transfer}</p>
                                </div>
                                <div className="p-3 bg-zinc-950/30 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 text-zinc-500 mb-1">
                                        <Smartphone size={12} />
                                        <span className="text-[8px] font-bold uppercase tracking-wider">QR</span>
                                    </div>
                                    <p className="text-sm font-bold text-white">${preview.total_qr}</p>
                                </div>
                            </div>

                            {/* Input Real Cash */}
                            <div className="space-y-4">
                                <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-3xl">
                                    <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-4 block">Contabilización_Física_Efectivo</label>
                                    <div className="flex items-center gap-4">
                                        <div className="text-4xl font-black text-amber-500">$</div>
                                        <input
                                            type="number"
                                            value={actualCash}
                                            onChange={(e) => setActualCash(e.target.value)}
                                            placeholder="0.00"
                                            className="bg-transparent text-5xl font-black text-white outline-none w-full tracking-tighter placeholder:text-zinc-800"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {/* Difference Indicator */}
                                {actualCash && (
                                    <div className={`p-4 rounded-2xl flex items-center justify-between border ${difference === 0 ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                            difference > 0 ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                                                'bg-red-500/10 border-red-500/20 text-red-500'
                                        }`}>
                                        <div className="flex items-center gap-3">
                                            {difference === 0 ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                            <p className="text-xs font-black uppercase italic">
                                                {difference === 0 ? 'Caja_Cuadrada_Perfecta' :
                                                    difference > 0 ? `Sobrante_Detectado: $${difference}` :
                                                        `Faltante_Detectado: $${Math.abs(difference)}`}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <textarea
                                    placeholder="Notas u observaciones del cierre..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl p-4 text-xs text-zinc-400 outline-none focus:border-amber-500/50 transition-all resize-none h-20"
                                />

                                <button
                                    onClick={handleSaveCashOut}
                                    disabled={loading}
                                    className="w-full bg-white hover:bg-amber-500 text-black py-4 rounded-2xl font-black text-xs uppercase italic tracking-tighter transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    Confirmar_Cierre_de_Caja
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
