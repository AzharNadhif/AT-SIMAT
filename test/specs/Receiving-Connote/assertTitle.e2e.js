import ReceivingPage from '../../pageobjects/Receiving/receiving.page.js';
import NavigationFlow from '../../helpers/navigationflow.js';

describe('AT-CORE-0015', () => {

    before(async () => {
        // Login dan juga flow
        await NavigationFlow.loginAndNavigateToIncoming();
    });

    describe('AT-CORE-0015-04', () => {
        it('Assert Page Title', async () => {
            await ReceivingPage.pageTitle.waitForDisplayed({ timeout: 5000 });    // memastikan halaman sudah dimuat
            expect(await ReceivingPage.pageTitle.getText()).toContain('Error');
        });
    });

});

    
