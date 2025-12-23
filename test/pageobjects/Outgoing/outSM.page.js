import { $, browser } from '@wdio/globals';

class OutSMPage {
   
    // ===== CREATE NEW SURAT MUATAN =====
    get btnNewSM() {
        return $('button[data-testid="create-button-surat-muatan"]');
    }

    get modalTitleCreateSM() {
        return $('//div[contains(@class,"vs-dialog-content")][.//div[contains(@class,"title-helper")]]');
    }

    get tableNumberBag(){
        return this.modalTitleCreateSM.$('tbody.vs-table__tbody tr:nth-child(1) td:nth-child(1) span');
    }

    // get tableNumberBag2(){
    //     return this.modalTitleCreateSM.$('tbody.vs-table__tbody tr:nth-child(2) td:nth-child(1) span');
    // }

    get selectModa() {
        return $('div[data-testid="select-manifest_method_id"]');
    }

    get inputNoSM() {
        return $('input[data-testid="input-manifest_number"]');
    }

    get inputMaxWeight() {
        return $('input[data-testid="input-max_weight"]');
    }

    get inputDestination() {
        return $('input[data-testid="autocomplete-node_id_destination"]');
    }

    get inputEtd(){
        return $('div[data-testid="input-date-time-etd"]');
    }

    get inputEta(){
        return $('div[data-testid="input-date-time-eta"]');
    }

    get btnNow() {
        return $("//button[.//span[normalize-space()='Now']]");
    }

    get btnVehicle(){
        return $('button[data-testid="add-vehicle-button"]');
    }

    get modalTitleVehicle() {
        return $('//div[contains(@class,"vs-dialog-content")][.//h4[normalize-space()="Manifest Vehicle"]]');
    }

    get navManual() {
        return $('button[data-testid="nav-k-NEW-MANUAL"]');
    }

    get inputflightNumber () {
        return $('div[data-testid="input-flight_number"] input.vs-input');
    }

    get flightSchedule() {
        return $('div[data-testid="input-date-time-flight schedule"] input.el-input__inner');
    }

    get ETDVehicle(){
        return this.modalTitleVehicle.$('div[data-testid="input-date-time-etd"]');
    }

    get ETAVehicle(){
        return this.modalTitleVehicle.$('div[data-testid="input-date-time-eta"]');
    }

    get datePicker() {
        return $('(//div[contains(@class,"el-picker-panel") and not(contains(@style,"display: none"))])[last()]')
    }
    
    get btnNowVehicle() {
        return this.datePicker.$("//button[.//span[normalize-space()='Now']]");
    }

    get idVehicle(){
        return $('input[data-testid="autocomplete-vehicle_id"]');
    }
    
    get originVehicle(){
        return $('input[data-testid="autocomplete-origin_branch_code"]');
    }

    get destinationVehicle(){
        return $('input[data-testid="autocomplete-destination_branch_code"]');
    }

    get inputFlight(){
        return $('input[data-testid="input-flight-number"]');
    }

    get inputDriver(){
        return $('input[data-testid="autocomplete-employee_driver_id"]');
    }

    get inputNoBag(){
        return $('input[data-testid="input-item_number"]');
    }

    get btnSubmit(){
        return $('button[data-testid="submit-button"]');
    }

    get btnApproveSM() {
        return $('button[data-testid="approve-button"]');
    }

    // SEARCH VALIDATE SM
    get inputSearch() {
        return $('input[data-testid="input-search"]');
    }

    //  ===== ACTION CREATE NEW SURAT MUATAN =====

