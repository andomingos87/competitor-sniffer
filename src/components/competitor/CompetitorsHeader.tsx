import React from 'react';
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompetitorDialog } from "@/components/CompetitorDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CompetitorsHeaderProps {
  selectedCount: number;
  onDelete: () => void;
}

export const CompetitorsHeader = ({ selectedCount, onDelete }: CompetitorsHeaderProps) => {
  return (
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
        {selectedCount > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="whitespace-nowrap"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Deletar ({selectedCount})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir {selectedCount} concorrente(s)? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <CompetitorDialog />
      </div>
    </div>
  );
};