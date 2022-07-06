import { expect, Page } from '@playwright/test';
import totp from "totp-generator";

export class AccountSetup {
    readonly page;

    constructor(pageSetup: Page) {
        this.page = pageSetup;

    }

    async vercelLogin() {
        await this.page.goto('https://vercel.com/login'); // go to vercel
        await this.page.locator('text="GitHub"').click(); // vercel login with github
        await this.page.waitForNavigation(); // wait for navigation
    }

    async githubLogin() {

        await this.page.goto('https://github.com/') // go to vercel link
        await this.page.locator('a:has-text("Sign in")').click();
        await expect(this.page).toHaveURL('https://github.com/login');
        await this.page.locator('#login_field').type(process.env.GITHUB_LOGIN_ID);
        await this.page.locator('#password').type(process.env.GITHUB_PASSWORD);
        await this.page.locator('[data-signin-label="Sign in"]').click();
        const twoFAToken = await totp(process.env.SECRET_KEY)
        await this.page.locator('.js-verification-code-input-auto-submit').fill(twoFAToken);
        expect(this.page.url()).toContain('github.com');
    }

    async accountLogin(){
        await this.githubLogin();
        await this.vercelLogin();
    }

}