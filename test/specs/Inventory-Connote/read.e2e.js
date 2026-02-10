import InventoryPage from '../../pageobjects/Inventory/inventory.page.js';
import NavigationFlow from '../../helpers/navigationflow.js';
import TotalColumnPage from '../../pageobjects/Main/totalcolumn.page.js';
import { $, $$, browser, expect } from '@wdio/globals';

describe('AT-CORE-0014', () => {
    let testData;

    before(async () => {
        // Login and Flow
        await NavigationFlow.loginAndNavigateToInventoryConnote();
    });

    describe('AT-CORE-0014-01', () => {

        it('Read Inventory Connote', async() => {
            const tests = [
                { index: 1, value:'BDO/SUB/1758105018862' }, // Bag (expand)
                { index: 2, value:'BDO10000'},              // Origin (main)
                // { index: 0, value:'0608418726018006' },     // Connote (main)
                { index: 3, value:'SUB10008'},              // Destination (main)
                { index: 4, value:'4'},                     // Cost Weight (expand)
                { index: 5, value:'REG23'},                 // Service (main)
                { index: 6, value:'18000'},                 // Amount COD (expand)
            ];

            const normalize = s => (s || '').replace(/\s|\.|,/g, '').toLowerCase();

            for (const { index, value } of tests) {
                console.log('---\n>> Test searching index:', index, 'value:', value);
                await InventoryPage.searchInventoryKoli(index, value);

                // pastikan ada row
                const firstRow = await $('//table/tbody/tr[1]');
                await firstRow.waitForDisplayed({ timeout: 7000 });

                // Ambil semua teks di main table (semua rows)
                const mainTds = await $$('table tbody tr td');
                const mainTexts = [];
                for (const el of mainTds) {
                    mainTexts.push((await el.getText()).trim());
                }
                console.log('>> Main Table Texts:', mainTexts);

                let foundInMain = mainTexts.some(t => normalize(t).includes(normalize(value)));

                // Jika tidak ketemu di main, coba expand (fallback)
                let foundInExpand = false;
                if (!foundInMain) {
                    // buka expand baris pertama (safe try/catch)
                    try {
                        await firstRow.click();
                        const expandContent = await $('.vs-table__expand__td__content__sub');
                        await expandContent.waitForDisplayed({ timeout: 5000 });

                        await browser.pause(300); // biar render stable

                        const allExpandCells = await $$('//div[contains(@class,"vs-table__expand__td__content__sub")]//table//tr//td');
                        const expandTexts = [];
                        for (const el of allExpandCells) {
                            expandTexts.push((await el.getText()).trim());
                        }
                        console.log('>> Expand Texts:', expandTexts);

                        foundInExpand = expandTexts.some(t => normalize(t).includes(normalize(value)));

                        // coba collapse lagi supaya tidak ganggu iterasi berikutnya
                        await firstRow.click();
                    } catch (e) {
                        console.log('>> Expand check failed (no expand or other error):', e.message);
                    }
                }

                console.log(`>> Result for "${value}": inMain=${foundInMain} inExpand=${foundInExpand}`);

                const found = foundInMain || foundInExpand;
                expect(found).toBe(true);
            }

            // Validasi total data sesuai row
            await TotalColumnPage.validateTotalMatchesRows();

            // Validate Filter Connote Status
            await browser.refresh();
            await InventoryPage.btnConnote.waitForClickable({timeout:5000});
            await InventoryPage.btnConnote.click();
            const bagStatuses = [
                { index: 1, expected: 'Is In Bag' },
                { index: 2, expected: 'Not In Bag' },
                { index: 0, expected: 'All Bag' }
            ];

            for (const { index, expected } of bagStatuses) {
                await InventoryPage.selectBagStatusByIndex(index);
                await InventoryPage.validateBagColumnConnote(expected);
            }

            // Validate Inventory Connote Status
            // await browser.refresh();
            const InvStatuses = [
                { index: 1, expected: 'Confirmed' },
                { index: 2, expected: 'Unconfirmed' },
                { index: 0, expected: 'All Status' },
            ];

            for (const { index, expected } of InvStatuses){
                await InventoryPage.selectInventoryStatus(index);
                await InventoryPage.validateStatusColumnConnote(expected);
            }
        
            // Validate Date Range + Filter Date
            const startDate = "2025-09-01";
            const endDate   = "2025-09-30";

            const scenarios = [
                { filterIndex: 2, expectedColumn: 9, fromExpand: true }, // Opened Date --> HARUS VALIDASI KE MANA ?
                { filterIndex: 3, expectedColumn: 9 },   // SLA → tabel utama
                { filterIndex: 0, expectedColumn: 10 },  // Created Date → tabel utama
                { filterIndex: 1, expectedColumn: 4, fromExpand: true },  // Receiving Date → expand kolom ke-4
            ];

            const startDateObj = new Date(startDate);
            const endDateObj   = new Date(endDate);

            // panggil pakai object, bukan param terpisah
            const results = await InventoryPage.applyDateFilterAndValidateMultiple({
                start: startDate,
                end: endDate,
                scenarios
            });

            for (const res of results) {
                let values = res.values;

                // khusus hanya untuk Receiving Date
                const receivingDateFilter = scenarios.find(s => s.filterIndex === 1);

                if (res.filterIndex === receivingDateFilter.filterIndex && receivingDateFilter.fromExpand) {
                    const firstRow = await $('//table/tbody/tr[1]');
                    await firstRow.click();

                    const expandContent = await $('.vs-table__expand__td__content__sub');
                    await expandContent.waitForDisplayed({ timeout: 5000 });

                    const cells = await $$(
                        `//div[contains(@class,"vs-table__expand__td__content__sub")]//table//tr/td[${res.expectedColumn}]`
                    );

                    values = [];
                    for (const el of cells) {
                        const txt = (await el.getText()).trim();
                        if (!txt) {
                            throw new Error(`Empty date found in filterIndex ${res.filterIndex}`);
                        }
                        values.push(txt);
                    }
                }

                // validasi date range hanya jika ada values
                for (const v of values) {
                    const datePart = v.split(' ')[0]; // ambil YYYY-MM-DD
                    const cellDate = new Date(datePart);

                    expect(cellDate >= startDateObj).toBe(true);
                    expect(cellDate <= endDateObj).toBe(true);
                }
            }
        });


    });
    after(async () => { 
        console.log('Test suite completed');
    });
});