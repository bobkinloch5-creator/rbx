import { useBuilderStore } from '../../hooks/useBuilderStore';
import { Settings } from 'lucide-react';

export default function PropertiesPanel() {
  const { selectedInstance, sendCommand } = useBuilderStore();

  const handlePropertyChange = (key: string, value: any) => {
    if (!selectedInstance) return;

    sendCommand({
      type: 'setProperty',
      target: selectedInstance.Name,
      data: { property: key, value }
    });
  };

  if (!selectedInstance) {
    return (
      <div className="h-full flex flex-col bg-roblox-dark">
        <div className="panel-header flex items-center space-x-2">
          <Settings className="w-4 h-4" />
          <span>Properties</span>
        </div>
        <div className="flex-1 flex items-center justify-center text-roblox-light text-sm">
          <p>Select an object to view properties</p>
        </div>
      </div>
    );
  }

  const properties = selectedInstance.Properties || {};

  return (
    <div className="h-full flex flex-col bg-roblox-dark">
      <div className="panel-header flex items-center space-x-2">
        <Settings className="w-4 h-4" />
        <span>Properties</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-3 border-b border-roblox-gray">
          <div className="text-xs text-roblox-light">Selected Object</div>
          <div className="font-semibold">{selectedInstance.Name}</div>
          <div className="text-xs text-roblox-light">{selectedInstance.ClassName}</div>
        </div>

        <div className="p-2 space-y-2">
          {Object.entries(properties).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <label className="text-xs text-roblox-light">{key}</label>
              {typeof value === 'boolean' ? (
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handlePropertyChange(key, e.target.checked)}
                  className="block"
                />
              ) : typeof value === 'number' ? (
                <input
                  type="number"
                  value={value}
                  onChange={(e) => handlePropertyChange(key, parseFloat(e.target.value))}
                  className="w-full bg-roblox-gray border border-roblox-gray rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-roblox-red"
                />
              ) : typeof value === 'string' ? (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handlePropertyChange(key, e.target.value)}
                  className="w-full bg-roblox-gray border border-roblox-gray rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-roblox-red"
                />
              ) : (
                <div className="text-xs bg-roblox-gray rounded px-2 py-1">
                  {JSON.stringify(value)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
