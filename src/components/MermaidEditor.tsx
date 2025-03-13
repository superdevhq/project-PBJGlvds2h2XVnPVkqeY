
import React, { useState, useEffect } from 'react';
import mermaid from 'mermaid';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Loader2, Copy, Check, RefreshCw, Zap, MessageSquare, Code } from 'lucide-react';

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
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ai' | 'code'>('ai');
  const [aiConversation, setAiConversation] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);

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
    setAiConversation([]);
  };

  const handleExampleSelect = (example: keyof typeof EXAMPLES) => {
    setCode(EXAMPLES[example]);
  };

  const handleExamplePromptSelect = (prompt: string) => {
    setAiPrompt(prompt);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setAiLoading(true);
    
    try {
      // Add user message to conversation
      const updatedConversation = [
        ...aiConversation,
        { role: 'user', content: aiPrompt }
      ];
      setAiConversation(updatedConversation);
      
      // This is a mock implementation - in a real app, you would call an API
      // that connects to GPT-4o-mini to generate the diagram
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate AI response with a diagram based on the prompt
      let aiGeneratedCode = '';
      
      if (aiPrompt.toLowerCase().includes('flowchart') || aiPrompt.toLowerCase().includes('flow')) {
        aiGeneratedCode = `graph TD
    A[${aiPrompt.slice(0, 15)}] --> B{Decision Point}
    B -->|Option 1| C[Process 1]
    B -->|Option 2| D[Process 2]
    C --> E[Result 1]
    D --> F[Result 2]
    E --> G[Conclusion]
    F --> G`;
      } else if (aiPrompt.toLowerCase().includes('sequence')) {
        aiGeneratedCode = `sequenceDiagram
    participant User
    participant System
    participant Database
    User->>System: Request Data
    System->>Database: Query
    Database-->>System: Return Results
    System-->>User: Display Information`;
      } else if (aiPrompt.toLowerCase().includes('class')) {
        aiGeneratedCode = `classDiagram
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
      } else {
        aiGeneratedCode = `graph TD
    A[${aiPrompt.slice(0, 20)}] --> B{Decision?}
    B -->|Option 1| C[Result 1]
    B -->|Option 2| D[Result 2]
    C --> E[Conclusion]
    D --> E`;
      }
      
      // Add AI response to conversation
      setAiConversation([
        ...updatedConversation,
        { 
          role: 'assistant', 
          content: `Here's a diagram based on your request:\n\n\`\`\`mermaid\n${aiGeneratedCode}\n\`\`\`` 
        }
      ]);
      
      setCode(aiGeneratedCode);
      setAiPrompt('');
      setAiLoading(false);
    } catch (error) {
      console.error('Error generating diagram:', error);
      setError('Failed to generate diagram with AI');
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <Tabs defaultValue="ai" className="w-full" onValueChange={(value) => setActiveTab(value as 'ai' | 'code')}>
        <TabsList className="mb-4">
          <TabsTrigger value="ai" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            AI Assistant
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-1">
            <Code className="h-4 w-4" />
            Code Editor
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ai" className="flex flex-col md:flex-row gap-4">
          {/* AI Chat Panel */}
          <div className="flex flex-col w-full md:w-1/2 h-full">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-medium">GPT-4o-mini Assistant</h2>
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
            
            <Card className="flex-1 min-h-[300px] overflow-auto p-4 mb-4">
              {aiConversation.length === 0 ? (
                <div className="text-center text-gray-500 h-full flex flex-col items-center justify-center">
                  <MessageSquare className="h-12 w-12 mb-2 opacity-20" />
                  <p>Ask GPT-4o-mini to create a diagram for you</p>
                  <div className="mt-4 grid grid-cols-1 gap-2 w-full max-w-md">
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
              ) : (
                <div className="space-y-4">
                  {aiConversation.map((message, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-blue-50 ml-8' 
                          : 'bg-gray-50 mr-8'
                      }`}
                    >
                      <div className="font-medium mb-1 text-xs text-gray-500">
                        {message.role === 'user' ? 'You' : 'GPT-4o-mini'}
                      </div>
                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
            
            <div className="flex gap-2">
              <Textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="text-sm flex-1"
                placeholder="Describe the diagram you want to create..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && aiPrompt.trim()) {
                    e.preventDefault();
                    handleAiGenerate();
                  }
                }}
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
          
          <Separator orientation="vertical" className="hidden md:block" />
          <Separator className="md:hidden" />
          
          {/* Preview Panel */}
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
        </TabsContent>
        
        <TabsContent value="code" className="flex flex-col md:flex-row gap-4">
          {/* Code Editor Panel */}
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
              className="font-mono text-sm flex-1 min-h-[400px] resize-none"
              placeholder="Enter mermaid diagram code here..."
            />
            
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
          
          <Separator orientation="vertical" className="hidden md:block" />
          <Separator className="md:hidden" />
          
          {/* Preview Panel */}
          <div className="w-full md:w-1/2 h-full">
            <h2 className="text-lg font-medium mb-2">Preview</h2>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MermaidEditor;
