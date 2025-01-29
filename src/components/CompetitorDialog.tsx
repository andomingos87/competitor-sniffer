import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CompetitorFormData {
  name: string;
  youtube_id: string;
}

export const CompetitorDialog = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<CompetitorFormData>();
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

  const onSubmit = async (data: CompetitorFormData) => {
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
        return;
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
      }

      toast({
        title: "Sucesso",
        description: "Concorrente adicionado com sucesso",
      });

      queryClient.invalidateQueries({ queryKey: ['competitors'] });
      reset();
      setOpen(false);
      
      // Navigate to the competitor's page
      if (competitor) {
        navigate(`/competitors/${competitor.id}`);
      }
    } catch (error) {
      console.error('Error adding competitor:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar concorrente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Concorrente</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Concorrente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              {...register("name", { required: true })}
              placeholder="Nome do concorrente"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtube_id">ID do Canal do YouTube</Label>
            <Input
              id="youtube_id"
              {...register("youtube_id", { required: true })}
              placeholder="ID do canal"
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adicionando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};