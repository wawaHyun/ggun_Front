import { useState } from "react";
import Image from "next/image";
import { useGlobalStock } from "@/app/store/globalStock.store";
import { stockList } from "@/app/common/dummy/stock.dummy";

export const StockComuBox = ({ id, writerId, title, content, date }: any) => {
    const [isOpen, setIsOpen] = useState(false);

    const globalStock = useGlobalStock();

    return (
        <div key={id} className="w-full h-full">
            <button className="w-full h-[50px] px-4 items-center active:text-xl flex w-full justify-between" onClick={() => setIsOpen(!isOpen)}>
                <div className="text-lg text-left active:text-xl flex space-x-3 truncate">
                <Image src={globalStock.data?.id !== undefined ? `${stockList[globalStock.data.id + 0].imgSrc}` : ``} width={30} height={30} alt={"stockLogo"}
                    className="rounded-full border-dashed" />
                     {title}
                    </div>
                {/* <div className="text-slate-400 text-right">{writerId}</div> */}
            </button>
            <hr />

            {isOpen == true ?
                <div className="border shadow-lg rounded-b-lg overflaw-auto p-2 w-full min-h-[100px] space-y-2 bg-slate-200 ">
                    <div className={`text-slate-400 text-right h-[15%]`}>{date}</div>
                    <div className="h-[50%] min-h-[30px]">{content}</div>
                    <input type="text" placeholder="자유롭게 의견을 나눠보세요." className="h-[35%] focus:h-[50px]" />
                </div>
                : <div></div>}
        </div>
    )

}