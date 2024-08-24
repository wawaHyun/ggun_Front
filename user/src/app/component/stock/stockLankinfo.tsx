import { useKixDaily } from "@/app/hooks/kis.hook";

export default function StockLankInfo({ stockName }: { stockName: string }) {

    const { data: kisDaily } = useKixDaily(stockName);
    return (<>
            <div className="grid grid-cols-3">
                <div>{Number(kisDaily?.output1.stck_prpr).toLocaleString()}</div>
                <div>{Number(kisDaily?.output1.acml_vol).toLocaleString()}</div>
                <div>{Number(kisDaily?.output1.hts_avls).toLocaleString()}</div>
            </div>
    </>)
}