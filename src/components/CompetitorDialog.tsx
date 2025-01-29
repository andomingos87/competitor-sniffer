import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CompetitorForm } from "@/components/competitor/CompetitorForm";
import { useAddCompetitor } from "@/hooks/use-add-competitor";

export const CompetitorDialog = () => {
  const [open, setOpen] = useState(false);
  const { addCompetitor, isLoading } = useAddCompetitor();
  const navigate = useNavigate();

  const handleSubmit = async (data: { name: string; youtube_id: string }) => {
    const competitor = await addCompetitor(data);
    if (competitor) {
      setOpen(false);
      navigate(`/competitors/${competitor.id}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Concorrente</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Concorrente</DialogTitle>
        </DialogHeader>
        <CompetitorForm
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};