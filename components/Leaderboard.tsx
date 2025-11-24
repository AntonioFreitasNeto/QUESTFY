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
          <img src={second.avatar} alt={second.name} className="w-16 h-16 rounded-full border-4 border-gray-300 shadow-md" />
          <div className="absolute -bottom-2 -right-2 bg-gray-300 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">2</div>
        </div>
        <div className="h-24 w-full bg-gray-300 mt-2 rounded-t-lg flex flex-col items-center justify-center text-white shadow-lg">
          <span className="font-bold text-gray-700 truncate w-full text-center px-1">{second.name}</span>
          <span className="text-xs text-gray-600 font-medium">{second.score} XP</span>
        </div>
      </div>

      {/* 1st Place */}
      <div className="flex flex-col items-center w-1/3 z-10">
        <div className="relative">
          <img src={first.avatar} alt={first.name} className="w-20 h-20 rounded-full border-4 border-accent-400 shadow-xl" />
          <div className="absolute -bottom-2 -right-2 bg-accent-400 text-yellow-900 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">1</div>
          <span className="absolute -top-6 text-2xl">👑</span>
        </div>
        <div className="h-32 w-full bg-gradient-to-b from-accent-400 to-accent-500 mt-2 rounded-t-lg flex flex-col items-center justify-center text-white shadow-lg">
          <span className="font-bold truncate w-full text-center px-1">{first.name}</span>
          <span className="text-sm font-medium">{first.score} XP</span>
        </div>
      </div>

      {/* 3rd Place */}
      <div className="flex flex-col items-center w-1/3">
        <div className="relative">
          <img src={third.avatar} alt={third.name} className="w-16 h-16 rounded-full border-4 border-orange-300 shadow-md" />
          <div className="absolute -bottom-2 -right-2 bg-orange-300 text-orange-800 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">3</div>
        </div>
        <div className="h-20 w-full bg-orange-300 mt-2 rounded-t-lg flex flex-col items-center justify-center text-white shadow-lg">
          <span className="font-bold text-orange-900 truncate w-full text-center px-1">{third.name}</span>
          <span className="text-xs text-orange-800 font-medium">{third.score} XP</span>
        </div>
      </div>
    </div>
  );
};

export const Leaderboard: React.FC = () => {
  const [scope, setScope] = useState<LeaderboardScope>(LeaderboardScope.GLOBAL);
  
  // In a real app, we would sort/filter based on scope.
  // Here we just shuffle or slice for demo visual variety.
  const sortedUsers = [...MOCK_USERS].sort((a, b) => b.score - a.score);
  const top3 = sortedUsers.slice(0, 3);
  const rest = sortedUsers.slice(3);

  return (
    <div className="px-4 pb-24 pt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Ranking</h2>
      
      {/* Scope Toggles */}
      <div className="flex p-1 bg-gray-200 rounded-xl mb-6">
        {Object.values(LeaderboardScope).map((s) => (
          <button
            key={s}
            onClick={() => setScope(s)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              scope === s 
              ? 'bg-white text-primary-700 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {s === 'GLOBAL' ? 'Brasil' : s === 'STATE' ? 'Estado' : 'Cidade'}
          </button>
        ))}
      </div>

      <Podium top3={top3} />

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {rest.map((user, index) => (
          <div key={user.id} className="flex items-center p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
            <span className="w-8 text-gray-400 font-bold text-sm">{index + 4}</span>
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-sm">{user.name}</h4>
              <p className="text-xs text-gray-500">{user.city}, {user.state}</p>
            </div>
            <div className="text-right">
              <span className="block font-bold text-primary-600">{user.score}</span>
              <span className="text-xs text-gray-400">XP</span>
            </div>
          </div>
        ))}
        {/* Current User Fixed at Bottom if not in list (Demo Logic) */}
        <div className="bg-primary-50 p-4 border-t border-primary-100 flex items-center">
            <span className="w-8 text-primary-600 font-bold text-sm">154</span>
            <img src={MOCK_USERS.find(u => u.id === 'you')?.avatar} alt="You" className="w-10 h-10 rounded-full mr-3 border-2 border-primary-200" />
            <div className="flex-1">
              <h4 className="font-bold text-primary-900 text-sm">Você</h4>
              <p className="text-xs text-primary-500">São Paulo, SP</p>
            </div>
            <div className="text-right">
              <span className="block font-bold text-primary-700">9800</span>
              <span className="text-xs text-primary-400">XP</span>
            </div>
        </div>
      </div>
    </div>
  );
};