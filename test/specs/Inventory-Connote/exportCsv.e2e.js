import NavigationFlow from '../../helpers/navigationflow.js';
import ExportPage from '../../pageobjects/Main/exportCsv.page.js';
import ColumnPage from '../../pageobjects/Main/columnfilter.page.js';
import { clearDownloadFolder, getLatestDownloadedCsv } from '../../helpers/downloadvalid.js';
import fs from 'fs';

describe('AT-CORE-0014', () => {

    before(async () => {
        // Login dengan akun username dan password
        clearDownloadFolder(); // Bersihkan folder sebelum test
        // Navigation flow to Inventory
        await NavigationFlow.loginAndNavigateToInventoryConnote();
    });

    describe('AT-CORE-0014-08', () => {
        
        // Export table to CSV
        it('Export Table to CSV - Inventory Koli', async () => {

            await ColumnPage.openDropdown(); 
            
            await ColumnPage.CheckboxByTestId('connote_shipper_tariff_code', false);
            await ColumnPage.CheckboxByTestId('connote_receiver_tariff_code', false);

            await ExportPage.exportCsv();
            // Mengambil file terbaru dengan format nama settings-destination
            const downloaded = await getLatestDownloadedCsv('inventory-connote');
            // Melihat file yang sudah 
            const content = fs.readFileSync(downloaded.path, 'utf-8');

            // Ambil header (baris pertama)
            const [headerLine] = content.split('\n');
            const headers = headerLine.split(',');

            // Expect kolom yang di-hide tidak ada
            expect(headers).not.toContain('Origin', 'Destination');

            // Expect pastikan kolom lain tetap ada
            const expectedHeaders = ["Connote Number", "Weight(Kg)", "Routing Type", "Service", "COD", "Amount COD (Rp)", "SLA", "Created At", "Created By", "Cancel"];
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