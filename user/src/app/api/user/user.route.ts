'use server'

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import client from "../../../../_lib/prisma/db";


export async function existUserP(username: string): Promise<boolean | { status: number }> {
    try {
        var result:boolean = false;
        await client.users.findUnique({
            where: { username: username },
        })
            .then((res: any) => {
                result = (res.username == username) ? true : false
            })
            .catch((err: any) => {
                if (err == PrismaClientKnownRequestError) return result = false;
            })
        // console.log("ExistAdminAPI " + username + " result : " + result);
        return result;
    } catch (error) {
        console.log("existUserP err : " + error);
        return { status: 500 };
    }
}

export async function authUserP(user: IUser): Promise<boolean | { status: number }> {
    try {
        const response = await client.users.create({
            data: {
                username: user.username + '',
                password: user.password + '',
                name: user.name,
                // email: user.email,
                // ssnF: user.ssnF,
                // ssnS: user.ssnS,
                // address: user.address,
            },
        });
        // console.log("authUserP response: " + response)

        return true
    } catch (error) {
        console.log("authUserP err : " + error);
        return { status: 500 };
    }
}

export async function loginUserP(user: IUser): Promise<boolean | { status: number }> {
    // console.log("loginUserP : " + user.username + " pw: " + user.password);
    try {
        var result: boolean = false;
        await client.users.findFirst({
            where: {
                username: user.username + '',
                password: user.password + '',
            },
        })
            .then((res: any) => {
                console.log("loginUserP err : " + res.json())
                if (res = true) {
                    console.log("loginUserP data : " + res.json())
                    client.users.update({
                        where: {
                            id: res.id,
                        },
                        data: {
                            token: "login user token"
                        }
                    })
                    result = true;
                }
                if (res = false) {
                    result = false;
                }
            })
            .catch((err: any) => {
                result = false
            })
        return result;
    } catch (error) {
        console.log("loginUserP err : " + error)
        return { status: 500 };
    }
}