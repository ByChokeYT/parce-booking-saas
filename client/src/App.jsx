import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingBarber from './LandingBarber';
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
import AgendaPage from './pages/AgendaPage';
import ClientesPage from './pages/ClientesPage';
import PerfilPage from './pages/PerfilPage';

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-amber-500">Cargando...</div>;
    return user ? children : <Navigate to="/" />;
}

function PublicRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-amber-500">Cargando...</div>;
    return user ? <Navigate to="/home" /> : children;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <PublicRoute>
                            <LandingBarber />
                        </PublicRoute>
                    } />

                    <Route path="/" element={
                        <PrivateRoute>
                            <MainLayout />
                        </PrivateRoute>
                    }>
                        <Route path="home" element={<HomePage />} />
                        <Route path="agenda" element={<AgendaPage />} />
                        <Route path="clientes" element={<ClientesPage />} />
                        <Route path="perfil" element={<PerfilPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
