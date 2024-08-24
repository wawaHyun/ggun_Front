'use client'

import { useMyArticleList } from "@/app/hooks/article.hook";
import { useRouter } from "next/navigation"
import { BrownLink } from "../link/brawnLink";
import Pagination from "../navigation/pagination";
import { useState } from "react";
import IConset from "@/app/common/icon/icon";

export default function Articles({ prop }: { prop: string }) {

    const router = useRouter();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const offset = (page - 1) * limit;

    const { data: artiMyList } = useMyArticleList(prop);

    return (
        <div>
            {prop === '1' ?
                <div className="w-full text-center flex justify-center mb-3 ">
                    <div className="w-[30%]">
                        <BrownLink click={`/articles/save/${prop}`}>1:1 문의하기</BrownLink>
                    </div>
                </div>
                : ''}
            <table className="">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>제목</th>
                        <th>내용</th>
                        <th>첨부파일</th>
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {artiMyList && artiMyList.slice(offset, offset + limit).map((v: IArticle, i: number) =>
                        <tr key={v.id} onClick={() => router.push(`/articles/detail/${v.id}`)}>
                            <td>{v.id}</td>
                            <td>{v.title}</td>
                            <td>{v.content}</td>
                            <td className="flex justify-center">{Number(v.id) >= 86 ?   <div ><IConset.ClipIcon /></div> : ''}</td>
                           
                            <td>{v.modDate}</td>
                        </tr>
                    )
                    }
                </tbody>
            </table>
            <div className="w-full items-center flex justify-center h-[50px]">
                <Pagination total={artiMyList?.length} limit={3} page={page} setPage={setPage} />
            </div>
        </div>
    )
}