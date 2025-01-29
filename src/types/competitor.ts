export interface Competitor {
  id: string;
  name: string;
  website: string;
  metrics: {
    posts: number;
    engagement: number;
    followers: number;
    lastUpdated: string;
  };
}