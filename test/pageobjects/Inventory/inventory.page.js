import { $, $$, browser, expect } from '@wdio/globals';
import assert from 'assert';

class InventoryPage {
    // ====== DEKLARASI ======
    // get Navbar Aktif 
    get navbarActive() {
        return $('button.vs-navbar__item.active');
    }

    // Button Navbar Connote
    get btnConnote() {
        return $('button[data-testid="nav-k-CONNOTE"]');
    }

    // pagetitle
    get pageTitle() {
        return $('h2=Connote');
    }

    // get select-searchBy
    get searchBy() {
        return $('div[data-testid="select-search-by"]');
    }

    // Option Search By
    get searchOption() {
        return $('.vs-select__options');
    }

    // button search
    get searchButton() {
        return $('.bx.bx-search.search-input-icon')
    }

    // get search input
    get searchInput() {
        return $('input[data-testid="input-search"]');
    }

    // get bag status
    get bagStatus() {
        return $('//div[@data-testid="select-bag-status-by"]');
    }

    // get status koli
    get inventoryStatus() {
        return $('//div[@data-testid="select-inventory-status-by"]');
    }

    // get Inventory date status
    get dateStatus() {
        return $('//div[@data-testid="select-filter-date-by"]')
    }

    // get date koli
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

    // ==================== ACTION MAIN ====================
    // Expect untuk mengubah ke format tanggal saja
    async toDateOnly(date) {
        return new Date(date.toISOString().split("T")[0]); // yyyy-mm-dd 00:00:00
    }

    // Validasi Navar Active
    async validateActiveNavbar(expectedTestId) {
        const activeTestId = await this.navbarActive.getAttribute('data-testid');
        expect(activeTestId).toEqual(expectedTestId);
    }

    // =============== INVENTORY KOLI =============== 

    // ==== Read Status Bag 
    // Ambil cell Bag row pertama
    async getAllBagCellValues() {
        // Ambil baris pertama (tr[1])
        // Lalu ambil sel kedua (td[2]) di dalam baris itu
        const cellSelector = '//table/tbody/tr[1]/td[3]';
        const cell = await $(cellSelector);
        
        // Pastikan elemen ada sebelum mengambil teksnya
        if (!await cell.isExisting()) {
        return [];
        }

        const value = (await cell.getText()).trim();
        
        // Kembalikan dalam bentuk array, seperti fungsi sebelumnya
        return [value];
    }
    // Pilih opsi di dropdown
    async selectBagStatusByIndex(index) {
        // Scroll & klik dropdown
        // await this.bagStatus.scrollIntoView();
        await this.bagStatus.waitForDisplayed({ timeout: 5000 });
        await this.bagStatus.waitForClickable({ timeout: 5000 });
        await this.bagStatus.click();

        // Tunggu panel muncul
        const optionsPanel = await $('.vs-select__options'); // container selalu ada
        await optionsPanel.waitForDisplayed({ timeout: 5000 });

        // Ambil semua opsi di dalam panel
        const options = await optionsPanel.$$(`.//button[contains(@class,"vs-select__option")]`);
        if (options.length === 0) throw new Error('Tidak ada opsi di dropdown Bag Status');
        if (index < 0 || index >= options.length) {
            throw new Error(`Index ${index} di luar range (0..${options.length - 1})`);
        }

        // await options[index].scrollIntoView();
        await options[index].waitForDisplayed({ timeout: 5000 });
        await options[index].waitForClickable({ timeout: 5000 });
        await options[index].click();

        await browser.pause(500);
    }
    // Validasi sesuai pilihan
    async validateBagColumn(option) {
        const values = await this.getAllBagCellValues();

        if (option === "Is In Bag") {
            // Semua baris harus ada value
            for (const val of values) {
                if (!val) throw new Error(`Expected Bag cell to have value, but got empty`);
            }
        } else if (option === "Not In Bag") {
            // Semua baris harus kosong atau berisi "-"
            for (const val of values) {
                // Periksa jika nilai tidak kosong DAN tidak sama dengan "-"
                if (val && val !== "-") {
                    throw new Error(`Expected Bag cell to be empty or "-", but got "${val}"`);
                }
            }
        }else if (option === "All Bag") {
            // Bisa campuran, log untuk info
            console.log(`All Bag selected → Bag column values:`, values);
        }
    }

