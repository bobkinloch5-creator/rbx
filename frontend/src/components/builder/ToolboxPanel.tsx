import { useState } from 'react';
import { useBuilderStore } from '../../hooks/useBuilderStore';
import { 
  Search, 
  Download, 
  Sword, 
  Flag, 
  Coins, 
  TreePine, 
  Zap, 
  Car, 
  Shield, 
  Flame,
  Check
} from 'lucide-react';

interface StarterAsset {
  id: number;
  name: string;
  category: string;
  icon: any;
  color: string;
}

const STARTER_ASSETS: StarterAsset[] = [
  { id: 101, name: 'Classic Sword', category: 'Weapons', icon: Sword, color: 'text-rose-400 bg-rose-500/10' },
  { id: 102, name: 'Checkpoint Flag', category: 'Mechanics', icon: Flag, color: 'text-emerald-400 bg-emerald-500/10' },
  { id: 103, name: 'Gold Coin Pickup', category: 'Mechanics', icon: Coins, color: 'text-amber-400 bg-amber-500/10' },
  { id: 104, name: 'Speed Boost Coil', category: 'Weapons', icon: Zap, color: 'text-cyan-400 bg-cyan-500/10' },
  { id: 105, name: 'Low-Poly Pine Tree', category: 'Nature', icon: TreePine, color: 'text-green-400 bg-green-500/10' },
  { id: 106, name: 'Campfire with Light', category: 'Decorations', icon: Flame, color: 'text-orange-400 bg-orange-500/10' },
  { id: 107, name: 'Spawn Forcefield Pad', category: 'Mechanics', icon: Shield, color: 'text-purple-400 bg-purple-500/10' },
  { id: 108, name: 'Sports Buggy Vehicle', category: 'Vehicles', icon: Car, color: 'text-blue-400 bg-blue-500/10' }
];

export default function ToolboxPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [recentlyInserted, setRecentlyInserted] = useState<number | null>(null);
  const { sendCommand } = useBuilderStore();

  const categories = ['All', 'Mechanics', 'Weapons', 'Nature', 'Decorations', 'Vehicles'];

  const filteredStarters = STARTER_ASSETS.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleInsertAsset = (assetId: number, assetName: string) => {
    setRecentlyInserted(assetId);
    setTimeout(() => setRecentlyInserted(null), 1800);

    sendCommand({
      type: 'insertAsset',
      data: { assetId, name: assetName }
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/95 select-none overflow-hidden">
      {/* Search Bar */}
      <div className="p-2.5 border-b border-white/10 bg-slate-950/60 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Roblox assets & models..."
            className="w-full bg-slate-800/80 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-roblox-red transition-all"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex gap-1 overflow-x-auto scrollbar-none py-0.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-roblox-red text-white shadow'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Grid */}
      <div className="flex-1 overflow-y-auto p-2.5 scrollbar-thin">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">
          {selectedCategory === 'All' ? 'Instant Catalog Models' : `${selectedCategory} Assets`}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {filteredStarters.map((asset) => {
            const Icon = asset.icon;
            const isJustAdded = recentlyInserted === asset.id;

            return (
              <div
                key={asset.id}
                onClick={() => handleInsertAsset(asset.id, asset.name)}
                className="bg-slate-950/70 hover:bg-slate-950 border border-white/5 hover:border-white/20 rounded-xl p-3 cursor-pointer transition-all duration-200 hover:scale-[1.02] flex flex-col justify-between group shadow-sm"
              >
                <div className={`w-10 h-10 rounded-xl ${asset.color} flex items-center justify-center mb-2 mx-auto`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="text-center">
                  <div className="text-xs font-bold text-slate-200 truncate group-hover:text-white" title={asset.name}>
                    {asset.name}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{asset.category}</div>
                </div>

                <button className={`mt-2.5 w-full py-1 rounded-lg text-[10px] font-bold flex items-center justify-center space-x-1 transition-all ${
                  isJustAdded 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-white/5 group-hover:bg-roblox-red text-slate-300 group-hover:text-white'
                }`}>
                  {isJustAdded ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Inserted</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3" />
                      <span>Insert</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
