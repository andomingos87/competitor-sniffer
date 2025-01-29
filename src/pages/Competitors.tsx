import { ArrowRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import type { Competitor } from "@/types/competitor";

// Dados mockados para exemplo
const mockCompetitors: Competitor[] = [
  {
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
  {
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
];

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
            <p className="text-sm font-medium text-primary-700">Posts</p>
            <p className="text-lg font-semibold text-primary-900">{competitor.metrics.posts}</p>
          </div>
          <div className="bg-primary-100 p-3 rounded-lg">
            <p className="text-sm font-medium text-primary-700">Engajamento</p>
            <p className="text-lg font-semibold text-primary-900">{competitor.metrics.engagement}%</p>
          </div>
          <div className="bg-primary-100 p-3 rounded-lg">
            <p className="text-sm font-medium text-primary-700">Seguidores</p>
            <p className="text-lg font-semibold text-primary-900">
              {competitor.metrics.followers.toLocaleString()}
            </p>
          </div>
          <div className="bg-primary-100 p-3 rounded-lg">
            <p className="text-sm font-medium text-primary-700">Última Atualização</p>
            <p className="text-lg font-semibold text-primary-900">{competitor.metrics.lastUpdated}</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Competitors = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleCompetitorClick = (id: string) => {
    navigate(`/competitors/${id}`);
  };

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
          {isMobile ? (
            <div className="grid gap-4">
              {mockCompetitors.map((competitor) => (
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
                  <TableHead className="text-primary-900">Posts</TableHead>
                  <TableHead className="text-primary-900">Engajamento</TableHead>
                  <TableHead className="text-primary-900">Seguidores</TableHead>
                  <TableHead className="text-primary-900">Última Atualização</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCompetitors.map((competitor) => (
                  <TableRow
                    key={competitor.id}
                    className="cursor-pointer hover:bg-primary-50 transition-colors"
                    onClick={() => handleCompetitorClick(competitor.id)}
                  >
                    <TableCell className="font-medium text-primary-800">
                      {competitor.name}
                    </TableCell>
                    <TableCell>{competitor.website}</TableCell>
                    <TableCell className="font-medium">{competitor.metrics.posts}</TableCell>
                    <TableCell className="font-medium">{competitor.metrics.engagement}%</TableCell>
                    <TableCell className="font-medium">
                      {competitor.metrics.followers.toLocaleString()}
                    </TableCell>
                    <TableCell>{competitor.metrics.lastUpdated}</TableCell>
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
