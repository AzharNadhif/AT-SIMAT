import { $, $$, browser, expect } from '@wdio/globals';

class tableValidationPage {
    // ================= ACTION TYPO TABLE HEADER =================
    async getHeaderTexts(expectedHeaders = null) {
        // cari table dengan thead
        const table = await $('//table[.//thead]');
        await table.waitForDisplayed({ timeout: 5000 });

        // ambil semua header di dalam table
        const headers = await table.$$('./thead//th//div[contains(@class,"vs-table__th__content")]');
        if (!headers || headers.length === 0) {
            throw new Error('Header table tidak ditemukan!');
        }

        // ambil text dari masing-masing header
        const texts = [];
        for (const h of headers) {
            texts.push(await h.getText());
        }

        // kalau ada expectedHeaders, lakukan validasi manual
        if (expectedHeaders) {
            const isSame = JSON.stringify(texts) === JSON.stringify(expectedHeaders);

            if (!isSame) {
                // cari mana yang beda
                const missing = expectedHeaders.filter(x => !texts.includes(x));
                const extra   = texts.filter(x => !expectedHeaders.includes(x));

                let message = `Header tabel tidak sesuai!\n\n`;
                
                if (extra.length) {
                    message += `Header yang seharusnya tidak ada/tidak sesuai:\n  • ${extra.join('\n  • ')}\n\n`;
                }

                message += `Expected (${expectedHeaders.length}):\n  • ${expectedHeaders.join('\n  • ')}\n\n`;
                message += `Received (${texts.length}):\n  • ${texts.join('\n  • ')}`;

                throw new Error(message);
            }
        }

        return texts;
    }

    // ================= ACTION CHECK ID TABLE HEADER =================
    async getTableHeaders() {
        const headers = await $$('//thead//th/div[contains(@class, "vs-table__th__content")]');
        if (!headers || headers.length === 0) {
            throw new Error('Header table tidak ditemukan, cek lagi selektor //thead//th/div');
        }
        const texts = [];
        for (const h of await headers) {
            texts.push((await h.getText()).trim());
        }
        console.log('Detected Headers:', texts); 
        return texts;
    }

    // ================= ACTION DATE FORMAT =================
    async selectTab(label) {
        const tab = await $(`//*[normalize-space(text())='${label}']`);
        if (!await tab.isExisting()) throw new Error(`Tab "${label}" tidak ditemukan`);
        await tab.click();
        await browser.waitUntil(async () => {
            const aria = await tab.getAttribute('aria-selected');
            const cls  = (await tab.getAttribute('class')) || '';
            return aria === 'true' || /\bactive\b/i.test(cls);
        }, { timeout: 6000, timeoutMsg: `Tab "${label}" belum aktif` });
        await browser.pause(150);
    }

    async getColumnValues2(headerText, { tableIndex = 0 } = {}) {
        if (!headerText) throw new Error('headerText wajib diisi');

        const result = await browser.execute((hdrText, idx) => {
            const norm = s => (s || '').replace(/\s+/g, ' ').trim();

            // ambil semua table yg kelihatan
            const tables = Array.from(document.querySelectorAll('table')).filter(t => {
                const cs = getComputedStyle(t);
                const r  = t.getBoundingClientRect();
                return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0;
            });

            if (!tables.length) return { ok:false, reason:'Tidak ada table yang visible' };

            let found = 0;
            for (const tbl of tables) {
                const ths = Array.from(tbl.querySelectorAll('thead th'));
                const targetTh =
                    ths.find(th => norm(th.textContent) === hdrText) ||
                    ths.find(th => norm(th.textContent).includes(hdrText));
                if (!targetTh) continue;

                if (found++ !== idx) continue;

                const headRect   = targetTh.getBoundingClientRect();
                const headCenter = headRect.left + headRect.width / 2;

                const rows = Array.from(tbl.querySelectorAll('tbody tr'));
                const values = [];

                for (const tr of rows) {
                    const tds = Array.from(tr.querySelectorAll('td'));
                    if (!tds.length) continue;

                    let bestTd = null, bestDist = Infinity;
                    for (const td of tds) {
                        const r = td.getBoundingClientRect();
                        if (r.width === 0 || r.height === 0) continue;
                        const cx = r.left + r.width / 2;
                        const d  = Math.abs(cx - headCenter);
                        if (d < bestDist) { bestDist = d; bestTd = td; }
                    }
                    if (bestTd) values.push(norm(bestTd.textContent));
                }

                return {
                    ok: true,
                    headers: ths.map(th => norm(th.textContent)),
                    values
                };
            }
            return { ok:false, reason:`Header "${hdrText}" tidak ketemu` };
        }, headerText, tableIndex);

        if (!result.ok) throw new Error(result.reason);
        console.log('Headers:', result.headers);
        console.log('Values:', result.values);
        return result.values;
    }


    // validator format tanggal:
    // len=10 -> YYYY-MM-DD ; len>10 -> YYYY-MM-DD HH:MM:SS ; selain itu invalid
    isValidDateFormat(str) {
        if (!str) return false;
        const v = str.trim();
        if (v.length === 10) {
            return /^\d{4}-\d{2}-\d{2}$/.test(v);
        }
        if (v.length > 10) {
            return /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(v);
        }
        return false;
    }

    // validasi satu kolom: return list baris yang gagal (biar gampang di-assert)
    async validateColumnDateFormat(headerText) {
        const values = await this.getColumnValues2(headerText);
        return values
            .map((val, i) => ({ row: i + 1, value: val, ok: this.isValidDateFormat(val) }))
            .filter(r => !r.ok);
    }

    // =============== BATAS DATE FORMAT TABLE INDEX ===============
    
    
 
}

export default new tableValidationPage();