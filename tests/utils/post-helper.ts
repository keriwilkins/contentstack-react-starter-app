import axios, { AxiosRequestConfig } from 'axios';
export async function getAuthenticated() {
    const axiosObj: AxiosRequestConfig = {
        url: `https://${process.env.BASE_API_URL}/v3/user-session`,
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        data: {
            user: {
                email: process.env.CONTENTSTACK_LOGIN,
                password: process.env.CONTENTSTACK_PASSWORD,
            },
        },
    }
    return (await axios(axiosObj)).data.user.authtoken

}

export async function deleteStack(apiKey: string, authToken: string) {
    const axiosObj: AxiosRequestConfig = {
        url: `https://${process.env.BASE_API_URL}/v3/stacks`,
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'api_key': apiKey,
            'authtoken': authToken
        }
    }
    await axios(axiosObj);
}