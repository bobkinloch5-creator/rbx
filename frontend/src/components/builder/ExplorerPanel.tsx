import { useState } from 'react';
import { useBuilderStore } from '../../hooks/useBuilderStore';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FileCode,
  Box,
  Sun,
  Users,
  Search,
  Layers,
  CircleDot,
  Link2Off,
  RefreshCw
} from 'lucide-react';

interface TreeNodeProps {
  instance: any;
  level: number;
  filter: string;
}

function getIcon(className: string) {
  switch (className) {
    case 'Workspace':
      return <Layers className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />;
    case 'Players':
      return <Users className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />;
    case 'Lighting':
      return <Sun className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />;
    case 'SpawnLocation':
      return <CircleDot className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />;
    case 'Script':
    case 'LocalScript':
    case 'ModuleScript':
      return <FileCode className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />;
    case 'Folder':
      return <Folder className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />;
    case 'ReplicatedStorage':
    case 'ServerScriptService':
    case 'StarterGui':
    case 'StarterPack':
    case 'ServerStorage':
      return <Folder className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />;
    default:
      return <Box className="w-3.5 h-3.5 text-roblox-red flex-shrink-0" />;
  }
}

function TreeNode({ instance, level, filter }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const { setSelectedInstance, selectedInstance, setCurrentScript } = useBuilderStore();
  const hasChildren = instance.Children && instance.Children.length > 0;
  const isSelected = selectedInstance?.Name === instance.Name && selectedInstance?.ClassName === instance.ClassName;

  const matchesFilter = !filter || instance.Name.toLowerCase().includes(filter.toLowerCase());
  const hasMatchingChild = hasChildren && instance.Children.some((c: any) =>
    c.Name.toLowerCase().includes(filter.toLowerCase())
  );

  if (!matchesFilter && !hasMatchingChild) return null;

  const handleClick = () => {
    setSelectedInstance(instance);
    if (instance.ClassName === 'Script' || instance.ClassName === 'LocalScript' || instance.ClassName === 'ModuleScript') {
      setCurrentScript({
        name: `${instance.Name}.luau`,
        content: instance.Source || `-- Script: ${instance.Name}\nprint("${instance.Name} loaded")\n`,
        path: instance.path || instance.Name
      });
    }
  };

  return (
    <div>
      <div
        className={`flex items-center space-x-1.5 py-[3px] px-1 hover:bg-white/5 cursor-pointer rounded text-xs transition-colors group ${
          isSelected
            ? 'bg-roblox-red/20 text-white font-semibold border-l-2 border-roblox-red'
            : 'text-slate-300'
        }`}
        style={{ paddingLeft: `${level * 14 + 4}px` }}
        onClick={handleClick}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 hover:bg-white/10 rounded flex-shrink-0"
          >
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
        ) : (
          <span className="w-4 flex-shrink-0" />
        )}

        {getIcon(instance.ClassName)}
        <span className="truncate flex-1">{instance.Name}</span>
        <span className="text-[10px] text-slate-600 ml-auto font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pl-1">
          {instance.ClassName}
        </span>
      </div>

      {isExpanded && hasChildren && (
        <div>
          {instance.Children.map((child: any, idx: number) => (
            <TreeNode key={idx} instance={child} level={level + 1} filter={filter} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExplorerPanel() {
  const { projectStructure, isPluginConnected } = useBuilderStore();
  const [filter, setFilter] = useState('');

  // Only show data if the plugin has sent real structure — never show fake data
  const hasRealData = projectStructure?.instances && projectStructure.instances.length > 0;

  const treeData = hasRealData
    ? [{ Name: 'Workspace', ClassName: 'Workspace', Children: projectStructure!.instances }]
    : [];

  return (
    <div className="h-full flex flex-col bg-slate-900/95 select-none overflow-hidden">
      {/* Search Input */}
      <div className="p-2 border-b border-white/10 bg-slate-950/40">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search hierarchy..."
            className="w-full bg-slate-800/80 border border-white/10 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-roblox-red transition-all"
          />
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-1 scrollbar-thin">
        {hasRealData ? (
          treeData.map((node, idx) => (
            <TreeNode key={idx} instance={node} level={0} filter={filter} />
          ))
        ) : (
          /* Empty state — waiting for plugin to send real data */
          <div className="flex flex-col items-center justify-center h-full py-10 px-4 text-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${isPluginConnected ? 'bg-emerald-500/10' : 'bg-white/5'}`}>
              {isPluginConnected
                ? <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
                : <Link2Off className="w-5 h-5 text-slate-500" />
              }
            </div>
            <p className="text-xs font-semibold text-slate-300 mb-1">
              {isPluginConnected ? 'Syncing workspace...' : 'No Studio Connection'}
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {isPluginConnected
                ? 'Click Sync in the BlockForge plugin panel to load your workspace hierarchy.'
                : 'Open Roblox Studio, install the BlockForge plugin, and click Connect to see your game hierarchy here.'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-white/10 bg-slate-950/40 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center space-x-1.5">
          <span className={`w-2 h-2 rounded-full ${isPluginConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
          <span>{isPluginConnected ? 'Studio Connected' : 'Waiting for Plugin'}</span>
        </span>
        {hasRealData && (
          <span className="font-mono text-slate-500">{projectStructure?.instances?.length} objects</span>
        )}
      </div>
    </div>
  );
}
