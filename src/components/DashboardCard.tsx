import { Card } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

export const DashboardCard = ({ title, value, description, icon }: DashboardCardProps) => {
  return (
    <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <p className="text-3xl font-bold text-primary-800 mt-2">{value}</p>
          <p className="text-sm text-gray-500 mt-2">{description}</p>
        </div>
        <div className="text-primary-400">{icon}</div>
      </div>
    </Card>
  );
};