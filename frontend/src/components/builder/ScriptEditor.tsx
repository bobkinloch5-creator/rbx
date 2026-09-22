import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useBuilderStore } from '../../hooks/useBuilderStore';
import { 
  Save, 
  Plus, 
  Check, 
  Code
} from 'lucide-react';

const STARTER_SCRIPTS: Record<string, string> = {
  'GameManager.server.luau': `--!strict
-- BlockForge AI Generated Server Script
local Players = game:GetService("Players")
local DataStoreService = game:GetService("DataStoreService")

print("🚀 [BlockForge] GameManager Initialized!")

-- Player Added Handler (Leaderstats setup)
Players.PlayerAdded:Connect(function(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local stage = Instance.new("IntValue")
    stage.Name = "Stage"
    stage.Value = 1
    stage.Parent = leaderstats

    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = 0
    coins.Parent = leaderstats

    print("✨ Initialized stats for player:", player.Name)
end)

-- Auto-Save & Cleanup on Exit
Players.PlayerRemoving:Connect(function(player)
    print("👋 Player leaving session:", player.Name)
end)
`,

  'CheckpointService.luau': `--!strict
-- BlockForge Checkpoint & Teleport Service
local Players = game:GetService("Players")
local Workspace = game:GetService("Workspace")

local function onTouched(hit, checkpointStage)
    local character = hit.Parent
    local humanoid = character and character:FindFirstChildOfClass("Humanoid")
    if not humanoid then return end

    local player = Players:GetPlayerFromCharacter(character)
    if player and player:FindFirstChild("leaderstats") then
        local stageStat = player.leaderstats:FindFirstChild("Stage")
        if stageStat and stageStat.Value < checkpointStage then
            stageStat.Value = checkpointStage
            print("🎉 " .. player.Name .. " reached Checkpoint " .. checkpointStage .. "!")
        end
    end
end

print("🏁 [BlockForge] Checkpoint Service Ready!")
`,

  'ShopHandler.luau': `--!strict
-- BlockForge In-Game Shop & Rewards Handler
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")

local ShopItems = {
    SpeedBoost = { Price = 50, Speed = 32 },
    JumpCoil = { Price = 100, JumpPower = 75 },
    RainbowTrail = { Price = 250, Cosmetic = true }
}

print("🛍️ [BlockForge] Shop System Ready with " .. #ShopItems .. " catalog items.")
`
};

export default function ScriptEditor() {
  const { currentScript, sendCommand, isPluginConnected } = useBuilderStore();
  const [activeTab, setActiveTab] = useState<string>('GameManager.server.luau');
  const [scripts, setScripts] = useState<Record<string, string>>(STARTER_SCRIPTS);
  const [isDirty, setIsDirty] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync with store if currentScript is set
  useEffect(() => {
    if (currentScript) {
      setActiveTab(currentScript.name);
      setScripts((prev) => ({
        ...prev,
        [currentScript.name]: currentScript.content
      }));
      setIsDirty(false);
    }
  }, [currentScript]);

  const activeContent = scripts[activeTab] || '-- New Script\nprint("Hello from BlockForge!")\n';

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setScripts((prev) => ({ ...prev, [activeTab]: value }));
      setIsDirty(true);
    }
  };

  const handleSave = () => {
    setIsDirty(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);

    if (isPluginConnected) {
      sendCommand({
        type: 'editScript',
        target: activeTab,
        data: { content: activeContent }
      });
    }
  };

  const handleNewScript = () => {
    const newName = `Script_${Object.keys(scripts).length + 1}.luau`;
    const template = `--!strict\n-- ${newName}\nlocal Players = game:GetService("Players")\n\nprint("Script initialized: ${newName}")\n`;
    setScripts((prev) => ({ ...prev, [newName]: template }));
    setActiveTab(newName);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 select-none overflow-hidden border-t border-white/10">
      {/* Editor Tab Bar */}
      <div className="h-10 bg-slate-900 flex items-center justify-between px-2 border-b border-white/10">
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-1">
          {Object.keys(scripts).map((scriptName) => {
            const isActive = activeTab === scriptName;
            return (
              <button
                key={scriptName}
                onClick={() => {
                  setActiveTab(scriptName);
                  setIsDirty(false);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm border border-white/10 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Code className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span className="truncate max-w-[140px]">{scriptName}</span>
                {isActive && isDirty && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </button>
            );
          })}

          <button
            onClick={handleNewScript}
            title="Create New Luau Script"
            className="p-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {savedSuccess && (
            <span className="text-[11px] text-emerald-400 flex items-center space-x-1">
              <Check className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Saved</span>
            </span>
          )}

          <button
            onClick={handleSave}
            title="Save script changes"
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-roblox-red to-red-600 hover:from-red-600 hover:to-roblox-red text-white text-xs font-semibold shadow transition-all active:scale-95"
          >
            <Save className="w-3 h-3" />
            <span>Save Script</span>
          </button>
        </div>
      </div>

      {/* Monaco Code Editor */}
      <div className="flex-1 relative overflow-hidden bg-[#1e1e1e]">
        <Editor
          height="100%"
          language="lua"
          value={activeContent}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on',
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            folding: true,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            bracketPairColorization: { enabled: true },
            renderLineHighlight: 'all',
            padding: { top: 8, bottom: 8 }
          }}
        />

        {/* Bottom Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-[11px] font-mono z-10 select-none">
          <div className="flex items-center space-x-3">
            <span>Luau Language Server: Active</span>
            <span>UTF-8</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Roblox Engine 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
