import { expect, Page } from "@playwright/test";

export class GithubLogin {
    readonly page;
    constructor(page: Page) {
        this.page = page
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
    }

}