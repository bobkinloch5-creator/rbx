import { useState, useRef, useEffect } from 'react';
import { useBuilderStore } from '../../hooks/useBuilderStore';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { formatTimestamp } from '../../lib/utils';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAIThinking) return;

    const message = input.trim();
    setInput('');
    await sendAIMessage(message);
  };

  return (
    <div className="h-full flex flex-col bg-roblox-dark">
      <div className="panel-header flex items-center space-x-2">
        <Sparkles className="w-4 h-4 text-roblox-red" />
        <span>BlockForge AI</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.length === 0 && (
          <div className="text-center text-roblox-light py-8">
            <Sparkles className="w-12 h-12 text-roblox-red mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">Start Building with BlockForge AI</p>
            <p className="text-sm">
              Describe what you want to build and I'll create it in Roblox Studio
            </p>
            <div className="mt-6 space-y-2 text-xs text-left max-w-md mx-auto">
              <p className="font-semibold">Try asking:</p>
              <div className="space-y-1 text-roblox-light">
                <p>• "Create a parkour obby with 5 levels"</p>
                <p>• "Add a leaderboard system"</p>
                <p>• "Insert a spawn point with teleport pads"</p>
                <p>• "Create a sword fighting system"</p>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-roblox-red text-white'
                  : 'bg-roblox-gray text-white'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap break-words">{msg.content}</div>
              <div className="text-xs opacity-60 mt-1">
                {formatTimestamp(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {isAIThinking && (
          <div className="flex justify-start">
            <div className="bg-roblox-gray rounded-lg p-3 flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-roblox-gray">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to build..."
            className="flex-1 bg-roblox-gray border border-roblox-gray rounded-lg px-4 py-2 text-white placeholder-roblox-light focus:outline-none focus:border-roblox-red"
            disabled={isAIThinking}
          />
          <button
            type="submit"
            disabled={!input.trim() || isAIThinking}
            className="bg-roblox-red hover:bg-roblox-red/90 disabled:bg-roblox-gray disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
