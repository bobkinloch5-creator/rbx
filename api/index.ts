// api/index.ts — Self-contained BlockForge API for Vercel Serverless
// Zero external file imports — all logic inline so Vercel compiles this reliably.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

// ---------------------------------------------------------------------------
// In-memory session store (persists across warm Lambda invocations)
// ---------------------------------------------------------------------------
interface Session {
  sessionId: string;
  userId: string;
  connected: boolean;
  lastActivity: number;
  projectStructure?: any;
}

const sessions = new Map<string, Session>();
const pendingCommands = new Map<string, any[]>();

function getOrCreateSession(sessionId: string, userId?: string): Session {
  let session = sessions.get(sessionId);
  if (!session) {
    session = {
      sessionId,
      userId: userId || `studio-${Date.now()}`,
      connected: true,
      lastActivity: Date.now(),
    };
    sessions.set(sessionId, session);
    pendingCommands.set(sessionId, []);
  }
  session.connected = true;
  session.lastActivity = Date.now();
  return session;
}

// ---------------------------------------------------------------------------
// AI client (MotAPIs / OpenAI compatible)
// ---------------------------------------------------------------------------
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_API_BASE || 'https://api.openai.com/v1',
    })
  : null;

const SYSTEM_PROMPT = `You are an expert Roblox game developer AI. When the user asks you to build something, respond with:
1. A brief explanation of what you will create
2. A JSON code block with the commands to execute

Example:
\`\`\`json
[{"type":"create","data":{"className":"Part","name":"Platform1","parent":"Workspace","properties":{"Size":{"X":10,"Y":1,"Z":10},"Position":{"X":0,"Y":5,"Z":0},"Anchored":true,"BrickColor":"Bright green"}}}]
\`\`\`

Always provide executable JSON commands for building in Roblox Studio.`;

