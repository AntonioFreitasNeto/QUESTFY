
import React, { useState, useRef } from 'react';
import { correctEssay } from '../services/geminiService';
import { Button } from './Button';

interface EssayCorrectionViewProps {
  credits: number;
  onBuyCredits: () => void;
  onBack: () => void;
  onConsumeCredit: () => void;
}

export const EssayCorrectionView: React.FC<EssayCorrectionViewProps> = ({ credits, onBuyCredits, onBack, onConsumeCredit }) => {
  const [image, setImage] = useState<string | null>(null);
  const [theme, setTheme] = useState('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCorrection = async () => {
    if (credits <= 0) {
        onBuyCredits();
        return;
    }
    if (!image || !theme) {
        alert("Por favor, adicione uma foto e o tema.");
        return;
    }

    setLoading(true);
    onConsumeCredit(); // Optimistic update
    
    const feedback = await correctEssay(image, theme);
    setResult(feedback);
    setLoading(false);
  };

  if (result) {
      return (
        <div className="min-h-screen bg-white p-4 pb-24 overflow-y-auto">
             <div className="flex items-center mb-6">
                <button onClick={() => setResult('')} className="mr-4 text-gray-500">
                    ← Voltar
                </button>
                <h2 className="font-bold text-xl">Resultado da Correção</h2>
             </div>
             <div className="bg-gray-50 p-6 rounded-2xl prose prose-sm max-w-none border border-gray-200">
                <div className="whitespace-pre-line text-gray-800">
                    {result}
                </div>
             </div>
             <Button fullWidth className="mt-6" onClick={() => {
                 setResult('');
                 setImage(null);
                 setTheme('');
             }}>
                 Enviar Outra
             </Button>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24 flex flex-col">
        <div className="flex items-center justify-between mb-6">
            <button onClick={onBack} className="text-gray-500 p-2 rounded-full hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                <span className="text-lg">💰</span>
                <span className="font-bold text-gray-800">{credits} créditos</span>
                <button onClick={onBuyCredits} className="bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ml-1 hover:bg-green-600">+</button>
            </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm flex-1 flex flex-col">
            <h1 className="text-2xl font-black text-gray-900 mb-1">Correção IA</h1>
            <p className="text-gray-500 text-sm mb-6">Tire uma foto legível da sua redação manuscrita.</p>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500 mb-6"></div>
                    <p className="font-bold text-teal-800 text-lg">A IA está lendo sua letra...</p>
                    <p className="text-gray-400 text-sm mt-2">Analisando competências 1 a 5</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">1. Tema da Redação</label>
                        <input 
                            type="text" 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-teal-500 outline-none"
                            placeholder="Ex: Desafios para a valorização de comunidades..."
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">2. Foto da Redação</label>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${image ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:bg-gray-50'}`}
                        >
                            {image ? (
                                <div className="relative w-full h-48">
                                    <img src={image} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white font-bold opacity-0 hover:opacity-100 transition-opacity rounded-lg">Trocar Foto</div>
                                </div>
                            ) : (
                                <>
                                    <span className="text-4xl mb-2">📸</span>
                                    <span className="text-sm font-bold text-gray-500">Toque para tirar foto</span>
                                </>
                            )}
                            <input 
                                ref={fileInputRef} 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleFileChange} 
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>

        {!loading && (
            <div className="mt-4">
                <Button 
                    fullWidth 
                    onClick={handleCorrection}
                    variant={credits > 0 ? 'primary' : 'secondary'}
                    className={credits > 0 ? 'bg-gradient-to-r from-teal-500 to-emerald-600' : ''}
                >
                    {credits > 0 ? 'Enviar para Correção (-1 Crédito)' : 'Comprar Créditos para Enviar'}
                </Button>
            </div>
        )}
    </div>
  );
};
