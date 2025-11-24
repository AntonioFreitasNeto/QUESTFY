import React, { useState } from 'react';
import { Button } from './Button';

interface LoginViewProps {
  onLogin: (name: string, isGoogle: boolean) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    onLogin(name || email.split('@')[0] || 'Estudante', false);
  };

  const handleGoogleLogin = () => {
    // Simulate Google OAuth
    onLogin('Estudante Google', true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-600 to-primary-900 flex items-center justify-center p-6">
      <div className="bg-white w-full rounded-3xl p-8 shadow-2xl animate-fade-in">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-primary-700 mb-2">ENEM Master</h1>
            <p className="text-gray-500 text-sm">Sua aprovação começa aqui.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {isRegister && (
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nome Completo</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Seu nome"
                    />
                </div>
            )}
            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">E-mail</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="estudante@email.com"
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Senha</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="******"
                />
            </div>

            <Button type="submit" fullWidth variant="primary">
                {isRegister ? 'Criar Conta Grátis' : 'Entrar'}
            </Button>
        </form>

        <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou continue com</span>
            </div>
        </div>

        <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl transition-all shadow-sm mb-6"
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Entrar com Google
        </button>

        <p className="text-center text-sm text-gray-600">
            {isRegister ? 'Já tem uma conta?' : 'Novo por aqui?'}
            <button 
                onClick={() => setIsRegister(!isRegister)}
                className="ml-1 font-bold text-primary-600 hover:underline"
            >
                {isRegister ? 'Fazer Login' : 'Cadastre-se'}
            </button>
        </p>
      </div>
    </div>
  );
};