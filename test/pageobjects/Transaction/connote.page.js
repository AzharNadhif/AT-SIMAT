import { $, $$, browser, expect } from '@wdio/globals';
import assert from 'assert';

class ConnotePage {
    get pageTitle() {
        return $('h2*=New Transactions');
    }
    // ===== GET ORIGIN =====
    get boxOrigin() {
        return $('div[data-testid="origin"]');
    }

    get inputOriginName() {
        return $('input[data-testid="input-origin_name"]');
    }

    get inputOriginPhone() {
        return $('input[data-testid="input-origin_phone"]');
    }

    get inputOriginAddress() {
        return $('input[data-testid="input-origin_address"]');
    }
    
    get inputOriginOnchange(){
        return $('input[data-testid="input-origin_onchange_address"]');
    }

    // ===== GET DESTINATION =====
    get boxDestination() {
        return $('div[data-testid="destination"]');
    }
    
get inputDestinationName( ) {
        return $('input[data-testid="input-destination_name"]');
    }

    get inputDestinationPhone() {
        return $('input[data-testid="input-destination_phone"]');
    }

    get inputDestinationAddress() {
        return $('input[data-testid="input-destination_address"]');
    }

    get inputDestinationOnchange() {
        return $('input[data-testid="input-destination_onchange_address"]');
    }
        
    // ===== GET PACKAGE INFORMATION =====
    get boxPackage() {
        return $('div[data-testid="package"]');
    }

    get koliDescription() {
        return $('input[data-testid="input-koli_description"]');
    }

    get koliKategori() {
        return $('div[data-testid="select-package_category"]');
    }

    get amountCOD() {
        return $('input[data-testid="input-amount_cod"]');
    }

    get goodsValue() {
        return $('input[data-testid="input-insured_goods_value"]');
    }

    get amountDiscount() {
        return $('input[data-testid="input-amount_discount"]');
    }
    
    get remarks() { //instruksi khusus
        return $('input[data-testid="input-remarks"]');
    }
    
    get btnBpik() {
        return $('button[data-testid="bpik-button"]');
    }
    
    get koliJumlah() { 
        return $('input[data-testid="input-koli_jumlah"]');
    }
    
    get koliWeight() {
        return $('input[data-testid="input-koli_weight"]');
    }

    get koliLength() {
        return $('input[data-testid="input-koli_length"]');
    }
    
    get koliWidth() {
        return $('input[data-testid="input-koli_width"]');
    }

    get koliHeight() {
        return $('input[data-testid="input-koli_height"]');
    }

    get tidakPackingKayu() {
        return $('label[data-testid="checkbox-Tidak Packing Kayu"] .el-checkbox__inner');
    }

    get tidakAsuransi() {
        return $('label[data-testid="checkbox-Tidak Asuransi"] .el-checkbox__inner');
    }

    get btnPrint() {
        return $('button[data-testid="print-button"]');
    }

    //  ===== MULTIPLE KOLI =====
    get btnAturBerat() { 
        return $('button[data-testid="atur-berat-button"]');
    }

    get weightMultiple1() { 
        return $('input[data-testid="input-actual_weight|0"]');
    }
    
    get lengthMultiple1() { 
        return $('input[data-testid="input-length|0"]');
    }

    get widthMultiple1() { 
        return $('input[data-testid="input-width|0"]');
    }

    get heightMultiple1() { 
        return $('input[data-testid="input-height|0"]');
    }

    get weightMultiple2() { 
        return $('input[data-testid="input-actual_weight|1"]');
    }
    
    get lengthMultiple2() { 
        return $('input[data-testid="input-length|1"]');
    }

    get widthMultiple2() { 
        return $('input[data-testid="input-width|1"]');
    }

    get heightMultiple2() { 
        return $('input[data-testid="input-height|1"]');
    }

    get descriptionMultiple2() { 
        return $('input[data-testid="input-description|1"]');
    }

