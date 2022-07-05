import { test, expect, Page } from '@playwright/test';
import { MarketplaceStarter } from '../pages/marketplace-starter'
import { GithubLogin } from '../pages/github-login';
import { VercelLogin } from '../pages/vercel-login';
import { getAuthenticated, deleteStack } from '../utils/post-helper';

let apiKey: string;
let globalContext;
let MP;
let page: Page;

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
    page = await globalContext.newPage();
    MP = new MarketplaceStarter(page)
})

//main test for E2E starter app

test.describe('marketplace starter app installation', async () => {
    test('visit marketplace', async () => {
        await MP.visitMarketplace(); //go to marketplace
        await expect(page).toHaveURL('/#!/marketplace/starters'); // check url
    })

    test('locate starter app from list', async () => {
        await MP.findStarterApp();// select starter app
        await expect(page.waitForSelector('.AuthCard__header--title')).toBeTruthy() // check card title
    })

    test('authorize stack installation', async () => {
        await MP.authorizeOrganization(); // get authorize in marketplace app
    })

    test('Added starter details', async () => {
        await MP.starterDetails(); // add app name and start importing stack export
    })

    test('deploy app on vercel', async () => {
        await MP.vercelAuthenticate(); // create project in vercel
    })

    test('verify all deploy or created links', async () => {
        const stackPage = await globalContext.newPage(); // create new tab for stack navigation link check
        const vercelPage = await globalContext.newPage(); // create new tab got vercel navigation link check
        const githubPage = await globalContext.newPage(); // create new tab got github navigation link check
        [apiKey] = await Promise.all(
            [await MP.stackLinkResolver(stackPage),
            await MP.vercelLinkResolver(vercelPage),
            await MP.gitLinkResolver(githubPage)]) // visit and check all links
    })
})


// after all E2E test delete newly created stack
test.afterAll(async () => {
    const authToken: string = await getAuthenticated();
    await deleteStack(apiKey, authToken);
})
