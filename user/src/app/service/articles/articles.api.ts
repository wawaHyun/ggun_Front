'use server'

import { userHeaders } from "../header/userHeader";
import { articlesDummy } from "@/app/common/dummy/articles.dummy";

export async function fetchMyArticleList(board: string): Promise<any[] | { status: number }> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/articles/list?boardId=${board}`,{
            method: 'GET',
            headers: userHeaders,
        });

        if (!response.ok) { throw new Error('API Network response was not ok'); }
        const data: any[] = await response.json();
        if (data.length === 0) { return { status: 404 }; }

        return data
    } catch (error) {
        console.error("myArticleList err : " + error);
        return articlesDummy;
    }
}

export async function findByArticleId(id: string): Promise<IArticle | { status: number }> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/api/boards/list?id=${id}`,{
            method: 'GET',
            headers: userHeaders,
        });

        if (!response.ok) { throw new Error('API Network response was not ok'); }
        const data: IArticle = await response.json();

        return data
    } catch (error) {
        console.error("findByArticleId err : " + error);
        return { status: 500 };
    }
}

export async function saveArticle(article: IArticle): Promise<IArticle | { status: number }> {
    const { title, content, writerId, boardId } = article || {}

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/articles/save`, {
            method: 'POST',
            headers: userHeaders,
            body: JSON.stringify({
                title: title,
                content: content,
                writerId: writerId,
                boardId: boardId,
            })
        })
        if (!response.ok) { throw new Error('API Network response was not ok'); }
        const data: IArticle = await response.json();
        if (data == null) { return { status: 404 }; }
        console.log("saveArticle api : " + JSON.stringify(article))
        return data
    } catch (error) {
        console.error("saveArticle err : " + error);
        return { status: 500 };
    }
}
