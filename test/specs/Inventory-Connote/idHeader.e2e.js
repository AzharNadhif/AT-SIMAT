import TableValidationPage from '../../pageobjects/Main/tablevalidation.page.js';
import NavigationFlow from '../../helpers/navigationflow.js';
import { expect } from '@wdio/globals';


describe('AT-CORE-0014', () => {

    before(async () => {
        // Login dan navigasi ke halaman Inventory
        await NavigationFlow.loginAndNavigateToInventoryConnote();
    });

    describe('AT-CORE-0014-04', () => {
        // Cek tidak ada column Id di table header
        it('should not have an ID column in the table headers', async () => {
            const headers = await TableValidationPage.getTableHeaders();
            console.log('Headers:', headers); // cek dulu isi array
            // normalisasi penulisan id
            const normalized = headers.map(h => h.toLowerCase());
            expect(normalized).not.toContain('id');
        });
    });

    after(async () => { 
        console.log('Test suite completed');
    });

});

