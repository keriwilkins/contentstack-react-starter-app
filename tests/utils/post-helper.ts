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

export async function githubAuthentication() {
    const axiosObj: AxiosRequestConfig = {
        url: 'https://api.github.com/orgs/ORG/repos',
        headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': 'token ',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
}

export async function deleteGitRepo(repoName: string) {
    const axiosObj: AxiosRequestConfig = {
        url: `https://api.github.com/repos/${process.env.GIT_OWNER_NAME}/${repoName}`,
        method: 'DELETE',
        headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': `token ${process.env.GITHUB_TOKEN}`
        }
    }
    await axios(axiosObj);
}

export async function deleteVercelProject(projectName: string) {

    const axiosObj: AxiosRequestConfig = {
        url: `https://api.vercel.com/v9/projects/${projectName}`,
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`
        }
    }
    await axios(axiosObj);
}
