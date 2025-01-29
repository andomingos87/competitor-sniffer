import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { useAddCompetitor } from "@/hooks/use-add-competitor";

export const CompetitorForm = () => {
  const [name, setName] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const { toast } = useToast();
  const { addCompetitor, isLoading } = useAddCompetitor(); // Hook para adicionar concorrente

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !youtubeId) {
      toast({
        title: "Erro",
        description: "Por favor, insira um nome e um ID do YouTube válidos",
        variant: "destructive",
      });
      return;
    }

    try {
      await addCompetitor({ name, youtube_id: youtubeId }); // Chama apenas uma vez
      toast({
        title: "Sucesso",
        description: "Concorrente adicionado para monitoramento",
      });
      setName("");
      setYoutubeId("");
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
          placeholder="Nome do concorrente"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="ID do canal do YouTube"
          value={youtubeId}
          onChange={(e) => setYoutubeId(e.target.value)}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adicionando..." : "Adicionar Concorrente"}
        </Button>
      </form>
    </Card>
  );
};
