import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { EditCompetitorDialog } from "@/components/EditCompetitorDialog";
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
import type { Competitor } from "@/types/competitor";

interface CompetitorHeaderProps {
  competitor: Competitor;
  onDelete: () => Promise<void>;
  onBack: () => void;
  onUpdate: () => void;
}

export const CompetitorHeader = ({ competitor, onDelete, onBack, onUpdate }: CompetitorHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        className="gap-2"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>
      <div className="flex gap-2">
        <EditCompetitorDialog competitor={competitor} onUpdate={onUpdate} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este concorrente? Esta ação não pode ser desfeita.
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
      </div>
    </div>
  );
};