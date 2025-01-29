import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

export const CompetitorForm = () => {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

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

    // Aqui seria implementada a lógica de coleta de dados
    toast({
      title: "Sucesso",
      description: "Concorrente adicionado para monitoramento",
    });
    setUrl("");
  };

  return (
    <Card className="p-6 bg-white shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-primary-800">Adicionar Concorrente</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            URL do Concorrente
          </label>
          <Input
            id="url"
            type="url"
            placeholder="https://exemplo.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary-700">
          Adicionar para Monitoramento
        </Button>
      </form>
    </Card>
  );
};