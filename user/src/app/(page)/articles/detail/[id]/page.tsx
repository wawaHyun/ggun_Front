'use client'

import { WhiteBox } from '@/app/component/style/whiteBox';
import Link from 'next/link';
import Image from 'next/image';
import { MoveButton } from '@/app/component/button/buttons';
import { useArticleDetail } from '@/app/hooks/article.hook';
import { useState } from 'react';
import { ClipIcon, MapIcon } from '@/app/common/icons/icons';

export default function ArticleDetail({ params }: { params: { id: string } }) {

  const { data: artiDetail } = useArticleDetail(params.id);
  const [files, setFiles] = useState(false);

  return (
    <div className=' w-full h-full'>
      <WhiteBox style="flex justify-center items-center ">
        <div className="w-[80%]" >
          <Image src={'/imgs/notice.jpg'} className="w-full h-[400px]" width={500} height={500} alt={'notice'} />
          <div className="text-center text-[36px] my-3">{artiDetail?.title}{params.id} <hr /></div>

          <div className='flex py-2 w-full border-b-2'>
            <div className='w-1/2'>
              작성자 : {artiDetail?.writerId} 부서 {artiDetail?.writerId} 님
            </div>
            <div className='text-right w-1/2'>작성일자 : {artiDetail?.regDate} </div>
          </div>

          <div className='min-h-[200px] py-[20px]'>
            {artiDetail?.content}

          </div>
          <div className="icons flex text-gray-500 gap-3 cursor-point mb-5">
            <MapIcon />
            <span className="hover:toolkit flex gap-4 group">
              <ClipIcon />
              {files == false ?
              <span className='invisible group-hover:visible rounded-lg p-1 px-3 bg-pebble-400'>첨부파일이 없습니다.</span>
              :
              <span className='group-hover:visible rounded-lg p-1 px-3 bg-pebble-400'>test.txt</span>
              }
            </span>
            <div className="count ml-auto text-gray-400 text-xs font-semibold">{artiDetail?.content?.length}/300</div>
          </div>
          <div className="buttons flex gap-5 justify-center ">
            <Link href={`/articles/list/1`} className='w-[20%] '><MoveButton style='w-full h-[30px]'>목록으로 돌아가기</MoveButton></Link>
          </div>
        </div>
      </WhiteBox>
      <div className='flex py-[15px] space-x-[70%] h-[80px] truncate'>
        <Link href={`/articles/detail/${parseInt(params.id) - 1}`}><WhiteBox>이전글 가기</WhiteBox></Link>
        <Link href={`/articles/detail/${parseInt(params.id) + 1}`}><WhiteBox>다음글 가기</WhiteBox></Link>
      </div>
    </div>
  );
};