import { Router } from 'express';
import { generateAIResponse, analyzeError, suggestImprovements } from '../services/ai-agent.js';
import { getActiveSession } from '../services/websocket.js';
import { AIMessage } from '../types/index.js';
import { logger } from '../services/logger.js';

export const aiRouter = Router();

// Generate AI response for chat
aiRouter.post('/chat', async (req, res) => {
  try {
    const { messages, sessionId, provider } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Get project context if session is active
    const session = sessionId ? getActiveSession(sessionId) : undefined;
    const projectStructure = session?.projectStructure;

    const response = await generateAIResponse({
      messages: messages as AIMessage[],
      projectStructure,
      provider
    });

    res.json(response);
  } catch (error: any) {
    logger.error('AI chat error:', error);
    res.status(500).json({ error: 'Failed to generate AI response', message: error.message });
  }
});

// Analyze error and get fix suggestions
aiRouter.post('/analyze-error', async (req, res) => {
  try {
    const { error, sessionId } = req.body;

    if (!error) {
      return res.status(400).json({ error: 'Error message required' });
    }

    const session = getActiveSession(sessionId);
    if (!session?.projectStructure) {
      return res.status(404).json({ error: 'Session not found or no project structure available' });
    }

    const analysis = await analyzeError(error, session.projectStructure);
    res.json({ analysis });
  } catch (error: any) {
    logger.error('Error analysis failed:', error);
    res.status(500).json({ error: 'Failed to analyze error', message: error.message });
  }
});

// Get improvement suggestions
aiRouter.post('/suggestions', async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = getActiveSession(sessionId);
    if (!session?.projectStructure) {
      return res.status(404).json({ error: 'Session not found or no project structure available' });
    }

    const suggestions = await suggestImprovements(session.projectStructure);
    res.json({ suggestions });
  } catch (error: any) {
    logger.error('Suggestions generation failed:', error);
    res.status(500).json({ error: 'Failed to generate suggestions', message: error.message });
  }
});
