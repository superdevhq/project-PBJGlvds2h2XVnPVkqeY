
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PromptExample from './PromptExample';

export interface PromptCategory {
  id: string;
  name: string;
  prompts: {
    id: string;
    title: string;
    prompt: string;
    description?: string;
  }[];
}

interface PromptGalleryProps {
  categories: PromptCategory[];
  onUsePrompt?: (prompt: string) => void;
  className?: string;
}

export const PromptGallery: React.FC<PromptGalleryProps> = ({
  categories,
  onUsePrompt,
  className = '',
}) => {
  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-6">Example Prompts</h2>
      
      <Tabs defaultValue={categories[0]?.id} className="w-full">
        <TabsList className="mb-6 flex flex-wrap h-auto">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="mb-2">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.prompts.map((prompt) => (
                <PromptExample
                  key={prompt.id}
                  title={prompt.title}
                  prompt={prompt.prompt}
                  description={prompt.description}
                  onUse={onUsePrompt}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PromptGallery;
