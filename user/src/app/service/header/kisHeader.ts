import { cookies } from "next/headers";
import { fetchKisAuth } from "../kis/kis.api";

async function ensureKisToken() {
    while (cookies().get('kisToken')?.value == null) {
        await fetchKisAuth();
    }
}


export async function getKisHeaders(): Promise<HeadersInit> {
    await ensureKisToken();
    
    return {
        'authorization': 'Bearer ' + cookies().get('kisToken')?.value,
        'appkey': process.env.KIS_DEV_API_KEY || '',
        'appsecret': process.env.KIS_DEV_API_SECERET || '',
    };
}
