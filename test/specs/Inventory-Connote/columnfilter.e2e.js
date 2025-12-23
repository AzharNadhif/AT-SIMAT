import NavigationFlow from '../../helpers/navigationflow.js';
import ColumnPage from '../../pageobjects/Main/columnfilter.page.js';

describe('AT-CORE-0014', () => {
    
    before(async () => {
        // Login dan juga flow
        await NavigationFlow.loginAndNavigateToInventoryConnote();
    });

    describe('AT-CORE-0014-02', () => {
        // Hide Some Columns
        it('Hide columns Origin & Destination', async () => {
           await ColumnPage.openDropdown();

            await ColumnPage.CheckboxByTestId('connote_shipper_tariff_code', false);
            await ColumnPage.CheckboxByTestId('connote_receiver_tariff_code', false);

            // Validasi Expect
            const headerTable1 = await $('th=Origin');
            await expect(headerTable1).not.toExist();

            const headerTable2 = await $('th=Destination');
            await expect(headerTable2).not.toExist();

        });

    });
    after(async () => { 
        console.log('Test suite completed');
    });
});
