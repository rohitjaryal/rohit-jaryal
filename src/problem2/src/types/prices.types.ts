export interface PricesResponse {
  currency: string;
  date: string;
  price: number;
}

export interface PriceData {
  [key: string]: PricesResponse & { img: string };
}
