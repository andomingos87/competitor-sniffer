import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Competitor } from "@/types/competitor";

// Dados mockados para exemplo
const mockCompetitors: Record<string, Competitor> = {
  "1": {
    id: "1",
    name: "Empresa A",
    website: "www.empresaa.com",
    metrics: {
      posts: 150,
      engagement: 25,
      followers: 10000,
      lastUpdated: "2024-02-20",
    },
  },
  "2": {
    id: "2",
    name: "Empresa B",
    website: "www.empresab.com",
    metrics: {
      posts: 200,
      engagement: 30,
      followers: 15000,
      lastUpdated: "2024-02-20",
    },
  },
};

const CompetitorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const competitor = id ? mockCompetitors[id] : null;

  if (!competitor) {
    return <div>Concorrente não encontrado</div>;
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
                  <p>{competitor.website}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">
                        {competitor.metrics.posts}
                      </div>
                      <div className="text-sm text-gray-500">Total de Posts</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">
                        {competitor.metrics.engagement}%
                      </div>
                      <div className="text-sm text-gray-500">
                        Taxa de Engajamento
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">
                        {competitor.metrics.followers.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Total de Seguidores
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