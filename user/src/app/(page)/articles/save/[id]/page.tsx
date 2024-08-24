'use client'

import { useRouter } from 'next/navigation';
import { saveArticle } from '@/app/service/articles/articles.api';
import { useArticleAction, useArticleStack } from '@/app/store/articles.store';
import { WhiteBox } from '@/app/component/style/whiteBox';
import { MoveButton } from '@/app/component/button/buttons';
import IConset from '@/app/common/icon/icon';
import { uploadFiles } from '@/app/service/articles/file.api';
import { useState } from 'react';


export default function ArticleSave({ params }: { params: { id: number } }) {

  const router = useRouter();
  const [files, setFiles] = useState();

  const inputArticle = useArticleAction();
  const article = useArticleStack();

  const handleArticle = (e: any) => {
    inputArticle({ ...article, [e.target.name]: e.target.value });
    console.log('article : ' + JSON.stringify(article))
  }

  const submitMail = async () => {
    inputArticle({ ...article, boardId: params.id+'', writerId:'QnA/1:1문의' });
    await saveArticle(article)
      .then((res: any | { status: number; }) => {
        // uploadFiles(files);
        router.back() 
      })
      .catch((error) => {
        console.log("saveArticle page err: ", error)
      })
  }

  const handlefiles = (e:any)=>{
    setFiles(e.target.value)
    console.log("handlefiles page : ", JSON.stringify(files))
  }

  return (
    <div className='flex justify-center content-center items-center w-full h-full'>
      <div className='py-10'>
        <WhiteBox>
          <form className="w-[100%]" >
            <div className="text-center text-[20px] my-3">1:1 문의<br /><br /> <hr /></div>
            <div className='space-y-2'>
              <input className="" placeholder="Title" type="text" name='title' onChange={handleArticle} />

              <textarea className="h-[200px] w-full border border-2" name='content' placeholder="문의내용을 입력해주세요."
                onChange={handleArticle} />
            </div>
            <div className="icons flex text-gray-500 m-2">
              <svg className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <IConset.MapIcon />
              </svg>
              <svg className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <IConset.ClipIcon />
              </svg>
              <input type="file" id="input-file" name="inputFile" accept='' className='invisable' onChange={handlefiles} />
              <div className="count ml-auto text-gray-400 text-xs font-semibold">{article.content?.length}/300</div>
            </div>
            <div className="buttons flex gap-5 justify-center h-[50px]">
              <MoveButton click={submitMail}>작성완료</MoveButton>
            </div>
          </form >
        </WhiteBox>
      </div>
    </div>
  );
};
