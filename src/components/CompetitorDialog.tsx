import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const CompetitorDialog = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    youtube_id: "",
    instagram: "",
    facebook: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const notifyYoutubeWebhook = async (youtube_id: string) => {
    try {
      const response = await fetch('https://n8n-production-ff75.up.railway.app/webhook-test/concorrente-youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtube_id }),
      });

      if (!response.ok) {
        throw new Error('Failed to notify webhook');
      }
    } catch (error) {
      console.error('Error notifying webhook:', error);
      toast({
        title: "Aviso",
        description: "Concorrente foi criado, mas houve um erro ao notificar o webhook",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("competitors")
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      // If youtube_id exists, notify webhook
      if (data && data.youtube_id) {
        await notifyYoutubeWebhook(data.youtube_id);
      }

      toast({
        title: "Sucesso",
        description: "Concorrente adicionado com sucesso",
      });
      
      setFormData({
        name: "",
        website: "",
        youtube_id: "",
        instagram: "",
        facebook: "",
      });
      
      setOpen(false);
    } catch (error) {
      console.error("Error adding competitor:", error);
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
        <Button className="gap-2 w-full sm:w-auto bg-primary-600 hover:bg-primary-700 transition-colors">
          <Users className="h-4 w-4" />
          Adicionar Concorrente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Concorrente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nome do concorrente"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="website" className="text-sm font-medium">
              Website
            </label>
            <Input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://exemplo.com"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="youtube_id" className="text-sm font-medium">
              YouTube ID
            </label>
            <Input
              id="youtube_id"
              name="youtube_id"
              value={formData.youtube_id}
              onChange={handleChange}
              placeholder="ID do canal"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="instagram" className="text-sm font-medium">
              Instagram
            </label>
            <Input
              id="instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="@usuario"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="facebook" className="text-sm font-medium">
              Facebook
            </label>
            <Input
              id="facebook"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              placeholder="URL da página"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Adicionando..." : "Adicionar Concorrente"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};