import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Users, Eye, Video } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/DashboardCard";
import { MetricsChart } from "@/components/MetricsChart";
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
import { supabase } from "@/integrations/supabase/client";
import { EditCompetitorDialog } from "@/components/EditCompetitorDialog";
import { useToast } from "@/hooks/use-toast";
import type { Competitor } from "@/types/competitor";

const CompetitorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const competitorId = id ? parseInt(id) : null;

  const { data: competitor, isLoading: isLoadingCompetitor, refetch } = useQuery({
    queryKey: ['competitor', competitorId],
    queryFn: async () => {
      if (!competitorId) return null;
      
      const { data, error } = await supabase
        .from('competitors')
        .select('*')
        .eq('id', competitorId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching competitor:', error);
        throw error;
      }

      return data as Competitor;
    },
    enabled: !!competitorId,
  });

  const { data: metrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['competitor_metrics', competitorId],
    queryFn: async () => {
      if (!competitorId) return null;

      const { data, error } = await supabase
        .from('competitor_metrics')
        .select('*')
        .eq('competitor_id', competitorId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching metrics:', error);
        throw error;
      }

      return data;
    },
    enabled: !!competitorId,
  });

  const { data: metricsHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['metrics_history', competitorId],
    queryFn: async () => {
      if (!competitorId) return null;

      const { data, error } = await supabase
        .from('competitor_metrics')
        .select('*')
        .eq('competitor_id', competitorId)
        .order('updated_at', { ascending: true });

      if (error) {
        console.error('Error fetching metrics history:', error);
        throw error;
      }

      return data;
    },
    enabled: !!competitorId,
  });

  const handleDelete = async () => {
    if (!competitorId) return;

    try {
      const { error } = await supabase
        .from('competitors')
        .delete()
        .eq('id', competitorId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Concorrente excluído com sucesso",
      });

      navigate("/competitors");
    } catch (error) {
      console.error('Error deleting competitor:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir concorrente",
        variant: "destructive",
      });
    }
  };

  if (isLoadingCompetitor || isLoadingMetrics || isLoadingHistory) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!competitor) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => navigate("/competitors")}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="mt-6 text-center text-gray-500">
            Concorrente não encontrado
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => navigate("/competitors")}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex gap-2">
            <EditCompetitorDialog competitor={competitor} onUpdate={refetch} />
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
                  <AlertDialogAction onClick={handleDelete}>
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{competitor.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <h3 className="font-medium text-gray-500">Website</h3>
                <p>{competitor.website || 'Não informado'}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DashboardCard
                  title="Inscritos"
                  value={metrics?.subscribers?.toLocaleString() || 'N/A'}
                  description="Total de inscritos no canal"
                  icon={<Users className="h-6 w-6" />}
                />
                <DashboardCard
                  title="Visualizações"
                  value={metrics?.views?.toLocaleString() || 'N/A'}
                  description="Total de visualizações"
                  icon={<Eye className="h-6 w-6" />}
                />
                <DashboardCard
                  title="Vídeos"
                  value={metrics?.videos?.toLocaleString() || 'N/A'}
                  description="Total de vídeos publicados"
                  icon={<Video className="h-6 w-6" />}
                />
              </div>

              {metricsHistory && metricsHistory.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-700">Evolução das Métricas</h3>
                  
                  <Card className="p-4">
                    <h4 className="text-md font-medium text-gray-600 mb-4">Inscritos</h4>
                    <MetricsChart
                      data={metricsHistory}
                      metric="subscribers"
                      color="#4f46e5"
                    />
                  </Card>

                  <Card className="p-4">
                    <h4 className="text-md font-medium text-gray-600 mb-4">Visualizações</h4>
                    <MetricsChart
                      data={metricsHistory}
                      metric="views"
                      color="#059669"
                    />
                  </Card>

                  <Card className="p-4">
                    <h4 className="text-md font-medium text-gray-600 mb-4">Vídeos</h4>
                    <MetricsChart
                      data={metricsHistory}
                      metric="videos"
                      color="#dc2626"
                    />
                  </Card>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {competitor.youtube_id || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">YouTube</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {competitor.instagram || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Instagram
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {competitor.facebook || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Facebook
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompetitorDetails;
