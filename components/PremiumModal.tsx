import React from 'react';
import { Button } from './Button';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  reason?: 'LIMIT_REACHED' | 'REPORT_LOCKED';
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onUpgrade, reason }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative z-10 animate-fade-in-up">
        
        <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-3xl shadow-lg mx-auto mb-4 text-white">
                👑
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Desbloqueie o Master</h2>
            
            {reason === 'LIMIT_REACHED' && (
                <p className="text-red-500 font-bold bg-red-50 py-2 rounded-lg mb-2">
                    Você atingiu o limite de 20 questões grátis.
                </p>
            )}
             {reason === 'REPORT_LOCKED' && (
                <p className="text-blue-500 font-bold bg-blue-50 py-2 rounded-lg mb-2">
                    O Relatório IA é exclusivo para assinantes.
                </p>
            )}

            <p className="text-gray-500 text-sm">
                Garanta sua aprovação no ENEM com ferramentas de elite.
            </p>
        </div>

        <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700">Questões ilimitadas</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700">Relatório de IA Mentor</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700">Ranking Estadual Exclusivo</span>
            </div>
        </div>

        <div className="bg-primary-50 p-4 rounded-xl text-center mb-6 border border-primary-100">
            <span className="block text-gray-500 text-xs line-through">R$ 29,90</span>
            <span className="block text-primary-700 font-black text-3xl">R$ 19,90</span>
            <span className="text-primary-600 text-xs font-bold">/mês</span>
        </div>

        <div className="space-y-3">
            <Button fullWidth onClick={onUpgrade} variant="primary" className="bg-gradient-to-r from-accent-500 to-orange-500 hover:from-accent-600 hover:to-orange-600 text-white shadow-orange-200">
                Assinar Premium Agora
            </Button>
            <Button fullWidth onClick={onClose} variant="secondary">
                Talvez Depois
            </Button>
        </div>
      </div>
    </div>
  );
};