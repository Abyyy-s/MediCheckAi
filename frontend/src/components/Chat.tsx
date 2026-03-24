import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RiskBadge from './RiskBadge';
import TypingIndicator from './TypingIndicator';
import { cn } from './RiskBadge';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  riskBadge?: {
    level: 'low' | 'medium' | 'high';
    reasons: string[];
  };
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello. I am MediCheck AI. Please concisely describe your symptoms and any medications you are taking.',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Call Flask Backend
    fetch('http://127.0.0.1:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage.text })
    })
      .then(res => res.json())
      .then((data: Message) => {
        setMessages(prev => [...prev, data]);
      })
      .catch(err => {
        console.error('API Error:', err);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'bot',
          text: 'Sorry, I am currently unable to reach the MediCheck servers. Please try again later.',
          timestamp: new Date().toISOString()
        }]);
      })
      .finally(() => {
        setIsTyping(false);
      });
  };

  return (
    <div className="flex-1 flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={cn(
                'flex gap-3 max-w-[85%]',
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1',
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-br from-indigo-500 to-blue-600 shadow-md' 
                    : 'bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600 dark:border-slate-700'
                )}
              >
                {msg.sender === 'user' 
                  ? <User className="w-4 h-4 text-white" /> 
                  : <Bot className="w-4 h-4 text-emerald-400" />
                }
              </div>

              <div className="flex flex-col gap-1 min-w-0">
                <div
                  className={cn(
                    'px-4 py-3 rounded-2xl shadow-sm relative',
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-sm'
                  )}
                >
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap word-break">{msg.text}</p>
                </div>
                
                {msg.riskBadge && (
                  <RiskBadge level={msg.riskBadge.level} reasons={msg.riskBadge.reasons} />
                )}
                
                <span className={cn(
                  'text-[10px] text-slate-400 mt-0.5',
                  msg.sender === 'user' ? 'text-right pr-1' : 'text-left pl-1'
                )}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex gap-3 mr-auto object-contain"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 sm:p-6 bg-white/50 dark:bg-[#0b1120]/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 rounded-br-3xl">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-3 max-w-4xl mx-auto relative group"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your symptoms or medications..."
            className="flex-1 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 text-slate-800 dark:text-slate-100 rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center overflow-hidden group-hover:shadow-blue-500/25"
          >
            <Send className="w-5 h-5 -ml-0.5 mt-0.5" />
          </button>
        </form>
        <div className="text-center mt-3 text-[10px] text-slate-400 flex justify-center items-center gap-1.5">
          <AlertTriangle className="w-3 h-3 text-amber-500" />
          MediCheck AI can make mistakes. Consider consulting a healthcare professional.
        </div>
      </div>
    </div>
  );
}