    // ===== Read Inventory Status
    // Ambil cell Status row pertama
    async getAllCellStatus() {
        // Ambil baris pertama (tr[1])
        // Lalu ambil sel kedua (td[2]) di dalam baris itu
        const cellSelector = '//table/tbody/tr[1]/td[23]';
        const cell = await $(cellSelector);
        
        // Pastikan elemen ada sebelum mengambil teksnya
        if (!await cell.isExisting()) {
        return [];
        }

        const value = (await cell.getText()).trim();
        
        // Kembalikan dalam bentuk array, seperti fungsi sebelumnya
        return [value];
    }
    // Pilih opsi di dropdown
    async selectInventoryStatus(index) {
        // Scroll & klik dropdown
        await this.inventoryStatus.waitForDisplayed({ timeout: 5000 });
        await this.inventoryStatus.waitForClickable({ timeout: 5000 });
        await this.inventoryStatus.click();

        // Tunggu panel muncul
        const optionsPanel = await $('.vs-select__options'); // container selalu ada
        await optionsPanel.waitForDisplayed({ timeout: 5000 });

        // Ambil semua opsi di dalam panel
        const options = await optionsPanel.$$(`.//button[contains(@class,"vs-select__option")]`);
        if (options.length === 0) throw new Error('Tidak ada opsi di dropdown Bag Status');
        if (index < 0 || index >= options.length) {
            throw new Error(`Index ${index} di luar range (0..${options.length - 1})`);
        }

        // await options[index].scrollIntoView();
        await options[index].waitForDisplayed({ timeout: 5000 });
        await options[index].waitForClickable({ timeout: 5000 });
        await options[index].click();

        await browser.pause(500);
    }
    // Validasi sesuai pilihan
    async validateStatusColumn(option) {
        const values = await this.getAllCellStatus();

        if (option === "Confirmed") {
            // Semua baris harus confirmed
            for (const val of values) {
                if (val !== "Confirmed") throw new Error(`Expected Status cell to have Confirmed, but got empty`);
            }
        } else if (option === "Unconfirmed") {
            // Semua baris harus Unconfirmed
            for (const val of values) {
                if (val !== "Unconfirmed") {
                    throw new Error(`Expected Status cell to have Unconfirmed"`);
                }
            }
        }else if (option === "All Status") {
            // Bisa campuran, log untuk info
            console.log(`All Status selected -> Status column values:`, values);
        }
    }

    // ===== Read Date time Inventory
    // Pilih opsi di dropdown
    async selectFilterDate(index) {
        // Scroll & klik dropdown
        await this.dateStatus.waitForDisplayed({ timeout: 5000 });
        await this.dateStatus.waitForClickable({ timeout: 5000 });
        await this.dateStatus.click();

        // Tunggu panel muncul
        const optionsPanel = await $('.vs-select__options'); // container selalu ada
        await optionsPanel.waitForDisplayed({ timeout: 5000 });

        // Ambil semua opsi di dalam panel
        const options = await optionsPanel.$$(`.//button[contains(@class,"vs-select__option")]`);
        if (options.length === 0) throw new Error('Tidak ada opsi di dropdown Bag Status');
        if (index < 0 || index >= options.length) {
            throw new Error(`Index ${index} di luar range (0..${options.length - 1})`);
        }

        // await options[index].scrollIntoView();
        await options[index].waitForDisplayed({ timeout: 5000 });
        await options[index].waitForClickable({ timeout: 5000 });
        await options[index].click();

        await browser.pause(500);
    }
    // Date range + filter date
    async applyDateFilterAndValidateMultiple({ start, end, scenarios }) {
        const results = [];

        for (const sc of scenarios) {
            // 1. Pilih filter by index
            await this.selectFilterDate(sc.filterIndex);

            // 2. Input range tanggal
            await this.dateStartInput.waitForDisplayed({ timeout: 5000 });
            await this.dateStartInput.click();
            await browser.pause(500); // tunggu popup muncul

            await browser.execute((start, end) => {
                const startInput = document.querySelector('input[placeholder="Start Date"]');
                const endInput   = document.querySelector('input[placeholder="End Date"]');

                if (!startInput || !endInput) throw new Error('Input date tidak ditemukan!');

                startInput.value = start;
                endInput.value   = end;

                startInput.dispatchEvent(new Event('input', { bubbles: true }));
                endInput.dispatchEvent(new Event('input', { bubbles: true }));
            }, start, end);

            // Klik tombol OK untuk apply date
            await this.btnOK.waitForClickable({ timeout: 5000 });
            await this.btnOK.click();
            await browser.pause(500);

            // 3. Ambil semua row di kolom sesuai urutan (expectedColumn = nomor kolom di table)
            const rows = await $$(`table tbody tr td:nth-child(${sc.expectedColumn})`);
            if (rows.length === 0) throw new Error(`Tidak ada data di tabel untuk filter index ${sc.filterIndex}!`);

            const values = [];
            for (const r of rows) {
                values.push((await r.getText()).trim());
            }

            console.log(`Filter index ${sc.filterIndex}, kolom ${sc.expectedColumn}:`, values);

            // 4. Tambahkan hasil ke array
            results.push({
                filterIndex: sc.filterIndex,
                expectedColumn: sc.expectedColumn,
                values
            });
        }

        return results;
    }

