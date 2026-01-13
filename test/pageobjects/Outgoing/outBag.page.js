import { $, $$, browser, expect } from '@wdio/globals';

class OutBagPage {
    get pageTitle() {
        return $('h2=Bag');
    }

    getBagCategory(testId){
        return $(`div[data-testid="bag-${testId}"]`);
    }

    get inputScan(){
        return $(`input[data-testid="input-scanItem"]`);
    }

    get inputDestination(){
        return $(`input[data-testid="autocomplete-destination"]`);
    }

    get btnSubmit(){
        return $(`button[data-testid="submit-button"]`);
    }

    get inputWeight(){
        return $(`input[data-testid="input-weight"]`);
    }

    get btnApprove(){
        return $(`button[data-testid="button-approve"]`);
    }

    get numberBag(){
        return $('.bag-header h3');
    }
    
    get btnPrint(){
        return $(`button[data-testid="button-print"]`);
    }

    get modalTitleRemove(){
        return $('h4=Remove Item Detail');
    }

    get btnRemove(){
        return $(`button[data-testid="remove-button-1"]`);
    }

    // Additional Connote
    get inputConnote(){
        return $('input[data-testid="input-item_number"]')
    }

    get uncheckValDes(){
        return $('div[data-testid="checkbox-validate_hub_delivery"]');
    }

    // ===== helper: soft assertion (async-safe) =====
    async softCheck(soft, label, fn) {
        if (soft && typeof soft.checkAsync === 'function') {
            return soft.checkAsync(label, fn);
        }
        // fallback: hard assert
        return fn();
    }

    async createbag(testId, number, destination, soft = null) {
        const categoryBag = this.getBagCategory(testId);
        await categoryBag.waitForDisplayed({ timeout: 5000 });
        await categoryBag.waitForClickable({ timeout: 5000 });
        await categoryBag.click();

        await this.inputScan.waitForDisplayed({ timeout: 5000 });
        await this.inputScan.waitForClickable({ timeout: 5000 });
        await this.inputScan.click();
        await this.inputScan.setValue(number);
        await browser.keys(['Enter']);
        await browser.pause(5000);
        
        //  Cek apakah modal Input Destination muncul
        const modal = $('div.vs-dialog__content.notFooter');

        if (await modal.isExisting()) {
            console.log('Modal destination muncul, isi field destination.');
            await this.inputDestination.waitForDisplayed({ timeout: 5000 });
            await this.inputDestination.waitForClickable({ timeout: 5000 });
            await this.inputDestination.setValue(destination);
            await browser.pause(1000);
            await browser.keys(['ArrowDown', 'Enter']);

            await this.btnSubmit.waitForDisplayed({ timeout: 5000 });
            await this.btnSubmit.waitForClickable({ timeout: 5000 });
            await this.btnSubmit.click();
        } else {
            console.log('Destination sudah ada, skip input destination.');
        }

        try {
            await this.uncheckValDes.waitForExist({ timeout: 3000 });
            await this.uncheckValDes.click();
        } catch (e) {
            console.log('Checkbox tidak ada, skip.');
        }

        // Validate Connote Number
        const numberConnote = await $('tbody.vs-table__tbody tr:nth-child(1) td:nth-child(2) span');
        await numberConnote.waitForDisplayed({ timeout: 10000 });

        const text = (await numberConnote.getText()).trim();
        console.log(`Nomor connote/bag input pertama: "${text}"`);
        console.log("Expected nomor connote/bag input pertama:", number);

        await this.softCheck(
            soft,
            `[Create Bag] Connote input ke-1 ("${text}") tidak sesuai input ("${number}")`,
            async () => {
                expect(text).toEqual(number);
            }
        );
    }

