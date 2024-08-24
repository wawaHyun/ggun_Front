'use server'

import Today from "@/app/common/date/today";
import { TransWonDummy } from "@/app/common/dummy/account.dummy";

export async function fetchExchange(): Promise<IExchange[] | { status: number }> {
    const code = ['USD', 'CNH', 'EUR', 'JPY(100)'];
    try {
        const response = await fetch(`${process.env.EXCHANGE_API_URL}?authkey=${process.env.EXCHANGE_API_KEY}&searchdate=${Today()}&data=AP01`);

            if (!response.ok) { throw new Error('API Network response was not ok'); }

            const data = await response.json();
            console.log("fetchData data:", data);

            if (Array.isArray(response)) {
                const data: any = response.filter((v: IExchange) => code.includes(v.cur_unit));
                // console.log("fetchExchange data : ", data);
                return data
            }
            if (!data || data.length === 0) { return TransWonDummy; }

            return data;
        } catch (error) {
            console.error("fetchExchange err : " + error);
            console.error("fetchExchange err : " + `${process.env.EXCHANGE_API_URL}?authkey=${process.env.EXCHANGE_API_KEY}&searchdate=${Today()}&data=AP01`);
            return TransWonDummy;
        }
    }