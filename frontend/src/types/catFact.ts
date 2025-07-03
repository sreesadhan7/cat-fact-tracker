export interface CatFact {
  id: number;
  fact: string;
  source: string;
  created_at: string;
  favorite: boolean;
}

export interface AddFactRequest {
  fact: string;
  source?: string;
}
