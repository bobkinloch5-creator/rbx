-- BlockForge Plugin
-- Combined plugin file with all modules embedded

local HttpService = game:GetService("HttpService")
local ChangeHistoryService = game:GetService("ChangeHistoryService")
local InsertService = game:GetService("InsertService")
local Selection = game:GetService("Selection")
local RunService = game:GetService("RunService")
local LogService = game:GetService("LogService")

-- Configuration
local CONFIG = {
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
	lastPoll = 0,
	pendingCommands = {}
}

-- Command Executor Module
local CommandExecutor = {}

-- Find instance by path
local function findInstance(path)
	local parts = string.split(path, ".")
	local current = game

	for _, part in ipairs(parts) do
		current = current:FindFirstChild(part)
		if not current then
			return nil
		end
	end

	return current
end

-- Apply value to instance (handles Vector3, Color3, BrickColor)
local function applyValue(instance, key, value)
	if typeof(value) == "table" then
		if value.X ~= nil and value.Y ~= nil and value.Z ~= nil then
			instance[key] = Vector3.new(value.X, value.Y, value.Z)
			return
		end
		if value.R ~= nil and value.G ~= nil and value.B ~= nil then
			instance[key] = Color3.fromRGB(value.R, value.G, value.B)
			return
		end
	end
	if key == "BrickColor" and typeof(value) == "string" then
		instance[key] = BrickColor.new(value)
		return
	end
	instance[key] = value
end

-- Create new instance
function CommandExecutor.createObject(command)
	local data = command.data or {}
	local className = data.className or "Part"
	local name = data.name or "NewObject"
	local parent = data.parent and findInstance(data.parent) or game.Workspace

	if not parent then
		error("Parent not found: " .. tostring(data.parent))
	end

	-- Create instance
	local instance = Instance.new(className)
	instance.Name = name

	-- Set properties
	if data.properties then
		for key, value in pairs(data.properties) do
			local success, err = pcall(function()
				applyValue(instance, key, value)
			end)
			if not success then
				warn("Failed to set property " .. key .. ": " .. tostring(err))
			end
		end
	end

	instance.Parent = parent
	ChangeHistoryService:SetWaypoint("Created " .. name)

	return {
		success = true,
		instanceName = name,
		instancePath = instance:GetFullName()
	}
end

-- Edit script content
function CommandExecutor.editScript(command)
	local data = command.data or {}
	local scriptPath = command.target
	local newContent = data.content

	local scriptObj = findInstance(scriptPath)
	if not scriptObj or not (scriptObj:IsA("Script") or scriptObj:IsA("LocalScript") or scriptObj:IsA("ModuleScript")) then
		error("Script not found: " .. tostring(scriptPath))
	end

	scriptObj.Source = newContent
	ChangeHistoryService:SetWaypoint("Edited " .. scriptObj.Name)

	return {
		success = true,
		scriptName = scriptObj.Name
	}
end

-- Set property on instance
function CommandExecutor.setProperty(command)
	local data = command.data or {}
	local targetPath = command.target
	local property = data.property
	local value = data.value

	local instance = findInstance(targetPath)
	if not instance then
		error("Instance not found: " .. tostring(targetPath))
	end

	-- Set property
	local success, err = pcall(function()
		applyValue(instance, property, value)
	end)

	if not success then
		error("Failed to set property: " .. tostring(err))
	end

	ChangeHistoryService:SetWaypoint("Set " .. property .. " on " .. instance.Name)

	return {
		success = true,
		instanceName = instance.Name,
		property = property,
		value = value
	}
end

-- Insert asset from Roblox catalog
function CommandExecutor.insertAsset(command)
	local data = command.data or {}
	local assetId = data.assetId
	local assetName = data.name or "Asset"

	-- Insert asset
	local success, model = pcall(function()
		return InsertService:LoadAsset(assetId)
	end)

	if not success or not model then
		error("Failed to load asset: " .. tostring(assetId))
	end

	-- Get the actual model from the returned object
	local actualModel = model:GetChildren()[1]
	if actualModel then
		actualModel.Name = assetName
		actualModel.Parent = game.Workspace
		model:Destroy()
		Selection:Set({actualModel})
		ChangeHistoryService:SetWaypoint("Inserted " .. assetName)

		return {
			success = true,
			assetName = assetName,
			assetPath = actualModel:GetFullName()
		}
	else
		model:Destroy()
		error("Asset is empty")
	end
end

-- Delete instance
function CommandExecutor.deleteObject(command)
	local targetPath = command.target
	local instance = findInstance(targetPath)
	if not instance then
		error("Instance not found: " .. tostring(targetPath))
	end

	local name = instance.Name
	instance:Destroy()
	ChangeHistoryService:SetWaypoint("Deleted " .. name)

	return {
		success = true,
		deletedName = name
	}
end

-- Main execution dispatcher
function CommandExecutor.execute(command)
	local commandType = command.type

	if commandType == "create" then
		return CommandExecutor.createObject(command)
	elseif commandType == "edit" then
		return CommandExecutor.editScript(command)
	elseif commandType == "setProperty" then
		return CommandExecutor.setProperty(command)
	elseif commandType == "insertAsset" then
		return CommandExecutor.insertAsset(command)
	elseif commandType == "delete" then
		return CommandExecutor.deleteObject(command)
	else
		error("Unknown command type: " .. tostring(commandType))
	end
end

-- Test Runner Module
local TestRunner = {}
local testErrors = {}
local testWarnings = {}

-- Monitor script errors
local function setupErrorMonitoring()
	testErrors = {}
	testWarnings = {}

	LogService.MessageOut:Connect(function(message, messageType)
		if messageType == Enum.MessageType.MessageError then
			table.insert(testErrors, {
				message = message,
				timestamp = tick()
			})
		elseif messageType == Enum.MessageType.MessageWarning then
			table.insert(testWarnings, message)
		end
	end)
