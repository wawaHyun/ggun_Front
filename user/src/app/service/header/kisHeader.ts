import { cookies } from "next/headers";
import { fetchKisAuth } from "../kis/kis.api";

const kisAuthToken = cookies().get('kisToken')?.value == null ? fetchKisAuth().then((res:any)=>cookies().get('kisToken')?.value) : cookies().get('kisToken')?.value;

export const kisHeaders: HeadersInit = {
    'content-type': 'application/json',
    'authorization': 'Bearer ' + kisAuthToken,
    'appkey': process.env.KIS_DEV_API_KEY || '',
    'appsecret': process.env.KIS_DEV_API_SECERET || '',
};
