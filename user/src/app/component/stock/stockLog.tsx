'use client'

import Pagination from "@/app/component/navigation/pagination";
import { useKixDaily } from "@/app/hooks/kis.hook";
import { useGlobalStock } from "@/app/store/globalStock.store";
import { useState } from "react";


function StockLog() {

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const offset = (page - 1) * limit;

    const globalStock = useGlobalStock();

    const { data: kisDaily } = useKixDaily(globalStock.data.name + '');

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>날짜</th>
                        <th>종가</th>
                        <th>전일대비</th>
                        <th>시가</th>
                        <th>고가</th>
                        <th>저가</th>
                        <th>거래량</th>
                    </tr>
                </thead>
                <tbody>
                    {kisDaily?.output2.slice(offset, offset + limit).map((v:IKisDailyOutput2, i: any) =>
                        <tr key={i}>
                         <td>{i+1}</td>
                            <td>{v.stck_bsop_date}</td>
                            <td>{Number(v.stck_clpr).toLocaleString()}</td>
                            <td className={`${Number(v.prdy_vrss) < 0  ? 'text-red-400': 'text-blue-400'}`}>{Number(v.prdy_vrss).toLocaleString()}</td>
                            <td className={`${Number(v.stck_oprc) < 0  ? 'text-red-400': 'text-blue-400'}`}>{Number(v.stck_oprc).toLocaleString()}</td>
                            <td>{Number(v.stck_hgpr).toLocaleString()}</td>
                            <td>{Number(v.stck_lwpr).toLocaleString()}</td>
                            <td>{Number(v.acml_vol).toLocaleString()}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="w-full items-center flex justify-center h-[50px]">
                <Pagination total={kisDaily?.output2.length} limit={10} page={page} setPage={setPage} />
            </div>

        </div>
    )
};
export default StockLog;