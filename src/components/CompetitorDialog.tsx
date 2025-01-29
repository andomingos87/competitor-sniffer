import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CompetitorFormData {
  name: string;
  website?: string;
  youtube_id?: string;
  instagram?: string;
  facebook?: string;
}

export const CompetitorDialog = () => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<CompetitorFormData>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const notifyYoutubeWebhook = async (youtube_id: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('youtube-metrics', {
        body: { youtube_id }
      });

      if (error) {
        console.error('Error notifying webhook:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error notifying webhook:', error);
      throw error;
    }
  };

  const onSubmit = async (data: CompetitorFormData) => {
    try {
      const { data: competitor, error } = await supabase
        .from('competitors')
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      if (competitor.youtube_id) {
        await notifyYoutubeWebhook(competitor.youtube_id);
      }

      toast({
        title: "Sucesso",
        description: "Concorrente adicionado com sucesso",
      });

      queryClient.invalidateQueries({ queryKey: ['competitors'] });
      reset();
      setOpen(false);
    } catch (error) {
      console.error('Error adding competitor:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar concorrente",
        variant: "destructive",
      });
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              {...register("website")}
              placeholder="https://exemplo.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtube_id">ID do Canal do YouTube</Label>
            <Input
              id="youtube_id"
              {...register("youtube_id")}
              placeholder="ID do canal"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              {...register("instagram")}
              placeholder="@usuario"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              {...register("facebook")}
              placeholder="@usuario"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};