    get modalMultiple() {
        return $('//div[contains(@class,"vs-dialog__content") and .//h4[contains(text(),"Multiple Koli")]]');
    }

    get submitMultiple() {
        return this.modalMultiple.$('button[data-testid="submit-button"]');
    }
    //  ===== SURCHARGE =====
    get btnSurcharge() {
        return $('button[data-testid="surcharge-button"]');
    }
    get surchargeModal() {
        return $('//div[contains(@class,"vs-dialog__content") and .//h4[contains(text(),"Surcharge")]]');
    }
    //  GET CHECKBOX GROUP 
    getGroupContainer(groupName) {
        return $(`//label[@data-testid="checkbox-${groupName}"]/ancestor::div[@data-testid="checkbox-wrapper"]`);
    }

    get submitSurcharge() {
        return this.surchargeModal.$('button[data-testid="submit-button"]');
    }

    // Section Calculator
    get selectConnote() {
        return $('[data-testid="select-list-connote"] input.el-input__inner');
    }

    get selectConnoteDropdownItems() {
        return $$('[data-testid="select-list-connote"] .el-select-dropdown__item');
    }
    
    get btnAddMore() {
        return $('button[data-testid="add-more-button"]');
    }

    get btnApprove() {
        return $('button[data-testid="approve-button"]');
    }

    // ===== GET BPIK =====
    get boxBPIK() {
        return $('div[data-testid="bpik"]');
    }

    get inputItemBPIK() {
        return $('input[data-testid="input-item_name|0"]');
    }

    get inputItemTypeBPIK() {
        return $('input[data-testid="input-item_type|0"]');
    }

    get inputItemNumberBPIK() {
        return $('input[data-testid="input-item_serial_number|0"]');
    }

    get inputItemTotalBPIK() {
        return $('input[data-testid="input-item_total|0"]');
    }

    get inputItemColorBPIK() {
        return $('input[data-testid="input-item_color|0"]');
    }

    get selectItemConditionBPIK() {
        return $('div[data-testid="select-item_condition|0"]');
    }

    get inputItemCompleteBPIK() {
        return $('input[data-testid="input-item_completeness|0"]');
    }

    // ===== URL PACKING KAYU & ASURANSI =====
    get titleSurat() {
        return $('h2*=SURAT PERNYATAAN PENOLAKAN ASURANSI DAN/ATAU PACKING KAYU   ( SPPAP )');    
    }
    get checkboxAsuransi() {
        return  $("//span[normalize-space()='Tidak Asuransi']/preceding-sibling::input[@type='checkbox']");
    }
    get checkboxTidakPackingKayu() {
        return  $("//span[normalize-space()='Tidak Packing Kayu']/preceding-sibling::input[@type='checkbox']");
    }

    //  ===== SUMMARY TRANSACTION =====
    get summaryModal() {
        return $('//div[contains(@class,"vs-dialog__content") and .//h2[contains(text(),"Summary")]]');
    }

    get jumlahConnote() {
        return $("//p[text()='Jumlah Connote']/following-sibling::h3");
    }

    get jumlahKoli() {
        return $("//p[text()='Jumlah Koli']/following-sibling::h3");
    }

    get totalPrice() {
        return $("//p[text()='Total Price']/following-sibling::h3");
    }

    get totalAfterDiscount() {
        return $("//p[text()='Total After Discount']/following-sibling::h3");
    }

    get btnPay() {
        return $("//button/div[contains(text(),'PAY')]");
    }

    // ====== THANK YOU PAGE ======
    get titleThankYou() {
        return $('h1*=Thank You');
    }

