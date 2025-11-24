
import React from 'react';
import { Button } from './Button';

interface EssayCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuy: (amount: number) => void;
}

export const EssayCreditModal: React.FC<EssayCreditModalProps> = ({ isOpen, onClose, onBuy }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative z-10 animate-fade-in-up">
        
        <div className="text-center mb-6">
            <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                📝
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Créditos de Redação</h2>
            <p className="text-gray-500 text-sm">
                A correção detalhada consome recursos avançados de IA. Adquira créditos avulsos.
            </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
            <button 
                onClick={() => onBuy(1)}
                className="p-4 rounded-xl border-2 border-teal-100 hover:border-teal-500 bg-teal-50 transition-all text-center group"
            >
                <span className="block text-2xl font-black text-teal-800">1</span>
                <span className="text-xs text-teal-600 uppercase font-bold">Correção</span>
                <div className="mt-2 bg-white rounded-lg py-1 text-sm font-bold text-gray-800 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                    R$ 4,90
                </div>
            </button>
            
            <button 
                onClick={() => onBuy(5)}
                className="p-4 rounded-xl border-2 border-teal-500 bg-white relative overflow-hidden transition-all text-center shadow-lg transform hover:-translate-y-1"
            >
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">
                    MELHOR VALOR
                </div>
                <span className="block text-2xl font-black text-teal-800">5</span>
                <span className="text-xs text-teal-600 uppercase font-bold">Correções</span>
                <div className="mt-2 bg-teal-600 rounded-lg py-1 text-sm font-bold text-white">
                    R$ 19,90
                </div>
            </button>
        </div>

        <Button fullWidth onClick={onClose} variant="secondary">
            Cancelar
        </Button>
      </div>
    </div>
  );
};
