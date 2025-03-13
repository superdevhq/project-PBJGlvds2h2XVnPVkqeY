
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export interface Diagram {
  id?: string;
  title: string;
  description?: string;
  content: string;
  thumbnail_url?: string;
  user_id?: string;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
}

export const diagramService = {
  /**
   * Save a new diagram or update an existing one
   */
  async saveDiagram(diagram: Diagram, user: User | null): Promise<{ data: Diagram | null; error: any }> {
    if (!user) {
      return { data: null, error: new Error("User not authenticated") };
    }

    const diagramData = {
      ...diagram,
      user_id: user.id,
    };

    if (diagram.id) {
      // Update existing diagram
      const { data, error } = await supabase
        .from("diagrams")
        .update(diagramData)
        .eq("id", diagram.id)
        .select()
        .single();

      return { data, error };
    } else {
      // Insert new diagram
      const { data, error } = await supabase
        .from("diagrams")
        .insert(diagramData)
        .select()
        .single();

      return { data, error };
    }
  },

  /**
   * Get a diagram by ID
   */
  async getDiagram(id: string): Promise<{ data: Diagram | null; error: any }> {
    const { data, error } = await supabase
      .from("diagrams")
      .select("*")
      .eq("id", id)
      .single();

    return { data, error };
  },

  /**
   * Get all diagrams for the current user
   */
  async getUserDiagrams(user: User | null): Promise<{ data: Diagram[] | null; error: any }> {
    if (!user) {
      return { data: null, error: new Error("User not authenticated") };
    }

    const { data, error } = await supabase
      .from("diagrams")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    return { data, error };
  },

  /**
   * Get public diagrams
   */
  async getPublicDiagrams(): Promise<{ data: Diagram[] | null; error: any }> {
    const { data, error } = await supabase
      .from("diagrams")
      .select("*")
      .eq("is_public", true)
      .order("updated_at", { ascending: false });

    return { data, error };
  },

  /**
   * Delete a diagram
   */
  async deleteDiagram(id: string, user: User | null): Promise<{ error: any }> {
    if (!user) {
      return { error: new Error("User not authenticated") };
    }

    const { error } = await supabase
      .from("diagrams")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    return { error };
  }
};
