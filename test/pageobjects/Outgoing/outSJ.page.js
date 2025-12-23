import { $, $$, browser } from '@wdio/globals';

class OutSJPage {
    get pageTitle(){
        return $('h2=Surat Jalan');
    }

    get buttonNew(){
        return $('button[data-testid="create-button-surat-jalan"]');
    }

    get modalNewSJ() {
        return $('//div[contains(@class,"vs-dialog__content")]//h4//div[normalize-space(text())="Transport Surat Jalan"]');
    }

    get inputScan(){
        return $('input[data-testid="input-scanBag"]');
    }
    
    get modalEditSJ() {
        return $('//div[contains(@class,"vs-dialog__content") and .//span[normalize-space(text())="Edit Transport Surat Jalan"]]');
    }

    get tableSJ() {
        return $('div[data-testid="table-dialog-surat-jalan"]');
    }

    get firstElem() {
        return this.tableSJ.$('span[data-testid="data-item_number-undefined"]');
    }

    get btnApprove() {
        return $('//button[.//div[normalize-space(text())="Approve"]]');
    }

    get selectModa(){
        return $('div[data-testid="select-no_moda_angkutan_id"]');
    }

    get selectDriver(){
        return $('div[data-testid="select-driver_id"]');
    }

    get tabSJ(){
        return $('a[href="/outgoing/surat-jalan"]');
    }

    get tableParentSJ() {
        return $('div[data-testid="table-surat-jalan"]');
    }

    get btnDepart() {
        return $('button[data-testid="depart-button-1"]');
    }

    get inputSearch() {
        return $('input[data-testid="input-search"]');
    }


    async createSJ(noBag, moda, driver, soft = null) {
        await this.buttonNew.waitForDisplayed({ timeout: 5000 });
        await this.buttonNew.waitForClickable({ timeout: 5000 });
        await this.buttonNew.click();

        await this.modalNewSJ.waitForDisplayed({ timeout: 5000 });

        await this.inputScan.waitForDisplayed({ timeout: 5000 });
        await this.inputScan.waitForClickable({ timeout: 5000 });
        await this.inputScan.click();

        await this.inputScan.setValue(noBag);
        await browser.keys(['Enter']);

        // Validate NumberBag
        const numberBag = this.firstElem;
        await numberBag.scrollIntoView();
        await numberBag.waitForDisplayed({ timeout: 10000 });

        const text = (await numberBag.getText()).trim();
        console.log(`Nomor bag baris 1: "${text}"`);
        console.log("Expected nomor bag baris 1:", noBag);

        const softCheck = async (title, fn) => {
            if (soft && typeof soft.check === 'function') return soft.check.call(soft, title, fn);
            return fn();
        };

        await softCheck(`[Create SJ] nomor bag baris ke-1 (${text}), Tidak Sesuai Input (${noBag})`, () => {
            expect(text).toEqual(noBag);
        });

        await browser.pause (500);

        await this.selectModa.waitForDisplayed({ timeout: 5000 });
        await this.selectModa.waitForClickable({ timeout: 5000 });
        await this.selectModa.click();

        const option = $(`//li[normalize-space()='${moda}']`);
        await option.waitForClickable({ timeout: 5000 });
        await option.click();

        await this.selectDriver.waitForDisplayed({ timeout: 5000 });
        await this.selectDriver.waitForClickable({ timeout: 5000 });
        await this.selectDriver.click();

        const optionDriver = $(`//li[normalize-space()='${driver}']`);
        await optionDriver.scrollIntoView();
        await optionDriver.waitForClickable({ timeout: 5000 });
        await optionDriver.click();
        
        await this.btnApprove.waitForDisplayed({ timeout: 5000 });
        await this.btnApprove.click();

        // Validate Surat Jalan
        await browser.pause(2000);
        const firstCell = await this.tableParentSJ.$('(//table//tr[1]//td[1]//span[@class="text-link"])[1]');
        await firstCell.waitForDisplayed({ timeout: 5000 });
        const sjNumber = await firstCell.getText();
        console.log(` Nomor Surat Jalan di tabel: ${sjNumber}`);

        await this.inputSearch.waitForDisplayed({ timeout: 5000 });
        await this.inputSearch.waitForClickable({ timeout: 5000});
        await this.inputSearch.setValue(sjNumber);
        await browser.keys('Enter');
        console.log(`Nomor Surat Jalan dicari: ${sjNumber}`);

        // https://core-staging.jne.co.id/print/SJ-1762158286400/manifest-delivery-order/84186
        // Klik Depart
        await browser.pause(5000);
        await this.btnDepart.waitForDisplayed({ timeout: 5000 });
        await this.btnDepart.waitForClickable({ timeout: 5000 });
        await this.btnDepart.click();

        await browser.waitUntil(async () => (await browser.getWindowHandles()).length > 1, {
            timeout: 10000,
            timeoutMsg: 'Tab print tidak muncul setelah klik print.',
        });

        const mainHandle = await browser.getWindowHandle();
        const handles = await browser.getWindowHandles();
        const printHandle = handles.find(h => h !== mainHandle);
        await browser.switchToWindow(printHandle);

        // Tunggu tab print baru muncul
        await browser.waitUntil(async () => (await browser.getWindowHandles()).length > 1, {
            timeout: 10000,
            timeoutMsg: 'Tab print tidak muncul setelah klik print.',
        });

        // Ambil handle baru dan pindah ke tab print
        const handlesAfterPrint = await browser.getWindowHandles();
        const newPrintHandle = handlesAfterPrint.find(h => h !== mainHandle);
        await browser.switchToWindow(newPrintHandle);

        // Tunggu sampai URL print muncul
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('print/');
        }, {
            timeout: 10000,
            timeoutMsg: 'URL print tidak muncul.',
        });

        const currentUrl = await browser.getUrl();
        console.log(` URL print terdeteksi: ${currentUrl}`);

        // Ambil segmen ke-4 dari URL
        const urlParts = currentUrl.split('/');
        const printedSJ = decodeURIComponent(urlParts[5]);
        console.log(` Nomor Surat Jalan di URL print: ${printedSJ}`);

        const normalize = str => decodeURIComponent(str).replace(/\\/g, '/').trim();

        // Validasi: pastikan nomor di tabel = nomor di url print
        await softCheck(`[Create SJ] Nomor surat jalan di URL print ${printedSJ}, tidak sesuai dengan input ${sjNumber}`, () => {
            expect(normalize(printedSJ)).toBe(normalize(sjNumber));
        }); 
        console.log(`Nomor Surat Jalan pada halaman print sesuai: ${normalize(printedSJ)}, dengan yang ada di URL ${normalize(sjNumber)}`);


        // Tutup tab print
        await browser.closeWindow();

        // Kembali ke tab utama
        await browser.switchToWindow(mainHandle);
        console.log('DEBUG: noBag =', noBag);
        console.log('DEBUG: moda =', moda);
        console.log('DEBUG: driver =', driver);
    
        return { sjNumber };

    }
    
}

export default new OutSJPage();