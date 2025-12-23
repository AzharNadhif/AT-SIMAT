import { $, $$, browser, expect } from '@wdio/globals';

class OpenBagPage {
    get pageTitle(){
        return $('h2=Open Bag');
    }

    get inputItemCode(){
        return $('input[data-testid="input-formInputUnbagging"]');
    }

    get unbaggedSection() {
        return $("//div[contains(@class,'box')][.//h4[normalize-space()='Unbagged']]");
    }

    get itemScannedSection() {
        return $("//div[contains(@class,'box')][.//h4[normalize-space()='Item Scanned']]");
    }

    get firstUnbaggedItemCell() {
        return this.unbaggedSection.$(".//span[@data-testid='data-item_number-1']");
    }

    get totalScan() {
        return this.itemScannedSection.$('p[data-testid="columns-total"]')
    }

    get firstItemScannedCell() {
        return this.itemScannedSection.$(".//span[@data-testid='data-item_number-1']");
    }

    get inventory(){
        return $('a[href="/inventory"]');
    }

    get inventoryBag(){
        return $('a[href="/inventory/bag"]');
    }

    get sidebarBtn(){
        return $('.vs-button__content i.bx.bx-menu');
    }

    get searchBag(){
        return $('input[data-testid="input-search"');
    }

    async openBag(bagNo, soft = null){
        await this.inputItemCode.waitForDisplayed({ timeout: 5000 });
        await this.inputItemCode.click();
        await this.inputItemCode.setValue(bagNo);
        await browser.keys(['Enter']);

        const softCheck = async (title, fn) => {
            if (soft && typeof soft.check === 'function') return soft.check.call(soft, title, fn);
            return fn();
        };

        // Tunggu tabel "Unbagged" muncul
        await this.unbaggedSection.waitForDisplayed({ timeout: 8000 });

        // Ambil teks yang tampil di tabel
        const displayedBag = (await this.firstUnbaggedItemCell.getText()).trim();

        // Log input dan hasil tabel
        console.log(`Input Bag Number   : ${bagNo}`);
        console.log(`Displayed in Table : ${displayedBag}`);

        await softCheck(`[Open Bag] Nomor Bag ${displayedBag}, tidak sesuai dengan input ${bagNo}`, async () => {
            await expect(displayedBag).toContain(bagNo);
        });
    }

    async openAddBag(bagNo, soft = null){
        const softCheck = async (title, fn) => {
            if (soft && typeof soft.check === 'function') return soft.check.call(soft, title, fn);
            return fn();
        };

        await this.totalScan.waitForDisplayed({ timeout: 5000 });
        // Total Sebelum discan
        const totalScanned = await this.totalScan.getText();
        const totalScanBefore = parseInt(totalScanned.split(':').pop().trim(), 10);
        console.log(`Total sebelum discan : ${totalScanBefore}`);


        await this.inputItemCode.waitForDisplayed({ timeout: 5000 });
        await this.inputItemCode.click();
        await this.inputItemCode.setValue(bagNo);
        await browser.keys(['Enter']);

        // Ambil teks yang tampil di tabel
        const displayedItem = (await this.firstItemScannedCell.getText()).trim();

        // Log input dan hasil tabel
        console.log(`Input Bag Number   : ${bagNo}`);
        console.log(`Displayed in Table : ${displayedItem}`);

        await softCheck(`[Open Bag] Nomor Item Scanned ${displayedItem} tetap muncul`, async () => {
            await expect(displayedItem).not.toBeDisplayed();
        });

        await browser.pause(500);
       // Ambil text total setelah scan (kalau ada)
        const isTotalScanExisting = await this.totalScan.isExisting();

        if (isTotalScanExisting) {
            // kalau element total scan masih ada
            const totalScannedAfter = await this.totalScan.getText();
            const totalScanAfter = parseInt(totalScannedAfter.split(':').pop().trim(), 10);
            console.log(`Total setelah discan : ${totalScanAfter}`);

            // kalau data lebih dari 1
            if (totalScanBefore > 1) {
                await softCheck(`[Open Add Bag] Validasi total scan berkurang`, () => {
                    expect(totalScanAfter).toBeLessThan(totalScanBefore);
                });
            } else {
                console.log('Total scan masih ada padahal data = 1');
                await softCheck(`[Open Add Bag] Elemen total scan harus hilang jika hanya 1 data`, async () => {
                    expect(await this.totalScan.isDisplayed()).toBe(false);
                });
            }
        } else {
            // kalau element total scan udah hilang
            console.log('Elemen total scan sudah hilang dari halaman');
            await softCheck(`[Open Add Bag] Validasi total scan hilang ketika hanya 1 data`, async () => {
                expect(isTotalScanExisting).toBe(false);
            });
        }   
    }

    async validateOM(data, soft = null){
        const softCheck = async (title, fn) => {
            if (soft && typeof soft.check === 'function') return soft.check.call(soft, title, fn);
            return fn();
        };

        await this.sidebarBtn.waitForDisplayed({ timeout: 5000 });
        await this.sidebarBtn.waitForClickable({ timeout: 5000 });
        await this.sidebarBtn.click();

        await this.inventory.waitForDisplayed({ timeout: 5000 });
        await this.inventory.click();

        await this.inventoryBag.waitForDisplayed({ timeout: 5000 });
        await this.inventoryBag.click();

        await this.searchBag.waitForDisplayed({ timeout: 5000 });
        await this.searchBag.click();
        await this.searchBag.setValue(data);
        await browser.keys(['Enter']);
        
        // Validate Number Bag
        const numberBag= await $('tbody.vs-table__tbody tr:nth-child(1) td:nth-child(1) span');
        await numberBag.waitForDisplayed({ timeout: 10000 });

        const text = (await numberBag.getText()).trim();
        console.log(`Nomor Bag di table: ${text}`);
        console.log("Expected nomor Bag baris 1:", data);

        await softCheck(`[Open Bag] Nomor Bag(${text}), Tidak Sesuai Input (${data})`, () => {
            expect(text).toEqual(data);
        });
    }

   

}

export default new OpenBagPage();