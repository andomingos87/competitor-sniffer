import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const notifyWebhook = async (youtube_id: string) => {
    try {
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

      return await response.json();
    } catch (error) {
      console.error('Error notifying webhook:', error);
      throw error;
    }
  };

  const addCompetitor = async (data: AddCompetitorData) => {
    try {
      setIsLoading(true);
      
      // First check if a competitor with this youtube_id already exists
      const { data: existingCompetitor } = await supabase
        .from('competitors')
        .select()
        .eq('youtube_id', data.youtube_id)
        .maybeSingle();

      if (existingCompetitor) {
        toast({
          title: "Erro",
          description: "Já existe um concorrente com este ID do YouTube",
          variant: "destructive",
        });
        return null;
      }

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

        toast({
          title: "Sucesso",
          description: "Concorrente adicionado com sucesso",
        });

        queryClient.invalidateQueries({ queryKey: ['competitors'] });
        
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