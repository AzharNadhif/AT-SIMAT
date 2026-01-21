import PaginationPage from '../../pageobjects/Main/pagination.page.js';
import NavigationFlow from '../../helpers/navigationflow.js';
import TotalColumnPage from '../../pageobjects/Main/totalcolumn.page.js';

describe('AT-CORE-0022', () => {

    before(async () => {
        await NavigationFlow.loginAndNavigateToSuratMuatan();
    });

    describe('AT-CORE-0022-05', () => {
        it('Row per Page 1000 in Data Table', async () => {
            const value = 1000;
            await PaginationPage.selectRowsPerPage(value);
            await browser.pause(22000);
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
