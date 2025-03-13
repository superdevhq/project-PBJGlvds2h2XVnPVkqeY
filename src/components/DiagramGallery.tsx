
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { diagramService, Diagram } from '@/integrations/supabase/services/diagramService';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Trash2, Eye, Globe, Lock, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface DiagramGalleryProps {
  onSelectDiagram?: (diagram: Diagram) => void;
  className?: string;
}

const DiagramGallery: React.FC<DiagramGalleryProps> = ({ 
  onSelectDiagram,
  className = ''
}) => {
  const [userDiagrams, setUserDiagrams] = useState<Diagram[]>([]);
  const [publicDiagrams, setPublicDiagrams] = useState<Diagram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-diagrams');
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  // Get current user and load diagrams
  useEffect(() => {
    const loadUserAndDiagrams = async () => {
      setIsLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Load user's diagrams
        const { data: userDiagramsData, error: userDiagramsError } = await diagramService.getUserDiagrams(user);
        
        if (userDiagramsError) {
          console.error('Error loading user diagrams:', userDiagramsError);
          toast({
            title: "Failed to load your diagrams",
            description: userDiagramsError.message || "An unexpected error occurred",
            variant: "destructive",
          });
        } else if (userDiagramsData) {
          setUserDiagrams(userDiagramsData);
        }
      }
      
      // Load public diagrams
      const { data: publicDiagramsData, error: publicDiagramsError } = await diagramService.getPublicDiagrams();
      
      if (publicDiagramsError) {
        console.error('Error loading public diagrams:', publicDiagramsError);
        toast({
          title: "Failed to load public diagrams",
          description: publicDiagramsError.message || "An unexpected error occurred",
          variant: "destructive",
        });
      } else if (publicDiagramsData) {
        setPublicDiagrams(publicDiagramsData);
      }
      
      setIsLoading(false);
    };
    
    loadUserAndDiagrams();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [toast]);
  
  const handleDeleteDiagram = async (id: string) => {
    if (!confirm('Are you sure you want to delete this diagram?')) {
      return;
    }
    
    const { error } = await diagramService.deleteDiagram(id, user);
    
    if (error) {
      console.error('Error deleting diagram:', error);
      toast({
        title: "Failed to delete diagram",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Diagram deleted",
        description: "Your diagram has been deleted successfully",
      });
      
      // Update the list of diagrams
      setUserDiagrams(userDiagrams.filter(diagram => diagram.id !== id));
      setPublicDiagrams(publicDiagrams.filter(diagram => diagram.id !== id));
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };
  
  const renderDiagramCard = (diagram: Diagram) => {
    const isOwner = user && diagram.user_id === user.id;
    
    return (
      <Card key={diagram.id} className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg line-clamp-1">{diagram.title}</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {formatDate(diagram.updated_at)}
            {diagram.is_public ? (
              <span className="ml-2 flex items-center text-green-600">
                <Globe className="h-3 w-3 mr-1" /> Public
              </span>
            ) : (
              <span className="ml-2 flex items-center text-gray-500">
                <Lock className="h-3 w-3 mr-1" /> Private
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow pb-2">
          {diagram.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {diagram.description}
            </p>
          )}
          <div className="bg-gray-50 p-2 rounded-md border h-24 overflow-hidden text-xs text-gray-500">
            <code className="whitespace-pre-wrap line-clamp-5">{diagram.content}</code>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onSelectDiagram && onSelectDiagram(diagram)}
            >
              <Eye className="h-4 w-4 mr-1" /> View
            </Button>
            {isOwner && (
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                onClick={() => onSelectDiagram && onSelectDiagram(diagram)}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            )}
            {isOwner && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => diagram.id && handleDeleteDiagram(diagram.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <div className={`${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="my-diagrams">My Diagrams</TabsTrigger>
          <TabsTrigger value="public-diagrams">Public Diagrams</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-diagrams">
          {isLoading ? (
            <div className="text-center py-8">Loading your diagrams...</div>
          ) : !user ? (
            <div className="text-center py-8">
              <p className="mb-4">Please sign in to view your diagrams</p>
              <Button onClick={() => supabase.auth.signIn()}>Sign In</Button>
            </div>
          ) : userDiagrams.length === 0 ? (
            <div className="text-center py-8">
              <p>You haven't created any diagrams yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userDiagrams.map(renderDiagramCard)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="public-diagrams">
          {isLoading ? (
            <div className="text-center py-8">Loading public diagrams...</div>
          ) : publicDiagrams.length === 0 ? (
            <div className="text-center py-8">
              <p>No public diagrams available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publicDiagrams.map(renderDiagramCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiagramGallery;
