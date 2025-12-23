import CreateConnote from '../../helpers/createConnote.js';
import NavigationFlow from '../../helpers/navigationflow.js';
import OutSMPage from '../../pageobjects/Outgoing/outSM.page.js';
import OutBagPage from '../../pageobjects/Outgoing/outBag.page.js';
import SoftError from '../../helpers/softerror.js';

describe('AT-CORE-0032', () => {

    describe('AT-CORE-0032 (01-04)', async () => {
        it('Create Surat Muatan - Kereta', async () => {
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

            // Create OM Bag
            await NavigationFlow.loginAndNavigateToOutgoingBag();
            await OutBagPage.createbag('OM', generatedConnoteNumber2, "SUX02", soft); 
            await OutBagPage.approveData("1", soft);
            const { bagNumber: bagNumber2 } = await OutBagPage.printData(soft);
            console.log('OM Bag Number:', bagNumber2);
            await NavigationFlow.logout();

            // Create Master Bag
            await NavigationFlow.loginAndNavigateToOutgoingBag();
            await OutBagPage.createMasterbag('MASTERBAG', bagNumber, "SUX02", soft); 
            // Add Additional Bag
            await OutBagPage.addAdditionalItem(bagNumber2, soft);
            await OutBagPage.editDestination("SUB750", soft);
            await OutBagPage.approveData("1", soft);
            const { bagNumber: bagNumber3 } = await OutBagPage.printData(soft);
            console.log('Master Bag Number:', bagNumber3);
            await NavigationFlow.logout();

            // CREATE SM
            await NavigationFlow.loginAndNavigateToSuratMuatan();
            await OutSMPage.createNewSM('KERETA', 10, 'JNE SURABAYA (SUB000)', 1)
            await OutSMPage.addVehicle('MOTOR', 'JNE BANDUNG (BDO000)', 'JNE SURABAYA (SUB000)', 1);
            await OutSMPage.addBagNo(bagNumber3, soft);
            const { smNumber } = await OutSMPage.approveSM(soft);
            console.log('SM Number:', smNumber);
            await NavigationFlow.logout();

            await NavigationFlow.loginAndNavigateToIncomingSUB();
            await OutSMPage.searchPre(smNumber, soft);

            soft.flush();
        });
    });
});
