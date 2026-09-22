import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useBuilderStore } from '../../hooks/useBuilderStore';
import { FileCode, Save, Download } from 'lucide-react';

export default function ScriptEditor() {
  const { currentScript, setCurrentScript, sendCommand } = useBuilderStore();
  const [localContent, setLocalContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (currentScript) {
      setLocalContent(currentScript.content);
      setIsDirty(false);
    }
  }, [currentScript]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setLocalContent(value);
      setIsDirty(value !== currentScript?.content);
    }
  };

  const handleSave = () => {
    if (!currentScript || !isDirty) return;

    sendCommand({
      type: 'edit',
      target: currentScript.path,
      data: { content: localContent }
    });

    setCurrentScript({ ...currentScript, content: localContent });
    setIsDirty(false);
  };

  return (
    <div className="h-full flex flex-col bg-roblox-dark">
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileCode className="w-4 h-4" />
          <span>{currentScript ? currentScript.name : 'Script Editor'}</span>
          {isDirty && <span className="text-xs text-yellow-400">• Modified</span>}
        </div>
        {currentScript && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className="text-xs bg-roblox-red hover:bg-roblox-red/90 disabled:bg-roblox-gray disabled:cursor-not-allowed px-3 py-1 rounded flex items-center space-x-1"
            >
              <Save className="w-3 h-3" />
              <span>Save</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex-1">
        {currentScript ? (
          <Editor
            height="100%"
            defaultLanguage="lua"
            value={localContent}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              folding: true,
              bracketPairColorization: { enabled: true }
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-roblox-light">
            <div className="text-center">
              <FileCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a script to edit</p>
              <p className="text-sm mt-2">Or ask AI to create a new script</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
