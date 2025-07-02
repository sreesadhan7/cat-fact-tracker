export interface CatFact {
  id: number;
  fact: string;
  source: string;
  timestamp: string;
  favorite: boolean;
}

export interface AddFactRequest {
  fact: string;
  source?: string;
}
