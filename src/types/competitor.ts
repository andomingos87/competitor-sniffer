export interface Competitor {
  id: number;
  name: string | null;
  website: string | null;
  youtube_id: string | null;
  instagram: string | null;
  facebook: string | null;
  created_at: string | null;
}

export interface AddCompetitorData {
  name: string;
  youtube_id: string;
}