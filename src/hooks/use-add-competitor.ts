import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Competitor } from "@/types/competitor";

interface AddCompetitorData {
  name: string;
  youtube_id: string;
}

export const useAddCompetitor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const notifyWebhook = async (youtube_id: string) => {
    const response = await fetch('https://n8n-production-ff75.up.railway.app/webhook/concorrente-youtube', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ youtube_id }),
    });

    if (!response.ok) {
      throw new Error('Failed to notify webhook');
    }
  };

  const addCompetitor = async (data: AddCompetitorData): Promise<Competitor | null> => {
    try {
      setIsLoading(true);
      
      const { data: competitor, error } = await supabase
        .from('competitors')
        .insert([{
          name: data.name,
          youtube_id: data.youtube_id
        }])
        .select()
        .single();

      if (error) throw error;

      if (competitor) {
        await notifyWebhook(competitor.youtube_id || '');
        queryClient.invalidateQueries({ queryKey: ['competitors'] });
        toast({
          title: "Sucesso",
          description: "Concorrente adicionado com sucesso",
        });
        return competitor;
      }
      
      return null;
    } catch (error) {
      console.error('Error adding competitor:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar concorrente",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addCompetitor,
    isLoading
  };
};