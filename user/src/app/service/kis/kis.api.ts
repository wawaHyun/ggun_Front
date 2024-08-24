'use server'

import ThirtyDaysAgo from "@/app/common/date/thirtyDaysAgo";
import Today from "@/app/common/date/today";
import { cookies } from "next/headers";
import { kisHeaders } from "../header/kisHeader";
import { extractCookie } from "@/app/component/util/extractToken";

export async function fetchKisAuth(): Promise<string | { status: number }> {
    const url = `${process.env.KIS_DEV_API_BASE_URL}${process.env.KIS_DEV_API_AUTH2}`
    try {
        const response = await fetch(url
            , {
                method: 'POST',
                headers: {},
                body: JSON.stringify({
                    grant_type: 'client_credentials',
                    appkey: process.env.KIS_DEV_API_KEY,
                    appsecret: process.env.KIS_DEV_API_SECERET,
                })
            }
        );

        if (!response.ok) { throw new Error('API Network response was not ok'); }


        if (response.ok) {
            const kisToken = response.headers.getSetCookie()[0];
            cookies().set({
                name: 'kisToken',
                value: extractCookie(kisToken, 'kisToken'),
                path: '/',
                maxAge: Number(extractCookie(kisToken, 'Max-Age')),
                expires: new Date(extractCookie(kisToken, 'Expires')),
                sameSite: 'lax',
                httpOnly: true,
            });
        }
        const data: any = await response.json();
        console.log("KIS fetchKisAuth api cookie update : ", cookies().get('kisToken'));
        return data;

    } catch (error) {
        console.log("fetchKisAuth err : " + error);
        return { status: 500 };
    }
}


export async function fetchKisSection(props: number): Promise<IKisSection | { status: number }> {
    const fid_input_iscd = props == 1 ? "1001" : "0001"
    const query = new URLSearchParams({
        "fid_cond_mrkt_div_code": "U",
        "fid_input_date_1": "20240701",
        "fid_input_date_2": "20240731",
        "fid_input_iscd": fid_input_iscd,
        "fid_period_div_code": "D"
    })

    const url = `${process.env.KIS_DEV_API_BASE_URL}${process.env.KIS_DEV_API_SECTION}?${query}`
    try {
        const response = await fetch(url
            , {
                method: 'GET',
                headers: { ...kisHeaders, 'tr_id': 'FHKUP03500100' },
            }
        );

        if (!response.ok) { throw new Error('API Network response was not ok'); }

        const res: IKisSection = await response.json();

        if (res.length === 0) {
            return { status: 404 };
        }

        return res;
    } catch (error) {
        console.log("KIS Section api err : " + error);
        return { status: 500 };
    }
}

export async function fetchKisAskingprice(stockCode: string): Promise<IKisAskPrice | { status: number }> {
    const query = new URLSearchParams({
        "fid_cond_mrkt_div_code": "J",
        "fid_input_iscd": stockCode,
    })

    const url = `${process.env.KIS_DEV_API_BASE_URL}${process.env.KIS_DEV_API_TRADE}?${query}`

    try {
        const response = await fetch(url
            , {
                method: 'GET',
                headers: { ...kisHeaders, 'tr_id': 'FHKST01010200' },
            }
        );

        if (!response.ok) { throw new Error('API Network response was not ok'); }

        const res: IKisAskPrice = await response.json();

        if (res.msg1 != '정상처리 되었습니다.') {
            return { status: 404 };
        }

        return res;
    } catch (error) {
        console.log("KIS AskPrice api err : " + error);
        return { status: 500 };
    }
}

export async function fetchKisDailyPrice(stockCode: string): Promise<IKisDaily | { status: number }> {
    const query = new URLSearchParams({
        "fid_cond_mrkt_div_code": "J",
        "fid_input_iscd": stockCode,
        "fid_input_date_1": ThirtyDaysAgo(),
        "fid_input_date_2": Today(),
        "fid_period_div_code": "D",
        "fid_org_adj_prc": "0",
    })

    const url = `${process.env.KIS_DEV_API_BASE_URL}${process.env.KIS_DEV_API_DAILYPRICE}?${query}`

    try {
        const response = await fetch(url
            , {
                method: 'GET',
                headers: { ...kisHeaders, 'tr_id': 'FHKST03010100' },
            }
        );

        if (!response.ok) { throw new Error('API Network response was not ok'); }
        const res: IKisDaily = await response.json();
        if (res == null) {
            return { status: 404 };
        }
        // console.log("fetchKisDailyPrice api",res.output2.length)

        return res;
    } catch (error) {
        console.log("KIS fetchKisDailyPrice api err : " + error);
        return { status: 500 };
    }
}

export async function fetchKisNow(stockCode: string): Promise<IKisNow | { status: number }> {
    const query = new URLSearchParams({
        "fid_cond_mrkt_div_code": "J",
        "fid_input_iscd": stockCode,
    })

    const url = `${process.env.KIS_DEV_API_BASE_URL}${process.env.KIS_DEV_API_NOW}?${query}`

    try {
        const response = await fetch(url
            , {
                method: 'GET',
                headers: { ...kisHeaders, 'tr_id': 'FHKST01010100' },
            }
        );

        if (!response.ok) { throw new Error('API Network response was not ok'); }
        const res: IKisNow = await response.json();
        if (res == null) {
            return { status: 404 };
        }
        // console.log("fetchKisNow api : ",res)

        return res;
    } catch (error) {
        console.log("KIS fetchKisNow api err : " + error);
        return { status: 500 };
    }
}
