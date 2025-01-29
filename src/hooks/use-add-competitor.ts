import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { AddCompetitorData } from "@/types/competitor";

export const useAddCompetitor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addCompetitor = async (data: AddCompetitorData): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('https://n8n-production-ff75.up.railway.app/webhook/concorrente-youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors', // Explicitly set CORS mode
        credentials: 'omit', // Don't send credentials
        body: JSON.stringify({ 
          name: data.name,
          youtube_id: data.youtube_id 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to notify webhook');
      }

      toast({
        title: "Sucesso",
        description: "Solicitação enviada com sucesso",
      });
      
      return true;
    } catch (error) {
      console.error('Error calling webhook:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar a solicitação",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addCompetitor,
    isLoading
  };
};