'use server'

import { newsDummy } from "@/app/common/dummy/news.dummy";

export async function fetchNews(): Promise<INews[] | { status: number }> {
    try {
        const headers: HeadersInit = {
            'content-type': 'application/json',
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admins/news/list`,{
            method:'GET',
            headers: headers,
        })
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/list`)

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const res: INews[] = await response.json();
        // console.log("News list api data : ", data);

        if (res.length === 0) {
            return { status: 404 };
        }

        return res;
    } catch (error) {
        console.error("News list api err : " + error);
        // return { status: 500 };
        return newsDummy;
    }
}