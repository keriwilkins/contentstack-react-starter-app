import { test, expect, Page } from '@playwright/test';
import { MarketplaceStarter } from '../pages/marketplace-starter'
import { AccountSetup } from '../pages/vercel-github-login';
// import { GithubLogin } from '../pages/github-login';
// import { VercelLogin } from '../pages/vercel-login';
import { getAuthenticated, deleteStack, deleteGitRepo, deleteVercelProject } from '../utils/post-helper';

let apiKey: string;
let projectName: string;
let globalContext;
let MP;

test.beforeAll(async ({ browser }) => {
    globalContext = await browser.newContext();
    // create a new tab for github login
    const pageSetup = await globalContext.newPage();
    const setup = new AccountSetup(pageSetup);
    setup.accountLogin(); // github and vercel login

    const page = await globalContext.newPage();
    const cancelFlowPage = await globalContext.newPage();
    MP = new MarketplaceStarter(page, cancelFlowPage);
    await MP.visitMarketplace(); //go to marketplace
    const pageURL = await MP.findStarterApp();// select starter app
    await cancelFlowPage.goto(pageURL);

})

//main test for E2E starter app
test('cancellation flow', async () => {
    await MP.cancelFlow(); // click on cancelFlow
    await MP.cancelScreen(); // cancellation navigation screen
})

test('starter app deployment flow', async () => {
    await MP.authorizeOrganization(); // get authorize in marketplace app
    await MP.starterDetails(); // add app name and start importing stack export
    await MP.vercelAuthenticate(); // create project in vercel
    const stackPage = await globalContext.newPage(); // create new tab for stack navigation link check
    const vercelPage = await globalContext.newPage(); // create new tab got vercel navigation link check
    const githubPage = await globalContext.newPage(); // create new tab got github navigation link check
    [apiKey, projectName] = await Promise.all(
        [await MP.stackLinkResolver(stackPage),
        await MP.vercelLinkResolver(vercelPage),
        await MP.gitLinkResolver(githubPage)]) // visit and check all links
})

// after all E2E test delete newly created stack
test.afterAll(async () => {
    const authToken: string = await getAuthenticated();
    await deleteStack(apiKey, authToken);
    await deleteGitRepo(projectName);
    await deleteVercelProject(projectName);
})
