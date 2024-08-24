'use client'

import { WhiteBox } from "@/app/component/style/whiteBox";
import { useEffect, useState } from "react";
import Image from "next/image";
import { TabButton } from "@/app/component/button/tabButton";
import { BankList } from "@/app/common/dummy/account.dummy";
import { BrownButton } from "@/app/component/button/buttons";
import { useAccountTransferAction, useAccountTransferStack } from "@/app/store/accountTransfer.store";
import { useAccList } from "@/app/hooks/account.hook";
import Swal from "sweetalert2";
import { depositApi, fetchVerifyIamport, withdrawAPi } from "@/app/service/asset/account.api";

export default function AccountTCharge() {

    const [isOpen, setIsOpen] = useState(false);
    const [howTransfer, setHowTransfer] = useState(false);

    const [bank, setBank] = useState<string>('');
    const [yourAcno, setYourAcno] = useState<number>(0);

    const { data: accList } = useAccList();

    const totalAsset = (accList ?? []).reduce((total, v: IAccount) => {
        return total + (v.balance || 0);
    }, 0);

    const actionAccountTransfer = useAccountTransferAction();
    const stackAccountTransfer = useAccountTransferStack();

    const handleForm = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        actionAccountTransfer.update({ ...stackAccountTransfer, [e.target.name]: e.target.value });
        console.log('stackAccountTransfer : ' + JSON.stringify(stackAccountTransfer))
    }

    const handleYourAcno = (e: React.ChangeEvent<HTMLInputElement>) => {
        setYourAcno(parseInt(e.target.value))
    }

    const isExtistInput = () => {
        if (stackAccountTransfer.tradeType == '출금' && !stackAccountTransfer.acpw) {
            Swal.fire(
                '계좌 비밀번호가\n입력되지 않았습니다. '
            )
        } else {
            if (stackAccountTransfer.balance != undefined) {
                if (stackAccountTransfer.acno && stackAccountTransfer.balance > 0 && stackAccountTransfer.tradeType) {
                    setIsOpen(!isOpen)
                } else {
                    Swal.fire(
                        '내용을 빠짐없이 입력해주세요.'
                    )
                }
            } else {
                Swal.fire(
                    '금액이 입력되지 않았습니다.',
                    '내용을 빠짐없이 입력해주세요.'
                )
            }
        }
    }


    const deposit = async () => await depositApi(stackAccountTransfer); //입금
    const withdraw = async () => await withdrawAPi(stackAccountTransfer); //출금

    const hendleWithdraw = () => {
        withdraw()
            .then((res: IAccount | { status: number; }) => {
                setIsOpen(false)
                setBank('')
                setYourAcno(0)
                actionAccountTransfer.clean;
                Swal.fire({
                    icon: "success",
                    title: "출금 성공",
                    text: "성공적으로 출금되었습니다. ",
                })
                window.location.reload()
            })
            .catch((error) => {
                console.log("withdraw page err: ", error)
            })
    }


    const hendleDeposit = () => {
        deposit()
            .then((res: IAccount | { status: number; }) => {
                setIsOpen(false)
                setBank('')
                setYourAcno(0)
                actionAccountTransfer.clean;
                Swal.fire({
                    icon: "success",
                    title: "입금 성공",
                    text: "성공적으로 입금되었습니다. ",
                })
                window.location.reload()
            })
            .catch((error) => {
                console.log("withdraw page err: ", error)
            })
    }
    const handleTabButton = (e: React.ChangeEvent<HTMLInputElement>) => {
        actionAccountTransfer.update({ ...stackAccountTransfer, tradeType: e.target.value })
        setIsOpen(false)
        setBank('')
        setYourAcno(0)
        actionAccountTransfer.clean;
    }


    const fetchVerifyIamportApi = async (impUid: any) => await fetchVerifyIamport(impUid);

    const onSubmitCard = () => {
        console.log("onSubmitCard : 1 ")
        if (!window.IMP) return;
        console.log("onSubmitCard : 2 ")
        const { IMP } = window;
        IMP.init('imp78657013'); // Iamport 가맹점 식별코드

        console.log("onSubmitCard : 3 ")
        // const cardData =
        //     {
        //         pg: 'html5_inicis',
        //         pay_method: 'card',
        //         merchant_uid: new Date().getTime().toString(), //  주문 번호
        //         name: '테스트 상품',
        //         amount: stackAccountTransfer.balance, // Use the state variable for amount
        //         buyer_email: 'test@naver.com',
        //         buyer_name: 1,
        //         buyer_tel: 1
        //     };
        const cardData = {
            pg: "html5_inicis", // PG사 : https://developers.portone.io/docs/ko/tip/pg-2 참고
            pay_method: "card", // 결제수단
            merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
            amount: 1000, // 결제금액
            name: "아임포트 결제 데이터 분석", // 주문명
            buyer_name: "홍길동", // 구매자 이름
            buyer_tel: "01012341234", // 구매자 전화번호
            buyer_email: "example@example.com", // 구매자 이메일
            buyer_addr: "신사동 661-16", // 구매자 주소
            buyer_postcode: "06018", // 구매자 우편번호
        }
        IMP.request_pay(cardData, callback)
    }
    function callback(response: any) {
        const { success, error_msg } = response;
        if (success) {
            alert("결제 성공");
        } else {
            alert(`결제 실패: ${error_msg}`);
        }
    }
    // async (rsp: any) => {
    //     try {
    //         if (rsp.success) {
    //             console.log("onSubmitCard : ",rsp.imp_uid);

    //             // const token = parseCookies().accessToken;

    //             // const { data } = await axios.post(
    //             //     `http://localhost:8080/api/accounts/verifyIamport/${rsp.imp_uid}`,
    //             //     // {},
    //             //     {
    //             //         headers: {
    //             //             Authorization: `Bearer ${token}`
    //             //         }
    //             //     }
    //             // );
    //             fetchVerifyIamportApi(rsp.imp_uid);
    //             console.log(rsp.imp_uid);
    //             if (rsp.paid_amount === stackAccountTransfer.balance) {
    //                 // console.log(data.response);
    //                 const paymentData = {    // 내 db 저장 값 
    //                     balance: stackAccountTransfer.balance,
    //                     // id: params.id,
    //                     id: '11',
    //                     paymentUid: rsp.imp_uid,
    //                     tradeType: "입금",

    //                 };
    //                 // dispatch(deposit(paymentData))
    //                 //     .then((res: any) => {
    //                 //         console.log('res.message ' + JSON.stringify(res.payload.message))
    //                 //         router.refresh()
    //                 //     })
    //                 console.log('data.response.amount:', stackAccountTransfer.balance);
    //                 alert('결제 성공');
    //             } else {
    //                 alert('결제 실패');
    //             }
    //         } else {
    //             alert('결제 실패');
    //         }
    //             } catch (error) {
    //                 console.error('Error while verifying payment:', error);
    //                 alert('결제 실패');
    //             }
    //         }
    //     );
    // }



    return (
        <div className="w-full h-full flex justify-center">
            <div className="w-[80%]">
                <WhiteBox style="text-center">
                    <div className="flex justify-center">
                        <Image src={"/imgs/accountTransfer.jpg"} width={500} height={300} alt={"account"}></Image>
                    </div>

                    <div className="h-[50px] grid grid-cols-2">
                        <TabButton name="tradeType" click={handleTabButton} value="입금" select={stackAccountTransfer.tradeType === '입금'} >입금</TabButton>
                        <TabButton name="tradeType" click={handleTabButton} value="출금" select={stackAccountTransfer.tradeType === '출금'} >출금</TabButton>
                    </div>

                    {stackAccountTransfer.tradeType == '입금' ?
                        // <div className="border border-t-transparent rounded-b-lg p-3">
                        //     <div className="flex content-center justify-center gap-3 p-6 ">
                        //         <WhiteBox style="text-center">
                        //             <label className="flex items-center gap-2" id="how">
                        //                 <input type="radio" name="how" className="w-5" defaultChecked onClick={() => setHowTransfer(true)} />입금</label>
                        //         </WhiteBox>
                        //         <WhiteBox style="text-center">
                        //             <label className="flex items-center gap-2" id="how">
                        //                 <input type="radio" name="how" className="w-5"  onClick={() => setHowTransfer(false)} />카드입금</label>
                        //         </WhiteBox>
                        //     </div>
                        //     <div>
                        //         {howTransfer == true ?
                        <div>
                            <div className="border-y-2 border-amber-400 grid grid-cols-2 text-center items-center py-3">
                                <div className="bg-slate-100 border-b-2 border-white ">입금계좌</div>
                                <div>
                                    <select name="acno" id="" className="w-full" onChange={handleForm}>
                                        {accList && accList.map((v: IAccount, i: number) =>
                                            <option value={v.id} key={i}>{v.acno}</option>)}
                                    </select>
                                </div>
                                <div className="bg-slate-100 border-b-2 border-white">입금금액</div>
                                <div className=""><input type="number" name="balance" onChange={handleForm} className="w-1/2" />원</div>
                                <div className="bg-slate-100 border-b-2 border-white">입금계좌표시내용</div>
                                <div className=""><input type="text" name="briefs" onChange={handleForm} className="w-1/2" /></div>
                                <div className="row-span-2 h-[50px]"></div>
                                <div className="row-span-2 h-[50px]"></div>
                                <div className="row-span-3 bg-slate-100 border-b-2 border-white h-full content-center ">출금은행</div>
                                <div className="row-span-3 grid grid-cols-5">
                                    {BankList.map((v: any, i: number) =>
                                        <button key={i} name="bank" onClick={() => setBank(v.bank)} className="p-2 grid grid-cols-2 content-center justify-center items-center text-center ">
                                            <div className=" content-center">
                                                <Image src={v.imgSrc} alt={"bank"} width={50} height={50} className="rounded-full border-dashed border-2" />
                                            </div>
                                            <div className="text-xs truncate">{v.bank}</div>
                                        </button>
                                    )}
                                </div>
                                <div className="bg-slate-100 border-b-2 border-white ">출금계좌번호</div>
                                <div className=""><input type="number" name="yourAcno" onChange={handleYourAcno} className="w-1/2" /></div>
                            </div>
                            <div className="w-full h-[50px] content-center"><BrownButton style="w-1/2" click={isExtistInput}>입금진행</BrownButton></div>

                            {isOpen ?
                                <div>
                                    <div className="border-y-2 border-amber-400 grid grid-cols-2 text-center items-center py-3">
                                        <div className="bg-slate-100 border-b-2 border-white">입금계좌</div>
                                        <div>{stackAccountTransfer.acno}</div>
                                        <div className="bg-slate-100 border-b-2 border-white">입금금액</div>
                                        <div>{stackAccountTransfer.balance?.toLocaleString()}</div>
                                        <div className="bg-slate-100 border-b-2 border-white">입금계좌표시내용</div>
                                        <div>{stackAccountTransfer.briefs}</div>
                                        <div className="bg-slate-100 border-b-2 border-white">출금은행</div>
                                        <div>{bank}</div>
                                        <div className="bg-slate-100 border-b-2 border-white">출금계좌번호</div>
                                        <div>{yourAcno}</div>
                                    </div>
                                    <div className="w-full h-[50px] content-center"><BrownButton style="w-1/2" click={hendleDeposit}>입금하기</BrownButton></div>
                                </div>
                                : <div></div>}
                        </div>
                        //     :
                        //     <div>
                        //         <div className="border-y-2 border-amber-400 grid grid-cols-2 text-center items-center py-3">
                        //         <div className="bg-slate-100 border-b-2 border-white col-span-2">카드 입금 결제</div>
                        //         <div className="bg-slate-100 border-b-2 border-white">입금금액</div>
                        //         <div className=""><input type="number" name="balance" onChange={handleForm} className="w-1/2" />원</div>
                        //         <button onClick={()=>onSubmitCard()}>ddd</button>
                        //         </div>
                        //         </div>
                        // }
                        // </div>
                        // </div>
                        :
                        <div className="border border-t-transparent rounded-b-lg p-3">
                            <div className="border-y-2 border-amber-400 grid grid-cols-2 text-center items-center py-3">
                                <div className="bg-slate-100 border-b-2 border-white ">출금계좌</div>
                                <div>
                                    <select name="acno" id="" className="w-full" onChange={handleForm}>
                                        {accList && accList.map((v: IAccount, i: number) =>
                                            <option value={v.id} key={i}>{v.acno}</option>)}
                                    </select>
                                </div>
                                <div className="bg-slate-100 border-b-2 border-white ">출금가능액</div>
                                <div className="text-slate-600">{totalAsset.toLocaleString()}</div>
                                <div className="bg-slate-100 border-b-2 border-white">출금금액</div>
                                <div className=""><input type="number" name="balance" onChange={handleForm} className="w-1/2" />원</div>
                                <div className="bg-slate-100 border-b-2 border-white">출금계좌 비밀번호</div>
                                <div className=""><input type="password" name="acpw" onChange={handleForm} className="w-1/2" /></div>
                                <div className="row-span-2 h-[50px]"></div>
                                <div className="row-span-2 h-[50px]"></div>
                                <div className="row-span-3 bg-slate-100 border-b-2 border-white h-full content-center ">입금은행</div>
                                <div className="row-span-3 grid grid-cols-5">
                                    {BankList.map((v: any, i: number) =>
                                        <button key={i} name="bank" onClick={() => setBank(v.bank)} className="p-2 grid grid-cols-2 content-center justify-center items-center text-center">
                                            <div className=" content-center">
                                                <Image src={v.imgSrc} alt={"bank"} width={50} height={50} className="rounded-full border-dashed border-2" />
                                            </div>
                                            <div className="text-xs truncate">{v.bank}</div>
                                        </button>
                                    )}
                                </div>
                                <div className="bg-slate-100 border-b-2 border-white ">입금계좌번호</div>
                                <div className=""><input type="number" name="yourAcno" onChange={handleYourAcno} className="w-1/2" /></div>
                                <div className="bg-slate-100 border-b-2 border-white">출금계좌표시내용</div>
                                <div className=""><input type="text" name="briefs" onChange={handleForm} className="w-1/2" /></div>
                            </div>
                            <div className="w-full h-[50px] content-center"><BrownButton style="w-1/2" click={isExtistInput}>출금진행</BrownButton></div>

                            {isOpen ?
                                <div>
                                    <div className="border-y-2 border-amber-400 grid grid-cols-2 text-center items-center py-3">
                                        <div className="bg-slate-100 border-b-2 border-white">출금계좌</div>
                                        <div>{stackAccountTransfer.acno}</div>
                                        <div className="bg-slate-100 border-b-2 border-white">출금금액</div>
                                        <div>{stackAccountTransfer.balance?.toLocaleString()}</div>
                                        <div className="bg-slate-100 border-b-2 border-white">입금은행</div>
                                        <div>{bank}</div>
                                        <div className="bg-slate-100 border-b-2 border-white">입금계좌번호</div>
                                        <div>{yourAcno}</div>
                                        <div className="bg-slate-100 border-b-2 border-white">출금계좌표시내용</div>
                                        <div>{stackAccountTransfer.briefs}</div>
                                    </div>
                                    <div className="w-full h-[50px] content-center"><BrownButton style="w-1/2" click={hendleWithdraw}>출금하기</BrownButton></div>
                                </div>
                                : <div></div>
                            }
                        </div>
                    }
                </WhiteBox>
            </div >
        </div >
    )
};
