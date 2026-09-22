import OpenAI from 'openai';
import { AIMessage, ProjectStructure, BuildCommand } from '../types/index.js';
import { logger } from './logger.js';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE || 'https://api.openai.com/v1'
}) : null;

const SYSTEM_PROMPT = `You are an expert Roblox game developer and AI assistant specializing in building games through natural language instructions. You have deep knowledge of:

1. Roblox Studio architecture and best practices
2. Lua scripting and ModuleScript patterns
3. Roblox API, services, and object hierarchy
4. Game design patterns and mechanics
5. Performance optimization for Roblox games
6. User experience and interface design

When analyzing a project structure, you should:
- Understand the complete game hierarchy and relationships
- Identify existing scripts, their purposes, and dependencies
- Recognize design patterns and architectural decisions
- Consider performance implications
- Maintain code quality and best practices

When generating build commands, you should:
- Break down complex requests into atomic, executable steps
- Ensure proper parent-child relationships
- Use appropriate Roblox classes and properties
- Generate clean, efficient, well-documented Lua code
- Include error handling and validation
- Provide test suggestions for new features

For debugging and testing:
- Analyze error messages and provide specific fixes
- Suggest improvements and optimizations
- Explain issues in clear, actionable terms
- Provide context-aware solutions based on the project structure

When the user asks you to build something, respond with:
1. A brief explanation of what you'll create
2. A JSON code block with the commands to execute

Example response format:
I'll create a parkour obby with 10 platforms. Here are the commands:

\`\`\`json
[
  {
    "type": "create",
    "data": {
      "className": "Part",
      "name": "Platform1",
      "parent": "Workspace",
      "properties": {
        "Size": {"X": 10, "Y": 1, "Z": 10},
        "Position": {"X": 0, "Y": 5, "Z": 0},
        "Anchored": true,
        "BrickColor": "Bright green"
      }
    }
  }
]
\`\`\`

Always provide executable JSON commands for building in Roblox Studio.`;

export interface AIRequest {
  messages: AIMessage[];
  projectStructure?: ProjectStructure;
}

export interface AIResponse {
  message: string;
  commands?: BuildCommand[];
  reasoning?: string;
}

export async function generateAIResponse(request: AIRequest): Promise<AIResponse> {
  let contextualPrompt = SYSTEM_PROMPT;
  if (request.projectStructure) {
    contextualPrompt += `\n\nCurrent Project Context:\n${JSON.stringify(request.projectStructure, null, 2)}`;
  }

  try {
    if (!openai) {
      throw new Error('No AI provider configured');
    }
    return await generateOpenAIResponse(contextualPrompt, request.messages);
  } catch (error) {
    logger.error('AI generation error:', error);
    throw error;
  }
}

async function generateOpenAIResponse(systemPrompt: string, messages: AIMessage[]): Promise<AIResponse> {
  if (!openai) throw new Error('AI provider not configured');

  const completion = await openai.chat.completions.create({
    model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role as 'user' | 'assistant' | 'system', content: m.content }))
    ],
    temperature: 0.7,
    max_tokens: 8000
  });

  const content = completion.choices[0].message.content || '';
  return parseAIResponse(content);
}

function parseAIResponse(content: string): AIResponse {
  const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
  let commands: BuildCommand[] | undefined;

  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      commands = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      logger.warn('Failed to parse JSON commands from AI response');
    }
  }

  return {
    message: content,
    commands,
    reasoning: extractReasoning(content)
  };
}

function extractReasoning(content: string): string | undefined {
  const reasoningMatch = content.match(/(?:Reasoning|Analysis|Plan):\s*([^\n]+(?:\n(?!```)[^\n]+)*)/i);
  return reasoningMatch ? reasoningMatch[1].trim() : undefined;
}

export async function analyzeError(error: string, context: ProjectStructure): Promise<string> {
  const messages: AIMessage[] = [
    {
      role: 'user',
      content: `Analyze this Roblox error and provide a specific fix:\n\nError: ${error}\n\nProject Context: ${JSON.stringify(context, null, 2)}`,
      timestamp: Date.now()
    }
  ];

  const response = await generateAIResponse({ messages, projectStructure: context });
  return response.message;
}

export async function suggestImprovements(projectStructure: ProjectStructure): Promise<string[]> {
  const messages: AIMessage[] = [
    {
      role: 'user',
      content: `Analyze this Roblox project and suggest 3-5 specific improvements for code quality, performance, or user experience:\n\n${JSON.stringify(projectStructure, null, 2)}`,
      timestamp: Date.now()
    }
  ];

  const response = await generateAIResponse({ messages, projectStructure });

  const suggestions = response.message
    .split('\n')
    .filter(line => /^[\d\-\*]/.test(line.trim()))
    .map(line => line.replace(/^[\d\-\*]\s*/, '').trim())
    .filter(s => s.length > 0);

  return suggestions;
}
