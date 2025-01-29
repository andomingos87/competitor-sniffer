import { ArrowRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  <Card className="cursor-pointer hover:bg-gray-50" onClick={onClick}>
    <CardHeader>
      <CardTitle className="text-lg">{competitor.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <p className="text-sm text-gray-500">{competitor.website}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Posts</p>
            <p className="text-lg">{competitor.metrics.posts}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Engajamento</p>
            <p className="text-lg">{competitor.metrics.engagement}%</p>
          </div>
          <div>
            <p className="text-sm font-medium">Seguidores</p>
            <p className="text-lg">{competitor.metrics.followers.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Última Atualização</p>
            <p className="text-lg">{competitor.metrics.lastUpdated}</p>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Concorrentes</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-2">
            Monitore e analise seus principais concorrentes
          </p>
        </div>
        <Button className="gap-2 w-full sm:w-auto">
          <Users className="h-4 w-4" />
          Adicionar Concorrente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Concorrentes</CardTitle>
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
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead>Engajamento</TableHead>
                  <TableHead>Seguidores</TableHead>
                  <TableHead>Última Atualização</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCompetitors.map((competitor) => (
                  <TableRow
                    key={competitor.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleCompetitorClick(competitor.id)}
                  >
                    <TableCell className="font-medium">
                      {competitor.name}
                    </TableCell>
                    <TableCell>{competitor.website}</TableCell>
                    <TableCell>{competitor.metrics.posts}</TableCell>
                    <TableCell>{competitor.metrics.engagement}%</TableCell>
                    <TableCell>
                      {competitor.metrics.followers.toLocaleString()}
                    </TableCell>
                    <TableCell>{competitor.metrics.lastUpdated}</TableCell>
                    <TableCell>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
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