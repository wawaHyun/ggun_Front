'use client'

import { stockInfoDummy, stockList } from "@/app/common/dummy/stock.dummy";
import { useItemDetail } from "@/app/hooks/item.hook";
import { useKixDaily, useKixNow } from "@/app/hooks/kis.hook";
import { fetchItemsDetail } from "@/app/service/items/items.api";
import { useGlobalStock } from "@/app/store/globalStock.store";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";


function StockInfo() {

    const globalStock = useGlobalStock();

    const { data: itemDetail } = useItemDetail(globalStock.data.code+'');
    const { data:kisNow } = useKixNow(globalStock.data.name+'');

    return (
        <div className="w-full h-full">
            <div className="w-full flex justify-center">
                <div className="flex-col w-full grid grid-cols-4 gap-3 text-center">

                    <div className="col-span-4 flex justify-center ">
                        <Image src={globalStock.data?.id !== undefined ?`${stockList[globalStock.data.id + 0].imgSrc}`:``} width={100} height={100} alt={"stockLogo"} 
                        className="rounded-full border-dashed "/></div>
                    {/* <div className="text-center border-r-2">전일</div>
                    <div className={`${Number(itemDetail && itemDetail.open) > 0 ? 'text-red-400' : 'text-blue-400'} text-right w-2/3`}>{itemDetail?.close}</div>
                    <div className="text-center border-r-2">시가</div>
                    <div className={`${Number(itemDetail && itemDetail.open) > 0 ? 'text-red-400' : 'text-blue-400'} text-right w-2/3`}>{itemDetail?.open}</div>
                    <div className="text-center border-r-2">고가</div>
                    <div className={`${Number(itemDetail && itemDetail.open) > 0 ? 'text-red-400' : 'text-blue-400'} text-right w-2/3`}>{itemDetail?.high}</div>
                    <div className="text-center border-r-2">저가</div>
                    <div className={`${Number(itemDetail && itemDetail.open) > 0 ? 'text-red-400' : 'text-blue-400'} text-right w-2/3`}>{itemDetail?.low}</div>
                    <div className="text-center border-r-2">거래량</div><div>{itemDetail?.volume}</div>
                    <div className="text-center border-r-2">대금</div><div>{itemDetail?.adjClose}</div> */}

                    
                    <div className=" border-r-2">시가</div>
                    <div className={`${Number(kisNow && kisNow.output.stck_prpr) > 0 ? 'text-red-400' : 'text-blue-400'} text-right w-2/3`}>{Number(kisNow?.output.stck_prpr).toLocaleString()}</div>
                    <div className="border-r-2">기준가</div>
                    <div className={`${Number(kisNow && kisNow.output.stck_sdpr) > 0 ? 'text-red-400' : 'text-blue-400'} text-right w-2/3`}>{Number(kisNow?.output.stck_sdpr).toLocaleString()}</div>
                    <div className="border-r-2">전일대비율</div>
                    <div className={`${Number(kisNow && kisNow.output.prdy_ctrt) > 0 ? 'text-red-400' : 'text-blue-400'} text-right w-2/3`}>{Number(kisNow?.output.stck_hgpr).toLocaleString()}</div>
                    <div className="border-r-2">고가</div>
                    <div className={`${Number(kisNow && kisNow.output.stck_hgpr) > 0 ? 'text-red-400' : 'text-blue-400'} text-right w-2/3`}>{Number(kisNow?.output.stck_hgpr).toLocaleString()}</div>
                    <div className="border-r-2">저가</div>
                    <div className={`${Number(kisNow && kisNow.output.stck_hgpr) > 0 ? 'text-red-400' : 'text-blue-400'} text-right w-2/3`}>{Number(kisNow?.output.stck_hgpr).toLocaleString()}</div>
                    <div className="border-r-2">누적 거래량</div><div>{Number(kisNow?.output.acml_vol).toLocaleString()}</div>
                    <div className="border-r-2">누적 거래 대금</div><div>{Number(kisNow?.output.acml_tr_pbmn).toLocaleString()}</div>
                    <div className="border-r-2">자본금</div><div>{Number(kisNow?.output.cpfn).toLocaleString()}</div>
                    <div className=" border-r-2">주식액면가</div><div>{Number(kisNow?.output.stck_fcam).toLocaleString()}</div>
                    <div className=" border-r-2">상장주수</div><div>{Number(kisNow?.output.lstn_stcn).toLocaleString()}</div>
                    <div className=" border-r-2">PER</div><div>{Number(kisNow?.output.per).toLocaleString()}</div>
                    <div className=" border-r-2">PBR</div><div>{Number(kisNow?.output.pbr).toLocaleString()}</div>
                    <div className=" border-r-2">EPS</div><div>{Number(kisNow?.output.eps).toLocaleString()}</div>
                    <div className=" border-r-2">BPS</div><div>{Number(kisNow?.output.bps).toLocaleString()}</div>

                </div>
            </div>
        </div>
    )
};
export default StockInfo;