import { useState, useRef, useEffect } from 'react';
import { useBuilderStore } from '../../hooks/useBuilderStore';
import { Send, Loader2, Sparkles, Lightbulb } from 'lucide-react';
import { formatTimestamp } from '../../lib/utils';
import mascotImg from '../../assets/images/mascot.png';

export default function ChatPanel() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isAIThinking, sendAIMessage } = useBuilderStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if a prompt was passed from template click
  useEffect(() => {
    const savedPrompt = localStorage.getItem('blockforge-initial-prompt');
    if (savedPrompt) {
      setInput(savedPrompt);
      localStorage.removeItem('blockforge-initial-prompt');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAIThinking) return;

    const message = input.trim();
    setInput('');
    await sendAIMessage(message);
  };

  const handleQuickPrompt = (promptText: string) => {
    if (isAIThinking) return;
    setInput(promptText);
  };

  const quickPrompts = [
    'Create a 10-stage rainbow parkour obby with checkpoints',
    'Add a coin collection system with leaderboard stats',
    'Create an interactive pet shop with 3 buyable pets',
    'Insert a weapon spawn pad and combat arena'
  ];

  return (
    <div className="h-full flex flex-col bg-roblox-dark">
      {/* Panel Header */}
      <div className="panel-header flex items-center justify-between py-2.5 px-3">
        <div className="flex items-center space-x-2">
          <img 
            src={mascotImg} 
            alt="Bolt AI" 
            className="w-5 h-5 rounded-full object-cover border border-cyan-400"
          />
          <span className="font-bold text-white text-sm">Bolt AI Co-Builder</span>
        </div>
        <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
          Online
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.length === 0 && (
          <div className="text-center text-roblox-light py-6 px-2">
            <div className="relative inline-block mb-3">
              <img 
                src={mascotImg} 
                alt="Bolt" 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-xl mx-auto"
              />
              <span className="absolute -bottom-1 -right-1 bg-roblox-red rounded-full p-1 text-white">
                <Sparkles className="w-3 h-3" />
              </span>
            </div>
            
            <h3 className="text-base font-bold text-white mb-1">
              Hi! I'm Bolt, your Roblox Builder.
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mb-4">
              Describe what you want to add or build in Roblox Studio, and I will generate the parts, layout, and Luau code!
            </p>

            {/* Quick Inspiration Chips */}
            <div className="text-left bg-black/20 rounded-xl p-3 border border-white/5 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-amber-400">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Quick Prompt Ideas:</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-left text-xs bg-white/5 hover:bg-white/10 hover:text-white text-slate-300 p-2 rounded-lg transition-colors border border-white/5"
                  >
                    • {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start items-start space-x-2'}`}
          >
            {msg.role !== 'user' && (
              <img 
                src={mascotImg} 
                alt="Bolt" 
                className="w-6 h-6 rounded-full object-cover border border-cyan-400 mt-1 flex-shrink-0"
              />
            )}
            
            <div
              className={`max-w-[82%] rounded-xl p-3 shadow-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-roblox-red to-red-600 text-white'
                  : 'bg-roblox-gray/80 border border-white/5 text-slate-100'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.content}</div>
              <div className="text-[10px] opacity-60 mt-1.5">
                {formatTimestamp(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {isAIThinking && (
          <div className="flex justify-start items-center space-x-2">
            <img 
              src={mascotImg} 
              alt="Bolt Thinking" 
              className="w-6 h-6 rounded-full object-cover border border-cyan-400 flex-shrink-0 animate-pulse"
            />
            <div className="bg-roblox-gray rounded-xl p-3 flex items-center space-x-2 border border-white/5">
              <Loader2 className="w-4 h-4 animate-spin text-roblox-red" />
              <span className="text-xs text-slate-300">Bolt is creating parts & scripts...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-roblox-gray bg-roblox-darker/60">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell Bolt what to build (e.g., 'Add a checkpoint system')..."
            className="flex-1 bg-roblox-gray/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-roblox-red transition-all"
            disabled={isAIThinking}
          />
          <button
            type="submit"
            disabled={!input.trim() || isAIThinking}
            className="bg-gradient-to-r from-roblox-red to-red-600 hover:from-red-600 hover:to-roblox-red disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 rounded-xl transition-all shadow-md flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
