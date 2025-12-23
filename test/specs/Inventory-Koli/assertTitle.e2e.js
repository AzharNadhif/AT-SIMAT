import NavigationFlow from '../../helpers/navigationflow.js';
import InventoryPage from '../../pageobjects/Inventory/inventory.page.js';

describe('AT-CORE-0013', () => {

    before(async () => {
        // Login dan juga flow
        await NavigationFlow.loginAndNavigateToInventory();
    });
    describe('Assert Page Title', () => {
        it('Check Title on Inventory Connote Page', async () => {
            await InventoryPage.pageTitle.waitForDisplayed({ timeout: 5000 });    // memastikan halaman sudah dimuat
            expect(await InventoryPage.pageTitle.getText()).toContain('Connote');
        });
    });
    after(async () => { 
        console.log('Test suite completed');
    });

});

    