    async createMasterbag(testId, number, destination, soft = null) {
        const categoryBag = this.getBagCategory(testId);
        await categoryBag.waitForDisplayed({ timeout: 5000 });
        await categoryBag.waitForClickable({ timeout: 5000 });
        await categoryBag.click();

        await this.inputScan.waitForDisplayed({ timeout: 5000 });
        await this.inputScan.waitForClickable({ timeout: 5000 });
        await this.inputScan.click();
        await this.inputScan.setValue(number);
        await browser.keys(['Enter']);
        await browser.pause(5000);
        
        //  Cek apakah modal Input Destination muncul
        const modal = $('div.vs-dialog__content.notFooter');

        if (await modal.isExisting()) {
            console.log('Modal destination muncul, isi field destination.');
            await this.inputDestination.waitForDisplayed({ timeout: 5000 });
            await this.inputDestination.waitForClickable({ timeout: 5000 });
            await this.inputDestination.setValue(destination);
            await browser.pause(1000);
            await browser.keys(['ArrowDown', 'Enter']);

            await this.btnSubmit.waitForDisplayed({ timeout: 5000 });
            await this.btnSubmit.waitForClickable({ timeout: 5000 });
            await this.btnSubmit.click();
        } else {
            console.log('Destination sudah ada, skip input destination.');
        }

        // Validate Connote Number
        const numberConnote = await $('tbody.vs-table__tbody tr:nth-child(1) td:nth-child(2) span');
        await numberConnote.waitForDisplayed({ timeout: 10000 });

        const text = (await numberConnote.getText()).trim();
        console.log(`Nomor connote/bag input pertama: "${text}"`);
        console.log("Expected nomor connote/bag input pertama:", number);

        await this.softCheck(
            soft,
            `[Create Masterbag] Connote input ke-1 ("${text}") tidak sesuai input ("${number}")`,
            async () => {
                expect(text).toEqual(number);
            }
        );
    }

    async addAdditionalItem(number, soft = null) {
        await this.inputConnote.waitForDisplayed({ timeout: 5000 });
        await this.inputConnote.waitForClickable({ timeout: 5000 });
        await this.inputConnote.click();
        await browser.pause(3000);
        await this.inputConnote.setValue(number);
        await browser.keys(['Enter']);
        await browser.pause(5000);

        // Cari span di kolom ke-2 yang teks-nya mengandung `number`
        const cellConnote = await $(
            `//tbody[contains(@class,"vs-table__tbody")]//tr/td[2]/span[contains(normalize-space(), "${number}")]`
        );

        await cellConnote.waitForDisplayed({ timeout: 10000 });

        const connoteText = (await cellConnote.getText()).trim();

        console.log("Nomor additional connote/bag yang ditemukan:", connoteText);
        console.log("Expected nomor connote/bag:", number);

        await this.softCheck(
            soft,
            `[Additional Connote/Bag] expected "${number}" tapi didapat "${connoteText}"`,
            async () => {
                expect(connoteText).toEqual(number);
            }
        );
    }

    async removeAdditionalConnote(soft = null) {
        const cellConnote = await $('[data-testid="data-item_number-2"]');
        await cellConnote.waitForDisplayed({ timeout: 10000 });

        const connoteText = (await cellConnote.getText()).trim(); 

        await this.btnRemove.waitForDisplayed({ timeout: 5000 });
        await this.btnRemove.waitForClickable({ timeout: 5000 });
        await this.btnRemove.click();

        await this.modalTitleRemove.waitForDisplayed({ timeout: 5000 });
        await this.btnSubmit.waitForDisplayed({ timeout: 5000 });
        await this.btnSubmit.waitForClickable({ timeout: 5000 });
        await this.btnSubmit.click();

        await this.softCheck(
        soft,
        `[Remove Additional Connote] Connote baris ke-2 ("${connoteText}") masih tampil`,
        async () => {

            // Pastikan aksi submit benar-benar selesai (modal sudah tertutup)
            await this.modalTitleRemove.waitForDisplayed({ reverse: true, timeout: 10000 });

            // Tunggu sampai connote TIDAK LAGI TAMPIL di tabel
            await browser.waitUntil(async () => {

            // Ambil semua elemen connote di DOM
            const els = await $$('[data-testid^="data-item_number-"]');

            // Simpan HANYA connote yang benar-benar tampil di layar
            const values = [];
            for (const el of els) {
                if (await el.isDisplayed()) {                
                values.push((await el.getText()).trim());
                }
            }

            // true  -> connote sudah hilang dari tampilan
            // false -> connote masih terlihat
            return !values.includes(connoteText);

            }, {
            timeout: 10000,
            timeoutMsg: `Connote "${connoteText}" masih tampil di tabel`
            });

        }
        );
    }

