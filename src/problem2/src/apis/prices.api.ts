import fetchRequest from "../includes/fetchRequest";
import { PriceData, PricesResponse } from "../types/prices.types";

const BASE_IMG_URL =
  "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/";

export async function getPrices(): Promise<PriceData[]> {
  const response = await fetchRequest.get("prices.json");
  // Currently the api is returning duplicate currency so to avoid that added 'existingCurrency' check.
  const existingCurrency: string[] = [];
  return response.data.reduce(
    (acc: any, current: { price: number; currency: string }) => {
      if (current?.price && !existingCurrency.includes(current.currency)) {
        existingCurrency.push(current.currency);
        return [
          ...acc,
          {
            ...current,
            value: current.currency,
            label: current.currency,
            img: `${BASE_IMG_URL}${current.currency}.svg`,
          },
        ];
      }

      return acc;
    },
    [],
  );
}
