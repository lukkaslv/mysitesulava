import React, { useState, useRef, useEffect } from 'react';
import { generateTherapyResponse } from '../services/geminiService';
import { Message, Language } from '../types';
import { Terminal as TerminalIcon, Loader2 } from 'lucide-react';

interface ChatInterfaceProps {
  lang: Language;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ lang }) => {
  const translations = {
    ru: {
      init: 'СОЕДИНЕНИЕ_УСТАНОВЛЕНО. УЗЕЛ_ЛУКА_СУЛАВА_АКТИВЕН. ГОТОВ_К_НАВИГАЦИИ_ПО_ТЕРНИЯМ. ЧТО_ВЫ_ЧУВСТВУЕТЕ?',
      header: 'БЛОК_РЕФЛЕКСИИ_ЛУКИ',
      status: 'СТАТУС: СЛУШАЮ',
      input: 'Введите сообщение...',
      btn: 'ОТПРАВИТЬ',
      processing: 'ОБРАБОТКА...',
      userInput: 'ВВОД_ПОЛЬЗОВАТЕЛЯ',
      lukaSys: 'СИС_ЛУКА'
    },
    ka: {
      init: 'კავშირი დამყარებულია. ლუკა სულავას კვანძი აქტიურია. მზად ვარ ეკლებში ნავიგაციისთვის. რას გრძნობთ?',
      header: 'ლუკას_რეფლექსიის_ბლოკი',
      status: 'სტატუსი: გისმენთ',
      input: 'შეიყვანეთ შეტყობინება...',
      btn: 'გაგზავნა',
      processing: 'მუშავდება...',
      userInput: 'მომხმარებელი',
      lukaSys: 'ლუკა_სის'
    }
  };

  const t = translations[lang];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'model',
      text: t.init,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{
      id: 'init-' + lang,
      role: 'model',
      text: t.init,
      timestamp: new Date()
    }]);
  }, [lang]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const responseText = await generateTherapyResponse(history, userMsg.text, lang);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto font-mono">
      <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <div className="bg-black p-4 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <TerminalIcon size={18} />
            <span className="uppercase font-black tracking-[0.2em] text-xs md:text-sm">{t.header}</span>
          </div>
          <div className="text-[10px] text-zinc-500 font-black tracking-widest uppercase">{t.status}</div>
        </div>

        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="h-[450px] md:h-[550px] overflow-y-auto p-6 md:p-10 space-y-8 font-mono scrollbar-hide bg-white"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-[85%] md:max-w-[75%] p-5 border-2 ${
                msg.role === 'user' 
                  ? 'border-black text-white bg-black rounded-tl-2xl rounded-br-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]' 
                  : 'border-black text-black bg-white rounded-tr-2xl rounded-bl-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)]'
              }`}>
                <span className={`text-[10px] uppercase block mb-2 font-black tracking-widest ${msg.role === 'user' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  {msg.role === 'user' ? t.userInput : t.lukaSys}
                </span>
                <p className="whitespace-pre-wrap leading-relaxed font-bold text-sm md:text-base">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start">
              <div className="p-4 border-2 border-black bg-zinc-50 text-black animate-pulse flex items-center gap-3">
                <Loader2 className="animate-spin" size={20} />
                <span className="text-xs uppercase font-black tracking-widest">{t.processing}</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="border-t-4 border-black p-4 bg-zinc-50 flex gap-4">
          <span className="text-black py-3 pl-2 font-black text-xl">{'>'}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.input}
            className="flex-1 bg-transparent border-none outline-none text-black placeholder-zinc-400 font-mono text-base md:text-lg py-3 font-bold"
            autoComplete="off"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-black text-white hover:bg-zinc-800 transition-all uppercase text-xs font-black tracking-[0.2em] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none"
          >
            {t.btn}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
