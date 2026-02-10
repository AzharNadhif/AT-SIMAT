import { $, $$, browser, expect } from '@wdio/globals';

class SuratMuatanPage {
    get tabSM() {
        return $('a[href="/outgoing/surat-muatan"]');
    }

    get pageTitle() {
        return $('h2=Surat Muatan');
    }

    get searchBy() {
        return $('div[data-testid="select-search-by"]');
    }

    get searchButton() {
        return $('.bx.bx-search.search-input-icon');
    }

    get searchInput() {
        return $('input[data-testid="input-search"]');
    }

    get searchOption() {
        return $('.vs-select__options');
    }

    get selectSearchByDate() {
        return $('div[data-testid="select-search-by-date"]');
    }

    get date() {
        return $('div[data-testid="input-date-time"].el-date-editor--datetimerange');
    }

    // Start & End input (index 0 = start, 1 = end)
    get dateStartInput() {
        return this.date.$$('input.el-range-input')[0];
    }
    get dateEndInput() {
        return this.date.$$('input.el-range-input')[1];
    }

    // button OK Date
    get btnOK() {
        return $("//button[contains(@class,'el-picker-panel__link-btn')]//span[normalize-space()='OK']");
    }

    get btnPrint() {
        return $('button[data-testid="print-button-1"]');
    }

    // ==== ACTION SURAT MUATAN PAGE ====

    // Dropdown option
    getColumnDropdown(testId) {
        return $(`div[data-testid="select-${testId}"]`);
    }

    // Ambil ikon dropdown arrow
    getDropdownArrow(dropdown) {
        return dropdown.$('i.vs-icon-arrow');
    }

    // Ambil semua opsi
    async getDropdownOptions() {
        return await this.searchOption.$$('.vs-select__option');
    }

    // Open dropdown
    async openDropdownFilter(testId, optionText = null) {
        const dropdown = this.getColumnDropdown(testId);
        await dropdown.waitForDisplayed({ timeout: 5000 });
        await dropdown.waitForClickable({ timeout: 5000 });
        await dropdown.click(); // buka dropdown

        await this.searchOption.waitForDisplayed({ timeout: 5000 });
        await browser.pause(300);

        const options = await this.getDropdownOptions();
        if (options.length === 0) throw new Error('Tidak ada opsi di dropdown.');

        // Unclick opsi yang sudah dicentang sebelumnya
        for (const opt of options) {
            const input = await opt.$('input[type="checkbox"]');
            if (await input.isSelected()) {
                await opt.waitForClickable({ timeout: 5000 });
                await opt.click();
                console.log(`Unclick sebelumnya: ${await opt.getText()}`);
                await browser.pause(200);
            }
        }

        // Klik opsi baru (berdasarkan text)
        if (optionText) {
            let optToClick = null;
            for (const opt of options) {
                const text = (await opt.getText()).trim().toUpperCase();
                if (text === optionText.toUpperCase()) {
                    optToClick = opt;
                    break;
                }
            }
            if (!optToClick) throw new Error(`Opsi "${optionText}" tidak ditemukan di dropdown "${testId}"`);

            await optToClick.waitForClickable({ timeout: 5000 });
            await optToClick.click();
            console.log(`Klik opsi baru: ${optionText}`);
        } else {
            // Kalau optionText null, klik semua opsi
            for (let i = options.length - 1; i >= 0; i--) {
                await options[i].waitForClickable({ timeout: 5000 });
                await options[i].click();
                console.log(`Klik opsi ke-${i}: ${await options[i].getText()}`);
                await browser.pause(200);
            }
        }

        // Tutup dropdown
        const arrow = await this.getDropdownArrow(dropdown);
        await arrow.waitForClickable({ timeout: 5000 });
        await arrow.click();
        console.log('Dropdown ditutup');

        await browser.pause(300);
    }

    async resetDropdownFilter(testId) {
        const dropdown = this.getColumnDropdown(testId);
        await dropdown.waitForDisplayed({ timeout: 5000 });

        // ambil semua chip close button di dalam dropdown
        const chipsClose = await dropdown.$$('.vs-select__chips__chip__close');

        if (chipsClose.length === 0) {
            console.log('Tidak ada chip aktif, skip reset');
            return;
        }

        for (const closeBtn of chipsClose) {
            await closeBtn.waitForClickable({ timeout: 5000 });
            await closeBtn.click();
            await browser.pause(200);
        }

        console.log('Semua chip filter berhasil di-reset');
    }

    // Search Surat Muatan
    async searchSuratMuatan(indexSearch, value) {
        await this.searchBy.waitForClickable({ timeout: 5000 });
        await this.searchBy.click();

        await this.searchOption.waitForDisplayed({ timeout: 5000 });

        const options = await this.searchOption.$$(`.//button[contains(@class,"vs-select__option")]`);
        if (options.length === 0) throw new Error('Tidak ada opsi di dropdown.');
        if (indexSearch < 0 || indexSearch >= options.length) {
            throw new Error(`Index ${indexSearch} di luar range (0..${options.length - 1}).`);
        }

        // log semua opsi untuk memastikan mapping index benar
        const optionTexts = [];
        for (let i = 0; i < options.length; i++) {
            optionTexts.push((await options[i].getText()).trim());
        }
        console.log('>> Search options (index:text):', optionTexts.map((t, i) => `${i}:${t}`).join(' | '));

        // klik opsi sesuai index
        await options[indexSearch].waitForClickable({ timeout: 50000 });
        console.log(`Selecting search option index ${indexSearch}:`, optionTexts[indexSearch]);
        await options[indexSearch].click();

        const input = await this.searchInput;
        await input.waitForDisplayed({ timeout: 5000 });
        await input.click();

        // pastikan kosong dulu
        try {
            await input.clearValue();
        } catch (e) {
            await input.setValue(['\u0008']);
        }

        await input.setValue(value);

        await this.searchButton.waitForClickable({ timeout: 5000 });
        await this.searchButton.click();

        // tunggu table ter-refresh (minimal ada row)
        await browser.waitUntil(async () => {
            const rows = await $$('table tbody tr');
            return rows.length > 0;
        }, { timeout: 7000, timeoutMsg: 'No rows after search (waitUntil timed out).' });

        await browser.pause(300);
    }

