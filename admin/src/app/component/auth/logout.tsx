
import { logoutApi } from "@/app/service/admin/auth.api";
import { useRouter } from "next/navigation"
import Swal from "sweetalert2";

export default function LogoutBox() {

    const router = useRouter()

    const logout = async () => await logoutApi()

    const handleLogout = () => {
        Swal.fire({
            title: 'Logout',
            text: "로그아웃 하시겠습니까?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '로그아웃',
            cancelButtonText: '취소',
            reverseButtons: true,

        }).then((result) => {
            if (result.isConfirmed) {
                logout()
                .then((res: boolean | { status: number; }) => {
                })
                .catch((error) => {
                    console.log("logout page err: ", error)
                })
                Swal.fire(
                    '로그아웃되었습니다.',
                    ''
                )
                // router.push('/beforeHome')
            }
        })
    }


    return (

        <div className="">
            <button onClick={() => handleLogout()}>Logout</button>
        </div>
    )
};