    // ===== Search By
    async searchInventoryKoli(indexSearch, value) {
        await this.searchBy.waitForClickable({ timeout: 5000 });
        await this.searchBy.click();

        await this.searchOption.waitForDisplayed({ timeout: 5000 });

        const options = await this.searchOption.$$(`.//button[contains(@class,"vs-select__option")]`);
        if (options.length === 0) throw new Error('Tidak ada opsi di dropdown.');
        if (indexSearch < 0 || indexSearch >= options.length) {
            throw new Error(`Index ${indexSearch} di luar range (0..${options.length - 1}).`);
        }

        // debug: log semua opsi untuk memastikan mapping index benar
        const optionTexts = [];
        for (let i = 0; i < options.length; i++) {
            optionTexts.push((await options[i].getText()).trim());
        }
        console.log('>> Search options (index:text):', optionTexts.map((t,i)=> `${i}:${t}`).join(' | '));

        // klik opsi sesuai index
        await options[indexSearch].waitForClickable({ timeout: 50000 });
        console.log(`>> Selecting search option index ${indexSearch}:`, optionTexts[indexSearch]);
        await options[indexSearch].click();

        const input = await this.searchInput;
        await input.waitForDisplayed({ timeout: 5000 });
        await input.click();

        // pastikan kosong dulu
        try {
            await input.clearValue();
        } catch (e) {
            // some drivers may not support clearValue; fallback: setValue with \u0008 to try clear
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

    // ========== INVENTORY CONNOTE ===========

   // Ambil semua nilai Bag dari row expand (setelah klik tr pertama)
    async getAllBagCellValuesConnote() {
        // Klik row pertama
        const firstRow = await $('//table/tbody/tr[1]');
        await firstRow.click();

        // Tunggu expand muncul
        const expandContent = await $('.vs-table__expand__td__content__sub');
        await expandContent.waitForDisplayed({ timeout: 5000 });

        // Ambil kolom Bag dari setiap baris expand (kolom ke-2)
        const bagCells = await $$('//div[contains(@class,"vs-table__expand__td__content__sub")]//table//tr/td[2]//ul/li/p');

        if (bagCells.length === 0) {
            throw new Error("Tidak menemukan cell Bag di tabel expand!");
        }

        const values = [];
        for (const cell of bagCells) {
            let txt = (await cell.getText()).trim();
            if (!txt) {
                // fallback: ambil innerHTML kalau text kosong
                txt = (await cell.getHTML(false)).trim();
            }
            values.push(txt);
        }

        return values;
    }

    // Validate Connote Row → cek kolom Bag sesuai option
    async validateBagColumnConnote(option) {
        const values = await this.getAllBagCellValuesConnote();

        if (option === "Is In Bag") {
            for (const val of values) {
                if (!val) {
                    throw new Error(`Expected Bag cell to have value, but got empty, but got "${val}"`);
                }
            }
        } else if (option === "Not In Bag") {
            for (const val of values) {
                if (val && val !== "-") {
                    throw new Error(`Expected Bag cell to be empty or "-", but got "${val}"`);
                }
            }
        } else if (option === "All Bag") {
            console.log(`All Bag selected → Bag column values:`, values);
        }
    }

    // Ambil semua nilai Bag dari row expand (setelah klik tr pertama)
    async getAllCellStatusConnote() {
        // Klik row pertama
        const firstRow = await $('//table/tbody/tr[1]');
        await firstRow.click();

        // Tunggu expand muncul
        const expandContent = await $('.vs-table__expand__td__content__sub');
        await expandContent.waitForDisplayed({ timeout: 5000 });

        // Ambil kolom Status dari setiap baris expand (kolom ke-2)
        const statusCells = await $$('//div[contains(@class,"vs-table__expand__td__content__sub")]//table//tr/td[7]//ul/li/p');

        // Pastikan elemen ada sebelum mengambil teksnya
        if (statusCells.length === 0) {
            throw new Error("Tidak menemukan cell Bag di tabel expand!");
        }

        const values = [];
        for (const cell of statusCells) {
            let txt = (await cell.getText()).trim();
            if (!txt) {
                // fallback: ambil innerHTML kalau text kosong
                txt = (await cell.getHTML(false)).trim();
            }
            values.push(txt);
        }

        return values;
    }

    // Validasi sesuai pilihan
    async validateStatusColumnConnote(option) {
        const values = await this.getAllCellStatusConnote();

        if (option === "Confirmed") {
            // Semua baris harus confirmed
            for (const val of values) {
                if (val !== "Confirmed") throw new Error(`Expected Status cell to have Confirmed, but got empty`);
            }
        } else if (option === "Unconfirmed") {
            // Semua baris harus Unconfirmed
            for (const val of values) {
                if (val !== "Unconfirmed") {
                    throw new Error(`Expected Status cell to have Unconfirmed"`);
                }
            }
        }else if (option === "All Status") {
            // Bisa campuran, log untuk info
            console.log(`All Status selected → Status column values:`, values);
        }
    }

    // ==================== GET INVENTORY BAG ====================
    // pagetitle
    get bagPageTitle() {
        return $('h2=Bag');
    }
    
    // Button Navbar Connote
    get btnBag() {
        return $('[data-testid="tab-1"]');
    }

    get btnMasterbag() {
        return $('button[data-testid="nav-k-MASTERBAG"]');
    }

    get codeOrigin() {
        return $('div[data-testid="select-code_origin"]');
    }

    get codeDestination() {
        return $('div[data-testid="select-code_destination"]');
    }

    get selectSearchByDate() {
        return $('div[data-testid="select-search-by-date"]');
    }

    get btnPrint() {
        return $('button[data-testid="print-button-1"]');
    }


    // ================ ACTION BAG ================
    
    // Fill code origin
    async fillCodeOriginMasterbag(value) {
        await this.codeOrigin.waitForDisplayed({ timeout: 5000 });
        await this.codeOrigin.waitForClickable({ timeout: 5000 });
        await this.codeOrigin.click();

        // ketik nilai input
        await browser.keys(value);
        await browser.pause(2000);
        await browser.keys(['ArrowDown', 'Enter']);

        // tunggu tabel tampil dan validasi kolom ke-12
        const firstRowCell = await $('table tbody tr:first-child td:nth-child(13)');
        await firstRowCell.waitForDisplayed({ timeout: 10000 });

        const text = await firstRowCell.getText();
        console.log(`Baris pertama kolom ke-13: "${text}"`);

        // validasi: pastikan teks mengandung value yang diinput
        if (!text.includes(value)) {
            throw new Error(`Validasi gagal! Kolom ke-13 tidak mengandung "${value}", ditemukan: "${text}"`);
        }

        console.log(`Validasi berhasil: kolom ke-13 mengandung "${value}"`);
    }

    // fill code Destination
    async fillCodeDestinationMasterbag(value){
        await this.codeDestination.waitForDisplayed({timeout:5000});
        await this.codeDestination.waitForClickable({timeout:5000});
        await this.codeDestination.click();

        await browser.keys(value);
        await browser.pause(2000);
        await browser.keys(['ArrowDown', 'Enter']);

        // tunggu tabel tampil dan validasi kolom ke-12
        const firstRowCell = await $('table tbody tr:first-child td:nth-child(15)');
        await firstRowCell.waitForDisplayed({ timeout: 10000 });

        const text = await firstRowCell.getText();
        console.log(`Baris pertama kolom ke-15: "${text}"`);

        // validasi: pastikan teks mengandung value yang diinput
        if (!text.includes(value)) {
            throw new Error(`Validasi gagal! Kolom ke-15 tidak mengandung "${value}", ditemukan: "${text}"`);
        }

        console.log(`Validasi berhasil: kolom ke-15 mengandung "${value}"`);
    }

    // Fill code origin
    async fillCodeOriginBag(value) {
        await this.codeOrigin.waitForDisplayed({ timeout: 5000 });
        await this.codeOrigin.waitForClickable({ timeout: 5000 });
        await this.codeOrigin.click();

        // ketik nilai input
        await browser.keys(value);
        await browser.pause(2000);
        await browser.keys(['ArrowDown', 'Enter']);

        // tunggu tabel tampil dan validasi kolom ke-12
        const firstRowCell = await $('table tbody tr:first-child td:nth-child(12)');
        await firstRowCell.waitForDisplayed({ timeout: 10000 });

        const text = await firstRowCell.getText();
        console.log(`Baris pertama kolom ke-12: "${text}"`);

        // validasi: pastikan teks mengandung value yang diinput
        if (!text.includes(value)) {
            throw new Error(`Validasi gagal! Kolom ke-12 tidak mengandung "${value}", ditemukan: "${text}"`);
        }

        console.log(`Validasi berhasil: kolom ke-12 mengandung "${value}"`);
    }

    // fill code Destination
    async fillCodeDestinationBag(value){
        await this.codeDestination.waitForDisplayed({timeout:5000});
        await this.codeDestination.waitForClickable({timeout:5000});
        await this.codeDestination.click();

        await browser.keys(value);
        await browser.pause(2000);
        await browser.keys(['ArrowDown', 'Enter']);
        await browser.pause(2000);

        // tunggu tabel tampil dan validasi kolom ke-12
        const firstRowCell = await $('table tbody tr:first-child td:nth-child(14)');
        await firstRowCell.waitForDisplayed({ timeout: 10000 });

        const text = await firstRowCell.getText();
        console.log(`Baris pertama kolom ke-14: "${text}"`);

        // validasi: pastikan teks mengandung value yang diinput
        if (!text.includes(value)) {
            throw new Error(`Validasi gagal! Kolom ke-14 tidak mengandung "${value}", ditemukan: "${text}"`);
        }

        console.log(`Validasi berhasil: kolom ke-14 mengandung "${value}"`);
    }

    // Dropdown option
    getColumnDropdown(testId){
        return $(`div[data-testid="select-${testId}"]`);
    }

    // Open dropdown
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

    // === Check Print
    async checkPrint() {
        // Ambil nilai Bag dari tabel (kolom pertama baris pertama)
        const firstRowCell = await $('table tbody tr:first-child td:nth-child(1)');
        await firstRowCell.waitForDisplayed({ timeout: 10000 });
        const bagNumber = await firstRowCell.getText();
        console.log(`Nomor bag ditemukan di tabel: "${bagNumber}"`);

        // Klik tombol Print
        await this.btnPrint.waitForDisplayed({ timeout: 5000 });
        await this.btnPrint.waitForClickable({ timeout: 5000 });
        await this.btnPrint.click();

        // Simpan handle utama
        const mainHandle = await browser.getWindowHandle();

        // Tunggu tab baru terbuka
        await browser.waitUntil(async () => (await browser.getWindowHandles()).length > 1, {
            timeout: 15000,
            timeoutMsg: 'Tab print tidak terbuka.',
        });

        // Pindah ke tab print
        const handles = await browser.getWindowHandles();
        const printHandle = handles.find(h => h !== mainHandle);
        await browser.switchToWindow(printHandle);

        // Tunggu URL print muncul
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('print/');
        }, {
            timeout: 10000,
            timeoutMsg: 'Halaman print gagal dimuat.',
        });

        const currentUrl = await browser.getUrl();
        console.log(`URL print terdeteksi: ${currentUrl}`);

        // Ambil nomor bag dari URL
        // Misal URL: https://core-staging.jne.co.id/print/BAGNUMBERXXX/bag/84185
        const urlParts = currentUrl.split('/');
        // Bag number biasanya di bagian index 4 (setelah /print/)
        let urlBagNumber = decodeURIComponent(urlParts[4]);
        console.log(`Nomor bag dari URL: ${urlBagNumber}`);

        // Validasi terhadap tabel
        expect(urlBagNumber).toContain(bagNumber);
        console.log('Nomor bag pada halaman print sesuai dengan tabel.');

        // Tutup tab print dan kembali ke tab utama
        await browser.closeWindow();
        await browser.switchToWindow(mainHandle);
    }

