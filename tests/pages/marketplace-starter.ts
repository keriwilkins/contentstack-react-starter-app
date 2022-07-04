import { expect, Page } from "@playwright/test"
export class MarketplaceStarter {
    readonly page
    apiKey: string;
    starterAppName: string;
    constructor(page: Page) {
        this.page = page;
    }
    async visitMarketplace() {
        await this.page.goto('/#!/marketplace/starters') //go to marketplace
    }
    async findStarterApp() {
        await this.page.locator(`text=${process.env.CONTENTSTACK_STARTER_APP}`).click();
        await this.page.locator('.ReactModalPortal >> text="Install Starter"').click();
    }

    // Marketplace oauth checker
    async checkReadMore() {
        if ((await this.page.$('button:has-text("Authorize")') !== null)) {
            const authorized = await this.page.locator('button:has-text("Authorize")');
            await authorized.click();
        }
        else if ((await this.page.$('text="Read More"')) !== null) {
            // const checkButton = await expect(this.page.locator('text="Read More"')).toHaveText('Read More');
            // checkButton && 
            await this.page.locator('text="Read More"').click();
            await this.page.waitForTimeout(500);
            // checkButton && 
            this.checkReadMore()
        }
    }

    // cancel installation flow
    async cancelFlow() {
        await this.page.locator('text="Cancel"').click();
        await this.page.waitForTimeout(2000);
    }

    // navigate to unauthorized screen
    async cancelScreen() {
        await expect(this.page.locator('.error')).toHaveText('Permission Denied - No user permissions')
    }

    // check for Read More button
    async authorizeOrganization() {
        await this.page.locator('#InstallationCardContent');
        await this.page.waitForSelector('text="Read More"');
        await this.checkReadMore();
    }

    // stack import
    async starterDetails() {
        const stackName = await this.page.locator(`input[placeholder="${process.env.CONTENTSTACK_STARTER_APP}"]`);
        this.starterAppName = (process.env.CONTENTSTACK_STARTER_APP)?.toLowerCase().replace(/ /g, "-") + "-" + Math.floor(Math.random() * 1000) + 1;
        await stackName.type(this.starterAppName.toString());
        await this.page.locator('text="Import Starter"').click();
    }

    // vercel deployment part
    async vercelDeploy() {
        const deployButton = await this.page.waitForSelector('button:has-text("Deploy to Vercel")');
        await deployButton.click();
        await this.page.waitForTimeout(5000)
    }

    // vercel authentication and deployment
    async vercelAuthenticate() {
        const deployButton = await this.page.waitForSelector('button:has-text("Deploy to Vercel")');
        await this.page.waitForTimeout(5000);
        const [popup] = await Promise.all([this.page.waitForEvent('popup'), await deployButton.click()]);
        await popup.waitForLoadState();
        const titleCheck = await popup.title();
        await expect(titleCheck).toBe('New Project – Vercel')
        await popup.waitForSelector('button[value="github"]');
        await popup.locator('button[value="github"]').click();
        await popup.locator('[data-geist-button] >> span:has-text("Create")').click();
        await popup.waitForTimeout(4000);
        const isCreate = await popup.locator('[data-geist-button] >> span:has-text("Create")').isVisible();
        isCreate && await popup.locator('[data-geist-button] >> span:has-text("Create")').click();

        expect(await popup.waitForSelector('button:has-text("Add")', { state: 'visible' })).toBeTruthy();
        await popup.locator('button:has-text("Add")').click();
        expect(await this.page.locator('.Info__content success', { state: 'visible' })).toBeTruthy();
    }

    // verify newly created stack link 
    async stackLinkResolver(stackPage: Page) {
        const getStackUrl = await this.page.locator('[data-test-id="cs-link"] >> .flex-v-center').nth(0).innerText();
        const getKeys = (new URL(getStackUrl)).hash;
        this.apiKey = (getKeys?.match('[a-z0-9]{10,30}'))[0];
        stackPage.goto(getStackUrl);
        await expect(stackPage).toHaveURL(`/#!/stack/${this.apiKey}/dashboard`)
        await stackPage.waitForLoadState();
        await stackPage.close();
        return this.apiKey;
    }

    // verify newly created github link
    async gitLinkResolver(githubPage: Page) {
        const githubLink = await this.page.locator('[data-test-id="cs-link"] >> .flex-v-center').nth(5).innerText();
        await githubPage.goto(githubLink);
        await githubPage.waitForLoadState();
        await expect(githubPage.url()).toContain(this.starterAppName);
    }

    // verify newly deployed vercel Link
    async vercelLinkResolver(vercelPage: Page) {
        const vercelLink = await this.page.locator('.ExternalLink').nth(2).innerText();
        await vercelPage.goto(vercelLink);
        await vercelPage.waitForLoadState();
        await expect(vercelPage.url()).toContain(this.starterAppName);
        vercelPage.close();
    }

}