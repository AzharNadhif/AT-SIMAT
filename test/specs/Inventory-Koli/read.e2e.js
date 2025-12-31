import InventoryPage from '../../pageobjects/Inventory/inventory.page.js';
import NavigationFlow from '../../helpers/navigationflow.js';
import SoftError from '../../helpers/softerror.js';
import TotalColumnPage from '../../pageobjects/Main/totalcolumn.page.js';
import { $, $$, browser, expect } from '@wdio/globals';

describe('AT-CORE-0013', () => {
    let testData;

    before(async () => {
        // Login and Flow
        await NavigationFlow.loginAndNavigateToInventory();
    });

    describe('AT-CORE-0013-01', () => {
        
        it('Read Inventory Koli', async() => {
            const tests = [
                { index: 1, value:'BDO/SUB/1758105018862 ' }, // Bag
                { index: 0, value:'060841872652000300 ' }, // Koli
                { index: 2, value:'CGK10000 '}, // Origin
                { index: 3, value:'SUB10008 '}, // Destination
                { index: 4, value:'2'}, // Cost Weight
                { index: 5, value:'REG23'}, // Service
                { index: 6, value:'18000'}, // Amount COD
            ];

            for (const { index, value } of tests) {
                await InventoryPage.searchInventoryKoli(index, value);

                // Ambil semua cell di tabel sekaligus
                const cells = await $$('table tbody tr td');
                const texts = [];
                for (const el of cells) {
                    const txt = await el.getText();
                    texts.push(txt.trim());
                }

                // Normalisasi angka untuk Amount COD
                const normalizedValue = value.replace(/\D/g, ''); // hapus koma/spasi/non-digit
                const found = texts.some(t => {
                    const normalizedText = t.replace(/\D/g, '');
                    return normalizedText === normalizedValue;
                });

                expect(found).toBe(true);
            }
   
            // Validasi total data sesuai row
            await TotalColumnPage.validateTotalMatchesRows();

        
            // Validate filter Bag Status 
            await browser.refresh();
            const bagStatuses = [
                { index: 1, expected: 'Is In Bag' },
                { index: 2, expected: 'Not In Bag' },
                { index: 0, expected: 'All Bag' }
            ];

            for (const { index, expected } of bagStatuses) {
                await InventoryPage.selectBagStatusByIndex(index);
                await InventoryPage.validateBagColumn(expected);
            }

            // Validate Inventory Koli Status
            // await browser.refresh();
            const InvStatuses = [
                { index: 1, expected: 'Confirmed' },
                { index: 2, expected: 'Unconfirmed' },
                { index: 0, expected: 'All Status' },
            ];

            for (const { index, expected } of InvStatuses){
                await InventoryPage.selectInventoryStatus(index);
                await InventoryPage.validateStatusColumn(expected);
            }
            
            // Validate Date Range + Filter Date
            const startDate = "2025-09-01";
            const endDate   = "2025-09-30";

            const scenarios = [
                { filterIndex: 1, expectedColumn: 6 }, // Receiving Date
                { filterIndex: 2, expectedColumn: 8 }, // Last Bag Opened Date
                { filterIndex: 3, expectedColumn: 17 }, // SLA
                { filterIndex: 0, expectedColumn: 4 }, // Connote Created Date
            ];

            const results = await InventoryPage.applyDateFilterAndValidateMultiple({
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