    async createNewSM(moda, maxweight, destination, daysOffset=1){
        await this.btnNewSM.waitForDisplayed({ timeout: 5000 });
        await this.btnNewSM.waitForClickable({ timeout: 5000 });
        await this.btnNewSM.click();

        await this.modalTitleCreateSM.waitForDisplayed({ timeout: 5000 });
        // Select Moda
        await this.selectModa.waitForDisplayed({ timeout: 5000 });
        await this.selectModa.waitForClickable({ timeout: 5000 });
        await this.selectModa.click();

        const option = $(`//li[normalize-space()='${moda}']`);
        await option.waitForClickable({ timeout: 5000 });
        await option.click();

        // Input No SM
        const now = new Date();
        const pad = (n) => n.toString().padStart(2, '0');
        const uniqueNoSM = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}${now.getMilliseconds()}`;
        await this.inputNoSM.waitForDisplayed({ timeout: 5000 });
        await this.inputNoSM.waitForClickable({ timeout: 5000 });
        await this.inputNoSM.click();
        await this.inputNoSM.setValue(uniqueNoSM);

        // Input Max Weight
        await this.inputMaxWeight.waitForDisplayed({ timeout: 5000 });
        await this.inputMaxWeight.waitForClickable({ timeout: 5000 });
        await this.inputMaxWeight.click();
        await this.inputMaxWeight.setValue(maxweight);

        // Input Destination
        await this.inputDestination.waitForDisplayed({ timeout: 5000 });
        await this.inputDestination.waitForClickable({ timeout: 5000 });
        await this.inputDestination.click();
        await this.inputDestination.setValue(destination);
        const optionDestination = await $(`//li[contains(text(),'${destination}')]`);
        await optionDestination.waitForDisplayed({ timeout: 5000 });
        await optionDestination.click();


        // Input ETD (Estimated Time of Departure)
        await this.inputEtd.waitForDisplayed({ timeout: 5000 });
        await this.inputEtd.waitForClickable({ timeout: 5000 });
        await this.inputEtd.click();
        await this.btnNow.waitForDisplayed({ timeout: 5000 });
        await this.btnNow.click();

        // Input ETA (Estimated Time of Arrival)
        // Tunggu input ETA tampil
        await this.inputEta.waitForDisplayed({ timeout: 5000 });
        await this.inputEta.waitForClickable({ timeout: 5000 });

        // Klik input di dalam div supaya fokus
        const etaInput = await this.inputEta.$('input'); // ambil child <input>
        await etaInput.click();

        // Hitung H+1
        const etaDate = new Date();
        etaDate.setDate(etaDate.getDate() + daysOffset);
        const yyyy = etaDate.getFullYear();
        const mm = String(etaDate.getMonth() + 1).padStart(2, '0');
        const dd = String(etaDate.getDate()).padStart(2, '0');
        const etaStr = `${yyyy}-${mm}-${dd} 00:00:00`;

        // Ketik tanggal otomatis
        await etaInput.setValue('');
        await etaInput.addValue(etaStr);

        // Pancing event supaya Vue terdeteksi
        await browser.execute((el) => {
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.blur();
        }, etaInput);

        // Lihat Panel kalender muncul
        const activePanel = await $$('div.el-picker-panel')
            .find(async el => await el.isDisplayed());

        if (!activePanel) {
            throw new Error('Tidak menemukan panel kalender aktif');
        }
        // Ambil tombol OK di dalam panel aktif
        const okBtn = await activePanel.$(".//button[.//span[normalize-space()='OK']]");
        await okBtn.waitForDisplayed({ timeout: 3000 });
        await browser.pause(200); // animasi transition

