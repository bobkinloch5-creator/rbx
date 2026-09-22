import { Router } from 'express';
import {
  getActiveSession,
  getAllActiveSessions,
  registerPluginSession,
  queueBuildCommand,
  takeBuildCommands,
  updateProjectStructure
} from '../services/websocket.js';
import { ProjectStructure } from '../types/index.js';
import { logger } from '../services/logger.js';

export const pluginRouter = Router();

// Verify plugin connection
pluginRouter.post('/verify', async (req, res) => {
  try {
    const { sessionId, secret } = req.body;

    if (secret !== process.env.PLUGIN_SECRET) {
      return res.status(401).json({ error: 'Invalid plugin secret' });
    }

    const session = registerPluginSession(sessionId, `studio-${Date.now()}`);
    res.json({ 
      verified: true, 
      connected: session?.connected || false,
      lastActivity: session?.lastActivity
    });
  } catch (error: any) {
    logger.error('Plugin verification error:', error);
    res.status(500).json({ error: 'Verification failed', message: error.message });
  }
});

// HTTP bridge used by the Roblox Studio plugin when WebSockets are unavailable.
pluginRouter.post('/sync', async (req, res) => {
  const { sessionId, structure } = req.body as { sessionId?: string; structure?: ProjectStructure };
  if (!sessionId || !structure) return res.status(400).json({ error: 'sessionId and structure are required' });
  if (!updateProjectStructure(sessionId, structure)) return res.status(404).json({ error: 'Session not found' });
  res.json({ success: true });
});

pluginRouter.post('/command', async (req, res) => {
  const command = req.body as { sessionId?: string; type?: string; [key: string]: unknown };
  if (!command.sessionId || !command.type) {
    return res.status(400).json({ error: 'sessionId and type are required' });
  }
  if (!getActiveSession(command.sessionId)) {
    return res.status(404).json({ error: 'Session not found' });
  }
  queueBuildCommand(command as any);
  res.json({ success: true });
});

pluginRouter.get('/commands/:sessionId', async (req, res) => {
  const session = getActiveSession(req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json({ commands: takeBuildCommands(req.params.sessionId) });
});

pluginRouter.post('/result', async (req, res) => {
  const { sessionId, result } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });
  const session = getActiveSession(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  session.lastActivity = Date.now();
  res.json({ success: true, result });
});

pluginRouter.post('/error', async (req, res) => {
  const { sessionId, error } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });
  const session = getActiveSession(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  logger.error(`Plugin error in session ${sessionId}: ${error}`);
  session.lastActivity = Date.now();
  res.json({ success: true });
});

pluginRouter.post('/test-result', async (req, res) => {
  const { sessionId, result } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });
  const session = getActiveSession(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  session.lastActivity = Date.now();
  res.json({ success: true, result });
});

// Get session status
pluginRouter.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = getActiveSession(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      sessionId: session.sessionId,
      userId: session.userId,
      connected: session.connected,
      lastActivity: session.lastActivity,
      hasProjectStructure: !!session.projectStructure
    });
  } catch (error: any) {
    logger.error('Session status error:', error);
    res.status(500).json({ error: 'Failed to get session status', message: error.message });
  }
});

// Get all active sessions (for admin/debugging)
pluginRouter.get('/sessions', async (req, res) => {
  try {
    const sessions = getAllActiveSessions();
    res.json({
      count: sessions.length,
      sessions: sessions.map(s => ({
        sessionId: s.sessionId,
        userId: s.userId,
        connected: s.connected,
        lastActivity: s.lastActivity
      }))
    });
  } catch (error: any) {
    logger.error('Sessions list error:', error);
    res.status(500).json({ error: 'Failed to list sessions', message: error.message });
  }
});
