
import React, { useState, useEffect } from 'react';
import mermaid from 'mermaid';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Loader2, Copy, Check, RefreshCw, Zap } from 'lucide-react';

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

export const MermaidEditor: React.FC = () => {
  const [code, setCode] = useState<string>(DEFAULT_DIAGRAM);
  const [renderKey, setRenderKey] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

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
  };

  const handleExampleSelect = (example: keyof typeof EXAMPLES) => {
    setCode(EXAMPLES[example]);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setAiLoading(true);
    
    try {
      // This is a mock implementation - in a real app, you would call an API
      // that connects to GPT-4o-mini to generate the diagram
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate AI response with a simple diagram based on the prompt
      const aiGeneratedCode = `graph TD
    A[${aiPrompt.slice(0, 20)}] --> B{Decision?}
    B -->|Option 1| C[Result 1]
    B -->|Option 2| D[Result 2]
    C --> E[Conclusion]
    D --> E`;
      
      setCode(aiGeneratedCode);
      setAiLoading(false);
    } catch (error) {
      console.error('Error generating diagram:', error);
      setError('Failed to generate diagram with AI');
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col md:flex-row h-full gap-4">
        {/* Editor Panel */}
        <div className="flex flex-col w-full md:w-1/2 h-full">
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
            className="font-mono text-sm flex-1 min-h-[300px] resize-none"
            placeholder="Enter mermaid diagram code here..."
          />
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">AI Assistant</h3>
            <div className="flex gap-2">
              <Textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="text-sm flex-1"
                placeholder="Describe the diagram you want to create..."
              />
              <Button 
                onClick={handleAiGenerate} 
                disabled={aiLoading || !aiPrompt.trim()}
                className="flex items-center gap-1"
              >
                {aiLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                Generate
              </Button>
            </div>
          </div>
        </div>
        
        <Separator orientation="vertical" className="hidden md:block" />
        <Separator className="md:hidden" />
        
        {/* Preview Panel */}
        <div className="w-full md:w-1/2 h-full">
          <h2 className="text-lg font-medium mb-2">Preview</h2>
          <Card className="p-4 h-[calc(100%-2rem)] overflow-auto bg-white">
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
      
      <div className="mt-4">
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
    </div>
  );
};

export default MermaidEditor;
