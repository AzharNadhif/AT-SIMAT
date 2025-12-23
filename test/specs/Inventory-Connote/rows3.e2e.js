import PaginationPage from '../../pageobjects/Main/pagination.page.js';
import NavigationFlow from '../../helpers/navigationflow.js';
import TotalColumnPage from '../../pageobjects/Main/totalcolumn.page.js';

describe('AT-CORE-0014', () => {

    before(async () => {
        await NavigationFlow.loginAndNavigateToInventoryConnote();
    });

    describe('AT-CORE-0014-06', () => {
        it('Validate the total of row values with Rows/Page = 50', async () => {
            const value = 50;
            await PaginationPage.selectRowsPerPage(value);

            await PaginationPage.assertRppSelected(value);
            
            // ambil jumlah rows yang tampil 
            const count = await PaginationPage.getVisibleRowCount();
            expect(count).toBeLessThanOrEqual(value);

            // Validasi row total data sesuai total label
            await TotalColumnPage.validateTotalMatchesRows();
        });
    });

    after(async () => { 
        console.log('Test suite completed');
    });

});