// ---------------------------------------------------------------------------
// Main Vercel handler — routes all /api/* requests
// ---------------------------------------------------------------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers — allow Roblox Studio and browser requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-session-id');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const path = (req.url || '').replace(/\?.*$/, '');
  const method = req.method?.toUpperCase() || 'GET';
  const body = req.body as any;

  console.log(`[BlockForge API] ${method} ${path}`);

  // ------------------------------------------------------------------
  // Health check
  // ------------------------------------------------------------------
  if (path === '/api/health' || path === '/health') {
    return res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  }

  // ------------------------------------------------------------------
  // POST /api/plugin/verify
  // ------------------------------------------------------------------
  if (path === '/api/plugin/verify' && method === 'POST') {
    const { sessionId, secret } = body || {};
    const expectedSecret = process.env.PLUGIN_SECRET || 'roblox-ai-builder-secure-2024';
    if (secret !== expectedSecret) {
      return res.status(401).json({ error: 'Invalid plugin secret' });
    }
    const session = getOrCreateSession(sessionId, `studio-${Date.now()}`);
    return res.status(200).json({ verified: true, connected: session.connected, lastActivity: session.lastActivity });
  }

  // ------------------------------------------------------------------
  // POST /api/plugin/sync
  // ------------------------------------------------------------------
  if (path === '/api/plugin/sync' && method === 'POST') {
    const { sessionId, structure } = body || {};
    if (!sessionId || !structure) {
      return res.status(400).json({ error: 'sessionId and structure are required' });
    }
    const session = getOrCreateSession(sessionId);
    session.projectStructure = structure;
    session.lastActivity = Date.now();
    return res.status(200).json({ success: true });
  }

  // ------------------------------------------------------------------
  // GET /api/plugin/commands/:sessionId
  // ------------------------------------------------------------------
  const commandsMatch = path.match(/^\/api\/plugin\/commands\/(.+)$/);
  if (commandsMatch && method === 'GET') {
    const sessionId = commandsMatch[1];
    const session = getOrCreateSession(sessionId);
    const commands = pendingCommands.get(sessionId) || [];
    pendingCommands.set(sessionId, []); // clear after pickup
    session.lastActivity = Date.now();
    return res.status(200).json({ commands });
  }

  // ------------------------------------------------------------------
  // POST /api/plugin/command  (web→plugin)
  // ------------------------------------------------------------------
  if (path === '/api/plugin/command' && method === 'POST') {
    const command = body as any;
    if (!command?.sessionId || !command?.type) {
      return res.status(400).json({ error: 'sessionId and type are required' });
    }
    getOrCreateSession(command.sessionId);
    const cmds = pendingCommands.get(command.sessionId) || [];
    cmds.push(command);
    pendingCommands.set(command.sessionId, cmds);
    return res.status(200).json({ success: true });
  }

  // ------------------------------------------------------------------
  // POST /api/plugin/result
  // ------------------------------------------------------------------
  if (path === '/api/plugin/result' && method === 'POST') {
    const { sessionId } = body || {};
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const session = sessions.get(sessionId);
    if (session) session.lastActivity = Date.now();
    return res.status(200).json({ success: true });
  }

  // ------------------------------------------------------------------
  // POST /api/plugin/error
  // ------------------------------------------------------------------
  if (path === '/api/plugin/error' && method === 'POST') {
    const { sessionId, error } = body || {};
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const session = sessions.get(sessionId);
    if (session) session.lastActivity = Date.now();
    console.error(`[Plugin Error] session=${sessionId}: ${error}`);
    return res.status(200).json({ success: true });
  }

  // ------------------------------------------------------------------
  // POST /api/plugin/test-result
  // ------------------------------------------------------------------
  if (path === '/api/plugin/test-result' && method === 'POST') {
    const { sessionId } = body || {};
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const session = sessions.get(sessionId);
    if (session) session.lastActivity = Date.now();
    return res.status(200).json({ success: true });
  }

  // ------------------------------------------------------------------
  // GET /api/plugin/session/:sessionId
  // ------------------------------------------------------------------
  const sessionMatch = path.match(/^\/api\/plugin\/session\/(.+)$/);
  if (sessionMatch && method === 'GET') {
    const sessionId = sessionMatch[1];
    const session = sessions.get(sessionId);
    if (!session) {
      // auto-create so plugin doesn't get 404
      const s = getOrCreateSession(sessionId);
      return res.status(200).json({ sessionId, connected: s.connected, lastActivity: s.lastActivity, hasProjectStructure: false });
    }
    return res.status(200).json({
      sessionId: session.sessionId,
      userId: session.userId,
      connected: session.connected,
      lastActivity: session.lastActivity,
      hasProjectStructure: !!session.projectStructure
    });
  }

  // ------------------------------------------------------------------
  // GET /api/plugin/sessions
  // ------------------------------------------------------------------
  if (path === '/api/plugin/sessions' && method === 'GET') {
    const all = Array.from(sessions.values()).map(s => ({
      sessionId: s.sessionId, userId: s.userId, connected: s.connected, lastActivity: s.lastActivity
    }));
    return res.status(200).json({ count: all.length, sessions: all });
  }

  // ------------------------------------------------------------------
  // POST /api/ai/chat
  // ------------------------------------------------------------------
  if (path === '/api/ai/chat' && method === 'POST') {
    const { messages, sessionId } = body || {};
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }
    if (!openai) {
      return res.status(500).json({ error: 'AI provider not configured' });
    }
    try {
      const session = sessionId ? sessions.get(sessionId) : undefined;
      const contextPrompt = session?.projectStructure
        ? `${SYSTEM_PROMPT}\n\nCurrent Project:\n${JSON.stringify(session.projectStructure, null, 2)}`
        : SYSTEM_PROMPT;

      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: contextPrompt },
          ...messages.map((m: any) => ({ role: m.role, content: m.content }))
        ],
        temperature: 0.7,
        max_tokens: 8000
      });

      const content = completion.choices[0].message.content || '';
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
      let commands: any[] | undefined;
      if (jsonMatch) {
        try { commands = JSON.parse(jsonMatch[1]); } catch {}
      }
      return res.status(200).json({ message: content, commands });
    } catch (err: any) {
      console.error('AI error:', err);
      return res.status(500).json({ error: 'AI request failed', message: err.message });
    }
  }

  // ------------------------------------------------------------------
  // GET /api/assets/categories
  // ------------------------------------------------------------------
  if (path === '/api/assets/categories' && method === 'GET') {
    return res.status(200).json({
      categories: [
        { id: 'Model', name: 'Models', icon: '🎨' },
        { id: 'Decal', name: 'Decals', icon: '🖼️' },
        { id: 'Audio', name: 'Audio', icon: '🎵' },
        { id: 'MeshPart', name: 'Mesh Parts', icon: '🔷' },
        { id: 'Plugin', name: 'Plugins', icon: '🔌' },
        { id: 'Animation', name: 'Animations', icon: '💃' },
      ]
    });
  }

  // ------------------------------------------------------------------
  // GET /api/assets/search
  // ------------------------------------------------------------------
  if (path === '/api/assets/search' && method === 'GET') {
    const query = String(req.query?.query || '');
    const category = String(req.query?.category || 'Model');
    const limit = Math.min(Number(req.query?.limit || 30), 60);
    if (!query) return res.status(400).json({ error: 'query required' });

    try {
      const robloxKey = process.env.ROBLOX_API_KEY || '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (robloxKey) headers['x-api-key'] = robloxKey;

      const searchRes = await fetch(
        `https://catalog.roblox.com/v1/search/items?keyword=${encodeURIComponent(query)}&category=${category}&limit=${limit}`,
        { headers }
      );
      const data: any = await searchRes.json();
      const assets = (data.data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        assetType: item.itemType,
        creator: item.creatorName,
        thumbnailUrl: `https://thumbnails.roblox.com/v1/assets?assetIds=${item.id}&size=150x150&format=Png&isCircular=false`,
        price: item.price
      }));
      return res.status(200).json({ assets, total: data.totalCount });
    } catch (err: any) {
      return res.status(500).json({ error: 'Asset search failed', message: err.message });
    }
  }

  // ------------------------------------------------------------------
  // GET /api/assets/featured
  // ------------------------------------------------------------------
  if (path === '/api/assets/featured' && method === 'GET') {
    try {
      const category = String(req.query?.category || 'Model');
      const limit = Math.min(Number(req.query?.limit || 20), 60);
      const searchRes = await fetch(
        `https://catalog.roblox.com/v1/search/items?category=${category}&sortType=Relevance&limit=${limit}`
      );
      const data: any = await searchRes.json();
      const assets = (data.data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        assetType: item.itemType,
        creator: item.creatorName,
        thumbnailUrl: `https://thumbnails.roblox.com/v1/assets?assetIds=${item.id}&size=150x150&format=Png&isCircular=false`,
        price: item.price
      }));
      return res.status(200).json({ assets });
    } catch (err: any) {
      return res.status(500).json({ error: 'Featured assets failed', message: err.message });
    }
  }

  // ------------------------------------------------------------------
  // 404 for unknown routes
  // ------------------------------------------------------------------
  return res.status(404).json({ error: 'Not found', path });
}
