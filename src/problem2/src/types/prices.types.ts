export interface PricesResponse {
  currency: string;
  date: string;
  price: number;
}

export type PriceData = PricesResponse & { img: string };
