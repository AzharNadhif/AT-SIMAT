import NavigationFlow from '../../helpers/navigationflow.js';
import SoftError from '../../helpers/softerror.js';
import TotalColumnPage from '../../pageobjects/Main/totalcolumn.page.js';
import { $, $$, browser, expect } from '@wdio/globals';
import SuratmuatanPage from '../../pageobjects/Surat-Muatan/suratmuatan.page.js';

describe('AT-CORE-0022', () => {
    let testData;

    before(async () => {
        // Login and Flow
        await NavigationFlow.loginAndNavigateToSuratMuatan();
    });

    describe('AT-CORE-0022-01', () => {
        
        it('Read Data Table Surat Muatan', async () => {
            const tests = [
                { index: 1, value: 'DARAT' }, // Type SM 
                { index: 2, value: 'UDARA' }, // Jenis Kiriman 
                { index: 3, value: 'BANDUNG' }, // Origin 
                { index: 4, value: 'SURABAYA' }, // Destination 
                { index: 5, value: '1' }, // Weight 
                { index: 6, value: 'RECEIVED' }, // Status 
                { index: 0, value: 'SMDT-AW5SEP2025' }, // Manifest Number
            ];

            for (const { index, value } of tests) {
                console.log(`\n [${index}] Searching for "${value}"`);

                await SuratmuatanPage.searchSuratMuatan(index, value);

                await browser.waitUntil(async () => {
                    const rows = await $$('table tbody tr');
                    return rows.length > 0;
                }, { timeout: 15000, timeoutMsg: ` Tabel tidak muncul untuk value "${value}"` });

                await browser.pause(1000);

                const rows = await $$('table tbody tr');
                const rowTexts = [];
                for (const row of rows) {
                    const text = (await row.getText()).trim();
                    if (text) rowTexts.push(text);
                }

                console.log(`Hasil table untuk "${value}":`, rowTexts.slice(0, 3)); // log contoh isi

                const normalizedValue = value.trim().toUpperCase();
                const found = rowTexts.some(text => text.toUpperCase().includes(normalizedValue));

                if (!found) {
                    console.log(`Value "${value}" tidak ditemukan.`);
                    console.log('Isi tabel penuh:\n', rowTexts.join('\n'));
                }

                expect(found).toBe(true);

                console.log(`Value "${value}" ditemukan di tabel`);

                await TotalColumnPage.validateTotalMatchesRows();

                // reset search setelah selesai 1 iterasi
                await SuratmuatanPage.resetSearchSuratMuatan();

            }

            // Validate Status Column after selecting status options'
            const statusOptions = ['UNAPPROVED', 'RECEIVED', 'OUTSTANDING', 'UNRECEIVED', 'CANCELED', 'MISSROUTE RECEIVED'];

            for (const status of statusOptions) {
                console.log(`\n Memilih status: ${status}`);

                //  Buka dropdown & pilih opsi
                await SuratmuatanPage.openDropdownFilter('status', status);

                //  Tunggu tabel reload / refresh
                await browser.pause(8000); // bisa diganti pakai waitUntil untuk lebih stabil

                //  Ambil kolom 2 dari tabel
                const cells = await $$('table tbody tr td:nth-child(2)');
                if (!cells || cells.length === 0) {
                    console.warn(' Tidak ada baris tabel ditemukan.');
                    continue; // skip validasi
                }

                const cellTexts = [];
                for (const c of cells) {
                    cellTexts.push((await c.getText()).trim().toUpperCase());
                }

                console.log(`Hasil table untuk status "${status}":`, cellTexts);

                //  Validasi semua cell sesuai status yang dipilih
                const allMatch = cellTexts.every(t => t.includes(status.toUpperCase()));
                expect(allMatch).toBe(true);

                console.log(` Semua cell di kolom 2 sesuai status "${status}"`);
            }
            await SuratmuatanPage.resetDropdownFilter('status');

            // Validate Route Column after selecting route options
            const routeOptions = ['TRANSIT', 'DIRECT'];

            for (const route of routeOptions) {
                console.log(`\n Memilih Route: ${route}`);

                //  Buka dropdown & pilih opsi
                await SuratmuatanPage.openDropdownFilter('route', route);

                //  Tunggu tabel reload / refresh
                await browser.pause(500); // bisa diganti pakai waitUntil untuk lebih stabil

                //  Ambil kolom 2 dari tabel
                const cells = await $$('table tbody tr td:nth-child(8)');
                if (!cells || cells.length === 0) {
                    console.warn(' Tidak ada baris tabel ditemukan.');
                    continue; // skip validasi
                }

                let allMatch = true;
                const hasilValidasi = [];

                for (const cell of cells) {
                    const spans = await cell.$$('span');
                    const texts = [];

                    for (const s of spans) {
                        const t = (await s.getText()).trim().toUpperCase();
                        if (t) texts.push(t);
                    }

                    // Simpan hasil tiap baris untuk debug
                    hasilValidasi.push(texts.join(' | '));

                    const hasTransit = texts.includes('TRANSIT');

                    if (route === 'TRANSIT') {
                        // Saat memilih TRANSIT, setiap cell HARUS ada "TRANSIT"
                        if (!hasTransit) {
                            allMatch = false;
                            console.log(` Baris tanpa TRANSIT: ${texts}`);
                        }
                    } else if (route === 'DIRECT') {
                        // Saat memilih DIRECT, tidak boleh ada "TRANSIT"
                        if (hasTransit) {
                            allMatch = false;
                            console.log(` Baris seharusnya DIRECT tapi ada TRANSIT: ${texts}`);
                        }
                    }
                }

                console.log(` Hasil kolom 8 untuk route "${route}":`, hasilValidasi);
                expect(allMatch).toBe(true);
                console.log(` Semua cell kolom 8 valid untuk route "${route}"`);
            }
            await SuratmuatanPage.resetDropdownFilter('route');

            // Validate Date Range + Filter Date
            const startDate = "2025-09-01";
            const endDate   = "2025-09-30";

            const scenarios = [
                { filterIndex: 1, expectedColumn: 12 }, // ETD
                { filterIndex: 2, expectedColumn: 13 }, // ETA
                { filterIndex: 0, expectedColumn: 20 }, // Created Date
            ];

            const results = await SuratmuatanPage.applyDateFilterAndValidateMultipleBag({
                start: startDate,
                end: endDate,
                scenarios
            });

            const startDateObj = new Date(startDate);
            const endDateObj   = new Date(endDate);

            for (const v of results) {
                if (!v || typeof v !== 'string') continue; // pastikan string dan tidak kosong

                // ambil bagian tanggal saja (YYYY-MM-DD)
                const datePart = v.split(' ')[0];
                const cellDate = new Date(datePart);

                expect(cellDate >= startDateObj).toBe(true);
                expect(cellDate <= endDateObj).toBe(true);
            }
        });
        
    });
    after(async () => { 
        console.log('Test suite completed');
    });
});