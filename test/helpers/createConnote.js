import NavigationFlow from './navigationflow.js';
import TestData from './testdata.js';
import ConnotePage from '../pageobjects/Transaction/connote.page.js';
import SoftError from './softerror.js';
import ConnotePrintPage from '../pageobjects/Transaction/connotePrint.page.js';
import ReceivingPage from '../pageobjects/Receiving/receiving.page.js';
import { browser, expect } from '@wdio/globals';

class ConnoteBagFlow {

    static async createConnoteForBag() {
        const soft = new SoftError('ConnoteBagFlow');

        // Login dan navigasi
        await NavigationFlow.loginAndNavigateToNewTransaction();
        await ConnotePage.pageTitle.waitForDisplayed({ timeout: 5000 });

        // ======= GENERATE DATA =======
        const testData = TestData.generateConnoteOutgoing();

        // ======= ISI FORM =======
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
            jumlah: testData.jumlah,
            weight: testData.weight,
            length: testData.length,
            width: testData.width,
            height: testData.height,
        });

        // ======= SUBMIT FORM =======
        const beforeHandles = await browser.getWindowHandles();
        await ConnotePrintPage.storeGrandTotal();
        await ConnotePage.submit();

        // ======= VALIDASI SUMMARY =======
        const { jumlahConnote, jumlahKoli } = await ConnotePage.validateSummaryTransaction({
            expectedConnote: 1,
            expectedKoli: 1,
            mode: 'exact'
        });

        await soft.checkAsync('Jumlah Connote', async () => {
            expect(jumlahConnote).toBe(1);
        });

        await soft.checkAsync('Jumlah Koli', async () => {
            expect(jumlahKoli).toBe(1);
        });

        // ======= CLICK PAY =======
        await ConnotePage.clickPay('CASH');

        // ======= PRINT WINDOW =======
        await ConnotePage.waitNewWindows(beforeHandles, { timeout: 15000 });
        const main = await ConnotePrintPage.switchToPrintWindow();
        await browser.pause(3000);

        const generatedConnoteNumber = await ConnotePrintPage.getConnoteNumberFromPrint();
        console.log(` Nomor Connote berhasil di-generate: ${generatedConnoteNumber}`);

        // sebelumnya fail cepat -> bikin soft aja biar konsisten & bisa screenshot juga
        await soft.checkAsync('Generated Connote Number harus terisi', async () => {
            expect(generatedConnoteNumber).toBeTruthy();
        });

        await ConnotePrintPage.validatePrintData('CASH', testData, 0, soft);
        await ConnotePrintPage.closePrintWindow(main);

        // ====== THANK YOU PAGE ======
        await ConnotePage.validateThankYouPage();

        await NavigationFlow.logout(); // Logout

        await NavigationFlow.loginAndNavigateToIncoming();
        await ReceivingPage.pageTitle.waitForDisplayed({ timeout: 5000 });

        // receivingKoli biasanya butuh connoteNumber valid,
        // jadi kalau kosong, langkah di bawah bisa error cascading.
        // Kita jalanin tetap, tapi kalau mau aman:
        if (generatedConnoteNumber) {
            await ReceivingPage.receivingKoli(generatedConnoteNumber);
            // await ReceivingPage.validateReceivedConnote(generatedConnoteNumber, soft);
        } else {
            // tetap catat sebagai soft error tambahan (biar jelas di Allure)
            await soft.checkAsync('Skipping Receiving karena generatedConnoteNumber kosong', async () => {
                expect(generatedConnoteNumber).toBeTruthy();
            });
        }

        await NavigationFlow.logout();

        // ====== AKHIR TEST ======
        soft.flush();

        return { testData, generatedConnoteNumber };
    }
}

export default ConnoteBagFlow;
