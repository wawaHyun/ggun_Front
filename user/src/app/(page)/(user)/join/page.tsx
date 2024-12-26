'use client'

import React, { useState } from "react";
import { MoveButton } from '@/app/component/button/buttons';
import { WhiteBox } from '@/app/component/style/whiteBox';
import { useJoinAction, useJoinStack } from '@/app/store/join.store';
import { characterInfo } from '@/app/common/enums/character';
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { joinUser } from "@/app/service/users/users.api";
import { authUserP, existUserP } from "@/app/api/user/user.route";

function UserJoin() {

    const actionJoin = useJoinAction();
    const userInfo = useJoinStack();
    const router = useRouter();
    const [btn, setBtn] = useState(0);

    const joinApi = async () => await authUserP(userInfo)
    const existApi = async () => await existUserP(userInfo.username+'')

    const handleForm = (e: any) => {
        actionJoin.update({ ...userInfo, [e.target.name]: e.target.value });
        // console.log('userInfo : ' + JSON.stringify(userInfo))
    }

    const handleSubmit = async (e: any) => {
        if (userInfo.username && userInfo.password) {
            existApi()
                .then((res: boolean | { status: number; }) => {
                    if (typeof res === 'boolean' && res === true) {
                        // console.log("existApi page true: "+ res);
                        Swal.fire({
                            icon: "warning",
                            title: "회원가입 실패",
                            text: "이미 있는 아이디입니다.\n다시 한번 시도해주세요.",
                        })
                    }

                    if (typeof res !== 'boolean' || res === false) {
                        // console.log("existApi page false: "+res)
                        joinApi()
                            .then((res: boolean | { status: number; }) => {
                                if (res = true) {
                                    actionJoin.clean()
                                    Swal.fire({
                                        icon: "success",
                                        title: "회원가입 완료",
                                        text: "회원가입되었습니다.\n로그인 해주십시오.",
                                    })
                                    console.log("page : " + res)
                                    router.push(`/login`)
                                }
                                if (res = false) {
                                    Swal.fire({
                                        icon: "warning",
                                        title: "회원가입 실패",
                                        text: "다시 한번 시도해주세요.",
                                    })
                                }
                            })
                            .catch((error) => {
                                console.log("auth page err: ", error)
                            })
                    }
                })
        } else {
            Swal.fire({
                icon: "warning",
                title: "필수정보 누락",
                text: "정보를 입력해주세요.",
            })
        }
    }

    return (
        <div className='flex w-full justify-center h-full'>
            <div className='w-[60%]'>
                <WhiteBox>
                    <div className='grid grid-cols-4'>
                        <div>회원가입</div>
                        <div className=' w-[90%] px-3 gap-3 col-span-3 space-y-3'>
                            <div className='grid-cols-2 flex'><p className="text-center w-1/3">ID :</p> <input type="text" placeholder='ID' className='w-2/3' name="username" onChange={handleForm} /></div>
                            <div className='grid-cols-2 flex'><p className="text-center w-1/3">password :</p><input type="password" placeholder='password' className='w-2/3' name="password" onChange={handleForm} /></div>
                            <div className='grid-cols-2 flex'><p className="text-center w-1/3">이름 :</p><input type="text" placeholder='이름' className='w-2/3' name="name" onChange={handleForm} /></div>
                            <div className='grid-cols-2 flex'><p className="text-center w-1/3">이메일 :</p>
                                <input type="text" placeholder='ggun@gmail.com' className='w-2/3' name="email" onChange={handleForm} />
                            </div>
                            <div className='grid-cols-2 flex'><p className="text-center w-1/3">성별 :</p>
                                <div className="flex justify-center gap-4 w-full">
                                    <label className="flex content-center" id="input2"><input type="radio" name="ssnF" className="w-5" value='true' onClick={handleForm} defaultChecked />여자</label>
                                    <label className="flex content-center" id="input1"><input type="radio" name="ssnF" className="w-5" value='false' onClick={handleForm} />남자</label>
                                </div>
                            </div>
                            <div className='grid-cols-2 flex'><p className="text-center w-1/3">주소 :</p><input type="text" placeholder='주소' className='w-2/3' name="address" onChange={handleForm} /></div>
                            <div className='grid-cols-2 flex'><p className="text-center w-1/3">핸드폰 :</p><input type="text" placeholder='010-0000-0000' className='w-2/3' onChange={handleForm} /></div>
                            <div className='grid-cols-2 flex'><p className="text-center w-1/3">투자성향 :</p><input type="text" placeholder='투자성향' className='w-2/3' onChange={handleForm} /></div>
                            {/* <div className='flex gap-3'><p className="text-center w-1/3">투자성향 :</p><input type="text" placeholder='투자성향' className='w-2/3' onChange={handleForm} value={characterInfo[btn].title} hidden /></div> */}
                            <div className='flex gap-3 justify-center'>
                                <div className={`bg-red-400 h-[50px] w-[50px] rounded-full ${btn == 0 ? 'border-red-600 border-dashed border-4 animate-spin-slow' : ''}`} text-white onClick={() => setBtn(0)} ></div>
                                <div className={`bg-amber-400 h-[50px] w-[50px] rounded-full ${btn == 1 ? 'border-amber-600 border-dashed border-4 animate-spin-slow' : ''}`} onClick={() => setBtn(1)}></div>
                                <div className={`bg-purple-400 h-[50px] w-[50px] rounded-full text-white ${btn == 2 ? 'border-purple-600 border-dashed border-4 animate-spin-slow' : ''}`} onClick={() => setBtn(2)}></div>
                                <div className={`bg-blue-400 h-[50px] w-[50px] rounded-full text-white ${btn == 3 ? 'border-blue-600 border-dashed border-4 animate-spin-slow' : ''}`} onClick={() => setBtn(3)}></div>
                                <div className={`bg-green-400 h-[50px] w-[50px] rounded-full text-white ${btn == 4 ? 'border-green-600 border-dashed border-4 animate-spin-slow' : ''}`} onClick={() => setBtn(4)}></div>
                            </div>
                            <div className='border w-full h-[200px] text-center bg-pebble-400 rounded-lg content-center'><span className={`text-lg text-bold text-[${characterInfo[btn].color}]`}>{characterInfo[btn].title}</span> <br /><br /> <p className="p-3">{characterInfo[btn].info}</p> </div>
                            <div className='w-full  p-5 content-center'>
                                <div className='h-[30px] mb-3 w-full '><MoveButton style="w-full" click={handleSubmit}> 회원가입</MoveButton></div>
                            </div>
                        </div>

                    </div>
                </WhiteBox>

            </div>

        </div>
    )
};
export default UserJoin;

function typeOf(res: boolean) {
    throw new Error("Function not implemented.");
}

