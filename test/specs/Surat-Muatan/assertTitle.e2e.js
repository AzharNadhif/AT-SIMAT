import NavigationFlow from '../../helpers/navigationflow.js';
import SuratmuatanPage from '../../pageobjects/Surat-Muatan/suratmuatan.page.js';

describe('AT-CORE-0022', () => {

    before(async () => {
        // Login dan juga flow
        await NavigationFlow.loginAndNavigateToSuratMuatan();
    });
    describe('Assert Page Title', () => {
        it('Check Title on Inventory Bag Page', async () => {
            await SuratmuatanPage.pageTitle.waitForDisplayed({ timeout: 5000 });    // memastikan halaman sudah dimuat
            expect(await SuratmuatanPage.pageTitle.getText()).toContain('Surat Muatan');
        });
    });
    after(async () => { 
        console.log('Test suite completed');
    });

});

    
