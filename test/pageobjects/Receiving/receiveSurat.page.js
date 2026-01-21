import { $, $$, browser, expect } from '@wdio/globals';
import assert from 'assert';

class ReceivingSuratPage {
    get tabReceive() {
        return $('a[href="/incoming/receiving-surat-muatan"]');
    }

    get tabSJ(){
        return $('a[href="/incoming/receiving-surat-jalan"]');
    }

    get pageTitle() {
        return $('h2=Receiving Surat Muatan');
    }

    get pageTitle2() {
        return $('h2=Receiving');
    }

    get btnReceive() {
        return $('button[data-testid="receiving-button"]');
    }

    get inputItem() {
        return $('//div[contains(@class,"vs-input-content")]' + '[.//label[contains(text(),"SM / SJ")]]//input');
    }

    get inputBag() {
        return $('//div[contains(@class,"vs-input-content")]' + '[.//label[contains(text(),"Masterbag / Bag")]]//input');
    }

    get boxInformation() {
        return $('//div[h4[text()="Receiving Information"]]');
    }

    get boxDetail() {
        return $('//div[h4[text()="List of Items"]]');
    }

    // Validate Masterbag on inventory
    get inputSearch() {
        return $('input[data-testid="input-search"]');
    }

    get searchButton() {
        return $('.bx.bx-search.search-input-icon')
    }

    // ===== helper: softCheck async (multi screenshot ready) =====
    async softCheck(soft, title, fn) {
        if (soft && typeof soft.checkAsync === 'function') {
            return soft.checkAsync.call(soft, title, fn);
        }
        return fn();
    }

    // ===== ACTION RECEIVE SURAT MUATAN =======

    async receiveSurat(noSurat, noBag, soft = null) {
        await this.inputItem.waitForDisplayed({ timeout: 5000 });
        await this.inputItem.waitForClickable({ timeout: 5000 });
        await this.inputItem.click();
        await this.inputItem.setValue(noSurat);
        await browser.keys('Enter');

        await this.boxInformation.waitForDisplayed({ timeout: 5000 });

        // Validate Number Surat
        const numberSurat = await this.boxInformation.$('tbody.vs-table__tbody tr:nth-child(1) td:nth-child(1) span');
        await numberSurat.waitForDisplayed({ timeout: 10000 });

        const text = (await numberSurat.getText()).trim();
        console.log(`Nomor surat di table: ${text}`);
        console.log("Expected nomor surat baris 1:", noSurat);

        await this.softCheck(soft, `[Receive Surat] Nomor Surat(${text}), Tidak Sesuai Input (${noSurat})`, async () => {
            expect(text).toEqual(noSurat);
        });

        await this.boxDetail.waitForDisplayed({ timeout: 5000 });

        // Tunggu table di boxDetail muncul
        const tableDetail = await $('div[data-testid="table-receiving-detail-info"]');
        await tableDetail.waitForDisplayed({ timeout: 10000 });

        // Tunggu baris pertama muncul
        const numberBag = await tableDetail.$('tbody.vs-table__tbody tr:first-child td:nth-child(1) span');
        await browser.waitUntil(async () => await numberBag.isDisplayed(), {
            timeout: 10000,
            timeoutMsg: 'Nomor Bag belum muncul di tabel Receiving Detail'
        });

        const text2 = (await numberBag.getText()).trim();
        console.log(`Nomor bag di table: "${text2}"`);
        console.log("Expected nomor bag:", noBag);

        await this.softCheck(soft, `[Receive Surat(check bag number)] Nomor Bag(${text2}), Tidak Sesuai Input (${noBag})`, async () => {
            expect(text2).toEqual(noBag);
        });

        // Receive Bag
        await this.inputBag.waitForDisplayed({ timeout: 5000});
        await this.inputBag.waitForClickable({ timeout: 5000});
        await this.inputBag.click({ timeout: 5000});
        await this.inputBag.setValue(noBag);
        await browser.keys('Enter');

        // --- Tunggu perubahan kolom 6 jadi ceklis ---
        await browser.waitUntil(async () => {
            const icon = await tableDetail.$('tbody.vs-table__tbody tr:first-child td:nth-child(6) i');
            const cls = await icon.getAttribute('class');
            return cls.includes('bx-check');
        }, {
            timeout: 10000,
            timeoutMsg: `Bag ${noBag} belum berubah menjadi ceklis di kolom 6`
        });

        // --- Validasi final ---
        const iconElement = await tableDetail.$('tbody.vs-table__tbody tr:first-child td:nth-child(6) i');
        const iconClass = await iconElement.getAttribute('class');
        console.log(`Status Bag ${noBag} di kolom 6:`, iconClass.includes('bx-check') ? '✅ Ceklis' : '❌ Belum receive');

        await this.softCheck(soft, `[Receive Surat] Status bag tidak berubah`, async () => {
            expect(iconClass.includes('bx-check')).toBe(true);
        });
    }

    async searchMasterbag(noBag, soft = null) {
        await this.inputSearch.waitForDisplayed({ timeout: 5000 });
        await this.inputSearch.click();
        await this.inputSearch.setValue(noBag);
        await this.searchButton.waitForDisplayed({ timeout: 5000});
        await this.searchButton.click();
        await browser.pause(3000);

        // Ambil nilai di baris pertama kolom pertama
        const firstCell = await $('(//table//tr[1]//td[1]//span[@class="text-link"])[1]');
        await firstCell.waitForDisplayed({ timeout: 5000 });
        const num = await firstCell.getText();

        console.log(` Nomor Masterbag di tabel: ${num}`);
        console.log(` Nomor Masterbag di input: ${noBag}`);

        const normalize = str => decodeURIComponent(str).replace(/\\/g, '/').trim();

        await this.softCheck(soft, `[Receive Surat] Nomor masterbag di tabel ${num}, tidak sesuai dengan input ${noBag}`, async () => {
            expect(normalize(noBag)).toBe(normalize(num));
        });
    }
}

export default new ReceivingSuratPage();
