import NavigationFlow from '../../helpers/navigationflow.js';
import TestData from '../../helpers/testdata.js';
import InventoryPage from '../../pageobjects/Inventory/inventory.page.js';
import ReceivingPage from '../../pageobjects/Receiving/receiving.page.js';
import ConnotePage from '../../pageobjects/Transaction/connote.page.js';
import SoftError from '../../helpers/softerror.js';
import ConnotePrintPage from '../../pageobjects/Transaction/connotePrint.page.js';
import { browser, expect } from '@wdio/globals';

describe('AT-CORE-0015', () => {
    let testData;
    let generatedConnoteNumber;

    describe('AT-CORE-0015-01-02-03', () => {
        it('Create Connote Service COD', async() => {
            const soft = new SoftError();

            await NavigationFlow.loginAndNavigateToNewTransaction();

            await ConnotePage.pageTitle.waitForDisplayed({ timeout: 5000 }); // memastikan halaman sudah dimuat

            // ======= GENERATE DATA DARI TESTDATA =======
            testData = TestData.generateConnoteCOD();

            // ======= ISI FORM DARI TESTDATA =======
            await ConnotePage.fillOrigin({
                namaPengirim: testData.namaPengirim,
                teleponPengirim: testData.teleponPengirim,
                alamatPengirim: testData.alamatPengirim,
                provinsiPengirim: testData.provinsiPengirim,
            });

            await ConnotePage.fillDestination({
                namaPenerima: testData.namaPenerima,
                teleponPenerima: testData.teleponPenerima,
                alamatPenerima: testData.alamatPenerima,
                provinsiPenerima: testData.provinsiPenerima,
            });

            await ConnotePage.fillPackageInformation({ 
                deskripsiBarang: testData.deskripsiBarang,
                kategori: testData.kategori,
                service: testData.service,
                cod: testData.cod,
                jumlah: testData.jumlah,
                weight: testData.weight,
                length: testData.length,
                width: testData.width,
                height: testData.height,
            });

            // ======= SUBMIT FORM =======
            // simpan handle sebelum submit
            const beforeHandles = await browser.getWindowHandles();
            await ConnotePrintPage.storeGrandTotal();
            await ConnotePage.submit();

            // ======= VALIDASI SUMMARY =======
            const {jumlahConnote, jumlahKoli} = await ConnotePage.validateSummaryTransaction({
                expectedConnote: 1,
                expectedKoli: 1,
                mode: 'exact'
            });

            soft.check('Jumlah Connote', () => {
                expect(jumlahConnote).toBe(1);
            });
            soft.check('Jumlah Koli', () => {
                expect(jumlahKoli).toBe(1);
            });

            // ======= CLICK PAY =======
            await ConnotePage.clickPay('CASH');

            // tunggu munculnya window baru (print)
            await ConnotePage.waitNewWindows(beforeHandles, { timeout: 15000 });
            // switch ke print window
            const main = await ConnotePrintPage.switchToPrintWindow();
            await browser.pause(5000);  // jeda

            // Ambil nomor dari print dan simpan ke variabel global
            generatedConnoteNumber = await ConnotePrintPage.getConnoteNumberFromPrint();
            console.log('Connote Number:', generatedConnoteNumber);
            // validasi isi print
            await ConnotePrintPage.validatePrintData('CASH', testData, 0, soft);
            // close print window dan balik ke main
            await ConnotePrintPage.closePrintWindow(main);

            // ====== THANK YOU PAGE ======
            await ConnotePage.validateThankYouPage();
            await NavigationFlow.logout();
            
            await NavigationFlow.loginAndNavigateToIncoming();
            await ReceivingPage.pageTitle.waitForDisplayed({ timeout: 5000 });
            await ReceivingPage.receivingKoli(generatedConnoteNumber);
            await ReceivingPage.validateReceivedConnote(generatedConnoteNumber, soft);
            await NavigationFlow.logout();

            await NavigationFlow.loginAndNavigateToInventory();
            await InventoryPage.pageTitle.waitForDisplayed({ timeout: 5000 });
            await ReceivingPage.validateInventoryConnote(generatedConnoteNumber, testData, soft);

            // flush soft errors di akhir test
            soft.flush();
            
        });
    });

    
    after(async () => { 
        console.log('Test suite completed');
    });

});

    