    async editDestination(destination, soft = null) {
        // // Destination Lama
        // const destinationEl = await $('div.bag-info > p:first-child');
        // await destinationEl.waitForDisplayed({ timeout: 5000 });
        // await browser.waitUntil(async () => {
        //     const txt = await destinationEl.getText();
        //     return txt.includes('Destination:');
        // }, {
        //     timeout: 5000,
        //     timeoutMsg: 'Destination belum muncul di DOM'
        // });

        // const oldDestination = (await destinationEl.getText()).replace('Destination:', '').trim();
        // console.log('Destination lama:', oldDestination);

        // Edit Destination
        await this.inputDestination.waitForDisplayed({ timeout: 5000 });
        await this.inputDestination.waitForClickable({ timeout: 5000 });
        await this.inputDestination.click();
        await this.inputDestination.setValue(destination);
        await browser.pause(1000);
        await browser.keys(['ArrowDown', 'Enter']);

        // // Tunggu update di DOM
        // await browser.waitUntil(async () => {
        //     const updatedText = await destinationEl.getText();
        //     const updatedDestination = updatedText.replace('Destination:', '').trim();
        //     return updatedDestination !== oldDestination;
        // }, {
        //     timeout: 5000,
        //     timeoutMsg: 'Destination tidak berubah di DOM'
        // });

        // const updatedDestination = (await destinationEl.getText()).replace('Destination:', '').trim();
        // console.log('Destination baru:', updatedDestination);

        // await this.softCheck(
        //     soft,
        //     `[Edit Destination] Destination baru ("${updatedDestination}") masih sama dengan sebelumnya ("${oldDestination}")`,
        //     async () => {
        //         expect(updatedDestination).not.toBe(oldDestination);
        //     }
        // );
    }

    async approveData(weight, soft = null) {
        // Get Weight Sebelum
        const weightTextBefore = await $('//div[contains(@class,"bag-info")]/p[contains(., "Actual Weight:")]').getText();
        const matchBefore = weightTextBefore.match(/Actual Weight:\s*([\d.]+)\s*Kg/);
        const actualWeightBefore = matchBefore ? matchBefore[1] : null;
        console.log('Actual Weight Before:', actualWeightBefore);

        await this.inputWeight.waitForDisplayed({ timeout: 5000 });
        await this.inputWeight.waitForClickable({ timeout: 5000 });
        await this.inputWeight.click();
        await this.inputWeight.setValue(weight);
        await browser.keys(['Enter']);
        await browser.pause(1000);

        await browser.waitUntil(async () => {
            const text = await $('//div[contains(@class,"bag-info")]/p[contains(., "Actual Weight:")]').getText();
            const match = text.match(/Actual Weight:\s*([\d.]+)\s*Kg/);
            return match && match[1] === weight.toString();
        }, { timeout: 5000, timeoutMsg: 'Actual Weight tidak terupdate di DOM' });

        // Ambil Actual Weight setelah edit
        const weightTextAfter = await $('//div[contains(@class,"bag-info")]/p[contains(., "Actual Weight:")]').getText();
        const matchAfter = weightTextAfter.match(/Actual Weight:\s*([\d.]+)\s*Kg/);
        const actualWeightAfter = matchAfter ? matchAfter[1] : null;
        console.log('Actual Weight After:', actualWeightAfter);

        await this.softCheck(
            soft,
            `[Add Actual Weight] Weight baru tidak berubah. Before="${actualWeightBefore}" After="${actualWeightAfter}"`,
            async () => {
                expect(actualWeightAfter).not.toBe(actualWeightBefore);
            }
        );

        await this.btnApprove.waitForDisplayed({ timeout: 5000 });
        await this.btnApprove.waitForClickable({ timeout: 5000 });
        await this.btnApprove.click();

        const btnUnapprove = await $('button[data-testid="button-unapproved"]');
        await btnUnapprove.waitForDisplayed({timeout:5000});
        const isDisabled = await btnUnapprove.getAttribute('disabled');

        await this.softCheck(
            soft,
            'Approve belum berhasil, Button Unapproved belum disabled',
            async () => {
                expect(isDisabled).toBe('true');
            }
        );

        console.log('Tombol approve sudah disabled, status: Approved');
    }

