import CreateConnote from '../../helpers/createConnote.js';
import NavigationFlow from '../../helpers/navigationflow.js';
import OutSMPage from '../../pageobjects/Outgoing/outSM.page.js';
import OutBagPage from '../../pageobjects/Outgoing/outBag.page.js';
import SoftError from '../../helpers/softerror.js';

describe('AT-CORE-0031', () => {

    describe('AT-CORE-0031 (01-04)', async () => {
        it('Create Surat Muatan - Darat', async () => {
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

            // CREATE SM
            await NavigationFlow.loginAndNavigateToSuratMuatan();
            await OutSMPage.createNewSM('DARAT', 10, 'SURABAYA', 1)
            await OutSMPage.addVehicleDarat('TRUCK TEST', 'DRIVER TESTING JAKARTA', 1);
            await OutSMPage.addBagNo(bagNumber, soft);
            await OutSMPage.addAdditionalBag(bagNumber2, soft);
            const { smNumber } = await OutSMPage.approveSM(soft);
            console.log('SM Number:', smNumber);
            await NavigationFlow.logout();

            await NavigationFlow.loginAndNavigateToIncomingSUB();
            await OutSMPage.searchPre(smNumber, soft);

            soft.flush();
        });
    });
});
