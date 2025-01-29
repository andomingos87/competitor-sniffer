import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { Competitor } from "@/types/competitor";

interface CompetitorCardProps {
  competitor: Competitor;
  onClick: () => void;
  onSelect: (checked: boolean) => void;
  isSelected: boolean;
}

export const CompetitorCard = ({ 
  competitor, 
  onClick, 
  onSelect, 
  isSelected 
}: CompetitorCardProps) => {
  return (
    <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg border-l-4 border-l-primary-600">
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
};