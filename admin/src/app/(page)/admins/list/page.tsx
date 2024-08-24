'use client'

import React, { Suspense } from "react";
import { Search } from "@/app/component/util/search";
import { useRouter } from "next/navigation";
import { allAdmins } from "@/app/service/admin/admin.api";
import { useQuery } from "@tanstack/react-query";
import { useAdminAllList } from "@/app/hooks/admin.hook";
import { adminDummy } from "@/app/common/dummy/admin.dummy";

function AdminList() {

    const router = useRouter();

    const {data:adminAllList} = useAdminAllList();
    // const adminAllList = adminDummy;
    
    return (
        <div className="w-full h-full flex justify-center ">
            <div className='w-[80%]'>
                <div className="bg-pebble-200 text-[32px] rounded-b-lg text-center pb-1">
                    임직원 정보 조회 </div>
                <div className="">
                    <div className="py-2 flex gap-3">
                        <div className=''>
                            <Search click="" />
                        </div>

                        <div className='w-[125px]'>
                            {/* <MoveButton text="임직원 추가" click={() => btn == 0 ? setBtn(1) : setBtn(0)} /> */}
                        </div>
                    </div>

                    <Suspense>
                        <div className="w-full h-full">
                            <table className="sticky z-[0] p-4">
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>아이디</th>
                                        <th>이름</th>
                                        <th>사원번호</th>
                                        <th>부서</th>
                                        <th>직책</th>
                                        {/* <th>직무</th> */}
                                        <th>이메일</th>
                                        <th>핸드폰</th>
                                        <th>권한</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminAllList&&adminAllList.map((v: IAdmin, i: number) =>
                                        <tr key={v.id} className="cursor-pointer" onClick={()=>router.push(`/admins/detail/${v.id}`)}>
                                            <td>{v.id}</td>
                                            <td>{v.username}</td>
                                            <td>{v.name}</td>
                                            <td>{v.number}</td>
                                            <td>{v.department}</td>
                                            <td>{v.position}</td>
                                            {/* <td>{v.job}</td> */}
                                            <td>{v.email}</td>
                                            <td>{v.phone}</td>
                                            <td>{v.role}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Suspense>
                </div>
            </div>
        </div>
    )
};
export default AdminList;

