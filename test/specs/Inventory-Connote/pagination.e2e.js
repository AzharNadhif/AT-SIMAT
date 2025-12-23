import PaginationPage from '../../pageobjects/Main/pagination.page.js';
import NavigationFlow from '../../helpers/navigationflow.js';


describe('AT-CORE-0014', () => {

    before(async () => {
        // Login dan navigasi
        await NavigationFlow.loginAndNavigateToInventoryConnote();
    });

    describe('AT-CORE-0014-07', () => {
        it('should validate pagination behavior', async () => {
            await PaginationPage.validatePagination();
        });
    });

    after(async () => { 
        console.log('Test suite completed');
    });

});
