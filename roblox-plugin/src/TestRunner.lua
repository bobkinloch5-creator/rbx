-- Test Runner Module
-- Runs tests in the game and sends results to the web app

local HttpService = game:GetService("HttpService")
local RunService = game:GetService("RunService")

local TestRunner = {}

-- Configuration
local SERVER_URL = "https://YOUR-BACKEND-DOMAIN.example.com"

-- Collect all test errors from output
local testErrors = {}
local testWarnings = {}

-- Monitor script errors
local function setupErrorMonitoring()
	testErrors = {}
	testWarnings = {}
	
	-- Hook into script errors
	game:GetService("LogService").MessageOut:Connect(function(message, messageType)
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
	
	for _, script in ipairs(game.Workspace:GetDescendants()) do
		if script:IsA("Script") or script:IsA("LocalScript") or script:IsA("ModuleScript") then
			local source = script.Source
			
			-- Check for common issues
			if source:match("wait%(%s*%)") then
				table.insert(issues, {
					file = script:GetFullName(),
					message = "Using wait() without arguments - may cause performance issues",
					type = "warning"
				})
			end
			
			if source:match("while%s+true%s+do") and not source:match("wait%(") then
				table.insert(issues, {
					file = script:GetFullName(),
					message = "Infinite loop without wait() - will freeze the game",
					type = "error"
				})
			end
			
			if source:match("_G%.") then
				table.insert(issues, {
					file = script:GetFullName(),
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
	print("Running tests...")
	
	setupErrorMonitoring()
	
	-- Wait a bit for any immediate errors
	wait(2)
	
	-- Analyze for static issues
	local staticIssues = analyzeScripts()
	
	-- Combine errors
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
	
	-- Generate suggestions
	local suggestions = generateSuggestions(allErrors, testWarnings)
	
	-- Build result
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
			Url = SERVER_URL .. "/api/plugin/test-result",
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
		print("Test results sent to web app")
	else
		warn("Failed to send test results: " .. tostring(response))
	end
	
	-- Print summary
	if #allErrors == 0 then
		print("✓ All tests passed!")
	else
		warn("✗ Found " .. #allErrors .. " errors")
		for _, err in ipairs(allErrors) do
			warn("  - " .. err.message)
		end
	end
	
	if #testWarnings > 0 then
		print("⚠ " .. #testWarnings .. " warnings")
	end
	
	return result
end

return TestRunner
