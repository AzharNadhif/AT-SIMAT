import { $, $$, browser, expect } from '@wdio/globals';
import assert from 'assert';

class ReceivingSMPage {

    get pageTitle () {
        return $('h2=Pre-Alert');
    }

    get selectBtnNode() {
        return $('div[data-testid="select-button-node"]');
    }

    get searchOrigin() {
        return $('div[data-testid="search-origin"]');
    }

    get searchBy() {
        return $$('[data-testid="select-search-by"]')[0];
    }

    get inputSearch() {
        return $('input[data-testid="input-search"]');
    }

    get btnReset() {
        return $('button[data-testid="button-reset-filter"]');
    }

    get searchButton() {
        return $('.bx.bx-search.search-input-icon')
    }

    get selectPreAlert(){
        return $('div[data-testid="multiple-select-pre-alert"]');
    }

    get searchOption() {
        return $('.vs-select__options');
    }

    get selectSearchByDate() {
        return $$('[data-testid="select-search-by"]')[1];
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
        return  $("//button[contains(@class,'el-picker-panel__link-btn')]//span[normalize-space()='OK']");
    }

   

    //  ===== ACTION READ PREALERT =====

    // Ambil semua opsi
    async getDropdownOptions(){
        return await this.searchOption.$$('.vs-select__option');
    }

    // Search Node
   async searchNode(indexSearch, value) {
        // Pilih dropdown utama sesuai index
        await this.selectBtnNode.waitForClickable({ timeout: 5000 });
        await this.selectBtnNode.click();

        await this.searchOption.waitForDisplayed({ timeout: 5000 });
        const options = await this.searchOption.$$(`.//button[contains(@class,"vs-select__option")]`);
        if (options.length === 0) throw new Error('Tidak ada opsi di dropdown.');
        if (indexSearch < 0 || indexSearch >= options.length) {
            throw new Error(`Index ${indexSearch} di luar range (0..${options.length - 1}).`);
        }

        // log semua opsi
        const optionTexts = [];
        for (let i = 0; i < options.length; i++) {
            optionTexts.push((await options[i].getText()).trim());
        }
        console.log('>> Search options (index:text):', optionTexts.map((t,i)=> `${i}:${t}`).join(' | '));

        // klik opsi sesuai index
        await options[indexSearch].waitForClickable({ timeout: 5000 });
        await options[indexSearch].click();
        await browser.pause(300);

        // Pilih opsi searchOrigin langsung dari dropdown
        const searchOriginDropdown = await this.searchOrigin;
        await searchOriginDropdown.waitForClickable({ timeout: 5000 });
        await searchOriginDropdown.click();

        await browser.pause(300);

        const searchOptions = await $$('div.vs-select__options button.vs-select__option');
        let targetOption = null;
        for (const opt of searchOptions) {
            const text = (await opt.getText()).trim();
            if (text === value.trim()) {
                targetOption = opt;
                break;
            }
        }

        if (!targetOption) {
            console.log('Opsi searchOrigin muncul:', await Promise.all(searchOptions.map(async o => (await o.getText()).trim())));
            throw new Error(`Opsi "${value}" tidak ditemukan di searchOrigin dropdown.`);
        }

        await targetOption.waitForClickable({ timeout: 5000 });
        await targetOption.click();
        console.log(`Selected searchOrigin option: "${value}"`);

        // tunggu table refresh
        await browser.waitUntil(async () => {
            const rows = await $$('table tbody tr');
            return rows.length > 0;
        }, { timeout: 7000, timeoutMsg: 'No rows after search (waitUntil timed out).' });

        await browser.pause(300);
    }



    //  Searh Prealert
    async searchPrealert(indexSearch, value) {
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
        console.log('>> Search options (index:text):', optionTexts.map((t,i)=> `${i}:${t}`).join(' | '));

        // klik opsi sesuai index
        await options[indexSearch].waitForClickable({ timeout: 50000 });
        console.log(`Selecting search option index ${indexSearch}:`, optionTexts[indexSearch]);
        await options[indexSearch].click();

        const input = await this.inputSearch;
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

        // tunggu table ter-refresh (minimal ada row) — safer than fixed pause
        await browser.waitUntil(async () => {
            const rows = await $$('table tbody tr');
            return rows.length > 0;
        }, { timeout: 7000, timeoutMsg: 'No rows after search (waitUntil timed out).' });

        // beri waktu render kecil
        await browser.pause(300);
    }

    // Open dropdown
    async openPrealert(optionText = null) {
        const dropdown = this.selectPreAlert;
        const arrow = await $('[data-testid="multiple-select-pre-alert"] .vs-icon-arrow');

        await dropdown.waitForDisplayed({ timeout: 5000 });
        await dropdown.waitForClickable({ timeout: 5000 });

        // Hapus semua chip aktif sebelum pilih baru
        const activeChips = await $$('.vs-select__chips__chip');
        if (activeChips.length > 0) {
            for (const chip of activeChips) {
                const closeBtn = await chip.$('.vs-select__chips__chip__close');
                if (await closeBtn.isExisting()) {
                    await closeBtn.waitForClickable({ timeout: 5000 });
                    await closeBtn.click();
                    // console.log(`Uncheck chip: ${await chip.getText()}`);
                    await browser.pause(200);
                }
            }
        }

        // Buka dropdown
        await arrow.waitForClickable({ timeout: 5000 });
        await arrow.click();
        await browser.pause(300);

        const options = await this.getDropdownOptions();
        if (options.length === 0) throw new Error('Tidak ada opsi di dropdown.');

        // Pilih opsi berdasarkan teks
        let optToClick = null;
        for (const opt of options) {
            const text = (await opt.getText()).trim().toUpperCase();
            if (text === optionText.toUpperCase()) {
                optToClick = opt;
                break;
            }
        }

        if (!optToClick) throw new Error(`Opsi "${optionText}" tidak ditemukan di dropdown.`);

        await optToClick.waitForClickable({ timeout: 5000 });
        await optToClick.click();
        console.log(`Klik opsi baru: ${optionText}`);

        await browser.pause(500);
    }

