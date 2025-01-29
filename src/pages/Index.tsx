import { Activity, Users, TrendingUp, BarChart2 } from "lucide-react";
import { CompetitorForm } from "@/components/CompetitorForm";
import { DashboardCard } from "@/components/DashboardCard";
import { InsightsList } from "@/components/InsightsList";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center mb-8">
          <div className="mb-4">
            <h1 className="text-5xl font-extrabold text-primary-800 tracking-tighter">
              SPIA
            </h1>
          </div>
          <h2 className="text-4xl font-bold text-primary-800 mb-2">
            Monitor de Concorrentes
          </h2>
          <p className="text-gray-600">
            Monitore seus concorrentes e obtenha insights valiosos
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Concorrentes"
            value="12"
            description="Total monitorado"
            icon={<Users className="w-6 h-6" />}
          />
          <DashboardCard
            title="Posts"
            value="1.2k"
            description="Últimos 30 dias"
            icon={<Activity className="w-6 h-6" />}
          />
          <DashboardCard
            title="Engajamento"
            value="25%"
            description="Taxa média"
            icon={<TrendingUp className="w-6 h-6" />}
          />
          <DashboardCard
            title="Análises"
            value="48"
            description="Insights gerados"
            icon={<BarChart2 className="w-6 h-6" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CompetitorForm />
          <InsightsList />
        </div>
      </div>
    </div>
  );
};

export default Index;
