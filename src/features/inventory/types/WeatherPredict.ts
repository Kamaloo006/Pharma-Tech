export interface Recommendation {
  product_name: string;
  advice: string;
}

export interface WeatherPredictResponse {
  status: string;
  weather_summary: string;
  ai_recommendations: Recommendation[];
}