import { Users, Eye, Video } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";

interface CompetitorMetricsProps {
  metrics: {
    subscribers?: number;
    views?: number;
    videos?: number;
  } | null;
}

export const CompetitorMetrics = ({ metrics }: CompetitorMetricsProps) => {
  return (
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
  );
};