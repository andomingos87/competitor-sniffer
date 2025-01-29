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
import { Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Competitor } from "@/types/competitor";

interface EditCompetitorDialogProps {
  competitor: Competitor;
  onUpdate: () => void;
}

export const EditCompetitorDialog = ({ competitor, onUpdate }: EditCompetitorDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: competitor.name || "",
    website: competitor.website || "",
    youtube_id: competitor.youtube_id || "",
    instagram: competitor.instagram || "",
    facebook: competitor.facebook || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("competitors")
        .update(formData)
        .eq("id", competitor.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Concorrente atualizado com sucesso",
      });
      
      onUpdate();
      setOpen(false);
    } catch (error) {
      console.error("Error updating competitor:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar concorrente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Concorrente</DialogTitle>
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
            {isLoading ? "Atualizando..." : "Atualizar Concorrente"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};