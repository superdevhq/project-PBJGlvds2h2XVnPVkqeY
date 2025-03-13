
import MermaidEditor from '@/components/MermaidEditor';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Mermaid Editor</h1>
            <div className="text-sm text-gray-500">Powered by GPT-4o-mini</div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Diagrams with AI</h2>
          <p className="text-gray-600">
            Write Mermaid syntax directly or use AI to generate diagrams from natural language descriptions.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 min-h-[70vh]">
          <MermaidEditor />
        </div>
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>A minimalist Mermaid diagram editor with AI assistance</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
