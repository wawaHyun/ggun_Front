import AfterHome from "./afterMain/page";
import BeforeHome from "./beforeMain/page";
import { cookies } from "next/headers";

export default function Home() {

    const isLoggedIn = Boolean(cookies().get('accessToken')?.value);
    console.log("isLoggedIn : ",isLoggedIn)

    return(<>
        {isLoggedIn == true ?
            <div><AfterHome /> </div>
            :   <div><BeforeHome /> </div> }
    </>)
}
