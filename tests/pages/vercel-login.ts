import { expect, Page } from '@playwright/test';
export class VercelLogin {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async navigateToVercel() {
        await this.page.goto('https://vercel.com/login'); // go to vercel
    }

    async loginToVercel(){
        await this.page.locator('text="GitHub"').click(); // vercel login with github
        await this.page.waitForNavigation(); // wait for navigation
        await expect(this.page).toHaveURL(/.*dashboard/); // check for match url value
    }

}