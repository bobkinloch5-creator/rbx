import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

class WebSocketService {
  private socket: Socket | null = null;
  private sessionId: string | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(sessionId: string, isPlugin: boolean = false) {
    this.sessionId = sessionId;
    
    if (this.socket?.connected) {
      this.socket.disconnect();
    }

    this.socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      if (isPlugin) {
        this.emit('plugin:connect', { sessionId, userId: 'user-' + Date.now() });
      } else {
        this.emit('web:connect', { sessionId });
      }
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.notify('disconnected', {});
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      this.notify('error', error);
    });

    // Listen to all events and forward to listeners
    this.setupEventForwarding();
  }

  private setupEventForwarding() {
    if (!this.socket) return;

    const events = [
      'plugin:connected',
      'web:connected',
      'project:updated',
      'web:command-result',
      'web:test-result',
      'web:error',
      'plugin:execute-command'
    ];

    events.forEach(event => {
      this.socket?.on(event, (data) => {
        this.notify(event, data);
      });
    });
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  off(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback);
  }

  private notify(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} listener:`, error);
      }
    });
  }

  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }

  sendBuildCommand(command: any) {
    if (!this.sessionId) {
      console.error('No active session');
      return;
    }
    this.emit('web:build-command', { ...command, sessionId: this.sessionId });
  }

  updateProjectStructure(structure: any) {
    if (!this.sessionId) {
      console.error('No active session');
      return;
    }
    this.emit('plugin:project-update', { sessionId: this.sessionId, structure });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.sessionId = null;
    this.listeners.clear();
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const wsService = new WebSocketService();
