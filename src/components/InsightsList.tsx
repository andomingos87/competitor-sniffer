import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const mockInsights = [
  {
    id: 1,
    text: "Aumento de 25% no engajamento do concorrente A nas últimas 2 semanas",
    type: "engagement",
  },
  {
    id: 2,
    text: "Palavras-chave em alta: 'inovação', 'sustentabilidade', 'tecnologia'",
    type: "keywords",
  },
  {
    id: 3,
    text: "Frequência média de posts aumentou para 3x por semana",
    type: "frequency",
  },
];

export const InsightsList = () => {
  return (
    <Card className="p-6 bg-white shadow-lg animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-primary-600" />
        <h2 className="text-2xl font-bold text-primary-800">Insights da IA</h2>
      </div>
      <div className="space-y-4">
        {mockInsights.map((insight) => (
          <div
            key={insight.id}
            className="p-4 rounded-lg bg-primary-100 border border-primary-200"
          >
            <p className="text-gray-800">{insight.text}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};