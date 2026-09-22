-- BlockForge Plugin
-- Main plugin file that connects Roblox Studio to the web app

local HttpService = game:GetService("HttpService")
local ChangeHistoryService = game:GetService("ChangeHistoryService")
local Selection = game:GetService("Selection")
local RunService = game:GetService("RunService")

-- Configuration
local CONFIG = {
	-- Replace this with the public URL of your deployed backend.
	SERVER_URL = "https://rbx-frontend1.vercel.app",
	WS_POLL_INTERVAL = 0.5,
	PLUGIN_SECRET = "roblox-ai-builder-secure-2024",
	SESSION_TIMEOUT = 300
}

-- Plugin state
local pluginState = {
	sessionId = nil,
	userId = nil,
	connected = false,
	lastSync = 0,
	pendingCommands = {}
}

-- Create plugin toolbar and buttons
local toolbar = plugin:CreateToolbar("BlockForge")
local connectButton = toolbar:CreateButton(
	"Connect",
	"Connect to BlockForge web app",
	"rbxasset://textures/ui/Settings/MenuBarIcons/GameSettingsTab.png"
)
local syncButton = toolbar:CreateButton(
	"Sync",
	"Sync project structure with web app",
	"rbxasset://textures/ui/Settings/MenuBarIcons/BasicSettingsTab.png"
)
local testButton = toolbar:CreateButton(
	"Test",
	"Run tests and send results to web app",
	"rbxasset://textures/ui/TopBar/iconPlay.png"
)

-- UI Widget
local widgetInfo = DockWidgetPluginGuiInfo.new(
	Enum.InitialDockState.Right,
	false,
	false,
	300,
	400,
	200,
	300
)
local widget = plugin:CreateDockWidgetPluginGui("BlockForgeWidget", widgetInfo)
widget.Title = "BlockForge"

-- Create UI
local function createUI()
	local frame = Instance.new("Frame")
	frame.Size = UDim2.new(1, 0, 1, 0)
	frame.BackgroundColor3 = Color3.fromRGB(25, 25, 25)
	frame.Parent = widget
	
	local title = Instance.new("TextLabel")
	title.Size = UDim2.new(1, -20, 0, 40)
	title.Position = UDim2.new(0, 10, 0, 10)
	title.BackgroundTransparency = 1
	title.Text = "BlockForge"
	title.TextColor3 = Color3.fromRGB(255, 255, 255)
	title.Font = Enum.Font.GothamBold
	title.TextSize = 18
	title.TextXAlignment = Enum.TextXAlignment.Left
	title.Parent = frame
	
	local statusLabel = Instance.new("TextLabel")
	statusLabel.Name = "StatusLabel"
	statusLabel.Size = UDim2.new(1, -20, 0, 30)
	statusLabel.Position = UDim2.new(0, 10, 0, 60)
	statusLabel.BackgroundColor3 = Color3.fromRGB(57, 59, 61)
	statusLabel.Text = "Disconnected"
	statusLabel.TextColor3 = Color3.fromRGB(255, 193, 7)
	statusLabel.Font = Enum.Font.Gotham
	statusLabel.TextSize = 14
	statusLabel.Parent = frame
	
	local sessionLabel = Instance.new("TextLabel")
	sessionLabel.Name = "SessionLabel"
	sessionLabel.Size = UDim2.new(1, -20, 0, 60)
	sessionLabel.Position = UDim2.new(0, 10, 0, 100)
	sessionLabel.BackgroundTransparency = 1
	sessionLabel.Text = "Session ID: None"
	sessionLabel.TextColor3 = Color3.fromRGB(189, 190, 190)
	sessionLabel.Font = Enum.Font.GothamMedium
	sessionLabel.TextSize = 12
	sessionLabel.TextWrapped = true
	sessionLabel.TextXAlignment = Enum.TextXAlignment.Left
	sessionLabel.TextYAlignment = Enum.TextYAlignment.Top
	sessionLabel.Parent = frame
	
	local logFrame = Instance.new("ScrollingFrame")
	logFrame.Name = "LogFrame"
	logFrame.Size = UDim2.new(1, -20, 1, -180)
	logFrame.Position = UDim2.new(0, 10, 0, 170)
	logFrame.BackgroundColor3 = Color3.fromRGB(13, 13, 13)
	logFrame.BorderSizePixel = 0
	logFrame.ScrollBarThickness = 6
	logFrame.CanvasSize = UDim2.new(0, 0, 0, 0)
	logFrame.AutomaticCanvasSize = Enum.AutomaticSize.Y
	logFrame.Parent = frame
	
	local logLayout = Instance.new("UIListLayout")
	logLayout.Padding = UDim.new(0, 5)
	logLayout.Parent = logFrame
	
	return frame
