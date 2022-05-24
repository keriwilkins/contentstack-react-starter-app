import { chromium, FullConfig } from '@playwright/test';
import { AppLogin } from './tests/pages/stack-login';

const globalSetup = async () => {
    const stackEmail = process.env.CONTENTSTACK_LOGIN;
    const stackPassword = process.env.CONTENTSTACK_PASSWORD;

    const browser = await chromium.launch();
    const stagLogin = await browser.newPage({
        httpCredentials: {
            username: process.env.BASIC_AUTH_USERNAME || '',
            password: process.env.BASIC_AUTH_PASSWORD || '',
        },
    });
    const loginSetup = new AppLogin(stagLogin);
    await loginSetup.getLoginPage();
    await loginSetup.contentstackLogin(stackEmail, stackPassword);
}

export default globalSetup