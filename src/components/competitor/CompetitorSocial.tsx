import { Card, CardContent } from "@/components/ui/card";
import type { Competitor } from "@/types/competitor";

interface CompetitorSocialProps {
  competitor: Competitor;
}

export const CompetitorSocial = ({ competitor }: CompetitorSocialProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">
            {competitor.youtube_id || 'N/A'}
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
  );
};