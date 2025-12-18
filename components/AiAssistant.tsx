
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const askAi = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResponse('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: {
          systemInstruction: 'Jesteś pomocnym asystentem na osobistym pulpicie Moni. Odpowiadaj krótko, uprzejmie i merytorycznie po polsku.',
        },
      });
      setResponse(res.text || 'Nie udało się wygenerować odpowiedzi.');
    } catch (error) {
      console.error('AI Error:', error);
      setResponse('Wystąpił błąd podczas rozmowy z AI. Upewnij się, że klucz API jest poprawny.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {isOpen ? (
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 w-80 sm:w-96 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="p-6 bg-indigo-500 text-white flex justify-between items-center">
            <h3 className="font-black text-[10px] uppercase tracking-widest">Monia AI Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div className="p-6 flex-1 flex flex-col gap-4 min-h-[300px] max-h-[400px] overflow-y-auto">
            {response ? (
              <div className="bg-slate-50 p-4 rounded-2xl text-[11px] font-medium text-slate-700 leading-relaxed border border-slate-100 animate-in fade-in slide-in-from-left-2">
                {response}
              </div>
            ) : (
              <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest text-center mt-20">Zadaj pytanie Monia...</p>
            )}
            {isLoading && (
              <div className="flex gap-1.5 p-2">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75" />
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150" />
              </div>
            )}
          </div>

          <div className="p-6 border-t border-slate-50">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && askAi()}
                placeholder="Napisz do mnie..."
                className="flex-1 bg-slate-50 border-none px-4 py-3 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all shadow-inner"
              />
              <button 
                onClick={askAi}
                disabled={isLoading}
                className="bg-indigo-500 text-white p-3 rounded-xl hover:bg-indigo-600 transition-all disabled:opacity-50 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-200 hover:scale-110 transition-all active:scale-95 hover:bg-indigo-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </button>
      )}
    </div>
  );
};

export default AiAssistant;
