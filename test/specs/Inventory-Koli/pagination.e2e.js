import PaginationPage from '../../pageobjects/Main/pagination.page.js';
import TestData from '../../helpers/testdata.js';
import NavigationFlow from '../../helpers/navigationflow.js';


describe('AT-CORE-0013', () => {

    before(async () => {
        // Login dan navigasi
        await NavigationFlow.loginAndNavigateToInventory();
    });

    describe('AT-CORE-0013-07', () => {
        it('Validate Data Table Pagination', async () => {
            await PaginationPage.validatePagination();
        });
    });

    after(async () => { 
        console.log('Test suite completed');
    });

});
