import { expect, Page } from "@playwright/test"
export class MarketplaceStarter {

    readonly page
    readonly cancelFlowPage
    starterAppName: string;
    apiKey: string;
    constructor(page: Page, cancelFlowPage:Page) {
        this.page = page;
        this.cancelFlowPage = cancelFlowPage;
    }
    async visitMarketplace() {
        await this.page.goto('/#!/marketplace/starters') //go to marketplace
    }
    async findStarterApp() {
        await this.page.locator(`text=${process.env.CONTENTSTACK_STARTER_APP}`).click();
        await this.page.locator('.ReactModalPortal >> text="Install Starter"').click();
        return await this.page.url();
    }

    // Marketplace oauth checker
    async checkReadMore() {
        if ((await this.page.$('button:has-text("Authorize")') !== null)) {
            const authorized = await this.page.locator('button:has-text("Authorize")');
            await authorized.click();
        }
        else if ((await this.page.$('text="Read More"')) !== null) {
            await this.page.locator('text="Read More"').click();
            await this.page.waitForTimeout(500);
            this.checkReadMore()
        }
    }

    // cancel installation flow
    async cancelFlow() {
        await this.cancelFlowPage.locator('text="Cancel"').click();
        await this.cancelFlowPage.waitForTimeout(2000);
    }

    // navigate to unauthorized screen
    async cancelScreen() {
        await expect(this.cancelFlowPage.locator('.error')).toHaveText('Permission Denied - No user permissions')
        await this.cancelFlowPage.close();
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
        const [popup] = await Promise.all([this.page.waitForEvent('popup'), await deployButton.click()]);
        await popup.waitForLoadState();
        const titleCheck = await popup.title();
        await expect(titleCheck).toBe('New Project – Vercel')
        await popup.waitForTimeout(4000); // needed delay for dom node changes
        await popup.locator('button:has-text("Create")', { force: true }).click();
        expect(await popup.waitForSelector('button:has-text("Add")', { state: 'visible' })).toBeTruthy();// wait for selector
        await popup.locator('button:has-text("Add")').click();
        expect(await this.page.locator('.Info__content success', { state: 'visible' })).toBeTruthy();
    }

    // verify newly created stack link 
    async stackLinkResolver(stackPage: Page) {
        const getStackUrl = await this.page.locator('[data-test-id="cs-link"] >> .flex-v-center').nth(0).innerText();
        const getKeys = (new URL(getStackUrl)).hash;
        //@ts-ignore
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
        await githubPage.close();
        return this.starterAppName;;
    }

    // verify newly deployed vercel Link
    async vercelLinkResolver(vercelPage: Page) {
        const vercelLink = await this.page.locator('.ExternalLink').nth(2).innerText();
        await vercelPage.goto(vercelLink);
        await vercelPage.waitForLoadState();
        await expect(vercelPage.url()).toContain(this.starterAppName);
        vercelPage.close();
        return this.starterAppName;
    }
}