# Roblox Studio Plugin Setup Guide

This guide will help you install and configure the Roblox AI Builder plugin in Roblox Studio.

## Prerequisites

- Roblox Studio installed
- HTTP requests enabled in your game settings
- Backend server running (see main README)

## Installation Methods

### Method 1: Manual Installation (Recommended for Development)

1. **Locate your Roblox Plugins folder:**
   - Windows: `%LOCALAPPDATA%\Roblox\Plugins`
   - macOS: `~/Documents/Roblox/Plugins`

2. **Create the plugin folder:**
   ```
   Plugins/
   └── RobloxAIBuilder/
       ├── init.lua
       ├── CommandExecutor.lua
       └── TestRunner.lua
   ```

3. **Copy the plugin files:**
   - Copy all `.lua` files from `roblox-plugin/src/` to the `RobloxAIBuilder` folder

4. **Configure the plugin:**
   - Open `init.lua` in a text editor
   - Update the `CONFIG` section:
     ```lua
     local CONFIG = {
         SERVER_URL = "http://localhost:3001",
         WS_POLL_INTERVAL = 0.5,
         PLUGIN_SECRET = "your_secure_random_string_here",
         SESSION_TIMEOUT = 300
     }
     ```
   - Make sure `PLUGIN_SECRET` matches the value in your backend `.env` file

5. **Restart Roblox Studio**

### Method 2: Using Rojo (Recommended for Production)

1. **Install Rojo:**
   ```bash
   cargo install rojo
   ```

2. **Create `plugin.project.json` in the `roblox-plugin` folder:**
   ```json
   {
     "name": "RobloxAIBuilder",
     "tree": {
       "$className": "Folder",
       "src": {
         "$path": "src"
       }
     }
   }
   ```

3. **Serve the plugin:**
   ```bash
   cd roblox-plugin
   rojo serve plugin.project.json
   ```

4. **Connect in Roblox Studio:**
   - Install the Rojo plugin from the Roblox marketplace
   - Click the Rojo button in Studio
   - Click "Connect"

## Configuration

### Enable HTTP Requests

1. Open your game in Roblox Studio
2. Go to `File` → `Game Settings`
3. Navigate to the `Security` tab
4. Check `Allow HTTP Requests`
5. Click `Save`

### Configure the Plugin

The plugin configuration is at the top of `init.lua`:

```lua
local CONFIG = {
    -- Backend server URL
    SERVER_URL = "http://localhost:3001",
    
    -- How often to poll for commands (seconds)
    WS_POLL_INTERVAL = 0.5,
    
    -- Secret key for authentication (must match backend)
    PLUGIN_SECRET = "your_secure_random_string_here",
    
    -- Session timeout in seconds
    SESSION_TIMEOUT = 300
}
```

## Using the Plugin

### 1. Plugin Toolbar

After installation, you'll see three new buttons in the "AI Builder" toolbar:

- **Connect**: Connect to the web app
- **Sync**: Manually sync project structure
- **Test**: Run tests and send results to web app

### 2. Plugin Widget

A docked widget will appear on the right side with:

- **Title**: "Roblox AI Builder"
- **Status**: Connection status (Connected/Disconnected)
- **Session ID**: Your unique session identifier
- **Log**: Real-time activity log

### 3. Connecting

1. Click the "Connect" button in the toolbar
2. The widget will display your session ID
3. Copy the session ID (you'll need it for the web app)
4. Wait for "Connected to AI Builder" message in the log
5. The status indicator will turn green

### 4. Building with AI

Once connected:

1. Go to the web app at `http://localhost:5173/builder`
2. Wait for the "Plugin Connected" indicator
3. Type natural language prompts in the chat
4. Watch as changes appear in Roblox Studio automatically

### 5. Testing

1. Click the "Test" button in the toolbar
2. The plugin will analyze your scripts for common issues
3. Results will appear in the web app's Test Console
4. Get AI-powered fix suggestions for any errors

## Supported Commands

The plugin can execute the following commands from the web app:

### Create Object
```lua
{
    type = "create",
    data = {
        className = "Part",
        name = "MyPart",
        parent = "Workspace",
        properties = {
            Size = Vector3.new(10, 1, 10),
            Position = Vector3.new(0, 5, 0),
            BrickColor = BrickColor.new("Bright red")
        }
    }
}
```

### Edit Script
```lua
{
    type = "edit",
    target = "Workspace.MyScript",
    data = {
        content = "print('Hello, World!')"
    }
}
```

### Set Property
```lua
{
    type = "setProperty",
    target = "Workspace.MyPart",
    data = {
        property = "Transparency",
        value = 0.5
    }
}
```

### Insert Asset
```lua
{
    type = "insertAsset",
    data = {
        assetId = 1234567890,
        name = "CoolModel"
    }
}
```

### Delete Object
```lua
{
    type = "delete",
    target = "Workspace.MyPart"
}
```

## Auto-Sync

The plugin automatically syncs your project structure when:

- Objects are added to the workspace
- Objects are removed from the workspace
- You click the "Sync" button
- After executing a command

Sync is throttled to once every 2 seconds to avoid excessive network traffic.

## Troubleshooting

### Plugin Not Appearing

1. Check that files are in the correct location
2. Restart Roblox Studio
3. Check the Output window for Lua errors

### Connection Failed

1. Verify the backend server is running
2. Check that `SERVER_URL` matches your backend address
3. Ensure `PLUGIN_SECRET` matches between plugin and backend
4. Check HTTP requests are enabled in Game Settings

### Commands Not Executing

1. Check the plugin widget log for errors
2. Verify the session is still connected
3. Click "Sync" to refresh the connection
4. Check the Output window for error details

### Performance Issues

1. Reduce `WS_POLL_INTERVAL` if polling too frequently
2. Limit the number of objects in your workspace
3. Disable auto-sync by commenting out the DescendantAdded/Removing connections

## Security Considerations

- Never share your `PLUGIN_SECRET`
- Only enable HTTP requests for games you're developing
- Review all AI-generated code before executing
- Use undo (Ctrl+Z) if a command produces unexpected results
- Test in a separate place before applying to production games

## Advanced Usage

### Custom Command Handlers

You can extend the plugin by adding custom command handlers to `CommandExecutor.lua`:

```lua
function CommandExecutor.myCustomCommand(command)
    local data = command.data
    -- Your custom logic here
    return {
        success = true,
        message = "Custom command executed"
    }
end
```

### Custom Tests

Add custom test logic to `TestRunner.lua`:

```lua
local function myCustomTest()
    -- Your test logic
    return {
        success = true,
        message = "Test passed"
    }
end
```

## Updates

To update the plugin:

1. Download the latest version
2. Replace the files in your Plugins folder
3. Restart Roblox Studio
4. Click "Connect" to reconnect

## Support

If you encounter issues:

1. Check the plugin widget log
2. Check Roblox Studio Output window
3. Check the backend server console
4. Open an issue on GitHub with error details