end

local ui = createUI()

-- Logging
local function log(message, color)
	color = color or Color3.fromRGB(189, 190, 190)
	
	local logFrame = ui:FindFirstChild("LogFrame")
	if not logFrame then return end
	
	local entry = Instance.new("TextLabel")
	entry.Size = UDim2.new(1, -10, 0, 0)
	entry.BackgroundTransparency = 1
	entry.Text = "[" .. os.date("%H:%M:%S") .. "] " .. message
	entry.TextColor3 = color
	entry.Font = Enum.Font.Code
	entry.TextSize = 11
	entry.TextXAlignment = Enum.TextXAlignment.Left
	entry.TextYAlignment = Enum.TextYAlignment.Top
	entry.TextWrapped = true
	entry.AutomaticSize = Enum.AutomaticSize.Y
	entry.Parent = logFrame
end

-- Update status UI
local function updateStatus(status, color)
	local statusLabel = ui:FindFirstChild("StatusLabel")
	if statusLabel then
		statusLabel.Text = status
		statusLabel.TextColor3 = color
	end
end

-- HTTP Request wrapper
local function httpRequest(method, endpoint, data)
	local success, result = pcall(function()
		local url = CONFIG.SERVER_URL .. endpoint
		local options = {
			Url = url,
			Method = method,
			Headers = {
				["Content-Type"] = "application/json"
			}
		}
		
		if data then
			options.Body = HttpService:JSONEncode(data)
		end
		
		local response = HttpService:RequestAsync(options)
		
		if response.Success then
			return HttpService:JSONDecode(response.Body)
		else
			error("HTTP " .. response.StatusCode .. ": " .. response.StatusMessage)
		end
	end)
	
	if success then
		return result
	else
		warn("HTTP Request failed: " .. tostring(result))
		return nil
	end
end

-- Generate session ID
local function generateSessionId()
	return tostring(tick()) .. "-" .. HttpService:GenerateGUID(false):sub(1, 8)
end

-- Connect to web app
local function connect()
	pluginState.sessionId = generateSessionId()
	pluginState.userId = "studio-" .. tostring(game.PlaceId)
	
	local sessionLabel = ui:FindFirstChild("SessionLabel")
	if sessionLabel then
		sessionLabel.Text = "Session ID:\n" .. pluginState.sessionId
	end
	
	-- Verify connection
	local result = httpRequest("POST", "/api/plugin/verify", {
		sessionId = pluginState.sessionId,
		secret = CONFIG.PLUGIN_SECRET
	})
	
	if result and result.verified then
		pluginState.connected = true
		updateStatus("Connected", Color3.fromRGB(72, 187, 120))
		log("Connected to BlockForge", Color3.fromRGB(72, 187, 120))
		
		-- Send initial project structure
		syncProjectStructure()
		
		-- Start polling for commands
		startCommandPolling()
	else
		updateStatus("Connection Failed", Color3.fromRGB(231, 76, 60))
		log("Failed to connect", Color3.fromRGB(231, 76, 60))
	end
end

-- Disconnect
local function disconnect()
	pluginState.connected = false
	pluginState.sessionId = nil
	updateStatus("Disconnected", Color3.fromRGB(255, 193, 7))
	log("Disconnected from BlockForge", Color3.fromRGB(255, 193, 7))
end

-- Project structure serialization
local function serializeInstance(instance, maxDepth, currentDepth)
	currentDepth = currentDepth or 0
	maxDepth = maxDepth or 10
	
	if currentDepth > maxDepth then
		return nil
	end
	
	local data = {
		ClassName = instance.ClassName,
		Name = instance.Name,
		Properties = {},
		Children = {}
	}
	
	-- Serialize common properties
	local propertiesToSerialize = {"Position", "Size", "Color", "Transparency", "Anchored", "CanCollide"}
	for _, propName in ipairs(propertiesToSerialize) do
		local success, value = pcall(function()
			return instance[propName]
		end)
		if success and value then
			data.Properties[propName] = value
		end
	end
	
	-- Serialize children
	if currentDepth < maxDepth then
		for _, child in ipairs(instance:GetChildren()) do
			local childData = serializeInstance(child, maxDepth, currentDepth + 1)
			if childData then
				table.insert(data.Children, childData)
			end
		end
	end
	
	return data
