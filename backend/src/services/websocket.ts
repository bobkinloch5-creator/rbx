import { Server, Socket } from 'socket.io';
import { logger } from './logger.js';
import { PluginSession, BuildCommand, ProjectStructure } from '../types/index.js';

const activeSessions = new Map<string, PluginSession>();
const pendingCommands = new Map<string, BuildCommand[]>();

export function registerPluginSession(sessionId: string, userId: string): PluginSession {
  const existing = activeSessions.get(sessionId);
  const session: PluginSession = existing || {
    sessionId,
    userId,
    connected: true,
    lastActivity: Date.now()
  };

  session.connected = true;
  session.lastActivity = Date.now();
  activeSessions.set(sessionId, session);
  if (!pendingCommands.has(sessionId)) pendingCommands.set(sessionId, []);
  return session;
}

export function queueBuildCommand(command: BuildCommand): void {
  const commands = pendingCommands.get(command.sessionId) || [];
  commands.push(command);
  pendingCommands.set(command.sessionId, commands);
}

export function takeBuildCommands(sessionId: string): BuildCommand[] {
  const commands = pendingCommands.get(sessionId) || [];
  pendingCommands.set(sessionId, []);
  const session = activeSessions.get(sessionId);
  if (session) session.lastActivity = Date.now();
  return commands;
}

export function updateProjectStructure(sessionId: string, structure: ProjectStructure): boolean {
  const session = activeSessions.get(sessionId);
  if (!session) return false;
  session.projectStructure = structure;
  session.connected = true;
  session.lastActivity = Date.now();
  return true;
}

export function setupWebSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Plugin connection from Roblox Studio
    socket.on('plugin:connect', (data: { sessionId: string; userId: string }) => {
      const session = registerPluginSession(data.sessionId, data.userId);
      socket.join(data.sessionId);
      logger.info(`Plugin connected: ${data.sessionId}`);
      socket.emit('plugin:connected', { success: true, sessionId: data.sessionId });
    });

    // Web app connection
    socket.on('web:connect', (data: { sessionId: string }) => {
      socket.join(data.sessionId);
      const session = activeSessions.get(data.sessionId);
      socket.emit('web:connected', { 
        success: true, 
        pluginConnected: session?.connected || false 
      });
    });

    // Project structure update from plugin
    socket.on('plugin:project-update', (data: { sessionId: string; structure: ProjectStructure }) => {
      const session = activeSessions.get(data.sessionId);
      if (session) {
        session.projectStructure = data.structure;
        session.lastActivity = Date.now();
        // Broadcast to web app
        io.to(data.sessionId).emit('project:updated', data.structure);
        logger.info(`Project structure updated for session: ${data.sessionId}`);
      }
    });

    // Build command from web app to plugin
    socket.on('web:build-command', (command: BuildCommand) => {
      logger.info(`Build command: ${command.type} for session: ${command.sessionId}`);
      queueBuildCommand(command);
      // Forward to plugin
      io.to(command.sessionId).emit('plugin:execute-command', command);
    });

    // Command result from plugin to web app
    socket.on('plugin:command-result', (data: { sessionId: string; result: any }) => {
      logger.info(`Command result for session: ${data.sessionId}`);
      // Broadcast to web app
      io.to(data.sessionId).emit('web:command-result', data.result);
    });

    // Test results from plugin
    socket.on('plugin:test-result', (data: { sessionId: string; result: any }) => {
      logger.info(`Test result for session: ${data.sessionId}`);
      io.to(data.sessionId).emit('web:test-result', data.result);
    });

    // Error handling
    socket.on('plugin:error', (data: { sessionId: string; error: string }) => {
      logger.error(`Plugin error in session ${data.sessionId}: ${data.error}`);
      io.to(data.sessionId).emit('web:error', data.error);
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
      // Clean up sessions
      for (const [sessionId, session] of activeSessions.entries()) {
        if (Date.now() - session.lastActivity > 300000) { // 5 minutes
          activeSessions.delete(sessionId);
          logger.info(`Session cleaned up: ${sessionId}`);
        }
      }
    });
  });
}

export function getActiveSession(sessionId: string): PluginSession | undefined {
  return activeSessions.get(sessionId);
}

export function getAllActiveSessions(): PluginSession[] {
  return Array.from(activeSessions.values());
}
