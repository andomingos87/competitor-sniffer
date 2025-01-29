import React from 'react';
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import type { Competitor } from "@/types/competitor";

interface CompetitorListProps {
  competitors?: Competitor[];
  selectedIds: number[];
  onSelect: (id: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
}

export const CompetitorList = ({ 
  competitors, 
  selectedIds, 
  onSelect, 
  onSelectAll 
}: CompetitorListProps) => {
  const navigate = useNavigate();

  const handleCompetitorClick = (id: number) => {
    navigate(`/competitors/${id}`);
  };

  if (!competitors?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum concorrente cadastrado ainda. Use o botão "Adicionar Concorrente" para começar.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-primary-50">
          <TableHead className="w-[50px]">
            <Checkbox
              checked={selectedIds.length === competitors?.length}
              onCheckedChange={(checked) => onSelectAll(checked === true)}
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
                onCheckedChange={(checked) => onSelect(competitor.id, checked === true)}
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
  );
};