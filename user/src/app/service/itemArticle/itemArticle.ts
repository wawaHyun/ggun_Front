'use server'

import { userHeaders } from "../header/userHeader";
import { stockCommunDummy } from "@/app/common/dummy/chat.dummy";


export async function fetchStockAticleTop(): Promise<IItemArticle[] | { status: number }> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/stockArticle/listTop`,{
            method: 'GET',
            headers: userHeaders,
        });

        if (!response.ok) { throw new Error('API Network response was not ok'); }
        const data: IItemArticle[] = await response.json();
        if (data.length === 0) { 
            return stockCommunDummy
            // return { status: 404 }; 
        }

        console.log("fetchStockAticleTop : " + JSON.stringify(data))

        return data
    } catch (error) {
        console.error("fetchStockAticleTop err : " + error);
        return stockCommunDummy;
        // return { status: 500 };
    }
}

export async function fetchStockAticleList(stockId:number): Promise<IItemArticle[] | { status: number }> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/stockArticle/list?boardId=${stockId}`,{
            method: 'GET',
            headers: userHeaders,
        });

        if (!response.ok) { throw new Error('API Network response was not ok'); }
        const data: IItemArticle[] = await response.json();
        if (data.length === 0) { 
            // return stockCommunDummy
            return { status: 404 }; 
        }

        // console.log("fetchStockAticleList : " + JSON.stringify(data))

        return data
    } catch (error) {
        console.error("fetchStockAticleList err : " + error);
        // return stockCommunDummy;
        return { status: 500 };
    }
}


export async function saveItemArticle(article: IItemArticle): Promise<string | { status: number }> {
    const { title, content, stockBoards } = article || []
    console.log("saveArticle : " + JSON.stringify(article))
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/stockArticle/save`, {
            method: 'POST',
            headers: userHeaders,
            body: JSON.stringify({
                title: title,
                content: content,
                stockBoards: stockBoards,
            })
        })
        if (!response.ok) { throw new Error('API Network response was not ok'); }
        const data:string = await response.json();
        if (data.length === 0) { return { status: 404 }; }
        console.log("saveArticle : " + JSON.stringify(article))
        return data
    } catch (error) {
        console.error("saveArticle err : " + error);
        return { status: 500 };
    }
}