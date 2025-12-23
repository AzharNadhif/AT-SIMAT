import NavigationFlow from '../../helpers/navigationflow.js';
import ExportPage from '../../pageobjects/Main/exportCsv.page.js';
import ColumnPage from '../../pageobjects/Main/columnfilter.page.js';
import { clearDownloadFolder, getLatestDownloadedCsv } from '../../helpers/downloadvalid.js';
import fs from 'fs';

describe('AT-CORE-0022', () => {

    before(async () => {
        // Login dengan akun username dan password
        clearDownloadFolder(); // Bersihkan folder sebelum test
        // Navigation flow to Inventory
        await NavigationFlow.loginAndNavigateToSuratMuatan();
    });

    describe('AT-CORE-0022-08', () => {
        
        // Export table to CSV
        it('Export Table to CSV - Surat Muatan', async () => {

            await ColumnPage.openDropdown(); 
            
            await ColumnPage.CheckboxByTestId('created_at', false);
            await ColumnPage.CheckboxByTestId('created_by_user', false);

            await ExportPage.exportCsv();
            // Mengambil file terbaru dengan format nama settings-destination
            const downloaded = await getLatestDownloadedCsv('outgoing-surat-muatan');
            // Melihat file yang sudah 
            const content = fs.readFileSync(downloaded.path, 'utf-8');

            // Ambil header (baris pertama)
            const [headerLine] = content.split('\n');
            const headers = headerLine.split(',');

            // Expect kolom yang di-hide tidak ada
            expect(headers).not.toContain('Created Date', 'Created By');

            // Expect pastikan kolom lain tetap ada
            const expectedHeaders = ["No Surat Muatan","Status","Received Bag","Outstanding Bag","Type SM","Flight Number","Vehicle","Moda Transportasi","Origin","Destination","Actual Weight","ETD","ETA","Approved","Received At","Total Irregularity","Total Master Bag","Total Bag","Total Connote"];

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