import { expect, Page } from "@playwright/test";
import totp from "totp-generator";

export class GithubLogin {
    readonly page;
    twoFAtoken: string;
    constructor(page: Page) {
        this.page = page
        // this.twoFAtoken = totp(process.env.SECRET_KEY)
    }

    async getGithubPage() {
        await this.page.goto('https://github.com/') // go to vercel link
    }

    // github login
    async githubLogin() {
        await this.page.locator('a:has-text("Sign in")').click();
        await expect(this.page).toHaveURL('https://github.com/login');
        await this.page.locator('#login_field').type(process.env.GITHUB_LOGIN_ID);
        await this.page.locator('#password').type(process.env.GITHUB_PASSWORD);
        await this.page.locator('[data-signin-label="Sign in"]').click();
        await this.page.waitForTimeout(1000);
        const twoFAToken = await totp(process.env.SECRET_KEY)
        await this.page.locator('.js-verification-code-input-auto-submit').fill(twoFAToken);
        await this.page.waitForTimeout(1000);
        expect(this.page.url()).toContain('github.com');
    }

}