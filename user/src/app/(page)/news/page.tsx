'use client'

import NewsHeader from "../../component/navigation/newsHeader";
import NewsToday from "../../component/news/newsToday";
import NewsTopic from '@/app/component/news/newsTopic';
import { useQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { newsDummy } from '@/app/common/dummy/news.dummy';
import { fetchNews } from '@/app/service/news/news.api';
import Link from "next/link";
import Image from "next/image";
import { useNews } from "@/app/hooks/news.hook";

export default function NewsPage() {

  // const { data: news } = useNews();
  const news = newsDummy;

  return (
    <div className="h-full w-full">
      <div className="flex justify-center w-full">
        <div className="h-full w-[80%] flex-col justify-center">
          <div className='sticky top-[60px] h-[60px] z-35'><NewsHeader /></div>
          <Suspense>
            <div className="mb-5">
              {news && news.length > 0 &&
                <Link href={news[0].imgLink}>
                  <div className="flex border bg-gray-200 text-center text-black hover:text-gray-500 rounded-lg">
                    <Image unoptimized src={news[0].imgSrc} height={250} width={500} alt={news[0].title} className="rounded-l-lg" />
                    <ul className="w-[50%] ml-[15px] text-center content-center">
                      <li className="text-[20px] text-orange-500 ml-[15px] text-left mt-[10%]">경제</li>
                      <li className="text-[30px]">{news[0].title}</li>
                      <li className="text-[15px] ml-[15px] text-left mt-[10%]">{news[0].content}</li>
                    </ul>
                  </div>
                </Link>
              }
            </div>
            <div><NewsTopic /></div>
            <div><NewsToday title="최신뉴스" newslist={news} /></div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

