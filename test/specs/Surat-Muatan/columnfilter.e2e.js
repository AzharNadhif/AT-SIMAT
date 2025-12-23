import NavigationFlow from '../../helpers/navigationflow.js';
import ColumnPage from '../../pageobjects/Main/columnfilter.page.js';

describe('AT-CORE-0022', () => {
    
    before(async () => {
        // Login dan juga flow
        await NavigationFlow.loginAndNavigateToSuratMuatan();
    });

    describe('AT-CORE-0022-02', () => {
        // Hide Some Columns
        it('Hide columns Created Date & Created By', async () => {
           await ColumnPage.openDropdown();

            await ColumnPage.CheckboxByTestId('created_at', false);
            await ColumnPage.CheckboxByTestId('created_by_user', false);

            // Validasi Expect
            const headerTable1 = await $('th=Created Date');
            await expect(headerTable1).not.toExist();

            const headerTable2 = await $('th=Created By');
            await expect(headerTable2).not.toExist();
        });

    });
    after(async () => { 
        console.log('Test suite completed');
    });
});