    //  ===== ACTIONS CREATE CONNOTE MAIN =====
    async fillOrigin(data) { // fill data pengirim
        await this.boxOrigin.waitForDisplayed({ timeout: 5000 });

        if (data.namaPengirim) {
            await this.inputOriginName.waitForDisplayed({ timeout: 5000 });
            await this.inputOriginName.setValue(data.namaPengirim);
        }

        if (data.teleponPengirim) {
            await this.inputOriginPhone.waitForDisplayed({ timeout: 5000 });
            await this.inputOriginPhone.setValue(data.teleponPengirim);
        }

        if (data.alamatPengirim) {
            await this.inputOriginAddress.waitForDisplayed({ timeout: 5000 });
            await this.inputOriginAddress.setValue(data.alamatPengirim);
        }

       if (data.provinsiPengirim) {
            await this.inputOriginOnchange.waitForDisplayed({ timeout: 5000 });
            await this.inputOriginOnchange.click();
            await this.inputOriginOnchange.setValue(data.provinsiPengirim);

            // tunggu table suggestion muncul
            const suggestion = await $(`//table[contains(@class,"tariff_selector")]//tr[contains(., "${data.provinsiPengirim}")]`);

            try {
                await suggestion.waitForDisplayed({ timeout: 5000 });
                await suggestion.click();
            } catch (e) {
                // fallback kalau gagal klik (misalnya row hilang)
                await browser.keys(['ArrowDown']);
                await browser.pause(300);
                await browser.keys(['Enter']);
            }
        }

    }

    // fill data penerima
    async fillDestination(data){ 
        await this.boxDestination.waitForDisplayed({ timeout: 5000 });

        if(data.namaPenerima){
            await this.inputDestinationName.waitForDisplayed({ timeout: 5000 });
            await this.inputDestinationName.setValue(data.namaPenerima);
        }
        if(data.teleponPenerima){
            await this.inputDestinationPhone.waitForDisplayed({ timeout: 5000 });
            await this.inputDestinationPhone.setValue(data.teleponPenerima);
        }
        if(data.alamatPenerima){
            await this.inputDestinationAddress.waitForDisplayed({ timeout: 5000 });
            await this.inputDestinationAddress.setValue(data.alamatPenerima);
        }
        if (data.provinsiPenerima) {
            await this.inputDestinationOnchange.waitForDisplayed({ timeout: 5000 });
            await this.inputDestinationOnchange.click();
            await browser.keys(['Control', 'a']); // select all
            await browser.keys('Delete'); // hapus semua
            await browser.pause(3000); 
            await this.inputDestinationOnchange.setValue(data.provinsiPenerima);
            // await browser.pause(3000);
            // tunggu table suggestion muncul
            // const suggestion = await $(`//table[contains(@class,"tariff_selector")]//tr[contains(., "${data.provinsiPenerima}")]`);

            // try {
            //     await suggestion.waitForDisplayed({ timeout: 5000 });
            //     await suggestion.click();
            //     await browser.pause(1000);
            // } catch (e) {
            //     // fallback kalau gagal klik (misalnya row hilang)
            //     await browser.keys(['ArrowDown']);
            //     await browser.pause(1000);
            //     await browser.keys(['Enter']);
            // }
        }

    }
    
    // Pilih Service berdasarkan key
    async selectService(serviceKey) { 
        const testIdMap = {
            REG: 'radio-reg23',
            YES: 'radio-yes23',
            JTR: 'radio-jtr23',
            CTC: 'radio-ctc23',
            CTCYES: 'radio-ctcyes23',
            CTCJTR: 'radio-ctcjtr23',
        };

        if (!testIdMap[serviceKey]) {
            throw new Error(` Service ${serviceKey} tidak dikenali`);
        }

        const locator = await $(`[data-testid="${testIdMap[serviceKey]}"] label`);
        await locator.scrollIntoView();
        await locator.waitForClickable({ timeout: 5000 });
        await locator.click();

        console.log(` Service selected: ${serviceKey}`);
    }

