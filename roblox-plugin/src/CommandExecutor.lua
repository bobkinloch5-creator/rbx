-- Command Executor Module
-- Handles execution of commands received from the web app

local ChangeHistoryService = game:GetService("ChangeHistoryService")
local InsertService = game:GetService("InsertService")
local Selection = game:GetService("Selection")

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

-- Create new instance
function CommandExecutor.createObject(command)
	local data = command.data
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
				instance[key] = value
			end)
			if not success then
				warn("Failed to set property " .. key .. ": " .. tostring(err))
			end
		end
	end
	
	instance.Parent = parent
	
	-- Record for undo
	ChangeHistoryService:SetWaypoint("Created " .. name)
	
	return {
		success = true,
		instanceName = name,
		instancePath = instance:GetFullName()
	}
end

-- Edit script content
function CommandExecutor.editScript(command)
	local data = command.data
	local scriptPath = command.target
	local newContent = data.content
	
	local script = findInstance(scriptPath)
	if not script or not (script:IsA("Script") or script:IsA("LocalScript") or script:IsA("ModuleScript")) then
		error("Script not found: " .. scriptPath)
	end
	
	script.Source = newContent
	
	-- Record for undo
	ChangeHistoryService:SetWaypoint("Edited " .. script.Name)
	
	return {
		success = true,
		scriptName = script.Name
	}
end

-- Set property on instance
function CommandExecutor.setProperty(command)
	local data = command.data
	local targetPath = command.target
	local property = data.property
	local value = data.value
	
	local instance = findInstance(targetPath)
	if not instance then
		error("Instance not found: " .. targetPath)
	end
	
	-- Set property
	local success, err = pcall(function()
		instance[property] = value
	end)
	
	if not success then
		error("Failed to set property: " .. tostring(err))
	end
	
	-- Record for undo
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
	local data = command.data
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
		
		-- Select the inserted model
		Selection:Set({actualModel})
		
		-- Record for undo
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
		error("Instance not found: " .. targetPath)
	end
	
	local name = instance.Name
	instance:Destroy()
	
	-- Record for undo
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

return CommandExecutor
