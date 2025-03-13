
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Check, AlertCircle } from 'lucide-react';
import { diagramService, Diagram } from '@/integrations/supabase/services/diagramService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface SaveDiagramButtonProps {
  diagramContent: string;
  diagramTitle: string;
  diagramDescription?: string;
  diagramId?: string;
  isPublic?: boolean;
  onSaveSuccess?: (diagram: Diagram) => void;
  className?: string;
}

const SaveDiagramButton: React.FC<SaveDiagramButtonProps> = ({
  diagramContent,
  diagramTitle,
  diagramDescription = '',
  diagramId,
  isPublic = false,
  onSaveSuccess,
  className = '',
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save your diagram",
          variant: "destructive",
        });
        setSaveStatus('error');
        setIsSaving(false);
        return;
      }

      // Prepare diagram data
      const diagramData: Diagram = {
        id: diagramId,
        title: diagramTitle || 'Untitled Diagram',
        description: diagramDescription,
        content: diagramContent,
        is_public: isPublic,
      };

      // Save diagram
      const { data, error } = await diagramService.saveDiagram(diagramData, user);

      if (error) {
        console.error('Error saving diagram:', error);
        toast({
          title: "Failed to save diagram",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        });
        setSaveStatus('error');
      } else if (data) {
        toast({
          title: "Diagram saved",
          description: "Your diagram has been saved successfully",
        });
        setSaveStatus('success');
        
        // Call the success callback if provided
        if (onSaveSuccess && data) {
          onSaveSuccess(data);
        }
        
        // Reset status after 2 seconds
        setTimeout(() => {
          setSaveStatus('idle');
        }, 2000);
      }
    } catch (error) {
      console.error('Error in save process:', error);
      toast({
        title: "Failed to save diagram",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      onClick={handleSave}
      disabled={isSaving}
      className={`${className} relative`}
      variant={saveStatus === 'error' ? "destructive" : "default"}
    >
      {isSaving ? (
        <>Saving...</>
      ) : (
        <>
          {saveStatus === 'success' ? (
            <Check className="h-4 w-4 mr-2" />
          ) : saveStatus === 'error' ? (
            <AlertCircle className="h-4 w-4 mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saveStatus === 'success' ? 'Saved' : saveStatus === 'error' ? 'Failed' : 'Save Diagram'}
        </>
      )}
    </Button>
  );
};

export default SaveDiagramButton;
