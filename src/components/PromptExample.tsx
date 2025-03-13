
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PromptExampleProps {
  title: string;
  prompt: string;
  description?: string;
  onUse?: (prompt: string) => void;
  className?: string;
}

export const PromptExample: React.FC<PromptExampleProps> = ({
  title,
  prompt,
  description,
  onUse,
  className = '',
}) => {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard.",
      duration: 3000,
    });
  };

  return (
    <Card className={`p-5 hover:shadow-md transition-shadow ${className}`}>
      <h3 className="font-medium text-lg mb-2">{title}</h3>
      {description && <p className="text-muted-foreground text-sm mb-3">{description}</p>}
      
      <div className="bg-muted p-3 rounded-md text-sm font-mono mb-4 overflow-x-auto">
        {prompt}
      </div>
      
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={copyToClipboard}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
        
        {onUse && (
          <Button 
            size="sm" 
            onClick={() => onUse(prompt)}
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Use
          </Button>
        )}
      </div>
    </Card>
  );
};

export default PromptExample;
