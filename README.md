# BlockForge

The ultimate AI-powered Roblox game builder that connects directly to Roblox Studio. Build, test, and deploy real games using natural language prompts.

## ✨ Features

- **Natural Language Building**: Describe what you want to build and watch the AI create it in real-time
- **3D Preview**: Visualize your game in an interactive 3D viewport
- **Explorer Panel**: Navigate your game's object hierarchy
- **Properties Editor**: Modify object properties with a visual interface
- **Professional Lua Editor**: Write scripts with autocomplete, syntax highlighting, and error detection
- **Real Asset Browser**: Search and insert millions of real Roblox assets
- **Context-Aware AI**: AI analyzes your entire project before making changes
- **Smart Testing**: Test your game and get AI-powered fix suggestions
- **Bidirectional Sync**: Changes in Roblox Studio automatically sync to the web app

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd roblox-ai-builder
npm install
```

### 2. Start the Application

```bash
npm run dev
```

This will start both the backend server (port 3001) and frontend (port 5173).

### 3. Install the Roblox Plugin

1. Copy all files from `roblox-plugin/src/` to:
   - Windows: `%LOCALAPPDATA%\Roblox\Plugins\BlockForge\`
   - macOS: `~/Documents/Roblox/Plugins/BlockForge/`

2. Open Roblox Studio
3. Go to File → Game Settings → Security
4. Enable "Allow HTTP Requests"
5. Restart Roblox Studio

### 4. Connect and Build

1. Open your game in Roblox Studio
2. Click the "Connect" button in the BlockForge toolbar
3. Open `http://localhost:5173` in your browser
4. Wait for "Plugin Connected" status
5. Start building with natural language!

## 💬 Example Prompts

- "Create a parkour obby with 10 levels that get progressively harder"
- "Add a leaderboard system that tracks player wins"
- "Insert a spawn point with a teleport pad to a secret area"
- "Create a sword fighting system with damage and health"
- "Add a shop GUI where players can buy power-ups"
- "Generate a racing track with checkpoints and a timer"

## 🏗️ Project Structure

```
roblox-ai-builder/
├── frontend/              # React + TypeScript web app
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Landing and Builder pages
│   │   ├── lib/           # API and WebSocket services
│   │   └── hooks/         # React hooks and state
│   └── package.json
├── backend/               # Node.js Express server
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # AI agent, WebSocket, etc.
│   │   └── types/         # TypeScript types
│   └── package.json
└── roblox-plugin/         # Lua plugin for Roblox Studio
    └── src/
        ├── init.lua           # Main plugin
        ├── CommandExecutor.lua # Command handling
        └── TestRunner.lua      # Testing framework
```

## 🔧 Configuration

The system is pre-configured and ready to use. All necessary configuration is already set up in the `.env` file.

## 📚 Documentation

- **Plugin Setup**: See `roblox-plugin/README.md` for detailed plugin installation
- **API Documentation**: All API endpoints are documented in the backend routes

## 🎮 Using BlockForge

### Chat Panel
Type natural language commands to build your game. The AI understands context and generates executable commands.

### 3D Preview
View your game in real-time with Three.js rendering. Rotate, zoom, and inspect your creations.

### Explorer
Browse your game's object hierarchy just like in Roblox Studio.

### Properties Panel
Select any object to view and edit its properties visually.

### Script Editor
Edit Lua scripts with Monaco editor featuring autocomplete and syntax highlighting.

### Toolbox
Search and insert real Roblox catalog assets directly into your game.

### Test Console
Run tests and get AI-powered suggestions to fix any errors.

## 🔒 Security

- Plugin authentication with secure secrets
- HTTP requests must be explicitly enabled
- Session-based communication
- All commands are validated before execution

## 🐛 Troubleshooting

### Plugin Won't Connect
- Ensure HTTP requests are enabled in Game Settings
- Verify backend server is running on port 3001
- Check the plugin's log panel for error messages

### AI Not Responding
- Check that your API configuration is correct
- Look at the backend console for error messages

### Commands Not Executing
- Make sure the plugin is connected (green status)
- Click "Sync" to refresh the connection
- Check Roblox Studio's Output window for errors

## 🎯 System Requirements

- Node.js 18+
- Roblox Studio (latest version)
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Internet connection for AI and asset browsing

## 📝 License

MIT License

## 💡 Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**BlockForge** - Build better games faster with AI.
