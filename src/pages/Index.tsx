
import MermaidEditor from '@/components/MermaidEditor';
import Navbar from '@/components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Diagrams with AI</h2>
          <p className="text-gray-600">
            Describe the diagram you want in natural language, and let GPT-4o-mini generate the Mermaid code for you.
            You can also edit the code directly if you prefer.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 min-h-[70vh]">
          <MermaidEditor />
        </div>
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>A minimalist AI-powered Mermaid diagram generator</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
