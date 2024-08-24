'use client'

import { stockCommunDummy } from "@/app/common/dummy/chat.dummy";
import { StockComuBox } from "@/app/component/stock/stockCommun";
import { useStockAticleList } from "@/app/hooks/itemArticle";
import { saveItemArticle } from "@/app/service/itemArticle/itemArticle";
import { useArticleAction } from "@/app/store/articles.store";
import { useGlobalStock } from "@/app/store/globalStock.store";
import { useItemArticleAction, useItemArticlestack } from "@/app/store/itemArticles.store";
import { useRouter } from "next/navigation";

function StockChat() {

    const itemArticleAction = useItemArticleAction();
    const itemaArticleStack = useItemArticlestack();
    const router = useRouter();

    const globalStock = useGlobalStock();

    const {data :stockAticleList } = useStockAticleList(Number(globalStock.data.id)+1);

    const randomList = () => {
        return stockCommunDummy.sort(() => Math.random() - 0.5).slice(0, 4);
    }

    const handleInput = (e:any) =>{
        itemArticleAction.update({ ...itemaArticleStack, [e.target.name]: e.target.value });
        // console.log('stackAccountTransfer : ' + JSON.stringify(itemaArticleStack))
    }   

    const saveItemArticleApi = async () => await saveItemArticle(itemaArticleStack)

    const submitChat = (e: any) => {
        try {
            if (e.key === "Enter") {
                e.preventDefault();
                itemArticleAction.update({ ...itemaArticleStack, stockBoards : globalStock.data.id+'' });
                console.log('submitChat : ' + JSON.stringify(itemaArticleStack))
                saveItemArticleApi()
                    .then((res: any | { status: number; }) => {
                        itemArticleAction.clean()
                        router.refresh();
                    })
                    .catch((error) => {
                        console.log("sendChat page err: ", error)
                    })
            }
            // refetch();
        } catch (error) {
            console.error('Error submitChat message:', error);
        }
    }

    return (
        <div className="w-full h-full flex justify-center">
            <div className="w-[85%]">
                <div className="text-lg bold">
                    <div className="blod text-[32px] h-[100px] content-center">{globalStock.data.name} 종목토론<hr /></div>
                    <input type="text" className="h-[50px] w-1/3 my-2" placeholder="종목토론 제목" name="title" onChange={handleInput}/>
                    <input type="text" className="h-[50px] w-2/3" placeholder="종목에 대한 자유로운 이야기를 해보세요!" name="content" onChange={handleInput}  onKeyDown={submitChat} />
                </div>
                <div>
                    {stockAticleList?.map((v:any, i:Number) =>
                        <StockComuBox key={v.id} id={v.id} writer={v.writerId} title={v.title} content={v.content} date={v.date} />
                    )}
                </div>
            </div>
        </div>
    )
};
export default StockChat;
