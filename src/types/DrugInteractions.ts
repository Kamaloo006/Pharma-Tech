export interface DrugInteractionRequest {
  product_ids: number[];
}

export interface InteractionItem {
  severity: string; 
  interaction: string;
}

export interface DrugInteractionResponse {
  status: string;
  interactions: InteractionItem[];
}