    // fill data package information
    async fillPackageInformation(data){
        if(data.deskripsiBarang){
            await this.koliDescription.scrollIntoView();
            await this.koliDescription.waitForDisplayed({ timeout: 5000 });
            await this.koliDescription.setValue(data.deskripsiBarang);
        }
        if (data.kategori){
            // 1) buka dropdown
            await this.koliKategori.waitForClickable({ timeout: 5000 });
            await this.koliKategori.click();

            // 2) pilih item by text 
            const optionItem = await $(`//li[normalize-space()="${data.kategori}"]`);
            await optionItem.waitForClickable({ timeout: 5000 });
            await optionItem.click();
        }
        if (data.service){
            await this.selectService(data.service);
        }
        if (data.cod){
            await this.amountCOD.waitForDisplayed({ timeout: 5000 });
            await this.amountCOD.click();
             // Kirim backspace beberapa kali untuk clear value
            for (let i = 0; i < 10; i++) {
                await browser.keys('Backspace');
            }
            await this.amountCOD.clearValue();
            await this.amountCOD.setValue(data.cod);
        }
        if (data.nilaiBarang){
            await this.goodsValue.waitForDisplayed({ timeout: 5000 });
            await this.goodsValue.setValue(data.nilaiBarang);
        }
        if (data.diskon){
            await this.amountDiscount.waitForDisplayed({ timeout: 5000 });
            await this.amountDiscount.setValue(data.diskon);
        }
        if (data.instruksiKhusus){  
            await this.remarks.waitForDisplayed({ timeout: 5000 });
            await this.remarks.setValue(data.instruksiKhusus);
        }
        if (data.jumlah){
            await this.koliJumlah.scrollIntoView({ block: 'start' });
            await browser.execute(() => window.scrollBy(0, -80)); // kira-kira tinggi header
            await this.koliJumlah.waitForDisplayed({ timeout: 5000 });
            await browser.pause(500);
            await this.koliJumlah.click();
            await browser.pause(3000);
             // Kirim backspace beberapa kali untuk clear value
            for (let i = 0; i < 10; i++) {
                await browser.keys('Backspace');
            }
            await this.koliJumlah.clearValue();
            await browser.pause(3000);
            await this.koliJumlah.setValue(data.jumlah);
            await browser.pause(3000);


            if (Number(data.jumlah) > 1) {
            await this.btnAturBerat.waitForDisplayed({ timeout: 5000 });
            await this.btnAturBerat.waitForClickable({ timeout: 5000 });
            await this.btnAturBerat.click();

            // koli pertama
            await this.weightMultiple1.waitForDisplayed({ timeout: 5000});
            await this.weightMultiple1.click();
            // Kirim backspace beberapa kali untuk clear value
            for (let i = 0; i < 10; i++) {
                await browser.keys('Backspace');
            }
            await this.weightMultiple1.clearValue();
            await this.weightMultiple1.setValue(data.weight1);

            await this.lengthMultiple1.waitForDisplayed({ timeout: 5000});
            await this.lengthMultiple1.click();
            // Kirim backspace beberapa kali untuk clear value
            for (let i = 0; i < 10; i++) {
                await browser.keys('Backspace');
            }
            await this.lengthMultiple1.clearValue();
            await this.lengthMultiple1.setValue(data.length1);
            
            await this.widthMultiple1.waitForDisplayed({ timeout: 5000});
            await this.widthMultiple1.click();
            // Kirim backspace beberapa kali untuk clear value
            for (let i = 0; i < 10; i++) {
                await browser.keys('Backspace');
            }
            await this.widthMultiple1.clearValue();
            await this.widthMultiple1.setValue(data.width1);

            await this.heightMultiple1.waitForDisplayed({ timeout: 5000});
            await this.heightMultiple1.click();
            // Kirim backspace beberapa kali untuk clear value
            for (let i = 0; i < 10; i++) {
                await browser.keys('Backspace');
            }
            await this.heightMultiple1.clearValue();
            await this.heightMultiple1.setValue(data.height1);

            // koli kedua
            await browser.pause(5000); // coba pause
            await this.weightMultiple2.waitForDisplayed({ timeout: 5000});
            await this.weightMultiple2.click();
            // Kirim backspace beberapa kali untuk clear value
            for (let i = 0; i < 10; i++) {
                await browser.keys('Backspace');
            }
            await this.weightMultiple2.clearValue();
            await this.weightMultiple2.setValue(data.weight2);

            await this.lengthMultiple2.waitForDisplayed({ timeout: 5000});
            await this.lengthMultiple2.click();
            // Kirim backspace beberapa kali untuk clear value
            for (let i = 0; i < 10; i++) {
                await browser.keys('Backspace');
            }
            await this.lengthMultiple2.clearValue();
            await this.lengthMultiple2.setValue(data.length2);

            await this.widthMultiple2.waitForDisplayed({ timeout: 5000});
            await this.widthMultiple2.click();
            // Kirim backspace beberapa kali untuk clear value
            for (let i = 0; i < 10; i++) {
                await browser.keys('Backspace');
            }
            await this.widthMultiple2.clearValue();
            await this.widthMultiple2.setValue(data.width2);

            await this.heightMultiple2.waitForDisplayed({ timeout: 5000});
            await this.heightMultiple2.click();
            // Kirim backspace beberapa kali untuk clear value
            for (let i = 0; i < 10; i++) {
                await browser.keys('Backspace');
            }
            await this.heightMultiple2.clearValue();
            await this.heightMultiple2.setValue(data.height2);

            await this.descriptionMultiple2.waitForDisplayed({ timeout: 5000});
            await this.descriptionMultiple2.setValue(data.deskripsiBarang2);
            
            }   else if (data.weight){ // berat single connote
                await this.koliWeight.waitForDisplayed({ timeout: 5000 });
                await this.koliWeight.click();
                // Kirim backspace beberapa kali untuk clear value
                for (let i = 0; i < 10; i++) {
                    await browser.keys('Backspace');
                }
                await this.koliWeight.clearValue();
                await this.koliWeight.setValue(data.weight);
            }
        }
        
        if (data.length){
            await this.koliLength.waitForDisplayed({ timeout: 5000})
            await this.koliLength.click();
            // Kirim backspace beberapa kali untuk clear value
            for (let i = 0; i < 10; i++) {
                await browser.keys('Backspace');
            }
            await this.koliLength.clearValue();
            await this.koliLength.setValue(data.length);
        }
        if (data.width){
            await this.koliWidth.waitForDisplayed( { timeout: 5000 } );
            await this.koliWidth.click();
            // Kirim backspace beberapa kali untuk clear value
            for (let i = 0; i < 10; i++) {
                await browser.keys('Backspace');
            }
            await this.koliWidth.clearValue();
            await this.koliWidth.setValue(data.width);
        }
        if (data.height){
            await this.koliHeight.waitForDisplayed({ timeout: 5000 });
            await this.koliHeight.click();
            // Kirim backspace beberapa kali untuk clear value
            for (let i = 0; i < 10; i++) {
                await browser.keys('Backspace');
            }
            await this.koliHeight.clearValue();
            await this.koliHeight.setValue(data.height);
        }
    }

