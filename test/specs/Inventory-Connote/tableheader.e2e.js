import TableValidationPage from '../../pageobjects/Main/tablevalidation.page.js';
import NavigationFlow from '../../helpers/navigationflow.js';

describe('AT-CORE-0014', () => {
    
    before(async () => {
        // Login dan juga flow
        await NavigationFlow.loginAndNavigateToInventoryConnote();
    });


    describe('AT-CORE-0014-03', () => {
       it('Validate Table Header Wording', async () => {
            const expectedHeaders = [
                "Connote Number", 
                "Origin", 
                "Destination", 
                "Weight(Kg)",
                "Routing Type", 
                "Service", 
                "COD", 
                "Amount COD (Rp)", 
                "SLA", 
                "Created At", 
                "Created By", 
                "Cancel"

            ];


            const actualHeaders = await TableValidationPage.getHeaderTexts();
            console.log("Headers ditemukan:", actualHeaders);

            expect(actualHeaders).toEqual(expectedHeaders); 
        });

    });

    after(async () => { 
        console.log('Test suite completed');
    });
});