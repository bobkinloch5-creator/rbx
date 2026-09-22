import { Router } from 'express';
import { getActiveSession, getAllActiveSessions } from '../services/websocket.js';
import { logger } from '../services/logger.js';

export const pluginRouter = Router();

// Verify plugin connection
pluginRouter.post('/verify', async (req, res) => {
  try {
    const { sessionId, secret } = req.body;

    if (secret !== process.env.PLUGIN_SECRET) {
      return res.status(401).json({ error: 'Invalid plugin secret' });
    }

    const session = getActiveSession(sessionId);
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
