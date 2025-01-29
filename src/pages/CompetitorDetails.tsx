import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { Competitor } from "@/types/competitor";

const CompetitorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const competitorId = id ? parseInt(id) : null;

  const { data: competitor, isLoading } = useQuery({
    queryKey: ['competitor', competitorId],
    queryFn: async () => {
      if (!competitorId) return null;
      
      const { data, error } = await supabase
        .from('competitors')
        .select('*')
        .eq('id', competitorId)
        .single();

      if (error) {
        console.error('Error fetching competitor:', error);
        throw error;
      }

      return data as Competitor;
    },
    enabled: !!competitorId,
  });

  if (isLoading) {
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
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => navigate("/competitors")}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{competitor.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <h3 className="font-medium text-gray-500">Website</h3>
                  <p>{competitor.website || 'Não informado'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">
                        {competitor.youtube || 'N/A'}
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
    </div>
  );
};

export default CompetitorDetails;