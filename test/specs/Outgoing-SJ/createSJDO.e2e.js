import CreateConnote from '../../helpers/createConnote.js';
import NavigationFlow from '../../helpers/navigationflow.js';
import OutSMPage from '../../pageobjects/Outgoing/outSM.page.js';
import OutBagPage from '../../pageobjects/Outgoing/outBag.page.js';
import OutSJPage from '../../pageobjects/Outgoing/outSJ.page.js';
import ReceiveSuratPage from '../../pageobjects/Receiving/receiveSurat.page.js';
import SoftError from '../../helpers/softerror.js';

describe('AT-CORE-0038', () => {

    describe('AT-CORE-0038 (01-02)', async () => {
        it('Create Surat Jalan - DO', async () => {
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
            await OutBagPage.addAdditionalItem(generatedConnoteNumber2, soft);
            await OutBagPage.removeAdditionalConnote(soft);
            await OutBagPage.editDestination("SUB750", soft);
            await OutBagPage.approveData("1", soft);
            await OutBagPage.printData(soft);      
            const { bagNumber } = await OutBagPage.printData(soft);
            console.log('OM Bag Number:', bagNumber);
            await NavigationFlow.logout();

            // CREATE SM
            await NavigationFlow.loginAndNavigateToSuratMuatan();
            await OutSMPage.createNewSM('KERETA', 10, 'JNE SURABAYA (SUB000)', 1)
            await OutSMPage.addVehicle('MOTOR', 'JNE BANDUNG (BDO000)', 'JNE SURABAYA (SUB000)', 1);
            await OutSMPage.addBagNo(bagNumber, soft);
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
            await ReceiveSuratPage.receiveSurat(smNumber, bagNumber, null, soft);
            await NavigationFlow.logout();

            // Validate SM
            await NavigationFlow.loginAndNavigateToInventoryBagSUB();
            await ReceiveSuratPage.searchMasterbag(bagNumber, soft);
            await NavigationFlow.logout();

            // Create HVO
            await NavigationFlow.loginAndNavigateToOutgoingBagSUB();
            await OutBagPage.createbag('HVO', generatedConnoteNumber, "JOG", soft); 
            await OutBagPage.editDestination("JOG", soft);
            await OutBagPage.approveData("1", soft);
            const { bagNumber : bagNumber2 } = await OutBagPage.printData(soft);
            console.log('HVO Bag Number:', bagNumber2);
            await NavigationFlow.logout();

            // Create SJ
            await NavigationFlow.loginAndNavigateToSuratJalan();
            await OutSJPage.createSJ(bagNumber2, "TRUCK(B 1234 TEST)", "KURIR ANTER (DPKS230)", soft);
            soft.flush();
        });
    });
});
