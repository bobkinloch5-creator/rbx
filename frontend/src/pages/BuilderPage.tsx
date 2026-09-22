import { useEffect, useState, useRef, useCallback } from 'react';
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
import logoImg from '../assets/images/logo.png';
import mascotImg from '../assets/images/mascot.png';
import {
  Home,
  Link2,
  Link2Off,
  FolderTree,
  Package,
  Settings2,
  Bot,
  Box,
  FileCode,
  Columns,
  Terminal,
  Copy,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen
} from 'lucide-react';

// Drag-resize hook
function usePanelResize(
  initialWidth: number,
  minWidth: number,
  maxWidth: number,
  side: 'left' | 'right'
) {
  const [width, setWidth] = useState(initialWidth);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(initialWidth);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = side === 'left'
        ? ev.clientX - startX.current
        : startX.current - ev.clientX;
      const newWidth = Math.min(maxWidth, Math.max(minWidth, startWidth.current + delta));
      setWidth(newWidth);
    };

    const onMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [width, minWidth, maxWidth, side]);

  return { width, onMouseDown };
}

export default function BuilderPage() {
  const navigate = useNavigate();
  const [activeLeftTab, setActiveLeftTab] = useState<'explorer' | 'toolbox'>('explorer');
  const [activeRightTab, setActiveRightTab] = useState<'chat' | 'properties'>('chat');
  const [centerViewMode, setCenterViewMode] = useState<'split' | 'preview' | 'script'>('split');
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [showTestConsole, setShowTestConsole] = useState(false);
  const [copiedSession, setCopiedSession] = useState(false);
  const [mobileTab, setMobileTab] = useState<'chat' | 'preview' | 'script' | 'explorer' | 'toolbox'>('chat');

  // Resizable panels
  const leftPanel = usePanelResize(288, 180, 520, 'left');
  const rightPanel = usePanelResize(360, 260, 600, 'right');

  const {
    sessionId,
    isPluginConnected,
    selectedInstance,
    projectStructure,
    setSessionId,
    setPluginConnected,
    setProjectStructure,
    addTestResult
  } = useBuilderStore();

  useEffect(() => {
    const storedSessionId = localStorage.getItem('roblox-ai-builder-session');
    const newSessionId = storedSessionId || generateSessionId();

    if (!storedSessionId) {
      localStorage.setItem('roblox-ai-builder-session', newSessionId);
    }

    setSessionId(newSessionId);
    wsService.connect(newSessionId, false);

    wsService.on('web:connected', (data: any) => {
      setPluginConnected(data.pluginConnected);
    });

    wsService.on('plugin:connected', () => {
      setPluginConnected(true);
    });

    wsService.on('project:updated', (structure: any) => {
      setProjectStructure(structure);
    });

    wsService.on('web:test-result', (result: any) => {
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

  useEffect(() => {
    if (selectedInstance) {
      setActiveRightTab('properties');
    }
  }, [selectedInstance]);

  const handleCopySession = () => {
    if (!sessionId) return;
    navigator.clipboard.writeText(sessionId);
    setCopiedSession(true);
    setTimeout(() => setCopiedSession(false), 2000);
  };

  const instanceCount = projectStructure?.instances?.length || 0;

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 font-sans select-none overflow-hidden">
      {/* Top Navigation Bar */}
      <nav className="h-14 bg-slate-900 border-b border-white/10 flex items-center justify-between px-3 md:px-5 z-20 flex-shrink-0">
        {/* Left Branding & Session */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/')}
            title="Return to Home"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-200 border border-white/5"
          >
            <Home className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2.5">
            <img
              src={logoImg}
              alt="BlockForge Logo"
              className="w-7 h-7 rounded-lg object-cover shadow-md shadow-roblox-red/20 border border-white/10"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-black tracking-tight leading-none text-white">BlockForge</span>
              <span className="text-[10px] text-slate-400 font-medium">Studio IDE</span>
            </div>
          </div>

          {sessionId && (
            <button
              onClick={handleCopySession}
              title="Click to copy Session ID into your Roblox Studio plugin"
              className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-white/10 text-xs text-slate-300 transition-colors group"
            >
              <span className="text-[11px] text-slate-400">Session:</span>
              <code className="font-mono text-cyan-300 font-semibold">{sessionId.slice(0, 8)}...</code>
              {copiedSession ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
              )}
            </button>
          )}
        </div>

        {/* Center View Mode Switcher */}
        <div className="hidden md:flex items-center bg-slate-950/80 p-1 rounded-xl border border-white/10 space-x-1 shadow-inner">
          <button
            onClick={() => setCenterViewMode('preview')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              centerViewMode === 'preview'
                ? 'bg-gradient-to-r from-roblox-red to-red-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D View</span>
          </button>

          <button
            onClick={() => setCenterViewMode('split')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              centerViewMode === 'split'
                ? 'bg-gradient-to-r from-roblox-red to-red-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split View</span>
          </button>

          <button
            onClick={() => setCenterViewMode('script')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              centerViewMode === 'script'
                ? 'bg-gradient-to-r from-roblox-red to-red-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Script Editor</span>
          </button>
        </div>

        {/* Right Actions & Status */}
        <div className="flex items-center space-x-2.5">
          <div
            title={isPluginConnected ? 'Roblox Studio plugin is connected' : 'Waiting for Roblox Studio plugin'}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isPluginConnected
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            }`}
          >
            {isPluginConnected ? (
              <>
                <Link2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">Studio Connected</span>
              </>
            ) : (
              <>
                <Link2Off className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Waiting for Plugin</span>
              </>
            )}
          </div>

          <button
            onClick={() => setShowTestConsole(!showTestConsole)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showTestConsole
                ? 'bg-roblox-red text-white border-roblox-red'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Console</span>
          </button>

          <div className="hidden lg:flex items-center space-x-1 border-l border-white/10 pl-2">
            <button
              onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
              title={isLeftCollapsed ? 'Open Explorer/Toolbox' : 'Collapse Explorer/Toolbox'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {isLeftCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsRightCollapsed(!isRightCollapsed)}
              title={isRightCollapsed ? 'Open Bolt AI/Properties' : 'Collapse Bolt AI/Properties'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {isRightCollapsed ? <PanelRightOpen className="w-4 h-4" /> : <PanelRightClose className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* LEFT SIDEBAR — resizable */}
        {!isLeftCollapsed && (
          <aside
            className="flex flex-col bg-slate-900/95 border-r border-white/10 flex-shrink-0 z-10 hidden lg:flex relative"
            style={{ width: leftPanel.width }}
          >
            {/* Tab Header */}
            <div className="flex border-b border-white/10 p-1.5 bg-slate-950/60 gap-1">
              <button
                onClick={() => setActiveLeftTab('explorer')}
                className={`flex-1 flex items-center justify-center space-x-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeLeftTab === 'explorer'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <FolderTree className="w-3.5 h-3.5 text-cyan-400" />
                <span>Explorer</span>
                {instanceCount > 0 && (
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 rounded-full font-mono">
                    {instanceCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveLeftTab('toolbox')}
                className={`flex-1 flex items-center justify-center space-x-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeLeftTab === 'toolbox'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Package className="w-3.5 h-3.5 text-amber-400" />
                <span>Toolbox</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-hidden">
              {activeLeftTab === 'explorer' ? <ExplorerPanel /> : <ToolboxPanel />}
            </div>

            {/* Drag Handle — RIGHT edge of left panel */}
            <div
              onMouseDown={leftPanel.onMouseDown}
              className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize z-30 group"
              title="Drag to resize panel"
            >
              <div className="w-full h-full bg-transparent group-hover:bg-roblox-red/40 transition-colors" />
              {/* Visual indicator dots */}
              <div className="absolute top-1/2 -translate-y-1/2 right-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1 h-1 rounded-full bg-roblox-red/80 mx-auto" />
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* CENTER — 3D Viewport & Script Editor */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-950 relative min-w-0">
          {(centerViewMode === 'split' || centerViewMode === 'preview') && (
            <div className={`${centerViewMode === 'split' ? 'flex-[1.2]' : 'flex-1'} relative overflow-hidden bg-slate-950`}>
              <PreviewPanel />
            </div>
          )}

          {centerViewMode === 'split' && (
            <div className="h-1 bg-slate-900 border-y border-white/10 flex items-center justify-center">
              <div className="w-8 h-0.5 bg-white/20 rounded-full" />
            </div>
          )}

          {(centerViewMode === 'split' || centerViewMode === 'script') && (
            <div className={`${centerViewMode === 'split' ? 'flex-1' : 'flex-1'} overflow-hidden bg-slate-900/50`}>
              <ScriptEditor />
            </div>
          )}

          {showTestConsole && (
            <div className="absolute bottom-0 left-0 right-0 h-64 border-t border-white/15 bg-slate-900 shadow-2xl z-20 flex flex-col">
              <TestConsole onClose={() => setShowTestConsole(false)} />
            </div>
          )}
        </main>

        {/* RIGHT SIDEBAR — resizable */}
        {!isRightCollapsed && (
          <aside
            className="flex flex-col bg-slate-900/95 border-l border-white/10 flex-shrink-0 z-10 hidden xl:flex relative"
            style={{ width: rightPanel.width }}
          >
            {/* Drag Handle — LEFT edge of right panel */}
            <div
              onMouseDown={rightPanel.onMouseDown}
              className="absolute top-0 left-0 w-1.5 h-full cursor-col-resize z-30 group"
              title="Drag to resize panel"
            >
              <div className="w-full h-full bg-transparent group-hover:bg-roblox-red/40 transition-colors" />
              <div className="absolute top-1/2 -translate-y-1/2 left-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1 h-1 rounded-full bg-roblox-red/80 mx-auto" />
                ))}
              </div>
            </div>

            {/* Tab Header */}
            <div className="flex border-b border-white/10 p-1.5 bg-slate-950/60 gap-1">
              <button
                onClick={() => setActiveRightTab('chat')}
                className={`flex-1 flex items-center justify-center space-x-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeRightTab === 'chat'
                    ? 'bg-gradient-to-r from-roblox-red to-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <img src={mascotImg} alt="Bolt" className="w-4 h-4 rounded-full object-cover" />
                <span>Bolt AI Chat</span>
              </button>

              <button
                onClick={() => setActiveRightTab('properties')}
                className={`flex-1 flex items-center justify-center space-x-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeRightTab === 'properties'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Settings2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Properties</span>
                {selectedInstance && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                )}
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-hidden">
              {activeRightTab === 'chat' ? <ChatPanel /> : <PropertiesPanel />}
            </div>
          </aside>
        )}
      </div>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden h-14 bg-slate-900 border-t border-white/10 flex items-center justify-around px-2 z-30 flex-shrink-0">
        {[
          { tab: 'preview' as const, icon: <Box className="w-4 h-4" />, label: '3D View' },
          { tab: 'chat' as const, icon: <Bot className="w-4 h-4" />, label: 'Bolt AI' },
          { tab: 'script' as const, icon: <FileCode className="w-4 h-4" />, label: 'Script' },
          { tab: 'explorer' as const, icon: <FolderTree className="w-4 h-4" />, label: 'Explorer' },
          { tab: 'toolbox' as const, icon: <Package className="w-4 h-4" />, label: 'Toolbox' },
        ].map(({ tab, icon, label }) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-lg text-[10px] font-semibold ${
              mobileTab === tab ? 'text-roblox-red' : 'text-slate-400'
            }`}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Mobile Overlays */}
      <div className="lg:hidden">
        {mobileTab === 'chat' && (
          <div className="fixed inset-x-0 top-14 bottom-14 z-20 bg-slate-900">
            <ChatPanel />
          </div>
        )}
        {mobileTab === 'explorer' && (
          <div className="fixed inset-x-0 top-14 bottom-14 z-20 bg-slate-900">
            <ExplorerPanel />
          </div>
        )}
        {mobileTab === 'toolbox' && (
          <div className="fixed inset-x-0 top-14 bottom-14 z-20 bg-slate-900">
            <ToolboxPanel />
          </div>
        )}
      </div>
    </div>
  );
}
