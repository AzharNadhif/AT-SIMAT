import CreateConnote from '../../helpers/createConnote.js';
import NavigationFlow from '../../helpers/navigationflow.js';
import OutSMPage from '../../pageobjects/Outgoing/outSM.page.js';
import OutBagPage from '../../pageobjects/Outgoing/outBag.page.js';
import ReceiveSuratPage from '../../pageobjects/Receiving/receiveSurat.page.js';
import SoftError from '../../helpers/softerror.js';

describe('AT-CORE-0035', () => {
    describe('AT-CORE-0035-01-02', async () => {
        it('Receiving Surat Muatan', async () => {
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
            await OutSMPage.createNewSM('KERETA', 10, 'JNE SURABAYA (SUB000)', 1)
            await OutSMPage.addVehicle('MOTOR', 'JNE BANDUNG (BDO000)', 'JNE SURABAYA (SUB000)', 1);
            await OutSMPage.addBagNo(bagNumber2, soft);
            const { smNumber } = await OutSMPage.approveSM(soft);
            console.log('SM Number:', smNumber);
            await NavigationFlow.logout();

            // PREALERT
            await NavigationFlow.loginAndNavigateToIncomingSUB();
            await OutSMPage.searchPre(smNumber, soft);

            //  RECEIVE SM
            await ReceiveSuratPage.tabReceive.waitForDisplayed({ timeout: 5000 });
            await ReceiveSuratPage.tabReceive.waitForClickable({ timeout: 5000 });
            await ReceiveSuratPage.tabReceive.click();

            await ReceiveSuratPage.btnReceive.waitForDisplayed({ timeout:5000 });
            await ReceiveSuratPage.btnReceive.waitForClickable({ timeout:5000 });
            await ReceiveSuratPage.btnReceive.click();

            await ReceiveSuratPage.receiveSurat(smNumber, bagNumber2, null, soft);
            
            await NavigationFlow.logout();

            // Validate SM
            await NavigationFlow.loginAndNavigateToInventoryBagSUB();
            await ReceiveSuratPage.searchMasterbag(bagNumber2, soft);

            soft.flush();
        });
    });
});
