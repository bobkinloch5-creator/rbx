import { create } from 'zustand';
import { wsService } from '../lib/websocket';
import { aiService, AIMessage } from '../lib/api';

interface RobloxInstance {
  ClassName: string;
  Name: string;
  Parent?: string;
  Properties?: Record<string, any>;
  Children?: RobloxInstance[];
}

interface ProjectStructure {
  name: string;
  instances: RobloxInstance[];
  scripts: any[];
}

interface BuilderState {
  // Session
  sessionId: string | null;
  isPluginConnected: boolean;
  
  // Project
  projectStructure: ProjectStructure | null;
  selectedInstance: RobloxInstance | null;
  
  // Chat
  messages: AIMessage[];
  isAIThinking: boolean;
  
  // Editor
  currentScript: { name: string; content: string; path: string } | null;
  
  // Testing
  testResults: any[];
  
  // Actions
  setSessionId: (id: string) => void;
  setPluginConnected: (connected: boolean) => void;
  setProjectStructure: (structure: ProjectStructure) => void;
  setSelectedInstance: (instance: RobloxInstance | null) => void;
  addMessage: (message: AIMessage) => void;
  setAIThinking: (thinking: boolean) => void;
  setCurrentScript: (script: { name: string; content: string; path: string } | null) => void;
  addTestResult: (result: any) => void;
  sendCommand: (command: any) => void;
  sendAIMessage: (content: string) => Promise<void>;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  // Initial state
  sessionId: null,
  isPluginConnected: false,
  projectStructure: null,
  selectedInstance: null,
  messages: [],
  isAIThinking: false,
  currentScript: null,
  testResults: [],
  
  // Actions
  setSessionId: (id) => set({ sessionId: id }),
  
  setPluginConnected: (connected) => set({ isPluginConnected: connected }),
  
  setProjectStructure: (structure) => set({ projectStructure: structure }),
  
  setSelectedInstance: (instance) => set({ selectedInstance: instance }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  setAIThinking: (thinking) => set({ isAIThinking: thinking }),
  
  setCurrentScript: (script) => set({ currentScript: script }),
  
  addTestResult: (result) => set((state) => ({
    testResults: [...state.testResults, result]
  })),
  
  sendCommand: (command) => {
    const { sessionId } = get();
    if (!sessionId) {
      console.error('No active session');
      return;
    }
    wsService.sendBuildCommand({ ...command, sessionId });
  },
  
  sendAIMessage: async (content: string) => {
    const { messages, sessionId, addMessage, setAIThinking } = get();
    
    // Add user message
    const userMessage: AIMessage = {
      role: 'user',
      content,
      timestamp: Date.now()
    };
    addMessage(userMessage);
    
    setAIThinking(true);
    
    try {
      const response = await aiService.sendMessage(
        [...messages, userMessage],
        sessionId || undefined
      );
      
      // Add AI response
      const aiMessage: AIMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: Date.now()
      };
      addMessage(aiMessage);
      
      // Execute commands if present
      if (response.commands && response.commands.length > 0) {
        response.commands.forEach(cmd => {
          get().sendCommand(cmd);
        });
      }
    } catch (error) {
      console.error('AI message error:', error);
      const errorMessage: AIMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now()
      };
      addMessage(errorMessage);
    } finally {
      setAIThinking(false);
    }
  }
}));
