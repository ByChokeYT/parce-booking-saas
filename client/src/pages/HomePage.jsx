export default function HomePage() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Dashboard_Cmd</h2>
                    <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase">Live_Status_Monitor</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 px-3 py-1 rounded text-[10px] font-black text-green-500 tracking-widest uppercase animate-pulse">
                    System_Online
                </div>
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Widget 1: Turnos Hoy */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-amber-500/30 transition-all group">
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-amber-500 transition-colors">Today_Activity</h3>
                        <div className="w-2 h-2 bg-zinc-800 rounded-full group-hover:bg-amber-500 transition-colors"></div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-white tracking-tighter">0</span>
                        <span className="text-zinc-600 font-bold text-xs uppercase tracking-wide">Turnos</span>
                    </div>
                    <div className="mt-4 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-white w-[10%] group-hover:bg-amber-500 transition-colors"></div>
                    </div>
                </div>

                {/* Widget 2: Próximas Horas */}
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 hover:bg-amber-500/20 transition-all group">
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">Next_3_Hours</h3>
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-amber-500 tracking-tighter">0</span>
                        <span className="text-amber-500/60 font-bold text-xs uppercase tracking-wide">Incoming</span>
                    </div>
                    <div className="mt-4 h-1 w-full bg-amber-500/20 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 w-[5%]"></div>
                    </div>
                </div>

                {/* Widget 3: Graph Placeholder */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 md:col-span-2 lg:col-span-1 border-dashed flex flex-col items-center justify-center min-h-[160px] hover:border-zinc-700 transition-colors cursor-crosshair">
                    <p className="text-zinc-700 font-black text-xs uppercase tracking-[0.2em] text-center">
                        Awaiting_Data_Stream
                        <br />
                        <span className="text-[10px] text-zinc-800 tracking-normal opacity-50">Ingresos vs Egresos</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
