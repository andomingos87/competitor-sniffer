import { Card } from "@/components/ui/card";
import { MetricsChart } from "@/components/MetricsChart";

interface CompetitorChartsProps {
  metricsHistory: any[];
}

export const CompetitorCharts = ({ metricsHistory }: CompetitorChartsProps) => {
  return (
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
  );
};