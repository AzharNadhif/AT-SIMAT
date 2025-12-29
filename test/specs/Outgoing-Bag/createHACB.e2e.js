import CreateConnote from '../../helpers/createConnote.js';
import NavigationFlow from '../../helpers/navigationflow.js';
import OutBagPage from '../../pageobjects/Outgoing/outBag.page.js';
import SoftError from '../../helpers/softerror.js';

describe('AT-CORE-0028', () => {

    describe('AT-CORE-0028-01-06', async () => {
        it('Create Bag HACB', async () => {
            const soft = new SoftError();
            
            // Create Connote Pertama
            const { testData, generatedConnoteNumber } = await CreateConnote.createConnoteForBag();

            console.log(' Test Data:', testData);
            console.log(' Generated Connote:', generatedConnoteNumber);

            // Create Connote Kedua
            const { testData: testData2, generatedConnoteNumber: generatedConnoteNumber2 } = await CreateConnote.createConnoteForBag();

            console.log(' Test Data:', testData2);
            console.log(' Generated Connote:', generatedConnoteNumber2);

            // Create HACB
            await NavigationFlow.loginAndNavigateToOutgoingBag();
            await OutBagPage.createbag('HACB', generatedConnoteNumber, "SUX02", soft); 

            // Add Additional Connote
            await OutBagPage.addAdditionalItem(generatedConnoteNumber2, soft);
            await OutBagPage.removeAdditionalConnote(soft);
            await OutBagPage.editDestination("SUB750", soft);
            await OutBagPage.approveData("1", soft);
            await OutBagPage.printData(soft);

            soft.flush();
        });
    });
});
