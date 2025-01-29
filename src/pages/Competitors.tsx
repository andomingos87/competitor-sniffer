import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { CompetitorList } from "@/components/competitor/CompetitorList";
import { CompetitorsHeader } from "@/components/competitor/CompetitorsHeader";
import { CompetitorCard } from "@/components/competitor/CompetitorCard";
import { useToast } from "@/hooks/use-toast";

const Competitors = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data: competitors, isLoading } = useQuery({
    queryKey: ['competitors'],
    queryFn: async () => {
      const response = await fetch('https://n8n-production-ff75.up.railway.app/webhook/concorrentes');
      if (!response.ok) {
        throw new Error('Failed to fetch competitors');
      }
      return response.json();
    },
  });

  const handleCompetitorClick = (id: number) => {
    window.location.href = `/competitors/${id}`;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(competitors?.map(c => c.id) || []);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedIds.length) return;

    try {
      const response = await fetch('https://n8n-production-ff75.up.railway.app/webhook/delete-concorrentes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete competitors');
      }

      toast({
        title: "Sucesso",
        description: `${selectedIds.length} concorrente(s) deletado(s) com sucesso`,
      });

      setSelectedIds([]);
    } catch (error) {
      console.error('Error deleting competitors:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar concorrentes",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CompetitorsHeader 
        selectedCount={selectedIds.length}
        onDelete={handleDeleteSelected}
      />

      <Card className="shadow-md border-t-4 border-t-primary-600">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-white">
          <CardTitle className="text-primary-800">Lista de Concorrentes</CardTitle>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            <div className="grid gap-4">
              {competitors?.map((competitor) => (
                <CompetitorCard
                  key={competitor.id}
                  competitor={competitor}
                  onClick={() => handleCompetitorClick(competitor.id)}
                  onSelect={(checked) => handleSelect(competitor.id, checked)}
                  isSelected={selectedIds.includes(competitor.id)}
                />
              ))}
            </div>
          ) : (
            <CompetitorList
              competitors={competitors}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Competitors;