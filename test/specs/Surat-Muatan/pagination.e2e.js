import PaginationPage from '../../pageobjects/Main/pagination.page.js';
import TestData from '../../helpers/testdata.js';
import NavigationFlow from '../../helpers/navigationflow.js';


describe('AT-CORE-0022', () => {

    before(async () => {
        // Login dan navigasi
        await NavigationFlow.loginAndNavigateToSuratMuatan();
    });

    describe('AT-CORE-0018-07', () => {
        it('should validate pagination behavior', async () => {
            await PaginationPage.validatePagination();
        });
    });

    after(async () => { 
        console.log('Test suite completed');
    });

});
