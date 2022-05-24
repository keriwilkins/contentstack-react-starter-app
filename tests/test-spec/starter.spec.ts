import { test, expect, Page } from '@playwright/test';
import { MarketplaceStarter } from '../pages/marketplace-starter'
import { GithubLogin } from '../pages/github-login';
import { VercelLogin } from '../pages/vercel-login';
import { getAuthenticated, deleteStack } from '../utils/post-helper';

let apiKey: string;
let globalContext;

test.beforeAll(async ({ browser }) => {
    globalContext = await browser.newContext();
    // create a new tab for github login
    const gitHubPage = await globalContext.newPage();
    // create a new tab for vercel login
    const vercelPage = await globalContext.newPage();
    const GH = new GithubLogin(gitHubPage);
    await GH.getGithubPage(); // go to github login page
    await GH.githubLogin(); // login to github

    const VL = new VercelLogin(vercelPage);
    await VL.navigateToVercel(); // go to vercel login page
    await VL.loginToVercel();// login to vercel
    await gitHubPage.waitForTimeout(1000);
})

// after all E2E test delete newly created stack
test.afterAll(async () => {
    const authToken: string = await getAuthenticated();
    await deleteStack(apiKey, authToken);
})

//main test for E2E starter app
test('marketplace installation', async () => {
    const page: Page = await globalContext.newPage();
    const MP = new MarketplaceStarter(page);
    await MP.visitMarketplace(); //go to marketplace
    await expect(page).toHaveURL('/#!/marketplace/starters'); // check url
    await page.waitForTimeout(1000);
    await MP.findStarterApp();// select starter app
    await expect(page.waitForSelector('.AuthCard__header--title')).toBeTruthy() // check card title
    await MP.authorizeOrganization(); // get authorize in marketplace app
    await MP.starterDetails(); // add app name and start importing stack export
    expect(await page.waitForSelector('button:has-text("Deploy to Vercel")', { state: 'visible' })).toBeTruthy();// check and wait for deploy button to me available on dom
    await MP.vercelAuthenticate(); // create project in vercel
    const stackPage = await globalContext.newPage(); // create new tab for stack navigation link check
    const vercelPage = await globalContext.newPage(); // create new tab got vercel navigation link check
    const githubPage = await globalContext.newPage(); // create new tab got github navigation link check
    [apiKey] = await Promise.all(
        [await MP.stackLinkResolver(stackPage),
        await MP.vercelLinkResolver(vercelPage),
        await MP.gitLinkResolver(githubPage)]) // visit and check all links
})
