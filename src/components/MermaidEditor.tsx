
import React, { useState, useEffect } from 'react';
import mermaid from 'mermaid';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  Loader2, Copy, Check, RefreshCw, Zap, Code, Settings, 
  X, Save, Key
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from '@/components/ui/label';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'Inter, sans-serif',
});

const DEFAULT_DIAGRAM = `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
`;

const EXAMPLES = {
  flowchart: `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`,
  sequence: `sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!`,
  classDiagram: `classDiagram
    class Animal {
        +name: string
        +eat(): void
        +sleep(): void
    }
    class Dog {
        +bark(): void
    }
    Animal <|-- Dog`,
  stateDiagram: `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`,
  gantt: `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2023-01-01, 30d
    Another task     :after a1, 20d
    section Another
    Task in sec      :2023-01-12, 12d
    another task     :24d`,
};

// Example prompts to help users get started
const EXAMPLE_PROMPTS = [
  "Create a flowchart showing the user registration process",
  "Draw a sequence diagram for API authentication flow",
  "Make a state diagram for a shopping cart checkout process",
  "Design a class hierarchy for a vehicle rental system",
  "Generate a gantt chart for a website development project"
];

export const MermaidEditor: React.FC = () => {
  const [code, setCode] = useState<string>(DEFAULT_DIAGRAM);
  const [renderKey, setRenderKey] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'prompt' | 'code'>('prompt');
  const [apiKey, setApiKey] = useState<string>('');
  const [apiKeySet, setApiKeySet] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  // Re-render diagram when code changes
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setError(null);
        setRenderKey(prev => prev + 1);
      } catch (err) {
        setError('Error rendering diagram');
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [code]);

  // Initialize mermaid rendering
  useEffect(() => {
    try {
      mermaid.contentLoaded();
    } catch (err) {
      console.error('Mermaid initialization error:', err);
    }
  }, [renderKey]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(DEFAULT_DIAGRAM);
    setAiPrompt('');
  };

  const handleExampleSelect = (example: keyof typeof EXAMPLES) => {
    setCode(EXAMPLES[example]);
  };

  const handleExamplePromptSelect = (prompt: string) => {
    setAiPrompt(prompt);
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      setApiKeySet(true);
      setSettingsOpen(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    if (!apiKeySet) {
      setError('Please set your OpenAI API key in settings first');
      setSettingsOpen(true);
      return;
    }
    
    setAiLoading(true);
    
    try {
      // In a real implementation, this would call the OpenAI API
      const response = await callOpenAI(aiPrompt);
      setCode(response);
      setAiLoading(false);
    } catch (error) {
      console.error('Error generating diagram:', error);
      setError('Failed to generate diagram with AI');
      setAiLoading(false);
    }
  };

  // Mock OpenAI API call - in a real app, this would use the actual API
  const callOpenAI = async (prompt: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate different diagram types based on the prompt
    if (prompt.toLowerCase().includes('flowchart') || prompt.toLowerCase().includes('flow')) {
      return `graph TD
    A[${prompt.slice(0, 15)}] --> B{Decision Point}
    B -->|Option 1| C[Process 1]
    B -->|Option 2| D[Process 2]
    C --> E[Result 1]
    D --> F[Result 2]
    E --> G[Conclusion]
    F --> G`;
    } else if (prompt.toLowerCase().includes('sequence')) {
      return `sequenceDiagram
    participant User
    participant System
    participant Database
    User->>System: Request Data
    System->>Database: Query
    Database-->>System: Return Results
    System-->>User: Display Information`;
    } else if (prompt.toLowerCase().includes('class')) {
      return `classDiagram
    class Main {
      +start()
    }
    class Component {
      +render()
    }
    class Model {
      -data
      +getData()
      +setData()
    }
    Main --> Component
    Component --> Model`;
    } else if (prompt.toLowerCase().includes('state')) {
      return `stateDiagram-v2
    [*] --> Initial
    Initial --> Processing
    Processing --> Success
    Processing --> Error
    Success --> [*]
    Error --> Retry
    Retry --> Processing`;
    } else if (prompt.toLowerCase().includes('gantt')) {
      return `gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Requirements    :a1, 2023-06-01, 10d
    Design          :after a1, 15d
    section Development
    Implementation  :2023-06-25, 20d
    Testing         :after Implementation, 10d
    section Deployment
    Release         :2023-07-25, 5d`;
    } else {
      return `graph TD
    A[${prompt.slice(0, 20)}] --> B{Decision?}
    B -->|Option 1| C[Result 1]
    B -->|Option 2| D[Result 2]
    C --> E[Conclusion]
    D --> E`;
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-4">
        <Tabs defaultValue="prompt" className="w-full" onValueChange={(value) => setActiveTab(value as 'prompt' | 'code')}>
          <div className="flex items-center justify-between w-full">
            <TabsList>
              <TabsTrigger value="prompt" className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                AI Prompt
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-1">
                <Code className="h-4 w-4" />
                Mermaid Code
              </TabsTrigger>
            </TabsList>
            
            <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <Settings className="h-4 w-4" />
                  {apiKeySet ? "API Key Set" : "Set API Key"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">OpenAI API Settings</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => setSettingsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">OpenAI API Key</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="apiKey"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..."
                        className="flex-1"
                      />
                      <Button 
                        size="sm" 
                        onClick={handleSaveApiKey}
                        disabled={!apiKey.trim()}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Your API key is stored locally in your browser and never sent to our servers.
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </Tabs>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 h-full">
        {/* Left Panel - Changes based on active tab */}
        <div className="flex flex-col w-full md:w-1/2 h-full">
          {activeTab === 'prompt' ? (
            <>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-medium">Describe Your Diagram</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReset}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
              
              <Card className="p-4 mb-4 flex-1">
                <div className="flex flex-col h-full">
                  <Textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="text-sm flex-1 min-h-[200px] mb-4"
                    placeholder="Describe the diagram you want to create..."
                  />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Example Prompts</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {EXAMPLE_PROMPTS.map((prompt, index) => (
                        <Button 
                          key={index} 
                          variant="outline" 
                          size="sm" 
                          className="text-left justify-start h-auto py-2 px-3"
                          onClick={() => handleExamplePromptSelect(prompt)}
                        >
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
              
              <Button 
                onClick={handleAiGenerate} 
                disabled={aiLoading || !aiPrompt.trim()}
                className="w-full"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Diagram
                  </>
                )}
              </Button>
              
              {!apiKeySet && (
                <div className="mt-2 text-amber-600 text-sm flex items-center">
                  <Key className="h-4 w-4 mr-1" />
                  Please set your OpenAI API key in settings first
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-medium">Mermaid Code</h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopy}
                    className="flex items-center gap-1"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleReset}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
              
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono text-sm flex-1 min-h-[300px] resize-none mb-4"
                placeholder="Enter mermaid diagram code here..."
              />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Examples</h3>
                <Tabs defaultValue="flowchart">
                  <TabsList>
                    <TabsTrigger value="flowchart" onClick={() => handleExampleSelect('flowchart')}>
                      Flowchart
                    </TabsTrigger>
                    <TabsTrigger value="sequence" onClick={() => handleExampleSelect('sequence')}>
                      Sequence
                    </TabsTrigger>
                    <TabsTrigger value="classDiagram" onClick={() => handleExampleSelect('classDiagram')}>
                      Class
                    </TabsTrigger>
                    <TabsTrigger value="stateDiagram" onClick={() => handleExampleSelect('stateDiagram')}>
                      State
                    </TabsTrigger>
                    <TabsTrigger value="gantt" onClick={() => handleExampleSelect('gantt')}>
                      Gantt
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </>
          )}
        </div>
        
        <Separator orientation="vertical" className="hidden md:block" />
        <Separator className="md:hidden" />
        
        {/* Preview Panel - Always the same */}
        <div className="w-full md:w-1/2 h-full">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-medium">Preview</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              className="flex items-center gap-1"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy Code'}
            </Button>
          </div>
          <Card className="p-4 min-h-[400px] overflow-auto bg-white">
            {error ? (
              <div className="text-red-500 p-4 border border-red-200 rounded-md">
                {error}
              </div>
            ) : (
              <div key={renderKey} className="mermaid">
                {code}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MermaidEditor;
