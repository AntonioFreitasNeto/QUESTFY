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
    onLogin(name || email.split('@')[0] || 'Player 1', false);
  };

  const handleGoogleLogin = () => {
    onLogin('Player Google', true);
  };

  return (
    <div className="min-h-screen bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-game-bg flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-cyan-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30"></div>

      <div className="bg-game-card/80 backdrop-blur-md border border-slate-700 w-full rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 mb-2 tracking-tighter uppercase italic">
              Questify
            </h1>
            <p className="text-slate-400 text-sm font-medium">PRESS START TO BEGIN</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {isRegister && (
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Nickname</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                        placeholder="Nome do Jogador"
                    />
                </div>
            )}
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">E-mail</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    placeholder="player@email.com"
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Senha</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    placeholder="******"
                />
            </div>

            <Button type="submit" fullWidth variant="primary" className="mt-4">
                {isRegister ? 'Criar Save' : 'Start Game'}
            </Button>
        </form>

        <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-game-card text-slate-500">ou</span>
            </div>
        </div>

        <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-slate-800 border-b-4 border-slate-950 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl transition-all mb-6 active:translate-y-1 active:border-b-0"
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Login com Google
        </button>

        <p className="text-center text-sm text-slate-400">
            {isRegister ? 'Já tem conta?' : 'Novo Jogador?'}
            <button 
                onClick={() => setIsRegister(!isRegister)}
                className="ml-1 font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
            >
                {isRegister ? 'Carregar Jogo' : 'Cadastrar'}
            </button>
        </p>
      </div>
    </div>
  );
};