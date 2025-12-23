import CreateConnote from '../../helpers/createConnote.js';
import NavigationFlow from '../../helpers/navigationflow.js';
import OutBagPage from '../../pageobjects/Outgoing/outBag.page.js';
import SoftError from '../../helpers/softerror.js';

describe('AT-CORE-0025', () => {

    describe('AT-CORE-0025 (01-06)', async () => {
        it('Outgoing Master Bag', async () => {
            const soft = new SoftError();
            
            // Create Connote Pertama
            const { testData, generatedConnoteNumber } = await CreateConnote.createConnoteForBag();

            console.log(' Test Data:', testData);
            console.log(' Generated Connote:', generatedConnoteNumber);

            // Create Connote Kedua
            const { testData: testData2, generatedConnoteNumber: generatedConnoteNumber2 } = await CreateConnote.createConnoteForBag();

            console.log(' Test Data:', testData2);
            console.log(' Generated Connote:', generatedConnoteNumber2);
            
            // Create OM Bag
            await NavigationFlow.loginAndNavigateToOutgoingBag();
            await OutBagPage.createbag('OM', generatedConnoteNumber, "SUX02", soft); 
            await OutBagPage.approveData("1", soft);         
            const { bagNumber } = await OutBagPage.printData(soft);
            console.log('OM Bag Number:', bagNumber);
            await NavigationFlow.logout();

            // Create MBag
            await NavigationFlow.loginAndNavigateToOutgoingBag();
            await OutBagPage.createbag('OM', generatedConnoteNumber2, "SUX02", soft); 
            await OutBagPage.approveData("1", soft);
            const { bagNumber: bagNumber2 } = await OutBagPage.printData(soft);
            console.log('OM Bag Number:', bagNumber2);
            await NavigationFlow.logout();

            await NavigationFlow.loginAndNavigateToOutgoingBag();
            await OutBagPage.createbag('MASTERBAG', bagNumber, "SUX02", soft); 
            
            // Add Additional Bag
            await OutBagPage.addAdditionalItem(bagNumber2, soft);
            // await OutBagPage.removeAdditionalConnote(soft);
            await OutBagPage.editDestination("SUB750", soft);
            await OutBagPage.approveData("1", soft);
            await OutBagPage.printData(soft);

            soft.flush();
        });
    });
});
