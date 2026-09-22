import { useState, useRef, useEffect } from 'react';
import { useBuilderStore } from '../../hooks/useBuilderStore';
import { 
  Send, 
  Loader2, 
  Sparkles, 
  Lightbulb, 
  Copy, 
  Check, 
  Gamepad2, 
  Coins, 
  Sword,
  Wand2
} from 'lucide-react';
import { formatTimestamp } from '../../lib/utils';
import mascotImg from '../../assets/images/mascot.png';

export default function ChatPanel() {
  const [input, setInput] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isAIThinking, sendAIMessage } = useBuilderStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAIThinking]);

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

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const promptCategories = [
    {
      category: 'Obby & Parkour',
      icon: <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />,
      prompts: [
        'Create a 10-stage rainbow parkour obby with cloud checkpoints',
        'Add a spinning laser obstacle that respawns players on touch'
      ]
    },
    {
      category: 'Economy & RPG',
      icon: <Coins className="w-3.5 h-3.5 text-amber-400" />,
      prompts: [
        'Add coin pickups that save to leaderstats with sound effects',
        'Create an interactive pet shop with 3 buyable pet models'
      ]
    },
    {
      category: 'Combat & Action',
      icon: <Sword className="w-3.5 h-3.5 text-roblox-red" />,
      prompts: [
        'Insert a sword fighting arena with weapon spawn pads',
        'Build a team deathmatch zone with red vs blue bases'
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col bg-slate-900/95 select-none overflow-hidden">
      {/* Panel Header */}
      <div className="h-10 bg-slate-950/60 border-b border-white/10 flex items-center justify-between px-3">
        <div className="flex items-center space-x-2">
          <img 
            src={mascotImg} 
            alt="Bolt AI" 
            className="w-5 h-5 rounded-full object-cover border border-cyan-400"
          />
          <span className="font-bold text-white text-xs">Bolt AI Co-Builder</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ready</span>
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5 scrollbar-thin">
        {messages.length === 0 && (
          <div className="py-3 px-1 space-y-4">
            {/* Friendly Greeting Card */}
            <div className="bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl p-4 border border-white/10 text-center shadow-lg relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="relative inline-block mb-2.5">
                <img 
                  src={mascotImg} 
                  alt="Bolt" 
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20 shadow-lg mx-auto"
                />
                <span className="absolute -bottom-1 -right-1 bg-roblox-red rounded-full p-0.5 text-white">
                  <Sparkles className="w-3 h-3" />
                </span>
              </div>
              
              <h3 className="text-sm font-bold text-white mb-1">
                Hi! I'm Bolt, your Roblox Game Builder.
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                Tell me what you want to create, and I will build 3D parts, generate Luau scripts, and sync them with your studio!
              </p>
            </div>

            {/* Prompt Categories */}
            <div className="space-y-3">
              <div className="flex items-center space-x-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <Lightbulb className="w-3 h-3 text-amber-400" />
                <span>Instant Build Ideas</span>
              </div>

              {promptCategories.map((cat, i) => (
                <div key={i} className="bg-slate-950/60 rounded-xl p-2.5 border border-white/5 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-300">
                    {cat.icon}
                    <span>{cat.category}</span>
                  </div>
                  <div className="space-y-1">
                    {cat.prompts.map((p, j) => (
                      <button
                        key={j}
                        onClick={() => handleQuickPrompt(p)}
                        className="w-full text-left text-[11px] bg-white/5 hover:bg-white/10 hover:text-white text-slate-300 p-2 rounded-lg transition-colors border border-white/5 flex items-center justify-between group"
                      >
                        <span className="truncate pr-2">• {p}</span>
                        <Wand2 className="w-3 h-3 text-slate-500 group-hover:text-amber-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
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
              className={`max-w-[85%] rounded-2xl p-3 shadow-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-roblox-red via-red-600 to-orange-600 text-white font-medium'
                  : 'bg-slate-950/90 border border-white/10 text-slate-100'
              }`}
            >
              <div className="text-xs whitespace-pre-wrap break-words leading-relaxed">{msg.content}</div>
              <div className="text-[9px] opacity-60 mt-1.5 flex items-center justify-between">
                <span>{formatTimestamp(msg.timestamp)}</span>
                {msg.role !== 'user' && (
                  <button
                    onClick={() => handleCopyCode(msg.content, idx)}
                    title="Copy message content"
                    className="hover:text-white transition-colors"
                  >
                    {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
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
            <div className="bg-slate-950/90 rounded-xl p-3 flex items-center space-x-2 border border-white/10">
              <Loader2 className="w-4 h-4 animate-spin text-roblox-red" />
              <span className="text-xs text-slate-300">Bolt is generating 3D models & Luau code...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-slate-950">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell Bolt what to build (e.g. 'Add a checkpoint system')..."
            className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-roblox-red transition-all shadow-inner"
            disabled={isAIThinking}
          />
          <button
            type="submit"
            disabled={!input.trim() || isAIThinking}
            className="bg-gradient-to-r from-roblox-red via-red-500 to-orange-500 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-white px-4 rounded-xl transition-all shadow-lg shadow-roblox-red/30 flex items-center justify-center flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
