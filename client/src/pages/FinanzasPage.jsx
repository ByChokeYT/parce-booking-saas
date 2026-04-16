import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Wallet, CreditCard, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight, Activity, Users, Star, Clock, Scissors, Download, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, AreaChart, Area, PieChart, Pie } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import toast from 'react-hot-toast';
import CashOutModal from '../components/CashOutModal';

export default function FinanzasPage() {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        today: 0,
        breakdown: []
    });
    const [fullReport, setFullReport] = useState(null);
    const [isCashOutOpen, setIsCashOutOpen] = useState(false);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/payments/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setStats({
                    today: data.today,
                    breakdown: data.breakdown || []
                });
            }

            const resReport = await fetch('/api/payments/full-report', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const dataReport = await resReport.json();
            if (dataReport.success) {
                setFullReport(dataReport.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Actualización en tiempo real
    useSocket((type) => {
        if (type === 'payment-recorded') {
            fetchStats();
            toast.success('¡Nuevo ingreso registrado!', { icon: '💰' });
        }
    });

    const exportToCSV = () => {
        if (!fullReport || !fullReport.performance) return;

        const headers = ["Barbero", "Total Generado", "Comision (40%)", "Turnos"];
        const rows = fullReport.performance.map(b => [
            b.name,
            b.total_generated,
            b.commission,
            b.appointments_count
        ]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `reporte_finanzas_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
        toast.success('Reporte exportado correctamente');
    };

    const chartData = stats.breakdown.map(item => ({
        name: item.payment_method.toUpperCase(),
        monto: parseFloat(item._sum.amount)
    }));

    const COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981'];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Dashboard Financiero</h2>
                    <p className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase">Inteligencia de Negocio y Auditoría</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={exportToCSV}
                        className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase italic tracking-tighter transition-all flex items-center gap-2 border border-white/5"
                    >
                        <Download size={16} /> Exportar_CSV
                    </button>
                    <button
                        onClick={() => setIsCashOutOpen(true)}
                        className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-2xl font-black text-xs uppercase italic tracking-tighter transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                    >
                        <Wallet size={18} className="group-hover:scale-110 transition-transform" />
                        Realizar_Corte_de_Caja
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-white/10 p-5 rounded-3xl relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <DollarSign size={32} className="text-amber-500" />
                    </div>
                    <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Ingresos de Hoy</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white tracking-tighter font-outfit">${stats.today}</span>
                        <div className="flex items-center gap-1 text-green-500 text-[10px] font-bold">
                            <ArrowUpRight size={12} />
                            <span>LIVE</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-white/5 rounded-3xl p-5 relative overflow-hidden group shadow-xl">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Activity size={32} className="text-blue-500" />
                    </div>
                    <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Transacciones</p>
                    <span className="text-3xl font-black text-white tracking-tighter font-outfit">
                        {stats.breakdown.reduce((acc, curr) => acc + (curr._count?.payment_method || 1), 0)}
                    </span>
                </div>

                <div className="bg-amber-500 text-black rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <TrendingUp size={64} />
                    </div>
                    <p className="text-black/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Status_Alarma</p>
                    <span className="text-xl font-black uppercase italic tracking-tighter">SIN_FALTANTES</span>
                </div>
            </div>

            {/* Advanced BI KPIs */}
            {fullReport && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4">
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Semana_Actual</p>
                        <p className="text-xl font-black text-white">${fullReport.income.week}</p>
                    </div>
                    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4">
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Mes_Actual</p>
                        <p className="text-xl font-black text-white">${fullReport.income.month}</p>
                    </div>
                    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4">
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">vs_Mes_Anterior</p>
                        <div className="flex items-center gap-2">
                            <p className="text-xl font-black text-white">${fullReport.income.lastMonth}</p>
                            <span className={`text-[10px] font-bold ${fullReport.income.month >= fullReport.income.lastMonth ? 'text-green-500' : 'text-red-500'}`}>
                                {fullReport.income.lastMonth > 0
                                    ? `${(((fullReport.income.month - fullReport.income.lastMonth) / fullReport.income.lastMonth) * 100).toFixed(1)}%`
                                    : '+100%'}
                            </span>
                        </div>
                    </div>
                    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4">
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Top_Barbero</p>
                        <p className="text-xl font-black text-amber-500 truncate lowercase italic">
                            {fullReport.performance.length > 0
                                ? fullReport.performance.sort((a, b) => b.total_generated - a.total_generated)[0].name
                                : 'n/a'}
                        </p>
                    </div>
                </div>
            )}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
                    <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Revenue_By_Method</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#71717a"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#71717a"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: '#ffffff05' }}
                                    contentStyle={{
                                        backgroundColor: '#18181b',
                                        border: '1px solid #3f3f46',
                                        borderRadius: '12px',
                                        fontSize: '12px'
                                    }}
                                />
                                <Bar dataKey="monto" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Table Breakdown */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
                    <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Method_Breakdown</h3>
                    <div className="space-y-4">
                        {stats.breakdown.length === 0 ? (
                            <p className="text-zinc-600 text-xs italic text-center py-20">No financial data for today.</p>
                        ) : (
                            stats.breakdown.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${COLORS[idx % COLORS.length]}10`}>
                                            <Wallet size={20} style={{ color: COLORS[idx % COLORS.length] }} />
                                        </div>
                                        <div>
                                            <p className="text-white text-xs font-black uppercase tracking-wider">{item.payment_method}</p>
                                            <p className="text-zinc-500 text-[10px] font-bold">MODO_VERIFICADO</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-black">${item._sum.amount}</p>
                                        <p className="text-green-500 text-[10px] font-bold">100%_SECURE</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Peak Hours Line Chart */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
                <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                    <Clock size={14} className="text-amber-500" />
                    Peak_Hours_Detection
                </h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={fullReport?.peakHours || []}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="hour" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                            />
                            <Area type="monotone" dataKey="count" stroke="#f59e0b" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Popular Services Bar Chart */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
                <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                    <Scissors size={14} className="text-blue-500" />
                    Top_Services_Engagement
                </h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={fullReport?.services || []} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                            <XAxis type="number" stroke="#71717a" fontSize={10} hide />
                            <YAxis dataKey="name" type="category" stroke="#fff" fontSize={10} width={80} />
                            <Tooltip
                                cursor={{ fill: '#ffffff05' }}
                                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                            />
                            <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Barber Performance Table */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
                <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                    <Users size={14} className="text-purple-500" />
                    Barber_Performance_Matrix
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-white/5">
                                <th className="pb-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Barbero</th>
                                <th className="pb-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Citas</th>
                                <th className="pb-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Generado</th>
                                <th className="pb-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Comisión</th>
                                <th className="pb-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Eficiencia</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {fullReport?.performance.map((b, idx) => (
                                <tr key={idx} className="group hover:bg-white/5 transition-colors">
                                    <td className="py-4">
                                        <span className="text-white font-bold text-sm uppercase italic">{b.name}</span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <span className="text-zinc-400 text-xs font-mono">{b.appointments}</span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <span className="text-white font-black">${b.total_generated}</span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <span className="text-amber-500 font-bold">${b.commission}</span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500"
                                                    style={{ width: `${Math.min(100, (b.appointments / 10) * 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-bold text-zinc-500">
                                                {((b.appointments / 50) * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <CashOutModal
                isOpen={isCashOutOpen}
                onClose={() => setIsCashOutOpen(false)}
            />
        </div>
    );
}
