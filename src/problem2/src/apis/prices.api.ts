import fetchRequest from "../includes/fetchRequest";
import { PriceData, PricesResponse } from "../types/prices.types";

const BASE_IMG_URL =
  "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/";

export async function getPrices(): Promise<PriceData> {
  const response = await fetchRequest.get("prices.json");
  return response.data.reduce(
    (acc: any, current: { price: number; currency: string }) => {
      if (current.price) {
        return {
          ...acc,
          [current.currency]: {
            ...current,
            img: `${BASE_IMG_URL}${current.currency}.svg`,
          },
        };
      }
    },
    {},
  );
}
