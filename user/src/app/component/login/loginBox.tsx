"use client"

import { useRef, useState } from "react";
import { MoveButton } from "../button/buttons";
import OAuth from "./oAuth";
import { useRouter } from "next/navigation";
import { useLoginAction, useLoginStack } from "@/app/store/login.store";
import { loginUser } from "@/app/service/users/users.api";
import { existUserP, loginUserP } from "@/app/api/user/user.route";
import Swal from "sweetalert2";

export default function IdLoginBox() {

    const router = useRouter();

    const userSubmit = useLoginAction();
    const userInfo: IUser = useLoginStack();

    const [isWrongId, setIsWrongId] = useState('');
    const [isWrongPw, setIsWrongPw] = useState('');
    const [msg, setMsg] = useState('');

    const ref = useRef<HTMLInputElement>(null)

    const handleUsername = (e: any) => {
        const ID_CHECK = /^[a-zA-Z][a-zA-Z0-9]{5,11}$/g;
        ID_CHECK.test(userInfo.username + "") ? setIsWrongId('false') : setIsWrongId('true');
        userSubmit({ ...userInfo, username: e.target.value });
        // console.log('username : ' + JSON.stringify(userInfo))
    }


    const handlePassword = (e: any) => {
        const PW_CHECK = /^[a-zA-Z][a-zA-Z0-9]{5,11}$/g;
        PW_CHECK.test(userInfo.password + "") ? setIsWrongPw('false') : setIsWrongPw('true');
        userSubmit({ ...userInfo, password: e.target.value });
        // console.log('password : ' + JSON.stringify(userInfo))
    }

    const forgetPw = () => {
        Swal.fire({
            icon: 'info',
            title: '문의',
            text: '권한 담당자에게 연락 부탁드립니다.\n 담당자 : 인사팀 김현주\nTel : 2046',
        })
    }

    const loginApi = async () => await loginUserP(userInfo)
    const existApi = async () => await existUserP(userInfo.username + '')

    const handleSubmit = () => {
        existApi()
            .then((res: boolean | { status: number; }) => {
                if (typeof res === 'boolean' && res === false) {
                    setMsg("로그인 실패")
                    Swal.fire({
                        icon: "warning",
                        title: "로그인 실패",
                        text: "없는 아이디입니다.\n다시 한번 시도해주세요.",
                        showCancelButton: true,
                        confirmButtonColor: '',
                        cancelButtonColor: 'red',

                        confirmButtonText: '로그인',
                        cancelButtonText: '회원가입'
                    })
                        .then((result) => {
                            if (result.isConfirmed != true) {
                                router.push('/join')
                            }
                        })
                } else if (typeof res === 'boolean' && res === true) {
                    console.log("login in")
                    loginApi()
                        .then((res: boolean | { status: number; }) => {
                            res === true ? router.push(`/`) : setMsg("비밀번호가 맞지 않습니다")
                        })

                    if (ref.current) {
                        ref.current.value = "";
                        userSubmit({ ...userInfo, password: '' });
                    }
                } else {
                    setMsg("로그인 오류")
                }

            })
    }

    return (

        <div className="w-full h-full">
            <div className="">
                <div className="pb-3">
                    <div className="bold text-lg text-center">ID 로그인</div>
                    <div className="text-slate-500 text-center">주문/뱅킹/서비스 신청 등 모든 거래가 가능합니다.</div>
                </div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    ID :
                </label>
                <input type="text" name="username" onChange={handleUsername} required />

                {userInfo.username != undefined && userInfo.username.length > 0 ?
                    userInfo.username?.length === 0 || userInfo.username === undefined ? <pre></pre> :
                        (isWrongId === 'true' ?
                            (<pre><h6 className='text-red-500 text-sm'>* Wrong username form.</h6></pre>) :
                            (<pre><h6 className='text-green-500 text-sm'>* good username form.</h6></pre>)
                        )
                    : <pre><h6 className='text-red-500 text-sm'>{msg}</h6></pre>}

            </div>
            <div className="mt-4 flex flex-col justify-between">
                <div className="flex justify-between">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Password :
                    </label>
                </div>
                <input type="password" name="password" onChange={handlePassword} ref={ref} />

                {userInfo.password != undefined && userInfo.password.length > 0 ?
                    userInfo.password?.length === 0 || userInfo.password === undefined ? <pre></pre> :
                        (isWrongPw === 'true' ?
                            userInfo.password.length > 15 ?
                                (<pre><h6 className='text-orange-500 text-sm'>* password가 15자를 넘었습니다..</h6></pre>) :
                                (<pre><h6 className='text-red-500 text-sm'>* Wrong password form.<br />영어 소문자, 대문자, #?!@$ %^&*- 포함<br />6자이상 </h6></pre>) :
                            (<pre><h6 className='text-green-500 text-sm'>* good password form.</h6></pre>)
                        )
                    : <pre></pre>}
            </div>

            <MoveButton style="w-full mt-[45px]" click={() => handleSubmit()} >Login</MoveButton>

            <div className="grid grid-cols-3 text-center py-3">
                자동로그아웃시간
                <select name="timeSelect" defaultValue='30' >
                    <option value='30'>30분</option>
                    <option value='60'>1시간</option>
                    <option value='240'>3시간</option>
                </select>
                <MoveButton>인증센터 바로가기</MoveButton>
            </div>

            <button
                className="text-xs text-gray-500 hover:text-gray-900 text-end w-full mt-2" onClick={() => forgetPw()}>
                Forget Password?
            </button>
            <div className="w-full items-center content-center justify-center">
                <span className="text-red-500">*</span><span className="text-slate-500">소셜로그인시 기능이 제한될수 있습니다.</span>
                <OAuth />
            </div>
        </div >
    )
};
