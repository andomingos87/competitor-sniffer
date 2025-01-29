import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface CompetitorFormData {
  name: string;
  youtube_id: string;
}

interface CompetitorFormProps {
  onSubmit: (data: CompetitorFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const CompetitorForm = ({ onSubmit, onCancel, isLoading }: CompetitorFormProps) => {
  const { register, handleSubmit } = useForm<CompetitorFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          {...register("name", { required: true })}
          placeholder="Nome do concorrente"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="youtube_id">ID do Canal do YouTube</Label>
        <Input
          id="youtube_id"
          {...register("youtube_id", { required: true })}
          placeholder="ID do canal"
          disabled={isLoading}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adicionando...
            </>
          ) : (
            'Salvar'
          )}
        </Button>
      </div>
    </form>
  );
};