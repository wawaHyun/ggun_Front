'use client'
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchKisAskingprice, fetchKisDailyPrice, fetchKisNow, fetchKisSection } from "../service/kis/kis.api";
import { stockList } from "../common/dummy/stock.dummy";

export const useKixSection = (id:number): UseQueryResult<IKisSection> => {
    const queryResult = useQuery<IKisSection>({
        queryKey: ["kisSection", id],
        queryFn:async (): Promise<IKisSection> => {
            const response = await fetchKisSection(id);
            if (typeof response === 'object' && 'status' in response) {
                throw new Error(`Error: ${response.status}`);
            }
            return response;
        },
    });

    return queryResult;
}

export const useKixPrice = (stockCode:string): UseQueryResult<IKisAskPrice> => {
    const queryResult = useQuery<IKisAskPrice>({
        queryKey: ["kisAskPrice",stockCode],
        queryFn:async (): Promise<IKisAskPrice> => {
            const response = await fetchKisAskingprice(stockCode);
            if (typeof response === 'object' && 'status' in response) {
                throw new Error(`Error: ${response.status}`);
            }
            return response;
        },
        staleTime : 1000,
    });

    return queryResult;
}

export const useKixDaily = (stockName:string): UseQueryResult<IKisDaily> => {
    const stockCode = stockList.find((v: any) => v.name === stockName)?.code;
    // console.log("useKixDaily input : ", JSON.stringify(stockName),JSON.stringify(stockCode))
    const queryResult = useQuery<IKisDaily>({
        queryKey: ["kisDaily",stockCode],
        queryFn:async (): Promise<IKisDaily> => {
            const response = await fetchKisDailyPrice(stockCode+'');
            if (typeof response === 'object' && 'status' in response) {
                throw new Error(`Error: ${response.status}`);
            }
            return response;
        },
    });

    return queryResult;
}

export const useKixNow = (stockName:string): UseQueryResult<IKisNow> => {
    const stockCode = stockList.find((v: any) => v.name === stockName)?.code;
    // console.log("useKixDaily input : ", JSON.stringify(stockName),JSON.stringify(stockCode))
    const queryResult = useQuery<IKisNow>({
        queryKey: ["kisNow",stockCode],
        queryFn:async (): Promise<IKisNow> => {
            const response = await fetchKisNow(stockCode+'');
            if (typeof response === 'object' && 'status' in response) {
                throw new Error(`Error: ${response.status}`);
            }
            return response;
        },
        staleTime : 1000,
    });

    return queryResult;
}