    // Dropdown option
    getColumnDropdown(testId){
        return $(`div[data-testid="select-${testId}"]`);
    }

    //  Open dropdown status Prealert
    async openDropdownFilter(testId, indexSearch = null) {
        const dropdownFilter = this.getColumnDropdown(testId);
        await dropdownFilter.waitForDisplayed({ timeout: 5000 });
        await dropdownFilter.waitForClickable({ timeout: 5000 });
        await dropdownFilter.click(); 

        await this.searchOption.waitForDisplayed({ timeout: 5000 });
        await browser.pause(300);

        const options = await this.searchOption.$$('.vs-select__option');
        if (options.length === 0) throw new Error('Tidak ada opsi di dropdown.');

        // Kalau indexSearch null → klik semua opsi
        if (indexSearch === null) {
            console.log(`Klik semua ${options.length} opsi pada dropdown "${testId}"`);
            for (let i = options.length - 1; i >= 0; i--) {
                await dropdownFilter.click();
                await this.searchOption.waitForDisplayed({ timeout: 5000 });
                const currentOptions = await this.searchOption.$$('.vs-select__option');

                await currentOptions[i].waitForClickable({ timeout: 5000 });
                await currentOptions[i].click();
                console.log(`Opsi ke-${i} (${await currentOptions[i].getText()}) berhasil diklik`);
                await browser.pause(300);
            }
            return;
        }

        // Kalau pakai index tertentu
        if (indexSearch < 0 || indexSearch >= options.length) {
            throw new Error(`Index ${indexSearch} di luar range (0..${options.length - 1}).`);
        }

        await options[indexSearch].waitForClickable({ timeout: 5000 });
        await options[indexSearch].click();
        console.log(`Berhasil pilih opsi index ${indexSearch} (${await options[indexSearch].getText()})`);
    }


    // ===== Read Date time Inventory
    // Select By Date
    async selectByDate(index) {
        await this.selectSearchByDate.waitForDisplayed({ timeout: 5000 });
        await this.selectSearchByDate.waitForClickable({ timeout: 5000 });
        await this.selectSearchByDate.click();

        const optionsPanel = await $('.vs-select__options');
        await optionsPanel.waitForDisplayed({ timeout: 5000 });

        const options = await optionsPanel.$$(`.//button[contains(@class,"vs-select__option")]`);
        if (options.length === 0) throw new Error('Tidak ada opsi di dropdown Bag Status');
        if (index < 0 || index >= options.length) {
            throw new Error(`Index ${index} di luar range (0..${options.length - 1})`);
        }

        await options[index].waitForDisplayed({ timeout: 5000 });
        await options[index].waitForClickable({ timeout: 5000 });
        await options[index].click();

        await browser.pause(500);
    }
    // Date filter
    async applyDateFilterAndValidateMultipleBag({ start, end, scenarios }) {
        const results = [];

        for (const sc of scenarios) {
            // 1. Pilih filter by index
            await this.selectByDate(sc.filterIndex);

            // 2. Input range tanggal
            await this.dateStartInput.waitForDisplayed({ timeout: 5000 });
            await this.dateStartInput.click();
            await browser.pause(500);

            await browser.execute((start, end) => {
                const startInput = document.querySelector('input[placeholder="Start Date"]');
                const endInput   = document.querySelector('input[placeholder="End Date"]');
                if (!startInput || !endInput) throw new Error('Input date tidak ditemukan!');
                startInput.value = start;
                endInput.value   = end;
                startInput.dispatchEvent(new Event('input', { bubbles: true }));
                endInput.dispatchEvent(new Event('input', { bubbles: true }));
            }, start, end);

            // 3. Klik tombol OK
            await this.btnOK.waitForClickable({ timeout: 5000 });
            await this.btnOK.click();
            await browser.pause(1000);

            // 4. Cek apakah tabel berisi pesan "No matching records found"
            const firstCell = await $('table tbody tr td');
            const firstText = await firstCell.getText();

            let values = [];

            if (firstText.includes('No matching records found')) {
                values = ['No matching records found'];
                // console.log(`Filter index ${sc.filterIndex}, kolom ${sc.expectedColumn}: Tidak ada data (${start} s/d ${end})`);
            } else {
                // 5. Kalau ada data, ambil semua isi kolom
                const rows = await $$(`table tbody tr td:nth-child(${sc.expectedColumn})`);
                for (const r of rows) {
                    values.push((await r.getText()).trim());
                }
            }

            // Simpan hasil ke array
            results.push({
                filterIndex: sc.filterIndex,
                expectedColumn: sc.expectedColumn,
                values
            });
        }

        // 6. Tampilkan rekap semua hasil di akhir (biar di Allure dan log kelihatan rapi)
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






}

export default new ReceivingSMPage();