    async switchToMasterbag() {
        await this.btnMasterbag.waitForDisplayed({ timeout: 5000 });
        await this.btnMasterbag.waitForClickable({ timeout: 5000 });
        await this.btnMasterbag.click();
            
    }


    // ======= TRACE BAG ========
    get titleModalTraceBag() {
        return $('.title-helper');
    }

    get btnTraceBag() {
        return $('button[data-testid="trace_bag-button-0"]');
    }

    async openTraceBag() {
        // Ambil nilai Bag dari tabel (kolom pertama baris pertama)
        const firstRowCell = await $('table tbody tr:first-child td:nth-child(1)');
        await firstRowCell.waitForDisplayed({ timeout: 10000 });
        const bagNumber = await firstRowCell.getText();
        console.log(`Nomor bag ditemukan di tabel: "${bagNumber}"`);

        // Klik tombol TraceBag
        await this.btnTraceBag.waitForDisplayed({ timeout: 5000 });
        await this.btnTraceBag.waitForClickable({ timeout: 5000 });
        await this.btnTraceBag.click();
        // Validasi Title Modal Tracebag
        await  this.titleModalTraceBag.waitForDisplayed({timeout:5000});
        await expect(await this.titleModalTraceBag.getText()).toBe('Trace Bag Activity');
    }




}

export default new InventoryPage();

