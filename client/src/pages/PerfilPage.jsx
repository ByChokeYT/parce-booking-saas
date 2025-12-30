import { useAuth } from '../context/AuthContext';

export default function PerfilPage() {
    const { logout, user } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-fade-in">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center border-2 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <span className="text-3xl font-black text-amber-500">{user?.full_name?.charAt(0) || 'U'}</span>
            </div>
            <div>
                <h2 className="text-white font-black text-2xl uppercase italic tracking-tighter">{user?.full_name}</h2>
                <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase">{user?.role}</p>
            </div>

            <div className="w-full max-w-xs bg-zinc-900/50 rounded-xl p-4 border border-white/5 mt-8">
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-2">Account_Status</p>
                <div className="flex items-center justify-center gap-2 text-green-500 font-bold text-xs uppercase tracking-wide">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Active_Session
                </div>
            </div>

            <button
                onClick={logout}
                className="mt-8 px-8 py-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all rounded-lg"
            >
                Cerrar_Sesión
            </button>
        </div>
    );
}
