export interface RobloxInstance {
  ClassName: string;
  Name: string;
  Parent?: string;
  Properties?: Record<string, any>;
  Children?: RobloxInstance[];
}

export interface ProjectStructure {
  name: string;
  instances: RobloxInstance[];
  scripts: ScriptInfo[];
}

export interface ScriptInfo {
  name: string;
  path: string;
  content: string;
  type: 'LocalScript' | 'Script' | 'ModuleScript';
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface BuildCommand {
  type: 'create' | 'edit' | 'delete' | 'setProperty' | 'insertAsset' | 'test' | 'debug';
  target?: string;
  data?: any;
  sessionId: string;
}

export interface BuildResponse {
  success: boolean;
  message: string;
  data?: any;
  suggestions?: string[];
}

export interface TestResult {
  success: boolean;
  errors: TestError[];
  warnings: string[];
  suggestions: string[];
}

export interface TestError {
  message: string;
  line?: number;
  file?: string;
  stack?: string;
  fix?: string;
}

export interface AssetInfo {
  id: number;
  name: string;
  description: string;
  assetType: string;
  creator: string;
  thumbnailUrl: string;
  price?: number;
}

export interface PluginSession {
  sessionId: string;
  userId: string;
  connected: boolean;
  lastActivity: number;
  projectStructure?: ProjectStructure;
}
