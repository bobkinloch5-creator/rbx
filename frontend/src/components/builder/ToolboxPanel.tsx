import { useState, useEffect } from 'react';
import { assetsService } from '../../lib/api';
import { useBuilderStore } from '../../hooks/useBuilderStore';
import { Search, Package, Loader2, Download } from 'lucide-react';
import { debounce } from '../../lib/utils';

export default function ToolboxPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [assets, setAssets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Model');
  const [isLoading, setIsLoading] = useState(false);
  const { sendCommand } = useBuilderStore();

  useEffect(() => {
    loadCategories();
    loadFeaturedAssets();
  }, []);

  const loadCategories = async () => {
    try {
      const { categories } = await assetsService.getCategories();
      setCategories(categories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadFeaturedAssets = async () => {
    setIsLoading(true);
    try {
      const { assets } = await assetsService.getFeatured('Model', 20);
      setAssets(assets);
    } catch (error) {
      console.error('Failed to load featured assets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = debounce(async (query: string) => {
    if (!query.trim()) {
      loadFeaturedAssets();
      return;
    }

    setIsLoading(true);
    try {
      const { assets } = await assetsService.search(query, selectedCategory, 20);
      setAssets(assets);
    } catch (error) {
      console.error('Failed to search assets:', error);
    } finally {
      setIsLoading(false);
    }
  }, 500);

  const handleInsertAsset = (assetId: number, assetName: string) => {
    sendCommand({
      type: 'insertAsset',
      data: { assetId, name: assetName }
    });
  };

  return (
    <div className="h-full flex flex-col bg-roblox-dark">
      <div className="panel-header flex items-center space-x-2">
        <Package className="w-4 h-4" />
        <span>Toolbox</span>
      </div>

      <div className="p-2 space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-roblox-light" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            placeholder="Search assets..."
            className="w-full bg-roblox-gray border border-roblox-gray rounded pl-10 pr-3 py-2 text-sm text-white placeholder-roblox-light focus:outline-none focus:border-roblox-red"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                if (searchQuery) handleSearch(searchQuery);
              }}
              className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-roblox-red text-white'
                  : 'bg-roblox-gray text-roblox-light hover:bg-roblox-gray/80'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-roblox-light" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="bg-roblox-gray rounded overflow-hidden hover:ring-2 hover:ring-roblox-red cursor-pointer group"
                onClick={() => handleInsertAsset(asset.id, asset.name)}
              >
                <div className="aspect-square bg-roblox-dark flex items-center justify-center relative">
                  {asset.thumbnailUrl ? (
                    <img
                      src={asset.thumbnailUrl}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-roblox-light" />
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs truncate" title={asset.name}>
                    {asset.name}
                  </p>
                  <p className="text-xs text-roblox-light truncate">
                    {asset.creator}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
