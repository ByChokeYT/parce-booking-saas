import { useState } from 'react';
import { X, DollarSign, CreditCard, Smartphone, Banknote, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentRecordModal({ isOpen, onClose, appointment, onPaymentRecorded }) {
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [notes, setNotes] = useState('');

    if (!isOpen || !appointment) return null;

    const methods = [
        { id: 'cash', name: 'Efectivo', icon: Banknote, color: 'text-green-500', bg: 'bg-green-500/10' },
        { id: 'card', name: 'Tarjeta', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { id: 'transfer', name: 'Transferencia', icon: Smartphone, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { id: 'qr', name: 'QR / Digital', icon: Smartphone, color: 'text-amber-500', bg: 'bg-amber-500/10' }
    ];

    const handleRecordPayment = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    appointment_id: appointment.id,
                    amount: appointment.service.price,
                    payment_method: paymentMethod,
                    notes
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success('Pago registrado y comisión calculada');
                onPaymentRecorded();
                onClose();
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            toast.error(error.message || 'Error al registrar el pago');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Registrar_Cobro</h3>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Transaction_Interface_v1</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-zinc-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Summary Card */}
                    <div className="bg-zinc-950/50 rounded-2xl p-4 border border-white/5">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Servicio</span>
                            <span className="text-xs font-bold text-white uppercase">{appointment.service.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total a Cobrar</span>
                            <span className="text-2xl font-black text-amber-500 tracking-tighter">${appointment.service.price}</span>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Método_de_Pago</label>
                        <div className="grid grid-cols-2 gap-3">
                            {methods.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setPaymentMethod(m.id)}
                                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${paymentMethod === m.id
                                            ? 'bg-amber-500 border-amber-500 text-black'
                                            : 'bg-zinc-950/50 border-white/5 text-zinc-400 hover:border-white/20'
                                        }`}
                                >
                                    <m.icon size={20} strokeWidth={paymentMethod === m.id ? 3 : 2} />
                                    <span className="text-xs font-black uppercase tracking-tighter">{m.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Notas_Transacción</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl p-4 text-zinc-300 text-xs focus:outline-none focus:border-amber-500/50 transition-all resize-none h-20"
                            placeholder="Ej: Propina incluida, vuelto entregado..."
                        />
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleRecordPayment}
                        disabled={loading}
                        className="w-full bg-white hover:bg-amber-500 text-black py-4 rounded-2xl font-black text-xs uppercase italic tracking-tighter transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-3 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <CheckCircle size={18} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                                Confirmar_y_Finalizar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
