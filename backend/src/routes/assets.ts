import { Router } from 'express';
import axios from 'axios';
import { logger } from '../services/logger.js';

export const assetsRouter = Router();

interface RobloxAsset {
  id: number;
  name: string;
  description: string;
  assetType: string;
  creator: {
    id: number;
    name: string;
    type: string;
  };
  price?: number;
}

function getRobloxHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (process.env.ROBLOX_API_KEY) {
    headers['x-api-key'] = process.env.ROBLOX_API_KEY;
  }
  if (process.env.ROBLOX_COOKIE) {
    headers['Cookie'] = `.ROBLOSECURITY=${process.env.ROBLOX_COOKIE}`;
  }
  return headers;
}

// Search Roblox catalog for assets
assetsRouter.get('/search', async (req, res) => {
  try {
    const { query, category, limit = 30 } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }

    // Use Roblox catalog API
    const searchUrl = `https://catalog.roblox.com/v1/search/items`;
    const params = {
      keyword: query,
      category: category || 'Model',
      limit: Math.min(Number(limit), 100)
    };

    const response = await axios.get(searchUrl, { params, headers: getRobloxHeaders() });
    
    const assets = response.data.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      assetType: item.itemType,
      creator: item.creatorName,
      thumbnailUrl: `https://thumbnails.roblox.com/v1/assets?assetIds=${item.id}&size=420x420&format=Png`,
      price: item.price
    }));

    res.json({ assets, total: response.data.total });
  } catch (error: any) {
    logger.error('Asset search error:', error);
    res.status(500).json({ error: 'Failed to search assets', message: error.message });
  }
});

// Get asset details
assetsRouter.get('/details/:assetId', async (req, res) => {
  try {
    const { assetId } = req.params;

    const detailsUrl = `https://economy.roblox.com/v2/assets/${assetId}/details`;
    const response = await axios.get(detailsUrl, { headers: getRobloxHeaders() });

    const asset = response.data;
    res.json({
      id: asset.AssetId,
      name: asset.Name,
      description: asset.Description,
      assetType: asset.AssetTypeId,
      creator: asset.Creator,
      created: asset.Created,
      updated: asset.Updated,
      price: asset.PriceInRobux,
      sales: asset.Sales,
      thumbnailUrl: `https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&size=420x420&format=Png`
    });
  } catch (error: any) {
    logger.error('Asset details error:', error);
    res.status(500).json({ error: 'Failed to get asset details', message: error.message });
  }
});

// Get popular/featured models
assetsRouter.get('/featured', async (req, res) => {
  try {
    const { category = 'Model', limit = 20 } = req.query;

    const searchUrl = `https://catalog.roblox.com/v1/search/items`;
    const params = {
      category,
      sortType: 'Relevance',
      limit: Math.min(Number(limit), 100)
    };

    const response = await axios.get(searchUrl, { params, headers: getRobloxHeaders() });
    
    const assets = response.data.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      assetType: item.itemType,
      creator: item.creatorName,
      thumbnailUrl: `https://thumbnails.roblox.com/v1/assets?assetIds=${item.id}&size=420x420&format=Png`,
      price: item.price
    }));

    res.json({ assets });
  } catch (error: any) {
    logger.error('Featured assets error:', error);
    res.status(500).json({ error: 'Failed to get featured assets', message: error.message });
  }
});

// Get asset categories
assetsRouter.get('/categories', async (req, res) => {
  try {
    const categories = [
      { id: 'Model', name: 'Models', icon: '🎨' },
      { id: 'Decal', name: 'Decals', icon: '🖼️' },
      { id: 'Audio', name: 'Audio', icon: '🎵' },
      { id: 'MeshPart', name: 'Mesh Parts', icon: '🔷' },
      { id: 'Plugin', name: 'Plugins', icon: '🔌' },
      { id: 'Animation', name: 'Animations', icon: '💃' },
      { id: 'Video', name: 'Videos', icon: '🎬' }
    ];

    res.json({ categories });
  } catch (error: any) {
    logger.error('Categories error:', error);
    res.status(500).json({ error: 'Failed to get categories', message: error.message });
  }
});
