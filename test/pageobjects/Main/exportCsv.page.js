import { $, browser, expect } from '@wdio/globals';

class exportCsvPage{
    // ========= ELEMENT PAGE ==========
    // button CSV
    get btnExport() {
        return $('button[data-testid="export-button"]');
    }

    // ========= ACTIONS ==========
    // Actions export CSV
    async exportCsv() {
        await this.btnExport.scrollIntoView({ timeout: 5000 });
        await this.btnExport.waitForDisplayed({ timeout: 5000 });
        await this.btnExport.click();

        await browser.pause(1000);
    }
}

export default new exportCsvPage();