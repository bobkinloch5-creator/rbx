import { useBuilderStore } from '../../hooks/useBuilderStore';
import { Settings2, Box, Lock, Move, Palette } from 'lucide-react';

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
      <div className="h-full flex flex-col bg-slate-900/95 select-none">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 text-slate-500">
            <Settings2 className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-300">No Object Selected</p>
          <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
            Click any part in the 3D Viewport or Explorer to inspect its properties.
          </p>
        </div>
      </div>
    );
  }

  const properties = selectedInstance.Properties || {};

  return (
    <div className="h-full flex flex-col bg-slate-900/95 select-none overflow-hidden">
      {/* Object Badge Banner */}
      <div className="p-3 border-b border-white/10 bg-slate-950/60 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-roblox-red/20 border border-roblox-red/30 flex items-center justify-center text-roblox-red">
          <Box className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-sm text-white truncate">{selectedInstance.Name}</div>
          <div className="text-[10px] text-cyan-400 font-mono">{selectedInstance.ClassName}</div>
        </div>
      </div>

      {/* Properties Table */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin text-xs">
        {/* Appearance Group */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Palette className="w-3.5 h-3.5 text-roblox-red" />
            <span>Appearance</span>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-2.5 border border-white/5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Color</span>
              <input
                type="color"
                value={properties.Color || '#e74c3c'}
                onChange={(e) => handlePropertyChange('Color', e.target.value)}
                className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border border-white/20"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-300">Transparency</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={properties.Transparency ?? 0}
                onChange={(e) => handlePropertyChange('Transparency', parseFloat(e.target.value))}
                className="w-24 accent-roblox-red cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-300">Material</span>
              <select
                value={properties.Material || 'Plastic'}
                onChange={(e) => handlePropertyChange('Material', e.target.value)}
                className="bg-slate-800 border border-white/10 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-roblox-red"
              >
                <option value="Plastic">Plastic</option>
                <option value="SmoothPlastic">SmoothPlastic</option>
                <option value="Neon">Neon</option>
                <option value="Wood">Wood</option>
                <option value="Metal">Metal</option>
                <option value="Glass">Glass</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transform Group */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Move className="w-3.5 h-3.5 text-cyan-400" />
            <span>Transform</span>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-2.5 border border-white/5 space-y-2.5">
            <div>
              <div className="text-[10px] text-slate-400 mb-1">Position (X, Y, Z)</div>
              <div className="grid grid-cols-3 gap-1.5">
                {['X', 'Y', 'Z'].map((axis) => (
                  <div key={axis} className="flex items-center bg-slate-800 rounded-lg px-2 py-1 border border-white/5">
                    <span className="text-slate-500 font-mono text-[10px] mr-1">{axis}:</span>
                    <input
                      type="number"
                      value={properties.Position?.[axis] ?? 0}
                      onChange={(e) => {
                        const newPos = { ...properties.Position, [axis]: parseFloat(e.target.value) || 0 };
                        handlePropertyChange('Position', newPos);
                      }}
                      className="w-full bg-transparent text-white focus:outline-none font-mono text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 mb-1">Size (X, Y, Z)</div>
              <div className="grid grid-cols-3 gap-1.5">
                {['X', 'Y', 'Z'].map((axis) => (
                  <div key={axis} className="flex items-center bg-slate-800 rounded-lg px-2 py-1 border border-white/5">
                    <span className="text-slate-500 font-mono text-[10px] mr-1">{axis}:</span>
                    <input
                      type="number"
                      value={properties.Size?.[axis] ?? 1}
                      onChange={(e) => {
                        const newSize = { ...properties.Size, [axis]: parseFloat(e.target.value) || 1 };
                        handlePropertyChange('Size', newSize);
                      }}
                      className="w-full bg-transparent text-white focus:outline-none font-mono text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Physics & Behavior */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Physics & Collision</span>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-2.5 border border-white/5 space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">Anchored</span>
              <input
                type="checkbox"
                checked={properties.Anchored ?? true}
                onChange={(e) => handlePropertyChange('Anchored', e.target.checked)}
                className="w-4 h-4 rounded accent-roblox-red cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">CanCollide</span>
              <input
                type="checkbox"
                checked={properties.CanCollide ?? true}
                onChange={(e) => handlePropertyChange('CanCollide', e.target.checked)}
                className="w-4 h-4 rounded accent-roblox-red cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
