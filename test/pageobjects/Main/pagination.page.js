import { $, $$, browser, expect } from '@wdio/globals';

class paginationPage {
    // ================= GET PAGINATION =================
    // Button Next
     get nextButton() {
        return $('.vs-pagination__arrow.next');
    }
    // Button Previous
    get prevButton() {
        return $('.vs-pagination__arrow.prev');
    }
    // Active Page
    get activePage() {
        return $('.vs-pagination__button.active');
    }
    
    // ================= ACTION PAGINATION =================
    async isNextDisabled() {
        return await this.nextButton.getAttribute('disabled') !== null;
    }

    async isPrevDisabled() {
        return await this.prevButton.getAttribute('disabled') !== null;
    }

    async getActivePageNumber() {
        const el = await this.activePage;

        // pastikan element exist & visible
        await el.waitForDisplayed({ timeout: 5000 });

        let txt = (await el.getText()).trim();

        // fallback: kalau kosong, coba innerHTML
        if (!txt) {
            txt = await el.getHTML(false);
        }

        const num = parseInt(txt, 10);

        if (isNaN(num)) {
            throw new Error(` Gagal baca nomor halaman aktif, teks="${txt}"`);
        }

        return num;
    }


    async validatePagination() {
        await this.nextButton.waitForExist({ timeout: 5000 });

        const nextDisabled = await this.isNextDisabled();
        const prevDisabled = await this.isPrevDisabled();
        const pages = await $$('.vs-pagination__button');
        const totalPages = pages.length;

        if (totalPages <= 1 || (nextDisabled && prevDisabled)) {
            console.log('Hanya 1 halaman, tombol Next & Prev disabled');
            expect(nextDisabled).toBe(true);
            expect(prevDisabled).toBe(true);
            return;
        }

        if (!nextDisabled) {
            console.log('Ada pagination, tombol Next aktif');

            const currentPage = await this.getActivePageNumber();
            const beforeRows = await this.getVisibleRowCount();

            // tunggu tombol benar2 enable
            await browser.waitUntil(async () => {
                const disabledAttr = await this.nextButton.getAttribute('disabled');
                return disabledAttr === null;
            }, {
                timeout: 10000,
                timeoutMsg: "Next button masih disabled setelah 10s"
            });

            // scroll supaya visible
            await this.nextButton.scrollIntoView();

            // klik Next
            await this.nextButton.click();
            console.log("Next button diklik");

            // beri jeda render
            await browser.pause(300);

            // tunggu sampai table berubah & active page valid
            await browser.waitUntil(async () => {
                const newPage = await this.getActivePageNumber();
                return newPage === currentPage + 1;
            }, {
                timeout: 15000,
                timeoutMsg: `Pagination gagal: masih di page ${currentPage}`
            });



            const newPage = await this.getActivePageNumber();
            console.log(`Berhasil pindah halaman → ${newPage}`);
            expect(newPage).toBe(currentPage + 1);

        } else {
            console.log('Sudah di halaman terakhir, Next disabled');
            expect(nextDisabled).toBe(true);
        }
    }



    // ================= GET ROWS PER PAGE =================
    get rowsPerPageSelect() {
       return $('.vs-select__input.simple');
    }

    get rowsPerPageOption() {
       return $('.vs-select__options__content');
    }

    // ================= ACTION ROWS PER PAGE =================
    async selectRowsPerPage(value) {
        const txt = String(value);

        await this.rowsPerPageSelect.scrollIntoView();
        await this.rowsPerPageSelect.click();
        await this.rowsPerPageOption.waitForDisplayed({ timeout: 5000 });

        // klik tombol opsi berdasarkan teks
        const optionBtn = await $(`//div[contains(@class,"vs-select__options__content")]//button[contains(@class,"vs-select__option")][normalize-space(.)="${txt}"]`);
        await optionBtn.waitForDisplayed({ timeout: 5000 });
        await optionBtn.click();

        // tunggu sampai refresh:
        // jumlah row = label total, dan jumlah row <= value
        await browser.waitUntil(async () => {
            const rowsNow = await this.getVisibleRowCount();
            const labelText = await $('[data-testid="columns-total"]').getText();
            const label = parseInt(labelText.replace(/\D/g, ''), 10) || 0;

            // cukup: rows sinkron dgn label & tidak melebihi RPP
            return rowsNow === label && rowsNow <= Number(value);
        }, {
            timeout: 15000,
            timeoutMsg: `Rows/label belum sinkron setelah pilih ${txt}`,
        });
    }
    
    async assertRppSelected(value) {
        const txt = String(value);
        // Coba baca dari input (kalau komponen isi value)
        const v = (await this.rowsPerPageSelect.getAttribute('value'))?.trim();
        if (v === txt) return;

        // Kalau input tidak menampilkan value, buka dropdown & cek activeOption
        await this.rowsPerPageSelect.click();
        const activeBtn = await $(`//div[contains(@class,"vs-select__options__content")]//button[contains(@class,"vs-select__option") and contains(@class,"activeOption")][normalize-space(.)="${txt}"]`);
        await activeBtn.waitForDisplayed({ timeout: 5000 });
        // tutup menu (opsional)
        try { await browser.keys('Escape'); } catch {}
    }

    // helper baca jumlah baris tabel saat ini
    async getVisibleRowCount() {
        const rows = await $$('//tbody[contains(@class,"vs-table__tbody")]//tr[td]');
        return rows.length;
    }

    
    // ================= ACTION ROWS PER PAGE TRACEBAG =================
    async selectRowsPerPageTB(value) {
        const txt = String(value);

        // buka dropdown di modal TraceBag
        const modal = await $('//div[contains(@class,"vs-dialog__content")]');
        const select = await modal.$('//div[contains(@class,"vs-select")]');
        await select.scrollIntoView();
        await select.click();

        const optionBtn = await $(`//div[contains(@class,"vs-select__options__content")]//button[contains(@class,"vs-select__option")][normalize-space(.)="${txt}"]`);
        await optionBtn.waitForDisplayed({ timeout: 5000 });
        await optionBtn.click();

        // tunggu sinkronisasi rows di dalam modal
        await browser.waitUntil(async () => {
            const rowsNow = await this.getVisibleRowCountTB();
            const labelText = await modal.$('[data-testid="columns-total"]').getText();
            const label = parseInt(labelText.replace(/\D/g, ''), 10) || 0;
            return rowsNow === label && rowsNow <= Number(value);
        }, {
            timeout: 15000,
            timeoutMsg: `Rows/label belum sinkron setelah pilih ${txt} di modal TraceBag`,
        });
    }

    async assertRppSelectedTB(value) {
        const txt = String(value);
        const modal = await $('//div[contains(@class,"vs-dialog__content")]');
        const select = await modal.$('//div[contains(@class,"vs-select")]');
        const v = (await select.getAttribute('value'))?.trim();
        if (v === txt) return;
        await select.click();
        const activeBtn = await $(`//div[contains(@class,"vs-select__options__content")]//button[contains(@class,"vs-select__option") and contains(@class,"activeOption")][normalize-space(.)="${txt}"]`);
        await activeBtn.waitForDisplayed({ timeout: 5000 });
        try { await browser.keys('Escape'); } catch {}
    }

    async getVisibleRowCountTB() {
        const modal = await $('//div[contains(@class,"vs-dialog__content")]');
        const rows = await modal.$$('//tbody[contains(@class,"vs-table__tbody")]//tr[td]');
        return rows.length;
    }

}

export default new paginationPage();