import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import { 
    Search, MapPin, Briefcase, Globe, ChevronDown, ChevronUp, 
    Menu, X, User, Settings, BarChart3, Users, Database, 
    LogOut, Bell, Mail, ArrowRight, CheckCircle, AlertCircle,
    Eye, EyeOff, Edit3, Trash2, Plus, ExternalLink, Lock, Filter, Sparkles, RotateCcw
} from 'https://esm.sh/lucide-react@0.263.1';

// --- CONFIG FIREBASE (Solo Firestore, sin Auth para evitar el error 400) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyADYUhcuHet7b5sn9UV48ea_VvlUPUv1_s",
    authDomain: "it-nomads.firebaseapp.com",
    projectId: "it-nomads",
    storageBucket: "it-nomads.appspot.com",
    appId: "1:367375252554:web:866299f2a9796e62f0263a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const App = () => {
    const [view, setView] = useState('home');
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Navegación por Hash
    useEffect(() => {
        const handleHash = () => setView(window.location.hash.replace('#', '') || 'home');
        window.addEventListener('hashchange', handleHash);
        handleHash();
        return () => window.removeEventListener('hashchange', handleHash);
    }, []);

    // --- CONEXIÓN A TU BASE DE DATOS SQLITE ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setFeedback({ type: '', message: '' });
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: loginForm.username.trim(), 
                    password: loginForm.password.trim() 
                })
            });

            const data = await response.json();

            if (data.success) {
                setCurrentUser(data.user);
                window.location.hash = '#cms';
            } else {
                setFeedback({ type: 'error', message: data.message });
            }
        } catch (err) {
            setFeedback({ type: 'error', message: 'Servidor Node.js apagado (ejecuta node server.js)' });
        } finally {
            setIsLoading(false);
        }
    };

    if (view === 'login') {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-md">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Staff Login</h2>
                    {feedback.message && (
                        <div className={`mb-4 p-3 rounded text-sm ${feedback.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                            {feedback.message}
                        </div>
                    )}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input 
                            type="text" 
                            className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-white outline-none focus:border-indigo-500"
                            placeholder="Usuario"
                            value={loginForm.username}
                            onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                        />
                        <input 
                            type="password" 
                            className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-white outline-none focus:border-indigo-500"
                            placeholder="Contraseña"
                            value={loginForm.password}
                            onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                        />
                        <button type="submit" disabled={isLoading} className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 flex justify-center">
                            {isLoading ? <RotateCcw className="animate-spin" /> : 'Entrar al Sistema'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (view === 'cms' && currentUser) {
        return (
            <div className="min-h-screen bg-black text-white p-10">
                <h1 className="text-3xl font-bold">Bienvenido, {currentUser.name}</h1>
                <p className="text-zinc-500">Has accedido a través de SQLite con éxito.</p>
                <button onClick={() => { window.location.hash = '#home'; setCurrentUser(null); }} className="mt-4 text-indigo-400 underline">Cerrar sesión</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
            <h1 className="text-6xl font-black mb-4">IT NOMADS</h1>
            <button onClick={() => window.location.hash = '#login'} className="bg-white text-black px-8 py-3 rounded-full font-bold">
                Ir al Login
            </button>
        </div>
    );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);