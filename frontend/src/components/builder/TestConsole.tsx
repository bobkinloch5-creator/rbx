import { useBuilderStore } from '../../hooks/useBuilderStore';
import { aiService } from '../../lib/api';
import { Terminal, X, AlertCircle, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { useState } from 'react';

interface TestConsoleProps {
  onClose: () => void;
}

export default function TestConsole({ onClose }: TestConsoleProps) {
  const { testResults, sessionId } = useBuilderStore();
  const [fixSuggestion, setFixSuggestion] = useState<string | null>(null);
  const [isLoadingFix, setIsLoadingFix] = useState(false);

  const handleGetFix = async (errorMessage: string) => {
    if (!sessionId) return;

    setIsLoadingFix(true);
    try {
      const { analysis } = await aiService.analyzeError(errorMessage, sessionId);
      setFixSuggestion(analysis);
    } catch (error) {
      console.error('Failed to get fix suggestion:', error);
    } finally {
      setIsLoadingFix(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-4 h-4 text-green-400" />
    ) : (
      <XCircle className="w-4 h-4 text-red-400" />
    );
  };

  return (
    <div className="h-full flex flex-col bg-roblox-dark border-t-2 border-roblox-red">
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4" />
          <span>Test Console</span>
        </div>
        <button onClick={onClose} className="hover:text-roblox-red">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {testResults.length === 0 ? (
          <div className="text-center text-roblox-light py-8">
            <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No test results yet</p>
            <p className="text-sm mt-2">Run tests in Roblox Studio to see results here</p>
          </div>
        ) : (
          testResults.map((result, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center space-x-2 font-semibold">
                {getStatusIcon(result.success)}
                <span>Test Run #{idx + 1}</span>
                <span className="text-xs text-roblox-light">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>

              {result.errors && result.errors.length > 0 && (
                <div className="space-y-2">
                  {result.errors.map((error: any, errorIdx: number) => (
                    <div
                      key={errorIdx}
                      className="bg-red-900/20 border border-red-500/30 rounded p-3"
                    >
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <p className="text-sm text-red-400 font-mono">
                            {error.message}
                          </p>
                          {error.file && (
                            <p className="text-xs text-roblox-light">
                              {error.file}
                              {error.line && `:${error.line}`}
                            </p>
                          )}
                          {error.stack && (
                            <pre className="text-xs bg-roblox-darker p-2 rounded overflow-x-auto">
                              {error.stack}
                            </pre>
                          )}
                          <button
                            onClick={() => handleGetFix(error.message)}
                            disabled={isLoadingFix}
                            className="text-xs bg-roblox-red hover:bg-roblox-red/90 disabled:bg-roblox-gray px-3 py-1 rounded flex items-center space-x-1"
                          >
                            <Lightbulb className="w-3 h-3" />
                            <span>Get AI Fix</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {result.warnings && result.warnings.length > 0 && (
                <div className="space-y-1">
                  {result.warnings.map((warning: string, warnIdx: number) => (
                    <div
                      key={warnIdx}
                      className="bg-yellow-900/20 border border-yellow-500/30 rounded p-2 text-sm text-yellow-400"
                    >
                      {warning}
                    </div>
                  ))}
                </div>
              )}

              {result.suggestions && result.suggestions.length > 0 && (
                <div className="bg-blue-900/20 border border-blue-500/30 rounded p-3">
                  <p className="text-sm font-semibold text-blue-400 mb-2">
                    Suggestions:
                  </p>
                  <ul className="text-sm text-roblox-light space-y-1">
                    {result.suggestions.map((suggestion: string, sugIdx: number) => (
                      <li key={sugIdx}>• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}

        {fixSuggestion && (
          <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="w-4 h-4 text-green-400" />
              <p className="font-semibold text-green-400">AI Fix Suggestion</p>
            </div>
            <div className="text-sm whitespace-pre-wrap">{fixSuggestion}</div>
          </div>
        )}
      </div>
    </div>
  );
}
