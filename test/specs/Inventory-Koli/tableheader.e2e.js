import TableValidationPage from '../../pageobjects/Main/tablevalidation.page.js';
import NavigationFlow from '../../helpers/navigationflow.js';

describe('AT-CORE-0013', () => {
    
    before(async () => {
        // Login dan juga flow
        await NavigationFlow.loginAndNavigateToInventory();
    });


    describe('AT-CORE-0013-03', () => {
       it('Validate Table Header Wording', async () => {
            const expectedHeaders = [
                "Koli Number",
                "Bag",
                "Connote Created Date",
                "Created By",
                "Receiving Date",
                "Received By",
                "Last Bag Opened Date",
                "Origin",
                "Destination",
                "Actual Weight(Kg)",
                "Cost Weight(Kg)",
                "Routing Type",
                "Service",
                "COD",
                "Amount COD (Rp)",
                "SLA",
                "Runsheet Number",
                "Wood Package",
                "Cancel",
                "Status POD",
                "Status Irregularity",
                "Status"
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