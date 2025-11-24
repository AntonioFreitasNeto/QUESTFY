import React, { useState } from 'react';
import { LeaderboardScope, User } from '../types';
import { MOCK_USERS } from '../constants';

const Podium: React.FC<{ top3: User[] }> = ({ top3 }) => {
  const [first, second, third] = top3;

  return (
    <div className="flex justify-center items-end gap-2 mb-8 mt-4">
      {/* 2nd Place */}
      <div className="flex flex-col items-center w-1/3">
        <div className="relative">
          <img src={second.avatar} alt={second.name} className="w-16 h-16 rounded-xl border-2 border-slate-400 opacity-80" />
          <div className="absolute -bottom-2 -right-2 bg-slate-600 text-white w-6 h-6 rounded flex items-center justify-center font-bold text-xs border border-slate-900">2</div>
        </div>
        <div className="h-24 w-full bg-slate-700/50 mt-2 rounded-t-lg border-t border-x border-slate-600 flex flex-col items-center justify-center text-white backdrop-blur-sm">
          <span className="font-bold text-slate-300 truncate w-full text-center px-1 text-sm">{second.name}</span>
          <span className="text-[10px] text-slate-400 font-mono">{second.score} XP</span>
        </div>
      </div>

      {/* 1st Place */}
      <div className="flex flex-col items-center w-1/3 z-10">
        <div className="relative">
          <img src={first.avatar} alt={first.name} className="w-20 h-20 rounded-xl border-2 border-gold shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
          <div className="absolute -bottom-2 -right-2 bg-gold text-yellow-900 w-7 h-7 rounded flex items-center justify-center font-black text-sm border border-yellow-900">1</div>
          <span className="absolute -top-8 text-2xl animate-bounce">👑</span>
        </div>
        <div className="h-32 w-full bg-gradient-to-b from-yellow-600/50 to-yellow-900/50 mt-2 rounded-t-lg border-t border-x border-yellow-500 flex flex-col items-center justify-center text-white backdrop-blur-sm">
          <span className="font-bold text-gold truncate w-full text-center px-1">{first.name}</span>
          <span className="text-sm font-mono text-yellow-200">{first.score} XP</span>
        </div>
      </div>

      {/* 3rd Place */}
      <div className="flex flex-col items-center w-1/3">
        <div className="relative">
          <img src={third.avatar} alt={third.name} className="w-16 h-16 rounded-xl border-2 border-orange-700 opacity-80" />
          <div className="absolute -bottom-2 -right-2 bg-orange-800 text-orange-200 w-6 h-6 rounded flex items-center justify-center font-bold text-xs border border-slate-900">3</div>
        </div>
        <div className="h-20 w-full bg-orange-900/30 mt-2 rounded-t-lg border-t border-x border-orange-800 flex flex-col items-center justify-center text-white backdrop-blur-sm">
          <span className="font-bold text-orange-400 truncate w-full text-center px-1 text-sm">{third.name}</span>
          <span className="text-[10px] text-orange-500 font-mono">{third.score} XP</span>
        </div>
      </div>
    </div>
  );
};

export const Leaderboard: React.FC = () => {
  const [scope, setScope] = useState<LeaderboardScope>(LeaderboardScope.GLOBAL);
  
  const sortedUsers = [...MOCK_USERS].sort((a, b) => b.score - a.score);
  const top3 = sortedUsers.slice(0, 3);
  const rest = sortedUsers.slice(3);

  return (
    <div className="px-4 pb-24 pt-6 bg-game-bg min-h-screen text-white">
      <h2 className="text-2xl font-black uppercase text-center mb-6 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200">Hall of Fame</h2>
      
      {/* Scope Toggles */}
      <div className="flex p-1 bg-slate-800 rounded-xl mb-6 border border-slate-700">
        {Object.values(LeaderboardScope).map((s) => (
          <button
            key={s}
            onClick={() => setScope(s)}
            className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
              scope === s 
              ? 'bg-slate-600 text-white shadow-sm' 
              : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {s === 'GLOBAL' ? 'Brasil' : s === 'STATE' ? 'Estado' : 'Cidade'}
          </button>
        ))}
      </div>

      <Podium top3={top3} />

      {/* List */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden backdrop-blur-sm">
        {rest.map((user, index) => (
          <div key={user.id} className="flex items-center p-4 border-b border-slate-700 last:border-0 hover:bg-slate-700/50 transition-colors">
            <span className="w-8 text-slate-500 font-bold text-sm font-mono">{index + 4}</span>
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded mr-3 bg-slate-600" />
            <div className="flex-1">
              <h4 className="font-bold text-slate-200 text-sm">{user.name}</h4>
              <p className="text-[10px] text-slate-500 uppercase">{user.city}, {user.state}</p>
            </div>
            <div className="text-right">
              <span className="block font-bold text-cyan-400 font-mono">{user.score}</span>
            </div>
          </div>
        ))}
        {/* Current User Fixed */}
        <div className="bg-indigo-900/40 p-4 border-t border-indigo-500/30 flex items-center">
            <span className="w-8 text-indigo-400 font-bold text-sm font-mono">154</span>
            <img src={MOCK_USERS.find(u => u.id === 'you')?.avatar} alt="You" className="w-10 h-10 rounded mr-3 border border-indigo-500" />
            <div className="flex-1">
              <h4 className="font-bold text-white text-sm">Você</h4>
              <p className="text-[10px] text-indigo-300 uppercase">São Paulo, SP</p>
            </div>
            <div className="text-right">
              <span className="block font-bold text-gold font-mono">9800</span>
            </div>
        </div>
      </div>
    </div>
  );
};