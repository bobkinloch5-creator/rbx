import { useState } from 'react';
import { useBuilderStore } from '../../hooks/useBuilderStore';
import { ChevronRight, ChevronDown, Folder, File, Code } from 'lucide-react';

interface TreeNodeProps {
  instance: any;
  level: number;
}

function TreeNode({ instance, level }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const { setSelectedInstance, selectedInstance } = useBuilderStore();
  const hasChildren = instance.Children && instance.Children.length > 0;
  const isSelected = selectedInstance?.Name === instance.Name;

  const getIcon = () => {
    if (hasChildren) return isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />;
    if (instance.ClassName === 'Script' || instance.ClassName === 'LocalScript' || instance.ClassName === 'ModuleScript') {
      return <Code className="w-4 h-4 text-blue-400" />;
    }
    return <File className="w-4 h-4" />;
  };

  return (
    <div>
      <div
        className={`flex items-center space-x-1 py-1 px-2 hover:bg-roblox-gray cursor-pointer ${
          isSelected ? 'bg-roblox-red/30 border-l-2 border-roblox-red' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (hasChildren) setIsExpanded(!isExpanded);
          setSelectedInstance(instance);
        }}
      >
        {getIcon()}
        <span className="text-sm truncate">{instance.Name}</span>
        <span className="text-xs text-roblox-light ml-auto">{instance.ClassName}</span>
      </div>

      {isExpanded && hasChildren && (
        <div>
          {instance.Children.map((child: any, idx: number) => (
            <TreeNode key={idx} instance={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExplorerPanel() {
  const { projectStructure } = useBuilderStore();

  return (
    <div className="h-full flex flex-col bg-roblox-dark">
      <div className="panel-header flex items-center space-x-2">
        <Folder className="w-4 h-4" />
        <span>Explorer</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {projectStructure ? (
          <div className="py-2">
            {projectStructure.instances.map((instance, idx) => (
              <TreeNode key={idx} instance={instance} level={0} />
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-roblox-light text-sm">
            <p>No project loaded</p>
            <p className="mt-2 text-xs">Connect Roblox Studio plugin to see your game structure</p>
          </div>
        )}
      </div>
    </div>
  );
}