    // Check Surcharge Value
    async getTableValue(label) {
        const row = await $(`//tr[td[translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')='${label.toLowerCase()}']]`);
        const value = await row.$('./td[2]').getText();
        return value.trim();
    }


    //  Async Submit
    async submit(){ 
        await this.btnApprove.scrollIntoView();
        await this.btnApprove.waitForDisplayed({ timeout: 5000 });
        await this.btnApprove.waitForClickable({ timeout: 5000 });
        await this.btnApprove.click();
    }

    // Validate Summary Transaction
    async validateSummaryTransaction({ expectedConnote = null, expectedKoli = null, mode = 'exact' } = {}) {
        await this.summaryModal.waitForDisplayed({ timeout: 10000 });

        await this.jumlahConnote.waitForDisplayed({ timeout: 5000 });
        const jumlahConnoteText = await this.jumlahConnote.getText();
        const jumlahConnote = parseInt(jumlahConnoteText, 10);
        assert(!isNaN(jumlahConnote) && jumlahConnote > 0, 'Jumlah Connote harus berupa angka lebih dari 0');

        await this.jumlahKoli.waitForDisplayed({ timeout: 5000 });
        const jumlahKoliText = await this.jumlahKoli.getText();
        const jumlahKoli = parseInt(jumlahKoliText, 10);
        assert(!isNaN(jumlahKoli) && jumlahKoli > 0, 'Jumlah Koli harus berupa angka lebih dari 0');

        // validation sesuai mode
        if (mode === 'exact') {
            if (expectedConnote !== null) assert(jumlahConnote === expectedConnote, `Expected connote ${expectedConnote} but got ${jumlahConnote}`);
            if (expectedKoli !== null) assert(jumlahKoli === expectedKoli, `Expected koli ${expectedKoli} but got ${jumlahKoli}`);
        }

        return { jumlahConnote, jumlahKoli }; 
    }

