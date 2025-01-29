import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Competitor } from "@/types/competitor";
import { CompetitorHeader } from "@/components/competitor/CompetitorHeader";
import { CompetitorMetrics } from "@/components/competitor/CompetitorMetrics";
import { CompetitorCharts } from "@/components/competitor/CompetitorCharts";
import { CompetitorSocial } from "@/components/competitor/CompetitorSocial";

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
          <CompetitorHeader
            competitor={competitor}
            onDelete={handleDelete}
            onBack={() => navigate("/competitors")}
            onUpdate={refetch}
          />
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
        <CompetitorHeader
          competitor={competitor}
          onDelete={handleDelete}
          onBack={() => navigate("/competitors")}
          onUpdate={refetch}
        />

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
              
              <CompetitorMetrics metrics={metrics} />

              {metricsHistory && metricsHistory.length > 0 && (
                <CompetitorCharts metricsHistory={metricsHistory} />
              )}

              <CompetitorSocial competitor={competitor} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompetitorDetails;