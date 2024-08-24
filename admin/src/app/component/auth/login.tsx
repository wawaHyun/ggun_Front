"use client"

import { MoveButton } from "@/app/common/button/MoveButton"
import { loginAdmin } from "@/app/service/admin/auth.api";
import { useLoginAction, useLoginStack } from "@/app/store/login.store";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Swal from "sweetalert2";

export default function LoginBox () {


    const router = useRouter();

    const userSubmit = useLoginAction();
    const userInfo: IAdmin = useLoginStack();

    const [isWrongId, setIsWrongId] = useState('');
    const [isWrongPw, setIsWrongPw] = useState('');
    const [msg, setMsg] = useState('');

    const ref = useRef<HTMLInputElement>(null)

    const handleAdminname = (e: any) => {
        const ID_CHECK = /^[a-zA-Z][a-zA-Z0-9]{5,11}$/g;
        ID_CHECK.test(userInfo.username + "") ? setIsWrongId('false') : setIsWrongId('true');
        userSubmit({ ...userInfo, username: e.target.value });
    }

    const handlePassword = (e: any) => {
        const PW_CHECK = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{6,15}$/g;
        PW_CHECK.test(userInfo.password + "") ? setIsWrongPw('false') : setIsWrongPw('true');
        userSubmit({ ...userInfo, password: e.target.value });
    }

    const forgetPw = () => {
        console.log("forgetPw")
        Swal.fire({
            icon: "error",
            title: "error",
            html: '권한 담당자에게 연락 부탁드립니다.<br/><br/>'+
            `담당자 : 인사팀 김현주 Tel : 2046 <br/><br/>`+
            'ggunuser0001 pO2(eO73)%@'
          });
    }

    const loginApi = async () => await loginAdmin(userInfo)

    const handleSubmit = () => {
        console.log('login page 입력받은 내용 ' + JSON.stringify(userInfo))
        loginApi()
            .then((res: boolean | { status: number; }) => {
                res === true ? router.push(`/`) : setMsg("로그인실패")
            })
            .catch((error) => {
                console.log("login page err: ", error)
            })

        if (ref.current) {
            ref.current.value = "";
            userSubmit({ ...userInfo, password: '' });
        }
    }


    return (

        <div className="w-full h-full">
            <div className="mt-4">
                <div>
                </div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    ID : 
                </label>
                <input type="text" name="username" onChange={handleAdminname} required />
                
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
            <div className="h-[30px] mt-5">
                <MoveButton click={() => handleSubmit()}>Login</MoveButton>
            </div>

            <button
                className="text-xs text-gray-500 hover:text-gray-900 text-end w-full mt-2" onClick={() => forgetPw()}>
                Forget Password?
            </button>
        </div >

    )
};
