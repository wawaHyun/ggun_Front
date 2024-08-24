'use client'
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchStockAticleList, fetchStockAticleTop } from "../service/itemArticle/itemArticle";


export const useStockAticleTop = (): UseQueryResult<IItemArticle[]> => {
    const queryResult = useQuery<IItemArticle[]>({
        queryKey: ["stockAticleTop"],
        queryFn: async (): Promise<IItemArticle[]> => {
            const response = await fetchStockAticleTop();
            if ('status' in response) {
                throw new Error(`Error: ${response.status}`);
            }
            return response;
        },
    });

    return queryResult;
}

export const useStockAticleList = (stockId:number): UseQueryResult<IItemArticle[]> => {
    const queryResult = useQuery<IItemArticle[]>({
        queryKey: ["stockAticleList"],
        queryFn: async (): Promise<IItemArticle[]> => {
            const response = await fetchStockAticleList(stockId);
            if ('status' in response) {
                throw new Error(`Error: ${response.status}`);
            }
            return response;
        },
    });

    return queryResult;
}
