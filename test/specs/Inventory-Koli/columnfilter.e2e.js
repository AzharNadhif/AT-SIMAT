import NavigationFlow from '../../helpers/navigationflow.js';
import ColumnPage from '../../pageobjects/Main/columnfilter.page.js';

describe('AT-CORE-0013', () => {
    
    before(async () => {
        // Login dan juga flow
        await NavigationFlow.loginAndNavigateToInventory();
    });

    describe('AT-CORE-0013-02', () => {
        // Hide Some Columns
        it('Hide columns Koli Number & Bag', async () => {
           await ColumnPage.openDropdown();

            await ColumnPage.CheckboxByTestId('koli_number', false);
            await ColumnPage.CheckboxByTestId('bag_number', false);

            // Validasi Expect
            const headerTable1 = await $('th=Koli Number');
            await expect(headerTable1).not.toExist();

            const headerTable2 = await $('th=Bag');
            await expect(headerTable2).not.toExist();



        });

    });
    after(async () => { 
        console.log('Test suite completed');
    });
});
