import { createServer } from 'http';
import { Server } from 'socket.io';
import { app } from './app.js';
import { setupWebSocketHandlers } from './services/websocket.js';
import { logger } from './services/logger.js';

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3001;

// Setup WebSocket handlers
setupWebSocketHandlers(io);

httpServer.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📡 WebSocket server ready`);
  logger.info(`🎮 Roblox AI Builder API active`);
});

export { io };
