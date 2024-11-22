interface IUser {
    id?: number,
    username?: string,
    password?: string,
    name?: string,
    email?: string,
    ssnF?: string,
    ssnS?: string,
    address?: string,
    phone?: string,
    color?: string,
    investmentPropensity?: string
    token?: string,
}

interface IAuthToken {
    id?: number,
    accessToken?: string,
    refreshToken?: string,
}