end

-- Get all scripts in workspace
local function getScripts(parent)
	local scripts = {}
	
	for _, descendant in ipairs(parent:GetDescendants()) do
		if descendant:IsA("Script") or descendant:IsA("LocalScript") or descendant:IsA("ModuleScript") then
			table.insert(scripts, {
				name = descendant.Name,
				path = descendant:GetFullName(),
				content = descendant.Source,
				type = descendant.ClassName
			})
		end
	end
	
	return scripts
end

-- Sync project structure with web app
function syncProjectStructure()
	if not pluginState.connected then
		log("Not connected", Color3.fromRGB(231, 76, 60))
		return
	end
	
	log("Syncing project structure...", Color3.fromRGB(52, 152, 219))
	
	local structure = {
		name = game.Name,
		instances = {},
		scripts = getScripts(game.Workspace)
	}
	
	-- Serialize workspace
	for _, child in ipairs(game.Workspace:GetChildren()) do
		local data = serializeInstance(child, 5)
		if data then
			table.insert(structure.instances, data)
		end
	end
	
	-- Send to server (simulate WebSocket by polling)
	local result = httpRequest("POST", "/api/plugin/sync", {
		sessionId = pluginState.sessionId,
		structure = structure
	})
	
	if result then
		log("Project synced successfully", Color3.fromRGB(72, 187, 120))
		pluginState.lastSync = tick()
	else
		log("Failed to sync project", Color3.fromRGB(231, 76, 60))
	end
end

-- Command polling (simulates WebSocket)
local commandPollConnection
function startCommandPolling()
	if commandPollConnection then
		commandPollConnection:Disconnect()
	end
	
	commandPollConnection = RunService.Heartbeat:Connect(function()
		if not pluginState.connected then
			return
		end
		
		-- Poll for commands every interval
		if tick() - (pluginState.lastPoll or 0) > CONFIG.WS_POLL_INTERVAL then
			pluginState.lastPoll = tick()
			
			local result = httpRequest("GET", "/api/plugin/commands/" .. pluginState.sessionId)
			if result and result.commands then
				for _, command in ipairs(result.commands) do
					executeCommand(command)
				end
			end
		end
	end)
end

-- Load command executors
local CommandExecutor = require(script.CommandExecutor)

-- Execute command from web app
function executeCommand(command)
	log("Executing: " .. command.type, Color3.fromRGB(52, 152, 219))
	
	local success, result = pcall(function()
		return CommandExecutor.execute(command)
	end)
	
	if success then
		log("Command executed: " .. command.type, Color3.fromRGB(72, 187, 120))
		
		-- Send result back
		httpRequest("POST", "/api/plugin/result", {
			sessionId = pluginState.sessionId,
			result = result
		})
		
		-- Re-sync project structure
		task.delay(0.5, syncProjectStructure)
	else
		log("Command failed: " .. tostring(result), Color3.fromRGB(231, 76, 60))
		
		-- Send error back
		httpRequest("POST", "/api/plugin/error", {
			sessionId = pluginState.sessionId,
			error = tostring(result)
		})
	end
end

-- Button handlers
connectButton.Click:Connect(function()
	if pluginState.connected then
		disconnect()
		connectButton:SetActive(false)
	else
		connect()
		connectButton:SetActive(true)
	end
end)

syncButton.Click:Connect(function()
	syncProjectStructure()
end)

testButton.Click:Connect(function()
	local TestRunner = require(script.TestRunner)
	TestRunner.runTests(pluginState.sessionId)
end)

-- Auto-sync on changes
game.Workspace.DescendantAdded:Connect(function()
	if pluginState.connected and tick() - pluginState.lastSync > 2 then
		syncProjectStructure()
	end
end)

game.Workspace.DescendantRemoving:Connect(function()
	if pluginState.connected and tick() - pluginState.lastSync > 2 then
		syncProjectStructure()
	end
end)

log("BlockForge Plugin loaded", Color3.fromRGB(52, 152, 219))
log("Click 'Connect' to start", Color3.fromRGB(189, 190, 190))
