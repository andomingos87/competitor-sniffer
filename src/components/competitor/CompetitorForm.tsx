import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { useAddCompetitor } from "@/hooks/use-add-competitor";

export const CompetitorForm = () => {
  const [url, setUrl] = useState("");
  const { toast } = useToast();
  const { addCompetitor, isLoading } = useAddCompetitor(); // Hook para adicionar concorrente

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma URL válida",
        variant: "destructive",
      });
      return;
    }

    try {
      await addCompetitor({ name: url, youtube_id: url }); // Chama apenas uma vez
      toast({
        title: "Sucesso",
        description: "Concorrente adicionado para monitoramento",
      });
      setUrl("");
    } catch (error) {
      toast({
        title: "Erro ao adicionar concorrente",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 bg-white shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-primary-800">Adicionar Concorrente</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Insira a URL do concorrente"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adicionando..." : "Adicionar Concorrente"}
        </Button>
      </form>
    </Card>
  );
};
