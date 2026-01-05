import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './LoginPage';
import MarketingLanding from './MarketingLanding';
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
import AgendaPage from './pages/AgendaPage';
import ClientesPage from './pages/ClientesPage';
import PerfilPage from './pages/PerfilPage';
import FinanzasPage from './pages/FinanzasPage';
import BookingPublicPage from './pages/BookingPublicPage';
import CalendarioPage from './pages/CalendarioPage';
import MarketingPage from './pages/MarketingPage';

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
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#18181b',
                        color: '#fff',
                        border: '1px solid #3f3f46',
                    },
                    success: {
                        iconTheme: {
                            primary: '#f59e0b',
                            secondary: '#000',
                        },
                    },
                }}
            />
            <BrowserRouter>
                <Routes>
                    {/* ACCESO TÁCTICO: LOGIN DIRECTO */}
                    <Route path="/" element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    } />

                    {/* LANDING EN 'OTRO LADO' */}
                    <Route path="/landing" element={
                        <PublicRoute>
                            <MarketingLanding />
                        </PublicRoute>
                    } />

                    <Route path="/reservar" element={<BookingPublicPage />} />

                    <Route path="/" element={
                        <PrivateRoute>
                            <MainLayout />
                        </PrivateRoute>
                    }>
                        <Route path="home" element={<HomePage />} />
                        <Route path="agenda" element={<AgendaPage />} />
                        <Route path="calendario" element={<CalendarioPage />} />
                        <Route path="clientes" element={<ClientesPage />} />
                        <Route path="marketing" element={<MarketingPage />} />
                        <Route path="finanzas" element={<FinanzasPage />} />
                        <Route path="perfil" element={<PerfilPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
