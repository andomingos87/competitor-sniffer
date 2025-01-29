import React, { useState } from 'react';
import { ArrowRight, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { CompetitorDialog } from "@/components/CompetitorDialog";
import { supabase } from "@/integrations/supabase/client";
import type { Competitor } from "@/types/competitor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const CompetitorCard = ({ 
  competitor, 
  onClick,
  onSelect,
  isSelected 
}: { 
  competitor: Competitor; 
  onClick: () => void;
  onSelect: (checked: boolean) => void;
  isSelected: boolean;
}) => (
  <Card 
    className="cursor-pointer transition-all duration-300 hover:shadow-lg border-l-4 border-l-primary-600" 
  >
    <CardHeader className="flex flex-row items-center gap-4">
      <Checkbox 
        checked={isSelected}
        onCheckedChange={(checked) => onSelect(checked === true)}
        onClick={(e) => e.stopPropagation()}
      />
      <CardTitle 
        className="text-lg text-primary-800 flex-1"
        onClick={onClick}
      >
        {competitor.name}
      </CardTitle>
    </CardHeader>
    <CardContent onClick={onClick}>
      <div className="space-y-2">
        <p className="text-sm text-gray-500">{competitor.website}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary-100 p-3 rounded-lg">
            <p className="text-sm font-medium text-primary-700">YouTube</p>
            <p className="text-lg font-semibold text-primary-900">{competitor.youtube_id || 'N/A'}</p>
          </div>
          <div className="bg-primary-100 p-3 rounded-lg">
            <p className="text-sm font-medium text-primary-700">Instagram</p>
            <p className="text-lg font-semibold text-primary-900">{competitor.instagram || 'N/A'}</p>
          </div>
          <div className="bg-primary-100 p-3 rounded-lg">
            <p className="text-sm font-medium text-primary-700">Facebook</p>
            <p className="text-lg font-semibold text-primary-900">{competitor.facebook || 'N/A'}</p>
          </div>
          <div className="bg-primary-100 p-3 rounded-lg">
            <p className="text-sm font-medium text-primary-700">Data de Cadastro</p>
            <p className="text-lg font-semibold text-primary-900">
              {new Date(competitor.created_at || '').toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Competitors = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);

  const { data: competitors, isLoading } = useQuery({
    queryKey: ['competitors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('competitors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching competitors:', error);
        throw error;
      }

      return data || [];
    },
  });

  const handleCompetitorClick = (id: number) => {
    navigate(`/competitors/${id}`);
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
      // First, delete related metrics
      const { error: metricsError } = await supabase
        .from('competitor_metrics')
        .delete()
        .in('competitor_id', selectedIds);

      if (metricsError) throw metricsError;

      // Then, delete the competitors
      const { error: competitorsError } = await supabase
        .from('competitors')
        .delete()
        .in('id', selectedIds);

      if (competitorsError) throw competitorsError;

      toast({
        title: "Sucesso",
        description: `${selectedIds.length} concorrente(s) deletado(s) com sucesso`,
      });

      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ['competitors'] });
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-primary-100 to-primary-50 p-6 rounded-lg">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-900">
            Análise de Concorrentes
          </h1>
          <p className="text-sm sm:text-base text-primary-700 mt-2">
            Monitore e analise seus principais concorrentes de forma inteligente
          </p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleDeleteSelected}
              className="whitespace-nowrap"
            >
              <Trash2 className="h-4 w-4" />
              Deletar ({selectedIds.length})
            </Button>
          )}
          <CompetitorDialog />
        </div>
      </div>

      <Card className="shadow-md border-t-4 border-t-primary-600">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-white">
          <CardTitle className="text-primary-800">Lista de Concorrentes</CardTitle>
        </CardHeader>
        <CardContent>
          {competitors && competitors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum concorrente cadastrado ainda. Use o botão "Adicionar Concorrente" para começar.
            </div>
          ) : isMobile ? (
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
            <Table>
              <TableHeader>
                <TableRow className="bg-primary-50">
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedIds.length === competitors?.length}
                      onCheckedChange={(checked) => handleSelectAll(checked === true)}
                    />
                  </TableHead>
                  <TableHead className="text-primary-900">Nome</TableHead>
                  <TableHead className="text-primary-900">Website</TableHead>
                  <TableHead className="text-primary-900">YouTube</TableHead>
                  <TableHead className="text-primary-900">Instagram</TableHead>
                  <TableHead className="text-primary-900">Facebook</TableHead>
                  <TableHead className="text-primary-900">Data de Cadastro</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competitors?.map((competitor) => (
                  <TableRow
                    key={competitor.id}
                    className="cursor-pointer hover:bg-primary-50 transition-colors"
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.includes(competitor.id)}
                        onCheckedChange={(checked) => handleSelect(competitor.id, checked === true)}
                      />
                    </TableCell>
                    <TableCell 
                      className="font-medium text-primary-800"
                      onClick={() => handleCompetitorClick(competitor.id)}
                    >
                      {competitor.name}
                    </TableCell>
                    <TableCell onClick={() => handleCompetitorClick(competitor.id)}>
                      {competitor.website}
                    </TableCell>
                    <TableCell onClick={() => handleCompetitorClick(competitor.id)}>
                      {competitor.youtube_id || 'N/A'}
                    </TableCell>
                    <TableCell onClick={() => handleCompetitorClick(competitor.id)}>
                      {competitor.instagram || 'N/A'}
                    </TableCell>
                    <TableCell onClick={() => handleCompetitorClick(competitor.id)}>
                      {competitor.facebook || 'N/A'}
                    </TableCell>
                    <TableCell onClick={() => handleCompetitorClick(competitor.id)}>
                      {new Date(competitor.created_at || '').toLocaleDateString()}
                    </TableCell>
                    <TableCell onClick={() => handleCompetitorClick(competitor.id)}>
                      <ArrowRight className="h-4 w-4 text-primary-600" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Competitors;