import NavigationFlow from '../../helpers/navigationflow.js';
import ExportPage from '../../pageobjects/Main/exportCsv.page.js';
import ColumnPage from '../../pageobjects/Main/columnfilter.page.js';
import { clearDownloadFolder, getLatestDownloadedCsv } from '../../helpers/downloadvalid.js';
import fs from 'fs';

describe('AT-CORE-0013', () => {

    before(async () => {
        // Login dengan akun username dan password
        clearDownloadFolder(); // Bersihkan folder sebelum test
        // Navigation flow to Inventory
        await NavigationFlow.loginAndNavigateToInventory();
    });

    describe('AT-CORE-0013-08', () => {
        
        // Export table to CSV
        it('Export Filtered Column Table to CSV', async () => {

            await ColumnPage.openDropdown(); 
            
            await ColumnPage.CheckboxByTestId('is_cod', false);
            await ColumnPage.CheckboxByTestId('amount_cod', false);

            await ExportPage.exportCsv();
            // Mengambil file terbaru dengan format nama settings-destination
            const downloaded = await getLatestDownloadedCsv('inventory-connote');
            // Melihat file yang sudah 
            const content = fs.readFileSync(downloaded.path, 'utf-8');

            // Ambil header (baris pertama)
            const [headerLine] = content.split('\n');
            const headers = headerLine.split(',');

            // Expect kolom yang di-hide tidak ada
            expect(headers).not.toContain('COD', 'Amount COD (Rp)');

            // Expect pastikan kolom lain tetap ada
            const expectedHeaders = ["Koli Number","Bag","Connote Created Date", "Created By", "Receiving Date", "Received By", "Last Bag Opened Date", "Origin", "Destination", "Actual Weight(Kg)", "Cost Weight(Kg)", "Routing Type", "Service", "SLA", "Runsheet Number", "Wood Package", "Cancel", "Status POD", "Status Irregularity", "Status"];

            // cek panjang 
            expect(headers.length).toBe(expectedHeaders.length);

            // cek isi array sama persis
            expect(headers).toEqual(expectedHeaders);

        });
    });
    
    after(async () => { 
        console.log('Test suite completed');
    });

});