end

-- Parse error message for file and line
local function parseError(errorMessage)
	local file, line, message = string.match(errorMessage, "(.-):%s*(%d+):%s*(.+)")

	if file and line then
		return {
			message = message or errorMessage,
			file = file,
			line = tonumber(line),
			stack = errorMessage
		}
	end

	return {
		message = errorMessage,
		stack = errorMessage
	}
end

-- Analyze scripts for common issues
local function analyzeScripts()
	local issues = {}

	for _, scriptObj in ipairs(game.Workspace:GetDescendants()) do
		if scriptObj:IsA("Script") or scriptObj:IsA("LocalScript") or scriptObj:IsA("ModuleScript") then
			local source = scriptObj.Source

			-- Check for common issues
			if source:match("wait%(%s*%)") then
				table.insert(issues, {
					file = scriptObj:GetFullName(),
					message = "Using wait() without arguments - may cause performance issues",
					type = "warning"
				})
			end

			if source:match("while%s+true%s+do") and not source:match("wait%(") then
				table.insert(issues, {
					file = scriptObj:GetFullName(),
					message = "Infinite loop without wait() - will freeze the game",
					type = "error"
				})
			end

			if source:match("_G%.") then
				table.insert(issues, {
					file = scriptObj:GetFullName(),
					message = "Using _G global table - consider using ModuleScripts",
					type = "warning"
				})
			end
		end
	end

	return issues
end

-- Generate improvement suggestions
local function generateSuggestions(errors, warnings)
	local suggestions = {}

	if #errors > 0 then
		table.insert(suggestions, "Fix script errors before testing gameplay")
	end

	if #warnings > 5 then
		table.insert(suggestions, "Consider addressing warnings to improve code quality")
	end

	-- Check for performance issues
	local partCount = #game.Workspace:GetDescendants()
	if partCount > 10000 then
		table.insert(suggestions, "High part count (" .. partCount .. ") - consider optimizing geometry")
	end

	return suggestions
end

-- Run tests
function TestRunner.runTests(sessionId)
	print("[BlockForge] Running tests...")

	setupErrorMonitoring()
	task.wait(2)

	local staticIssues = analyzeScripts()
	local allErrors = {}

	for _, err in ipairs(testErrors) do
		table.insert(allErrors, parseError(err.message))
	end

	for _, issue in ipairs(staticIssues) do
		if issue.type == "error" then
			table.insert(allErrors, issue)
		elseif issue.type == "warning" then
			table.insert(testWarnings, issue.message)
		end
	end

	local suggestions = generateSuggestions(allErrors, testWarnings)
	local result = {
		success = #allErrors == 0,
		errors = allErrors,
		warnings = testWarnings,
		suggestions = suggestions,
		timestamp = tick()
	}

	-- Send to web app
	local success, response = pcall(function()
		return HttpService:RequestAsync({
			Url = CONFIG.SERVER_URL .. "/api/plugin/test-result",
			Method = "POST",
			Headers = {
				["Content-Type"] = "application/json"
			},
			Body = HttpService:JSONEncode({
				sessionId = sessionId,
				result = result
			})
		})
	end)

	if success then
		print("[BlockForge] Test results sent to web app")
	else
		warn("[BlockForge] Failed to send test results: " .. tostring(response))
	end

	if #allErrors == 0 then
		print("[BlockForge] All tests passed")
	else
		warn("[BlockForge] Found " .. #allErrors .. " errors")
		for _, err in ipairs(allErrors) do
			warn("  - " .. err.message)
		end
	end

	if #testWarnings > 0 then
		print("[BlockForge] " .. #testWarnings .. " warnings")
	end

	return result
end

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
local settingsButton = toolbar:CreateButton(
	"Settings",
	"Set the BlockForge backend URL",
	"rbxasset://textures/ui/Settings/MenuBarIcons/BasicSettingsTab.png"
)

-- UI Widget
local widgetInfo = DockWidgetPluginGuiInfo.new(
	Enum.InitialDockState.Right,
	true,
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
	if not logFrame then
		return
	end

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
		warn("[BlockForge] HTTP Request failed: " .. tostring(result))
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
		log("Failed to connect. Enable HTTP requests and start the BlockForge server.", Color3.fromRGB(231, 76, 60))
	end
end

-- Disconnect
local function disconnect()
	pluginState.connected = false
	pluginState.sessionId = nil
	if commandPollConnection then
		commandPollConnection:Disconnect()
		commandPollConnection = nil
	end
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
		if success and value ~= nil then
			if typeof(value) == "Vector3" then
				data.Properties[propName] = { X = value.X, Y = value.Y, Z = value.Z }
			elseif typeof(value) == "Color3" then
				data.Properties[propName] = {
					R = math.floor(value.R * 255),
					G = math.floor(value.G * 255),
					B = math.floor(value.B * 255)
				}
			else
				data.Properties[propName] = value
			end
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

	-- Send to server
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

-- Execute command from web app (HTTP fallback)
local function executeCommand(command)
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
	TestRunner.runTests(pluginState.sessionId)
end)

settingsButton.Click:Connect(function()
	local currentUrl = CONFIG.SERVER_URL
	local ok, result = pcall(function()
		return plugin:PromptForInputAsync("BlockForge backend URL", currentUrl)
	end)
	if ok and result and result ~= "" then
		CONFIG.SERVER_URL = tostring(result):gsub("/+$", "")
		plugin:SetSetting("BlockForgeServerUrl", CONFIG.SERVER_URL)
		log("Server URL set to " .. CONFIG.SERVER_URL, Color3.fromRGB(52, 152, 219))
	end
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