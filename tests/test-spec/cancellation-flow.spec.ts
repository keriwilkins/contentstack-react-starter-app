import { expect, test } from "@playwright/test";
import { MarketplaceStarter } from "../pages/marketplace-starter";

test('marketplace cancellation flow', async ({ page }) => {
    const MP = new MarketplaceStarter(page);
    await MP.visitMarketplace(); // go to marketplace url
    await expect(page).toHaveURL('/#!/marketplace/starters'); // check marketplace url
    await page.waitForTimeout(2000);
    await MP.findStarterApp(); // find starter
    await MP.cancelFlow(); // click on cancelFlow
    await MP.cancelScreen(); // cancellation navigation screen
})