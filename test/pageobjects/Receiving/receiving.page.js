import { $, $$, browser, expect } from '@wdio/globals';
import assert from 'assert';

class ReceivingPage {
    get pageTitle() {
        return $('h2=Pre-Alert');
    }
    
    get pageTitle2() {
        return $('h2=Receiving');
    }

    get btnReceive() {
        return $('button[data-testid="receiving-button"]');
    }

    get inputKoli() {
        return $('input[data-testid="input-child_no"]');
    }

    get searchConnote() {
        return $('input[data-testid="input-search"]');
    }

    get searchBtn() {
        return $('.bx.bx-search.search-input-icon')
    }

    // table kedua
    get secondTable() {
        return $$("div.vs-table-content")[1]; 
    }

    // cell "No item."
    get noItemCell() {
        return this.secondTable.$("tbody.vs-table__tbody tr td:nth-child(1) span");
    }

    // cell "Status receiving" -> button check
    get statusReceivingCheck() {
        return this.secondTable.$("tbody.vs-table__tbody tr td:nth-child(6) button i.bx-check");
    }

    // ===== helper: softCheck async (multi screenshot ready) =====
    async softCheck(soft, label, fn) {
        if (soft && typeof soft.checkAsync === 'function') {
            return soft.checkAsync(label, fn);
        }
        return fn();
    }

    // ====== ACTION RECEIVE KOLI ======
    async receivingKoli(data){
        await this.btnReceive.waitForDisplayed({ timeout: 5000 });
        await this.btnReceive.waitForClickable({ timeout: 5000 });
        await this.btnReceive.click();

        await this.pageTitle2.waitForDisplayed({ timeout: 5000 });
        await this.inputKoli.waitForDisplayed({ timeout: 5000 });
        await this.inputKoli.click();

        const value = data.toString().trim();
        await this.inputKoli.setValue(value);
        await browser.keys('Enter');
    }

    async receivingConnote1000(data){
        await this.pageTitle2.waitForDisplayed({ timeout: 5000 });
        await this.inputKoli.waitForDisplayed({ timeout: 5000 });
        await this.inputKoli.click();

        const value = data.toString().trim();
        await this.inputKoli.setValue(value);
        await browser.keys('Enter');
    }

    // ===== Validate Received Connote =====
    async validateReceivedConnote(expectedConnote, soft = null) {
        // tunggu no item muncul
        await this.noItemCell.waitForDisplayed({ timeout: 10000 });

        const noItemText = (await this.noItemCell.getText()).trim();

        // Cek No item yang didapat
        console.log("No item text dari table:", noItemText);
        console.log("Expected connote number:", expectedConnote);

        await this.softCheck(soft, `No Item equal to Expected Koli Number`, async () => {
            expect(noItemText).toEqual(expectedConnote);
        });

        // validasi status receiving ada icon check
        await this.statusReceivingCheck.waitForDisplayed({ timeout: 5000 });
        const isDisplayed = await this.statusReceivingCheck.isDisplayed();

        await this.softCheck(soft, `Status Receiving`, async () => {
            expect(isDisplayed).toBe(true);
        });
    }

    // ===== Validate Inventory Koli -> Connote Number + COD =====
    async validateInventoryConnote(data, testData, soft = null) {
        await this.searchConnote.waitForDisplayed({ timeout: 5000 });
        await this.searchConnote.setValue(data);

        await this.searchBtn.waitForDisplayed({ timeout: 5000 });
        await this.searchBtn.click();

        await browser.waitUntil(async () => {
            const rows = await $$('table tbody tr');
            return rows.length > 0;
        }, { timeout: 7000, timeoutMsg: 'No rows after search (waitUntil timed out).' });

        const firstRow = await $('table tbody tr');
        const cells = await firstRow.$$('td');

        const koliNumber = (await cells[1].getText()).trim();   // kolom Koli Number
        const cod = (await cells[14].getText()).trim();         // kolom COD
        const amountCod = (await cells[15].getText()).trim();   // kolom Amount COD

        // Logging biar jelas
        console.log("Koli Number dari tabel:", koliNumber);
        console.log("Expected Connote:", data);
        console.log("COD column:", cod);
        console.log("Amount COD column:", amountCod);

        // Assertion
        await this.softCheck(soft, `Koli Number equal to expected`, async () => {
            expect(koliNumber).toEqual(data);
        });

        await this.softCheck(soft, `COD`, async () => {
            expect(cod).toEqual('YES');
        });

        await this.softCheck(soft, `Amount COD`, async () => {
            expect(amountCod.replace(/,/g, '')).toEqual(testData.cod.toString());
        });
    }
}

export default new ReceivingPage();
