import fs from 'fs';
import path from 'path';
import { expect } from '@wdio/globals';
import getLatestDownloadedCsv from './getLatestDownloadedCsv.js'; // function yg kamu udah punya

class CsvHelper {
    /**
     * Validate CSV headers
     * @param {string[]} expectedHeaders - array header yang diharapkan
     * @param {string} prefix - prefix nama file CSV (misal: "settings-bag")
     */
    async validateCsv(expectedHeaders, prefix) {
        // Ambil file terbaru
        const downloaded = await getLatestDownloadedCsv(prefix);
        const content = fs.readFileSync(downloaded.path, 'utf-8');

        // Ambil baris pertama
        const [headerLine] = content.split('\n');
        const headers = headerLine.split(',').map(h => h.trim());

        //  Validasi panjang kolom
        expect(headers.length).toBe(expectedHeaders.length);

        // Validasi isi kolom persis
        expect(headers).toEqual(expectedHeaders);
    }
}

export default new CsvHelper();