    // Click Pay Button
    async clickPay(method) {
        // exact match dengan normalize-space untuk hilangkan spasi ekstra
        const selector = `//ul[contains(@class,"mnu_payment")]//li[a[normalize-space(text())="${method}"]]`;

        const paymentOption = await $(selector);
        await paymentOption.waitForDisplayed({ timeout: 5000 });
        await paymentOption.scrollIntoView();
        await paymentOption.click();

        console.log(`Metode pembayaran dipilih: ${method}`);

        await this.btnPay.scrollIntoView();
        await this.btnPay.waitForDisplayed({ timeout: 5000 });
        await this.btnPay.waitForClickable({ timeout: 5000 });
        await this.btnPay.click();

        console.log(`Click Pay berhasil dengan metode: ${method}`);
    }


    // Validate Complete Transcaction
    async validateThankYouPage(){
        // Pastikan URL benar
        const url = await browser.getUrl();
        if (!url.includes('/transaction/complete/')) {
            throw new Error(`Expected URL to contain "/transaction/complete/", got: ${url}`);
        }
        
        // Pastikan title Thank You muncul
        await this.titleThankYou.waitForDisplayed({ timeout: 10000 });
        const titleText = await this.titleThankYou.getText();
        assert(titleText && titleText.includes('Thank You'), `Expected title to include "Thank You", got: ${titleText}`);
        
        // Tekan tombol spasi
        await browser.keys(['Space']);
    }

    // ===== ACTIONS SURCHARGE =====
    // Checkbox
    async toggleCheckbox(groupName){
        await this.btnSurcharge.waitForDisplayed({ timeout: 5000 });
        await this.btnSurcharge.waitForClickable({ timeout: 5000 });
        await this.btnSurcharge.click();
        await browser.pause(300);

        const checkboxLabel = await $(`//label[@data-testid="checkbox-${groupName}"]`);
        await checkboxLabel.waitForDisplayed({ timeout: 5000 });
        await checkboxLabel.waitForClickable({ timeout: 5000 });
        await checkboxLabel.click();
    };

    // Option Radio
    async selectRadioOption(optionName) {
        // cari elemen label radio button berdasarkan nama option
        const radioLabel = await $(`//label[normalize-space()="${optionName}"]`);
        await radioLabel.waitForDisplayed({ timeout: 5000 });
        await radioLabel.waitForClickable({ timeout: 5000 });
        await radioLabel.click();

        // Submit Surcharge
        await this.submitSurcharge.waitForDisplayed({ timeout: 5000 });
        await this.submitSurcharge.waitForClickable({ timeout: 5000 });
        await this.submitSurcharge.click();
    }   

    // Input manual surcharge
    async setManualSurcharge(groupName, value) {
        // pastikan checkbox sudah diaktifkan
        const input = await $(`//input[@data-testid="input-surcharge_manual|${groupName}"]`);
        await input.waitForDisplayed({ timeout: 5000 });
        await input.click();

        // clear dulu
        await browser.keys(['Control', 'a']);
        await browser.keys('Delete');
        // isi value baru
        await input.setValue(value);

        // Submit Surcharge
        await this.submitSurcharge.waitForDisplayed({ timeout: 5000 });
        await this.submitSurcharge.waitForClickable({ timeout: 5000 });
        await this.submitSurcharge.click();
    }
    

