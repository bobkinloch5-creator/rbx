import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wsService } from '../lib/websocket';
import { useBuilderStore } from '../hooks/useBuilderStore';
import { generateSessionId } from '../lib/utils';
import ChatPanel from '../components/builder/ChatPanel';
import PreviewPanel from '../components/builder/PreviewPanel';
import ExplorerPanel from '../components/builder/ExplorerPanel';
import PropertiesPanel from '../components/builder/PropertiesPanel';
import ScriptEditor from '../components/builder/ScriptEditor';
import ToolboxPanel from '../components/builder/ToolboxPanel';
import TestConsole from '../components/builder/TestConsole';
import { 
  Home, 
  Link2, 
  Link2Off,
  Menu,
  X
} from 'lucide-react';

export default function BuilderPage() {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showTestConsole, setShowTestConsole] = useState(false);
  
  const { 
    sessionId, 
    isPluginConnected,
    setSessionId, 
    setPluginConnected,
    setProjectStructure,
    addTestResult
  } = useBuilderStore();

  useEffect(() => {
    // Generate or retrieve session ID
    const storedSessionId = localStorage.getItem('roblox-ai-builder-session');
    const newSessionId = storedSessionId || generateSessionId();
    
    if (!storedSessionId) {
      localStorage.setItem('roblox-ai-builder-session', newSessionId);
    }
    
    setSessionId(newSessionId);

    // Connect to WebSocket
    wsService.connect(newSessionId, false);

    // Setup WebSocket listeners
    wsService.on('web:connected', (data: any) => {
      console.log('Web connected:', data);
      setPluginConnected(data.pluginConnected);
    });

    wsService.on('plugin:connected', () => {
      console.log('Plugin connected');
      setPluginConnected(true);
    });

    wsService.on('project:updated', (structure: any) => {
      console.log('Project updated:', structure);
      setProjectStructure(structure);
    });

    wsService.on('web:test-result', (result: any) => {
      console.log('Test result:', result);
      addTestResult(result);
      setShowTestConsole(true);
    });

    wsService.on('disconnected', () => {
      setPluginConnected(false);
    });

    return () => {
      wsService.disconnect();
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-roblox-darker">
      {/* Top Navigation */}
      <nav className="bg-roblox-dark border-b border-roblox-gray flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 hover:text-roblox-red transition-colors"
          >
            <Home className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2.5">
            <img src="/images/logo.png" alt="BlockForge Logo" className="w-6 h-6 rounded-md object-cover shadow-sm" />
            <span className="text-lg font-bold">BlockForge</span>
          </div>

          {sessionId && (
            <div className="hidden md:flex items-center space-x-2 text-sm bg-roblox-gray px-3 py-1 rounded">
              <span className="text-roblox-light">Session:</span>
              <code className="text-xs">{sessionId.slice(0, 8)}...</code>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Plugin Connection Status */}
          <div className={`flex items-center space-x-2 px-3 py-1 rounded ${
            isPluginConnected 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {isPluginConnected ? (
              <>
                <Link2 className="w-4 h-4" />
                <span className="text-sm hidden md:block">Plugin Connected</span>
              </>
            ) : (
              <>
                <Link2Off className="w-4 h-4" />
                <span className="text-sm hidden md:block">Waiting for Plugin</span>
              </>
            )}
          </div>

          <button
            onClick={() => setShowTestConsole(!showTestConsole)}
            className="btn-secondary text-sm py-2 hidden md:block"
          >
            {showTestConsole ? 'Hide' : 'Show'} Console
          </button>

          <button
            className="md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Explorer & Toolbox */}
        <div className="w-64 flex flex-col border-r border-roblox-gray hidden lg:flex">
          <div className="flex-1 overflow-hidden">
            <ExplorerPanel />
          </div>
          <div className="h-80 border-t border-roblox-gray overflow-hidden">
            <ToolboxPanel />
          </div>
        </div>

        {/* Center - Preview & Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <PreviewPanel />
          </div>
          <div className="h-80 border-t border-roblox-gray overflow-hidden">
            <ScriptEditor />
          </div>
        </div>

        {/* Right Sidebar - Chat & Properties */}
        <div className="w-96 flex flex-col border-l border-roblox-gray hidden xl:flex">
          <div className="flex-1 overflow-hidden">
            <ChatPanel />
          </div>
          <div className="h-64 border-t border-roblox-gray overflow-hidden">
            <PropertiesPanel />
          </div>
        </div>
      </div>

      {/* Test Console Overlay */}
      {showTestConsole && (
        <div className="absolute bottom-0 left-0 right-0 h-64 border-t border-roblox-gray">
          <TestConsole onClose={() => setShowTestConsole(false)} />
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/80 z-50 lg:hidden">
          <div className="bg-roblox-dark h-full w-80 overflow-y-auto">
            <div className="p-4">
              <button
                onClick={() => setShowMobileMenu(false)}
                className="mb-4"
              >
                <X className="w-6 h-6" />
              </button>
              <ExplorerPanel />
              <div className="mt-4">
                <ToolboxPanel />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
