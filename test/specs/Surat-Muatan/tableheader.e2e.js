import TableValidationPage from '../../pageobjects/Main/tablevalidation.page.js';
import NavigationFlow from '../../helpers/navigationflow.js';

describe('AT-CORE-0022', () => {
    
    before(async () => {
        // Login dan juga flow
        await NavigationFlow.loginAndNavigateToSuratMuatan();
    });


    describe('AT-CORE-0022-03', () => {
       it('Validate Table Header Wording', async () => {
            const expectedHeaders = [
                "No Surat Muatan",
                "Status",
                "Received Bag",
                "Outstanding Bag",
                "Type SM",
                "Flight Number",
                "Vehicle",
                "Moda Transportasi",
                "Origin",
                "Destination",
                "Actual Weight",
                "ETD",
                "ETA",
                "Approved",
                "Received At",
                "Total Irregularity",
                "Total Master Bag",
                "Total Bag",
                "Total Connote",
                "Created Date",
                "Created By",
                "Action"
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