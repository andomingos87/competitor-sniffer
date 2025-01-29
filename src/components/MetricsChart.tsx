import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MetricsChartProps {
  data: Array<{
    updated_at: string;
    subscribers?: number | null;
    views?: number | null;
    videos?: number | null;
  }>;
  metric: 'subscribers' | 'views' | 'videos';
  color: string;
}

export const MetricsChart = ({ data, metric, color }: MetricsChartProps) => {
  const formattedData = data.map(item => ({
    ...item,
    date: format(new Date(item.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
  }));

  const getMetricLabel = () => {
    switch (metric) {
      case 'subscribers':
        return 'Inscritos';
      case 'views':
        return 'Visualizações';
      case 'videos':
        return 'Vídeos';
      default:
        return '';
    }
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={70}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey={metric}
            name={getMetricLabel()}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};