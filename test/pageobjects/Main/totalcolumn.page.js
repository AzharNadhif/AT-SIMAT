import { $, $$, browser, expect } from '@wdio/globals';

class totalColumnPage {
    // ================= PAGE VALIDATION TOTAL COLUMN =================
    // Table Header
    get totalColumn() {
        return $('p[@data-testid="columns-total"]');
    }

    // ================= ACTION CALCULATE TOTAL ROWS   =================
    // Ambil total data dari text <p>
    async getDisplayedTotal() {
        const totalElement = await $('[data-testid="columns-total"]');
        await totalElement.waitForDisplayed({ timeout: 5000 });
        const text = await totalElement.getText(); // contoh: "Total: 3"
        const total = parseInt(text.replace(/\D/g, ''), 10); // ambil angka aja
        return total;
    }

    // Hitung jumlah baris <tr> di tbody
    async getTableRowCount() {
        // Ambil hanya row dengan td, dan pastikan visible, tidak memasukkan yang not visible
        const rows = await $$('//table/tbody/tr[td]');
        const visibleRows = [];
        for (const row of rows) {
            if (await row.isDisplayed()) { //tunggu row muncul
                visibleRows.push(row);
            }
        }
        return visibleRows.length; // Mengembalikkan row yang terlihat dan hitung banyaknya
    }

    // Validasi Row yang tampil dengan Label Total
    async validateTotalMatchesRows() {
        const uiTotal = await this.getDisplayedTotal();

        await browser.waitUntil(async () => {
            const rowCount = await this.getTableRowCount();
            return rowCount === uiTotal;
        }, { timeout: 10000, timeoutMsg: 'Row count tidak sinkron dengan UI total' });

        const rowCount = await this.getTableRowCount();
        expect(rowCount).toEqual(uiTotal);
    }

    async validateTotalMatchesRowsTB() {
        // Ambil konteks modal TraceBag
        const modal = await $('//div[contains(@class,"vs-dialog__content")]');

        // ambil total dari label di modal
        const uiTotalText = await modal.$('[data-testid="columns-total"]').getText();
        const uiTotal = parseInt(uiTotalText.replace(/\D/g, ''), 10) || 0;

        // tunggu sampai jumlah row di tabel modal sinkron dgn label
        await browser.waitUntil(async () => {
            const rows = await modal.$$('//tbody[contains(@class,"vs-table__tbody")]//tr[td]');
            return rows.length === uiTotal;
        }, { timeout: 10000, timeoutMsg: 'Row count TraceBag tidak sinkron dengan UI total' });

        // ambil ulang untuk validasi
        const finalRows = await modal.$$('//tbody[contains(@class,"vs-table__tbody")]//tr[td]');
        expect(finalRows.length).toEqual(uiTotal);
        console.log(`TraceBag Table: ${finalRows.length} row(s) cocok dengan total UI (${uiTotal})`);
    }

}

export default new totalColumnPage();