        // Klik via JS agar tidak kena overlay
        await browser.execute(el => el.click(), okBtn);
    }

    async addVehicle(dataId, dataOrigin, dataDestination, daysOffset=1){
        await this.btnVehicle.waitForDisplayed({ timeout: 5000 });
        await this.btnVehicle.waitForClickable({ timeout: 5000 });
        await this.btnVehicle.click();
        await this.modalTitleVehicle.waitForDisplayed({ timeout: 5000 });

        await this.idVehicle.waitForDisplayed({ timeout: 5000 });
        await this.idVehicle.click();
        await this.idVehicle.setValue(dataId);
        await browser.pause(1000); // jeda singkat agar dropdown muncul
        await browser.keys(['ArrowDown', 'Enter']);
    
        await this.originVehicle.waitForDisplayed({ timeout: 5000 });
        await this.originVehicle.click();
        await this.originVehicle.setValue(dataOrigin);
        await browser.pause(1000); // jeda singkat agar dropdown muncul
        await browser.keys(['ArrowDown', 'Enter']);

        await this.destinationVehicle.waitForDisplayed({ timeout: 5000 });
        await this.destinationVehicle.click();
        await this.destinationVehicle.setValue(dataDestination);
        await browser.pause(1000); // jeda singkat agar dropdown muncul
        await browser.keys(['ArrowDown', 'Enter']);

        // Input ETD (Estimated Time of Departure)
        await this.ETDVehicle.waitForDisplayed({ timeout: 5000 });
        await this.ETDVehicle.waitForClickable({ timeout: 5000 });
        await this.ETDVehicle.click();
        await this.btnNowVehicle.waitForDisplayed({ timeout: 5000 });
        await this.btnNowVehicle.click();

        // await browser.pause(5000);

        // Input ETA (Estimated Time of Arrival)
        await this.ETAVehicle.waitForDisplayed({ timeout: 5000 });
        await this.ETAVehicle.waitForClickable({ timeout: 5000 });

        // Klik input di dalam div supaya fokus
        const etaInput = await this.ETAVehicle.$('input'); // ambil child <input>
        await etaInput.click();

        // Hitung H+1
        const etaDate = new Date();
        etaDate.setDate(etaDate.getDate() + daysOffset);
        const yyyy = etaDate.getFullYear();
        const mm = String(etaDate.getMonth() + 1).padStart(2, '0');
        const dd = String(etaDate.getDate()).padStart(2, '0');
        const etaStr = `${yyyy}-${mm}-${dd} 00:00:00`;

        // Ketik tanggal otomatis
        await etaInput.setValue('');
        await etaInput.addValue(etaStr);

        // Pancing event supaya Vue terdeteksi
        await browser.execute((el) => {
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.blur();
        }, etaInput);

        // Lihat Panel kalender muncul
        const activePanel = await $$('div.el-picker-panel')
            .find(async el => await el.isDisplayed());

        if (!activePanel) {
            throw new Error('Tidak menemukan panel kalender aktif');
        }
        // Ambil tombol OK di dalam panel aktif
        const okBtn = await activePanel.$(".//button[.//span[normalize-space()='OK']]");
        await okBtn.waitForDisplayed({ timeout: 3000 });
        await browser.pause(200); // animasi transition

        // Klik via JS agar tidak kena overlay
        await browser.execute(el => el.click(), okBtn);

        // await browser.pause(5000);

        // Submit Vehicle
        await this.btnSubmit.waitForDisplayed({ timeout: 5000 });
        await this.btnSubmit.waitForClickable({ timeout: 5000 });
        await this.btnSubmit.click();  
    }

    async addVehicleUdara(data){
        await this.btnVehicle.waitForDisplayed({ timeout: 5000 });
        await this.btnVehicle.waitForClickable({ timeout: 5000 });
        await this.btnVehicle.click();
        await this.modalTitleVehicle.waitForDisplayed({ timeout: 5000 });

        await this.inputFlight.waitForDisplayed({ timeout: 5000 });
        await this.inputFlight.click();
        await this.inputFlight.setValue(data);
        await browser.keys(['Enter']);

        // Submit Vehicle
        await this.btnSubmit.waitForDisplayed({ timeout: 5000 });
        await this.btnSubmit.waitForClickable({ timeout: 5000 });
        await this.btnSubmit.click();
    }

    async addVehicleUdaraManual(idVehicle, data, dataOrigin, dataDestination, daysOffset=1) {
        await this.btnVehicle.waitForDisplayed({ timeout: 5000 });
        await this.btnVehicle.waitForClickable({ timeout: 5000 });
        await this.btnVehicle.click();
        await this.modalTitleVehicle.waitForDisplayed({ timeout: 5000 });

        await this.navManual.waitForDisplayed({ timeout: 5000 });
        await this.navManual.waitForClickable({ timeout: 5000 });
        await this.navManual.click();

        await this.idVehicle.waitForDisplayed({ timeout: 5000 });
        await this.idVehicle.click();
        await this.idVehicle.setValue(idVehicle);
        await browser.pause(1000);
        await browser.keys(['ArrowDown','Enter']);


        await this.inputflightNumber.waitForDisplayed({ timeout: 5000 });
        await this.inputflightNumber.click();
        await this.inputflightNumber.setValue(data);
        await browser.pause(500);
        // await browser.keys('Enter');

        // Flight Schedule
        await this.flightSchedule.waitForDisplayed({ timeout: 5000 });
        await this.flightSchedule.waitForClickable({ timeout: 5000 });
        await this.flightSchedule.click();
        await this.btnNowVehicle.waitForDisplayed({ timeout: 5000 });
        await this.btnNowVehicle.click();

        // Origin Destination
        await this.originVehicle.waitForDisplayed({ timeout: 5000 });
        await this.originVehicle.click();
        await this.originVehicle.setValue(dataOrigin);
        await browser.pause(1000); // jeda singkat agar dropdown muncul
        await browser.keys(['ArrowDown','Enter']);

        await this.destinationVehicle.waitForDisplayed({ timeout: 5000 });
        await this.destinationVehicle.click();
        await this.destinationVehicle.setValue(dataDestination);
        await browser.pause(1000); // jeda singkat agar dropdown muncul
        await browser.keys(['ArrowDown','Enter']);

        // Input ETD (Estimated Time of Departure)
        await this.ETDVehicle.waitForDisplayed({ timeout: 5000 });
        await this.ETDVehicle.waitForClickable({ timeout: 5000 });
        await this.ETDVehicle.click();
        await this.btnNowVehicle.waitForDisplayed({ timeout: 5000 });
        await this.btnNowVehicle.click();

        // Input ETA (Estimated Time of Arrival)
        await this.ETAVehicle.waitForDisplayed({ timeout: 5000 });
        await this.ETAVehicle.waitForClickable({ timeout: 5000 });

        // Klik input di dalam div supaya fokus
        const etaInput = await this.ETAVehicle.$('input'); // ambil child <input>
        await etaInput.click();

        // Hitung H+1
        const etaDate = new Date();
        etaDate.setDate(etaDate.getDate() + daysOffset);
        const yyyy = etaDate.getFullYear();
        const mm = String(etaDate.getMonth() + 1).padStart(2, '0');
        const dd = String(etaDate.getDate()).padStart(2, '0');
        const etaStr = `${yyyy}-${mm}-${dd} 00:00:00`;

        // Ketik tanggal otomatis
        await etaInput.setValue('');
        await etaInput.addValue(etaStr);

        // Pancing event supaya Vue terdeteksi
        await browser.execute((el) => {
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.blur();
        }, etaInput);

        // Lihat Panel kalender muncul
        const activePanel = await $$('div.el-picker-panel')
            .find(async el => await el.isDisplayed());

        if (!activePanel) {
            throw new Error('Tidak menemukan panel kalender aktif');
        }
        // Ambil tombol OK di dalam panel aktif
        const okBtn = await activePanel.$(".//button[.//span[normalize-space()='OK']]");
        await okBtn.waitForDisplayed({ timeout: 3000 });
        await browser.pause(200); // animasi transition

        // Klik via JS agar tidak kena overlay
        await browser.execute(el => el.click(), okBtn);





        // Submit Vehicle
        await this.btnSubmit.waitForDisplayed({ timeout: 5000 });
        await this.btnSubmit.waitForClickable({ timeout: 5000 });
        await this.btnSubmit.click();
    }

    async addVehicleDarat(dataId, dataDriver, daysOffset=1){
        await this.btnVehicle.waitForDisplayed({ timeout: 5000 });
        await this.btnVehicle.waitForClickable({ timeout: 5000 });
        await this.btnVehicle.click();
        await this.modalTitleVehicle.waitForDisplayed({ timeout: 5000 });

        await this.idVehicle.waitForDisplayed({ timeout: 5000 });
        await this.idVehicle.click();
        await this.idVehicle.setValue(dataId);
        await browser.pause(1000); // jeda singkat agar dropdown muncul
        await browser.keys(['ArrowDown', 'Enter']);

        await this.inputDriver.waitForDisplayed({ timeout: 5000 });
        await this.inputDriver.click();
        await this.inputDriver.setValue(dataDriver);
        await browser.pause(1000); // jeda singkat agar dropdown muncul
        await browser.keys(['ArrowDown', 'Enter']);

        // Input ETD (Estimated Time of Departure)
        await this.ETDVehicle.waitForDisplayed({ timeout: 5000 });
        await this.ETDVehicle.waitForClickable({ timeout: 5000 });
        await this.ETDVehicle.click();
        await this.btnNowVehicle.waitForDisplayed({ timeout: 5000 });
        await this.btnNowVehicle.click();

        // await browser.pause(5000);

        // Input ETA (Estimated Time of Arrival)
        await this.ETAVehicle.waitForDisplayed({ timeout: 5000 });
        await this.ETAVehicle.waitForClickable({ timeout: 5000 });

        // Klik input di dalam div supaya fokus
        const etaInput = await this.ETAVehicle.$('input'); // ambil child <input>
        await etaInput.click();

        // Hitung H+1
        const etaDate = new Date();
        etaDate.setDate(etaDate.getDate() + daysOffset);
        const yyyy = etaDate.getFullYear();
        const mm = String(etaDate.getMonth() + 1).padStart(2, '0');
        const dd = String(etaDate.getDate()).padStart(2, '0');
        const etaStr = `${yyyy}-${mm}-${dd} 00:00:00`;

        // Ketik tanggal otomatis
        await etaInput.setValue('');
        await etaInput.addValue(etaStr);

        // Pancing event supaya Vue terdeteksi
        await browser.execute((el) => {
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.blur();
        }, etaInput);

        // Lihat Panel kalender muncul
        const activePanel = await $$('div.el-picker-panel')
            .find(async el => await el.isDisplayed());

        if (!activePanel) {
            throw new Error('Tidak menemukan panel kalender aktif');
        }
        // Ambil tombol OK di dalam panel aktif
        const okBtn = await activePanel.$(".//button[.//span[normalize-space()='OK']]");
        await okBtn.waitForDisplayed({ timeout: 3000 });
        await browser.pause(200); // animasi transition

        // Klik via JS agar tidak kena overlay
        await browser.execute(el => el.click(), okBtn);

        // await browser.pause(5000);

        // Submit Vehicle
        await this.btnSubmit.waitForDisplayed({ timeout: 5000 });
        await this.btnSubmit.waitForClickable({ timeout: 5000 });
        await this.btnSubmit.click();  
    }

    async addBagNo(nobag, soft = null){
        await this.inputNoBag.waitForDisplayed({ timeout: 5000 });
        await this.inputNoBag.waitForClickable({ timeout: 5000 });
        await this.inputNoBag.click();
        await this.inputNoBag.setValue(nobag);

         await browser.keys(['Enter']);

        const softCheck = async (title, fn) => {
            if (soft && typeof soft.check === 'function') return soft.check.call(soft, title, fn);
            return fn();
        };

        // Validate Connote Number
        const numberBag = this.tableNumberBag;
        await numberBag.waitForDisplayed({ timeout: 10000 });

        const text = (await numberBag.getText()).trim();
        console.log(`Nomor bag input pertama: "${text}"`);
        console.log("Expected nomor bag input pertama:", nobag);

        await softCheck(`[Create SM] nomor bag input ke-1 (${text}), Tidak Sesuai Input (${nobag})`, () => {
            expect(text).toEqual(nobag);
        });

        await browser.pause (1000);
    }

    async addAdditionalBag(data, soft = null){
        await this.inputNoBag.waitForDisplayed({ timeout: 5000 });
        await this.inputNoBag.waitForClickable({ timeout: 5000 });
        await this.inputNoBag.click();
        await this.inputNoBag.setValue(data);

        await browser.keys(['Enter']);

        const softCheck = async (title, fn) => {
            if (soft && typeof soft.check === 'function') return soft.check.call(soft, title, fn);
            return fn();
        };

        // Validate Connote Number
        const numberBag = this.tableNumberBag;
        await numberBag.waitForDisplayed({ timeout: 10000 });

        const text = (await numberBag.getText()).trim();
        console.log(`Nomor bag input kedua: "${text}"`);
        console.log("Expected nomor bag input kedua:", data);

        await softCheck(`[Create SM] nomor bag input ke-2 (${text}), Tidak Sesuai Input (${data})`, () => {
            expect(text).toEqual(data);
        });
    }

    async approveSM(soft = null){
        const softCheck = async (title, fn) => {
            if (soft && typeof soft.check === 'function') return soft.check.call(soft, title, fn);
            return fn();
        };

        // Approve Surat Muatan
        await this.btnApproveSM.waitForDisplayed({ timeout: 5000 });
        await this.btnApproveSM.waitForClickable({ timeout: 5000 });
        await this.btnApproveSM.click();

        // Setelah klik Approve dan pindah ke tab print sebelumnya
        await browser.waitUntil(async () => (await browser.getWindowHandles()).length > 1, {
            timeout: 10000,
            timeoutMsg: 'Tab print tidak muncul setelah approve.',
        });

        // Simpan handle utama dan pindah ke print tab
        const mainHandle = await browser.getWindowHandle();
        const handles = await browser.getWindowHandles();
        const printHandle = handles.find(h => h !== mainHandle);
        await browser.switchToWindow(printHandle);

        // Tunggu halaman print terbuka
        await browser.waitUntil(async () => (await browser.getUrl()).includes('print/'), {
            timeout: 10000,
            timeoutMsg: 'Halaman print gagal dimuat setelah approve.',
        });

        // Tutup tab print dan kembali ke tab utama
        await browser.closeWindow();
        await browser.switchToWindow(mainHandle);

        // === BALIK KE TAB UTAMA ===

        // Tutup modal
        const btnCloseModal = $('button.vs-dialog__close');
        await btnCloseModal.waitForDisplayed({ timeout: 5000 });
        await btnCloseModal.click();

        await browser.pause(1000);

        
        // Ambil nilai di baris pertama kolom pertama
        const firstCell = await $('(//table//tr[1]//td[1]//span[@class="text-link"])[1]');
        await firstCell.waitForDisplayed({ timeout: 5000 });
        const smNumber = await firstCell.getText();
        console.log(` Nomor Surat Muatan di tabel: ${smNumber}`);

        // Klik nomor SM (text-link)
        await firstCell.click();

        // Klik tombol Print
        const btnPrint = await $('button[data-testid="print-button"]');
        await btnPrint.waitForDisplayed({ timeout: 5000 });
        await btnPrint.waitForClickable({ timeout: 5000 });
        await btnPrint.click();

        // Tunggu tab print baru muncul
        await browser.waitUntil(async () => (await browser.getWindowHandles()).length > 1, {
            timeout: 10000,
            timeoutMsg: 'Tab print tidak muncul setelah klik print.',
        });

        // Ambil handle baru dan pindah ke tab print
        const handlesAfterPrint = await browser.getWindowHandles();
        const newPrintHandle = handlesAfterPrint.find(h => h !== mainHandle);
        await browser.switchToWindow(newPrintHandle);

        // Tunggu sampai URL print muncul
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('print/');
        }, {
            timeout: 10000,
            timeoutMsg: 'URL print tidak muncul.',
        });

        const currentUrl = await browser.getUrl();
        console.log(` URL print terdeteksi: ${currentUrl}`);

        // Ambil segmen ke-4 dari URL
        const urlParts = currentUrl.split('/');
        const printedSM = decodeURIComponent(urlParts[5]);
        console.log(` Nomor Surat Muatan di URL print: ${printedSM}`);

        const normalize = str => decodeURIComponent(str).replace(/\\/g, '/').trim();

        // Validasi: pastikan nomor di tabel = nomor di url print
        await softCheck(`[Create SM] Nomor surat muatan di URL print ${printedSM}, tidak sesuai dengan input ${smNumber}`, () => {
            expect(normalize(printedSM)).toBe(normalize(smNumber));
        });
        console.log(`Nomor Surat Muatan pada halaman print sesuai: ${normalize(printedSM)}, dengan yang ada di URL ${normalize(smNumber)}`);


        // Tutup tab print
        await browser.closeWindow();

        // Kembali ke tab utama
        await browser.switchToWindow(mainHandle);

        await btnCloseModal.waitForDisplayed({ timeout: 5000 });
        await btnCloseModal.waitForClickable({ timeout: 5000 });
        await btnCloseModal.click();
        
        return { smNumber };   
    }

    async searchPre(smNumber, soft = null) {
        await this.inputSearch.waitForDisplayed({ timeout: 5000 });
        await this.inputSearch.click();
        await this.inputSearch.setValue(smNumber);
        await browser.keys(['Enter']);
        await browser.pause(3000);

        const softCheck = async (title, fn) => {
            if (soft && typeof soft.check === 'function') return soft.check.call(soft, title, fn);
            return fn();
        };

        // Ambil nilai di baris pertama kolom pertama
        const firstCell = await $('(//table//tr[1]//td[1]//span[@class="text-link"])[1]');
        await firstCell.waitForDisplayed({ timeout: 5000 });
        const num = await firstCell.getText();
        console.log(` Nomor Surat Muatan di tabel: ${num}`);
        console.log(` Nomor Surat Muatan di input: ${smNumber}`);
        const normalize = str => decodeURIComponent(str).replace(/\\/g, '/').trim();
         // Validasi: pastikan nomor di tabel = nomor di input
        await softCheck(`[Create SM] Nomor surat muatan di tabel ${num}, tidak sesuai dengan input ${smNumber}`, () => {
            expect(normalize(smNumber)).toBe(normalize(num));
        });
    }
}

export default new OutSMPage();