    async approveDataPra(soft = null) {
        await this.btnApprove.waitForDisplayed({ timeout: 5000 });
        await this.btnApprove.waitForClickable({ timeout: 5000 });
        await this.btnApprove.click();

        const btnUnapprove = await $('button[data-testid="button-unapproved"]');
        await btnUnapprove.waitForDisplayed({timeout:5000});
        const isDisabled = await btnUnapprove.getAttribute('disabled');

        await this.softCheck(
            soft,
            'Approve belum berhasil, Button Unapproved belum disabled',
            async () => {
                expect(isDisabled).toBe('true');
            }
        );

        console.log('Tombol approve sudah disabled, status: Approved');
    }

    async printData(soft = null) {
        await this.btnPrint.waitForDisplayed({ timeout: 5000 });
        await this.btnPrint.waitForClickable({ timeout: 5000 });
        await this.btnPrint.click();

        await this.numberBag.waitForDisplayed();
        const bagNumberText = await this.numberBag.getText();
        const bagNumber = bagNumberText.replace('Bag No. ', '').trim();
        console.log(`Nomor bag ditemukan di tabel: "${bagNumber}"`);

        const mainHandle = await browser.getWindowHandle();

        await browser.waitUntil(async () => (await browser.getWindowHandles()).length > 1, {
            timeout: 15000,
            timeoutMsg: 'Tab print tidak terbuka.',
        });

        const handles = await browser.getWindowHandles();
        const printHandle = handles.find(h => h !== mainHandle);
        await browser.switchToWindow(printHandle);

        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('print/');
        }, {
            timeout: 10000,
            timeoutMsg: 'Halaman print gagal dimuat.',
        });

        const currentUrl = await browser.getUrl();
        console.log(`URL print terdeteksi: ${currentUrl}`);

        const urlParts = currentUrl.split('/');
        let urlBagNumber = decodeURIComponent(urlParts[5]);
        console.log(`Nomor bag dari URL: ${urlBagNumber}`);

        const normalize = str => decodeURIComponent(str).replace(/\\/g, '/').trim();

        await this.softCheck(
            soft,
            '[Print] Bag number di URL tidak sesuai dengan bag number yang di-approve',
            async () => {
                expect(normalize(urlBagNumber)).toBe(normalize(bagNumber));
            }
        );

        console.log(`Nomor bag pada halaman print sesuai: ${normalize(urlBagNumber)}, ${normalize(bagNumber)}`);

        await browser.closeWindow();
        await browser.switchToWindow(mainHandle);

        return { bagNumber };
    }

    async printDataPra(soft = null) {
        await this.btnPrint.waitForDisplayed({ timeout: 5000 });
        await this.btnPrint.waitForClickable({ timeout: 5000 });
        await this.btnPrint.click();

        const mainHandle = await browser.getWindowHandle();

        await browser.waitUntil(async () => (await browser.getWindowHandles()).length > 1, {
            timeout: 15000,
            timeoutMsg: 'Tab print tidak terbuka.',
        });

        const handles = await browser.getWindowHandles();
        const printHandle = handles.find(h => h !== mainHandle);
        await browser.switchToWindow(printHandle);

        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('/PRA%');
        }, {
            timeout: 10000,
            timeoutMsg: 'Halaman print gagal dimuat.',
        });

        const currentUrl = await browser.getUrl();
        console.log(`URL PRA terdeteksi: ${currentUrl}`);

        await this.softCheck(
            soft,
            '[Print Bag PRA] Print berhasil, URL tidak sesuai mengandung PRA',
            async () => {
                expect(currentUrl.toLowerCase()).toContain('print/delivery/pra%');
            }
        );

        console.log(`[Print Bag PRA] Validasi URL berhasil: ${currentUrl}`);

        await browser.closeWindow();
        await browser.switchToWindow(mainHandle);
    }
}

export default new OutBagPage();