    // === Reset search bar + enter ===
    async resetSearchSuratMuatan() {
        const input = await this.searchInput;
        await input.waitForDisplayed({ timeout: 5000 });
        await input.click();

        // clear yang stabil
        await browser.keys(['Control', 'a']);
        await browser.keys('Backspace');

        // trigger reload/reset via Enter
        await browser.keys('Enter');

        // tunggu tabel balik muncul
        await browser.waitUntil(async () => {
        const rows = await $$('table tbody tr');
        return rows.length > 0;
        }, { timeout: 15000, timeoutMsg: 'Tabel tidak muncul setelah reset search.' });

        await browser.pause(300);
    }

    // ===== Read Date time Inventory =====
    async selectByDate(index) {
        await this.selectSearchByDate.waitForDisplayed({ timeout: 5000 });
        await this.selectSearchByDate.waitForClickable({ timeout: 5000 });
        await this.selectSearchByDate.click();

        const optionsPanel = await $('.vs-select__options');
        await optionsPanel.waitForDisplayed({ timeout: 5000 });

        const options = await optionsPanel.$$(`.//button[contains(@class,"vs-select__option")]`);
        if (options.length === 0) throw new Error('Tidak ada opsi di dropdown SM Status');
        if (index < 0 || index >= options.length) {
            throw new Error(`Index ${index} di luar range (0..${options.length - 1})`);
        }

        await options[index].waitForDisplayed({ timeout: 5000 });
        await options[index].waitForClickable({ timeout: 5000 });
        await options[index].click();   

        await browser.pause(500);
    }

    async applyDateFilterAndValidateMultipleBag({ start, end, scenarios }) {
        const results = [];

        for (const sc of scenarios) {
            await this.selectByDate(sc.filterIndex);

            await this.dateStartInput.waitForDisplayed({ timeout: 5000 });
            await this.dateStartInput.click();
            await browser.pause(500);

            await browser.execute((start, end) => {
                const startInput = document.querySelector('input[placeholder="Start Date"]');
                const endInput = document.querySelector('input[placeholder="End Date"]');
                if (!startInput || !endInput) throw new Error('Input date tidak ditemukan!');
                startInput.value = start;
                endInput.value = end;
                startInput.dispatchEvent(new Event('input', { bubbles: true }));
                endInput.dispatchEvent(new Event('input', { bubbles: true }));
            }, start, end);

            await this.btnOK.waitForClickable({ timeout: 5000 });
            await this.btnOK.click();
            await browser.pause(1000);

            const firstCell = await $('table tbody tr td');
            const firstText = await firstCell.getText();

            let values = [];

            if (firstText.includes('No matching records found')) {
                values = ['No matching records found'];
            } else {
                const rows = await $$(`table tbody tr td:nth-child(${sc.expectedColumn})`);
                for (const r of rows) {
                    values.push((await r.getText()).trim());
                }
            }

            results.push({
                filterIndex: sc.filterIndex,
                expectedColumn: sc.expectedColumn,
                values
            });
        }

        console.log('\n Rekap Hasil Filter Tanggal:');
        for (const r of results) {
            console.log(`Filter index ${r.filterIndex} | Kolom ${r.expectedColumn} | Total data: ${r.values.length}`);
            if (r.values[0] === 'No matching records found') {
                console.log('Tidak ada data pada rentang waktu tersebut');
            } else {
                console.log(`Data ditemukan (${r.values.length} baris)`);
            }
        }

        return results;
    }

    async checkPrint(soft = null) {
        const softCheck = async (label, fn) => {
            if (soft?.checkAsync) return soft.checkAsync(label, fn);
            return fn();
        };

        const firstRowCell = await $('table tbody tr:first-child td:nth-child(0)');
        await firstRowCell.waitForDisplayed({ timeout: 10000 });

        const SMNumber = (await firstRowCell.getText()).trim();
        console.log(`Nomor SM ditemukan di tabel: "${SMNumber}"`);

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
            return url.includes('print/');
        }, {
            timeout: 10000,
            timeoutMsg: 'Halaman print gagal dimuat.',
        });

        const currentUrl = await browser.getUrl();
        console.log(`URL print terdeteksi: ${currentUrl}`);

        const urlParts = currentUrl.split('/');
        const urlSuratMuatan = decodeURIComponent(urlParts[5] || '');
        console.log(`Nomor SM dari URL: ${urlSuratMuatan}`);

        await softCheck(
            `[Print SM] Nomor SM di URL (${urlSuratMuatan}) harus mengandung SMNumber tabel (${SMNumber})`,
            async () => {
                await expect(urlSuratMuatan).toContain(SMNumber);
            }
        );

        await browser.closeWindow();
        await browser.switchToWindow(mainHandle);
    }
}

export default new SuratMuatanPage();
