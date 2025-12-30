export default function ClientesPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-white/5">
                <span className="text-2xl">👥</span>
            </div>
            <div>
                <h2 className="text-white font-medium text-lg">Clientes</h2>
                <p className="text-zinc-500 text-sm">Base de datos de clientes próximamente</p>
            </div>
        </div>
    );
}
