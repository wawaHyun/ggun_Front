'use client'
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchItemsDetail } from "../service/items/items.api";


export const useItemDetail = (stockName:string): UseQueryResult<IItems> => {
    const queryResult = useQuery<IItems>({
        queryKey: ["itemDetail"],
        queryFn: async (): Promise<IItems> => {
            const response = await fetchItemsDetail(stockName);
            if ('status' in response) {
                throw new Error(`Error: ${response.status}`);
            }
            return response;
        },
    });

    return queryResult;
}