    //  ===== ACTIONS CREATE CONNOTE INTRACITY =====
    async waitNewWindows(beforeHandles, { timeout = 15000 } = {}) {
        await browser.waitUntil(async () => {
            const handles = await browser.getWindowHandles();
            return handles.length > beforeHandles.length;
        }, { timeout, interval: 200, timeoutMsg: 'Expected new window(s) to open' });
        return browser.getWindowHandles();
    }

    async switchToBPIKWindowByUrl({ timeout = 8000 } = {}) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const handles = await browser.getWindowHandles();
            for (const h of handles) {
                await browser.switchToWindow(h);
                try {
                    const url = await browser.getUrl();
                    if (url.includes('/bpik/')) return h;
                }   catch {}
            }
            await browser.pause(250);
        }
        return null;
    }

    // ===== ACTIONS BPIK
    async fillBPIK(data){
        await this.btnBpik.waitForDisplayed({ timeout: 5000 });
        await this.btnBpik.click();
        
        await this.boxBPIK.waitForDisplayed({ timeout: 5000 });

        if (data.namaKirimanBPIK){
            await this.inputItemBPIK.waitForDisplayed({ timeout: 5000 });
            await this.inputItemBPIK.setValue(data.namaKirimanBPIK);
        }

        if (data.jenisKirimanBPIK){
            await this.inputItemTypeBPIK.waitForDisplayed({ timeout: 5000 });
            await this.inputItemTypeBPIK.setValue(data.jenisKirimanBPIK);
        }

        if (data.imeiBPIK){
            await this.inputItemNumberBPIK.waitForDisplayed({ timeout: 5000 });
            await this.inputItemNumberBPIK.setValue(data.imeiBPIK);
        }

        if (data.jumlahBPIK){
            await this.inputItemTotalBPIK.waitForDisplayed({ timeout: 5000 });
            await this.inputItemTotalBPIK.setValue(data.jumlahBPIK);
        }

        if (data.warnaBPIK){
            await this.inputItemColorBPIK.waitForDisplayed({ timeout: 5000 });
            await this.inputItemColorBPIK.setValue(data.warnaBPIK);
        }

        if (data.kondisiBPIK){
            await this.selectItemConditionBPIK.waitForDisplayed({ timeout: 5000 });
            await this.selectItemConditionBPIK.click();

            const optionItem = $(`//li[normalize-space()='${data.kondisiBPIK}']`);
            await optionItem.waitForClickable({ timeout: 5000 });
            await optionItem.click();
            await browser.pause(500);
        }

        if (data.kelengkapanBPIK){
            await this.inputItemCompleteBPIK.waitForDisplayed({ timeout: 5000 });
            await this.inputItemCompleteBPIK.setValue(data.kelengkapanBPIK);
        }
    }
    
    async submitMultipleKoli() {
        // Submit Surcharge
        await this.submitMultiple.waitForDisplayed({ timeout: 5000 });
        await this.submitMultiple.waitForClickable({ timeout: 5000 });
        await this.submitMultiple.click();
    }

    //  ===== ACTIONS CREATE CONNOTE DOMESTIC =====
    // ===== ACTIONS Create Connote Service REG (TIDAK PACKING KAYU & VOLUMETRIC)
    // Click Not Packing Kayu
    async clickNotPackingKayu() {
        await this.tidakPackingKayu.waitForDisplayed({ timeout: 5000 });
        await this.tidakPackingKayu.scrollIntoView();
        await this.tidakPackingKayu.waitForClickable({ timeout: 5000 });
        await this.tidakPackingKayu.click();
        console.log("Click Print Tidak Packing Kayu berhasil");
        await this.btnPrint.waitForDisplayed({ timeout: 5000 });
        await this.btnPrint.waitForClickable({ timeout: 5000 });
        await this.btnPrint.click();
    }

    // VALIDASI CHECKBOX STATUS PACKING KAYU & ASSURANSI  di TAB SPPAP 
    async validateCheckboxStatus(option, expected){ // Checkbox Tidak Packing Kayu / Tidak Asuransi
        let checkbox;
        if(option === 'Packing'){
            checkbox = await this.checkboxTidakPackingKayu;
        }else if(option === 'Asuransi'){
            checkbox = await this.checkboxAsuransi;
        } else {
            throw new Error(`Option ${option} tidak dikenali`);
        }
        
        await checkbox.waitForDisplayed({ timeout: 5000 });
        const isChecked = await checkbox.isSelected();

        if (expected) {
            await expect(isChecked).toBe(true);
        } else {
            await expect(isChecked).toBe(false);
        }
    }

    // Tutup tab SPPAP Packing Kayu/Asuransi
    async closeSSAPTab(mainHandle) {
        const allHandles = await browser.getWindowHandles();
        for (const handle of allHandles) {
            if (handle !== mainHandle) {
                await browser.switchToWindow(handle);
                await browser.closeWindow(); // tutup tab SPPAP
                break;
            }
        }
        await browser.switchToWindow(mainHandle); // balik ke main tab
    }

    // CHECK VOLUMETRIC
    async validateChargeableWeight(data) {
        const length = Number(data.length);
        const width  = Number(data.width);
        const height = Number(data.height);

        const expectedVolumetric = Math.round((length * width * height) / 6000);

        const chargeableCell = await $("//tr[td[normalize-space()='chargeable Weight']]/td[2]");
        await chargeableCell.waitForDisplayed({ timeout: 5000 });
        const chargeableText = await chargeableCell.getText();
        const actualChargeable = parseFloat(chargeableText);

        expect(actualChargeable).toBeCloseTo(expectedVolumetric, 2);
    }

    //  CHECK PRICE AFTER DISCOUNT
    parseCurrency(text) {
        return Number(
            text
                .replace(/[Rp\s]/g, '')   // hapus Rp dan spasi
                .replace(/\./g, '')       // hapus titik ribuan
                .replace(/,00$/, '')      // hapus ,00 di belakang
        );
    }

    async validatePriceAfterDiscount(data) {
        await this.summaryModal.scrollIntoView();
        await this.summaryModal.waitForDisplayed({ timeout: 5000 });

        const diskon = Number(data.diskon);

        // ambil total price dari UI
        const totalPriceText = await this.totalPrice.getText();
        const totalHarga = this.parseCurrency(totalPriceText);

        // hitung expected (rupiah penuh)
        const expectPriceAfterDiscount = totalHarga - diskon;

        // ambil actual dari UI
        const actualPriceAfterDiscountText = await this.totalAfterDiscount.getText();
        const actualPriceAfterDiscount = this.parseCurrency(actualPriceAfterDiscountText);

        // debug
        console.log({
            totalHarga,
            diskon,
            expectPriceAfterDiscount,
            actualPriceAfterDiscount
        });

        // validasi
        expect(actualPriceAfterDiscount).toBe(expectPriceAfterDiscount);
    }

    // AT-CORE-0012-02
    // Click Tidak Asuransi
    async clickNotAsuransi() {
        await this.tidakAsuransi.waitForDisplayed({ timeout: 5000 });
        await this.tidakAsuransi.scrollIntoView();
        await this.tidakAsuransi.waitForClickable({ timeout: 5000 });
        await this.tidakAsuransi.click();
        console.log("Click Print Tidak Asuransi berhasil");
        await this.btnPrint.waitForDisplayed({ timeout: 5000 });
        await this.btnPrint.waitForClickable({ timeout: 5000 });
        await this.btnPrint.click();
    }
}

export default new ConnotePage();
