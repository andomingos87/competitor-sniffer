import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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

const CompetitorCard = ({ competitor, onClick }: { competitor: Competitor; onClick: () => void }) => (
  <Card 
    className="cursor-pointer transition-all duration-300 hover:shadow-lg border-l-4 border-l-primary-600" 
    onClick={onClick}
  >
    <CardHeader>
      <CardTitle className="text-lg text-primary-800">{competitor.name}</CardTitle>
    </CardHeader>
    <CardContent>
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
        <CompetitorDialog />
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
                />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-primary-50">
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
                    onClick={() => handleCompetitorClick(competitor.id)}
                  >
                    <TableCell className="font-medium text-primary-800">
                      {competitor.name}
                    </TableCell>
                    <TableCell>{competitor.website}</TableCell>
                    <TableCell>{competitor.youtube_id || 'N/A'}</TableCell>
                    <TableCell>{competitor.instagram || 'N/A'}</TableCell>
                    <TableCell>{competitor.facebook || 'N/A'}</TableCell>
                    <TableCell>
                      {new Date(competitor.created_at || '').toLocaleDateString()}
                    </TableCell>
                    <TableCell>
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
