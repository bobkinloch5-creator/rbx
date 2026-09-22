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
  CircleDot
} from 'lucide-react';

const DEFAULT_EXPLORER_TREE = [
  {
    Name: 'Workspace',
    ClassName: 'Workspace',
    Children: [
      {
        Name: 'Baseplate',
        ClassName: 'Part',
        Properties: { Position: { X: 0, Y: -0.5, Z: 0 }, Size: { X: 80, Y: 1, Z: 80 }, Color: '#1e293b', Anchored: true }
      },
      {
        Name: 'SpawnLocation',
        ClassName: 'SpawnLocation',
        Properties: { Position: { X: 0, Y: 0.5, Z: 0 }, Size: { X: 4, Y: 0.4, Z: 4 }, Color: '#10b981', Anchored: true }
      },
      {
        Name: 'ObbyStage_1',
        ClassName: 'Part',
        Properties: { Position: { X: 0, Y: 1.5, Z: -6 }, Size: { X: 3, Y: 0.8, Z: 3 }, Color: '#e74c3c', Anchored: true }
      },
      {
        Name: 'ObbyStage_2',
        ClassName: 'Part',
        Properties: { Position: { X: 4, Y: 2.5, Z: -10 }, Size: { X: 3, Y: 0.8, Z: 3 }, Color: '#f97316', Anchored: true }
      },
      {
        Name: 'WinningPlatform',
        ClassName: 'Part',
        Properties: { Position: { X: -4, Y: 5.0, Z: -20 }, Size: { X: 5, Y: 1, Z: 5 }, Color: '#a855f7', Anchored: true }
      }
    ]
  },
  {
    Name: 'Players',
    ClassName: 'Players',
    Children: []
  },
  {
    Name: 'Lighting',
    ClassName: 'Lighting',
    Children: [
      { Name: 'Atmosphere', ClassName: 'Atmosphere' },
      { Name: 'Bloom', ClassName: 'BloomEffect' },
      { Name: 'Sky', ClassName: 'Sky' }
    ]
  },
  {
    Name: 'ReplicatedStorage',
    ClassName: 'ReplicatedStorage',
    Children: [
      { Name: 'ShopItems', ClassName: 'Folder' },
      { Name: 'RemoteEvents', ClassName: 'Folder' }
    ]
  },
  {
    Name: 'ServerScriptService',
    ClassName: 'ServerScriptService',
    Children: [
      { Name: 'GameManager', ClassName: 'Script' },
      { Name: 'CheckpointService', ClassName: 'Script' }
    ]
  },
  {
    Name: 'StarterGui',
    ClassName: 'StarterGui',
    Children: [
      { Name: 'HUD', ClassName: 'ScreenGui' },
      { Name: 'CoinCounter', ClassName: 'Frame' }
    ]
  }
];

interface TreeNodeProps {
  instance: any;
  level: number;
  filter: string;
}

function TreeNode({ instance, level, filter }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const { setSelectedInstance, selectedInstance, setCurrentScript } = useBuilderStore();
  const hasChildren = instance.Children && instance.Children.length > 0;
  const isSelected = selectedInstance?.Name === instance.Name;

  // Search filter
  const matchesFilter = !filter || instance.Name.toLowerCase().includes(filter.toLowerCase());
  const hasMatchingChild = hasChildren && instance.Children.some((c: any) => 
    c.Name.toLowerCase().includes(filter.toLowerCase())
  );

  if (!matchesFilter && !hasMatchingChild) {
    return null;
  }

  const getIcon = () => {
    switch (instance.ClassName) {
      case 'Workspace':
        return <Layers className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Players':
        return <Users className="w-3.5 h-3.5 text-amber-400" />;
      case 'Lighting':
        return <Sun className="w-3.5 h-3.5 text-yellow-400" />;
      case 'SpawnLocation':
        return <CircleDot className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Script':
      case 'LocalScript':
        return <FileCode className="w-3.5 h-3.5 text-blue-400" />;
      case 'Folder':
        return <Folder className="w-3.5 h-3.5 text-slate-400" />;
      default:
        return <Box className="w-3.5 h-3.5 text-roblox-red" />;
    }
  };

  const handleClick = () => {
    setSelectedInstance(instance);
    if (instance.ClassName === 'Script') {
      setCurrentScript({
        name: `${instance.Name}.luau`,
        content: `-- Script: ${instance.Name}\nprint("${instance.Name} running")\n`,
        path: `ServerScriptService.${instance.Name}`
      });
    }
  };

  return (
    <div>
      <div
        className={`flex items-center space-x-1.5 py-1 px-2 hover:bg-white/5 cursor-pointer rounded text-xs transition-colors ${
          isSelected ? 'bg-roblox-red/20 text-white font-semibold border-l-2 border-roblox-red' : 'text-slate-300'
        }`}
        style={{ paddingLeft: `${level * 14 + 6}px` }}
        onClick={handleClick}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 hover:bg-white/10 rounded"
          >
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
        ) : (
          <span className="w-4" />
        )}

        {getIcon()}
        <span className="truncate">{instance.Name}</span>
        <span className="text-[10px] text-slate-500 ml-auto font-mono opacity-80">{instance.ClassName}</span>
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

  const treeData = (projectStructure?.instances && projectStructure.instances.length > 0)
    ? [{ Name: 'Workspace', ClassName: 'Workspace', Children: projectStructure.instances }]
    : DEFAULT_EXPLORER_TREE;

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
      <div className="flex-1 overflow-y-auto p-1.5 scrollbar-thin">
        {treeData.map((node, idx) => (
          <TreeNode key={idx} instance={node} level={0} filter={filter} />
        ))}
      </div>

      {/* Explorer Footer Status */}
      <div className="p-2 border-t border-white/10 bg-slate-950/40 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center space-x-1.5">
          <span className={`w-2 h-2 rounded-full ${isPluginConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span>{isPluginConnected ? 'Synced with Studio' : 'Default Baseplate'}</span>
        </span>
      </div>
    </div>
  );
}
