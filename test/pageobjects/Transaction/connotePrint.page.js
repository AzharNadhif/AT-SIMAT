import SoftError from '../../helpers/softerror.js';

class ConnotePrintPage {
   
    // ====== CONTAINER PER SHEET (connote) ======
    // gunakan section.sheet supaya setiap index mewakili 1 resi
    sheet(index = 0) {
        // pilih section ke-(index+1)
        return $(`(//section[contains(@class,'sheet')])[${index + 1}]`);
    }

    // ====== COUNT / WAIT HELPERS ======
    async countSheets() {
        const arr = await $$('//section[contains(@class,"sheet")]');
        return arr.length;
    }

    // tunggu sampai ada minimal expectedCount sheet di halaman print
    async waitForPrintSheets(expectedCount, timeout = 15000) {
        await browser.waitUntil(
            async () => {
                const c = await this.countSheets();
                return c >= expectedCount;
            },
            {
                timeout,
                timeoutMsg: `Expected at least ${expectedCount} print sheets but found ${await this.countSheets()}`
            }
        );
    }

    namaPengirim(index = 0) {
        return this.sheet(index).$(`span[data-testid="shipper-name"]`);
    }

    alamatPengirim(index = 0) {
        return this.sheet(index).$(`span[data-testid="shipper-address"]`);
    }

    noPengirim(index = 0) {
        return this.sheet(index).$(`span[data-testid="shipper-phone"]`);
    }

    namaPenerima(index = 0) {
        return this.sheet(index).$(`span[data-testid="receiver-name"]`);
    }

    alamatPenerima(index = 0) {
        return this.sheet(index).$(`span[data-testid="receiver-address"]`);
    }

    noPenerima(index = 0) {
        return this.sheet(index).$(`span[data-testid="receiver-phone"]`);
    }

    deskripsi(index = 0) {
        return this.sheet(index).$(`td[data-testid="description"]`);
    }

    instruksi(index = 0) {
        return this.sheet(index).$(`td[data-testid="remarks"]`);
    }

    service(index = 0) {
        return this.sheet(index).$(`td[data-testid="service-name"]`);
    }

    berat(index = 0) {
        return this.sheet(index).$(`span[data-testid="weight"]`);
    }
    
    jumlahKiriman(index = 0) {
        return this.sheet(index).$(`span[data-testid="koli-qty"]`);
    }

    asuransi(index = 0) {
        return this.sheet(index).$(`span[data-testid="insurance"]`);
    }

    pembayaran(index = 0) {
        return this.sheet(index).$(`span[data-testid="payment-type-detail"]`);
    }

    tanggalConnote(index = 0) {
        return this.sheet(index).$(`span[data-testid="transaction-date"]`);
    }

    maxDelivery(index = 0) {
        return this.sheet(index).$(`span[data-testid="maximum-delivery"]`);
    }

    get grandTotal() {
        return $("//td[h3[text()='Grand Total']]/following-sibling::td/h3");
    }

    get total() {
        return $(`td[data-testid="total-price"]`);
    }

    get connoteNumber() {
        return $('span[data-testid="connote-number"]');
    }

    // ===== WINDOW HANDLING =====
    async switchToPrintWindow() {
        const handles = await browser.getWindowHandles();
        const mainHandle = await browser.getWindowHandle();
        for (const handle of handles) {
            if (handle !== mainHandle) {
                await browser.switchToWindow(handle);
                return mainHandle; // kembalikan handle utama supaya bisa dipakai lagi
            }
        }
    }

    async closePrintWindow(mainHandle) {
        await browser.closeWindow();
        if (mainHandle) {
            await browser.switchToWindow(mainHandle);
        }
    }

    // normalize nomor telepon 08 -> 62
    normalizePhone(phone) {
        phone = phone.replace(/[\s\-]/g, '');
        
        if (phone.startsWith('08')) {
            return '628' + phone.slice(2);
        } else if (phone.startsWith('8')) {
            return '62' + phone;
        } else if (phone.startsWith('+62')) {
            return phone.slice(1);
        }
        
        return phone; // Sudah format 62xxx
    }
    
    toNum(v) {
        return Number(String(v ?? '').trim().replace(',', '.')) || 0;
    }

    // ==== helper deskripsi dinamis (deskripsiBarang, deskripsiBarang2, dst) ====
    getExpectedDescription(testData, index = 0) {
        // cari semua key yang match: deskripsiBarang, deskripsiBarang2, deskripsiBarang3, ...
        const keys = Object.keys(testData).filter(k => /^deskripsiBarang(\d+)?$/i.test(k));
        if (keys.length === 0) return undefined;

        // petakan ke index 0-based: deskripsiBarang -> 0, deskripsiBarang2 -> 1, dst
        const mapped = keys.map(k => {
            const m = k.match(/(\d+)$/);
            const i = m ? Number(m[1]) - 1 : 0; // tanpa angka = pertama (index 0)
            return { key: k, i };
        }).sort((a, b) => a.i - b.i);

        // ambil yang sesuai index; fallback ke item pertama kalau index out-of-range
        const chosen = mapped.find(x => x.i === index) ?? mapped[0];
        return testData[chosen.key];
    }


    computeExpectedChargeable(testData) {
        // ambil semua weight (support weight1, weight2, dst)
        const weightKeys = Object.keys(testData).filter(k => /^weight\d*$/i.test(k));
        let actual = 0;
        if (weightKeys.length) {
            for (const k of weightKeys) actual += this.toNum(testData[k]);
        } else {
            actual = this.toNum(testData.weight);
        }

        if (testData.packingKayu) actual *= 2;

        // volumetric (pakai length/width/height tunggal aja dulu biar simpel)
        const vol = this.toNum(testData.length) *
                    this.toNum(testData.width) *
                    this.toNum(testData.height);
        const volumetric = vol ? Math.round(vol/6000) : 0;

        return Math.max(actual, volumetric);
    }

    sanitizeInstruksi(text) {
        return String(text)
            .replace(/^Instruksi\s*Khusus\s*:?\s*/i, '') // buang label di depan
            .trim();
    }

    // ====== VALIDATION =====
    async validatePrintData(paymentMethod, testData, index = 0, soft = null, overrides = {}) {
        
        const softCheck = async (title, fn) => {
            if (soft && typeof soft.check === 'function') {
                // panggil method di instance soft 
                return await soft.check.call(soft, title, fn);
            }
            return await fn();
        };

        // pengirim
        const namaPengirim = await this.namaPengirim(index).getText();
        const noPengirim = await this.noPengirim(index).getText();
        const alamatPengirim = await this.alamatPengirim(index).getText();

        softCheck('Nama Pengirim', () => {
            expect(namaPengirim).toEqual(testData.namaPengirim);
        });
        softCheck('Nomor Pengirim', () => {
            expect(this.normalizePhone(noPengirim)).toEqual(this.normalizePhone(testData.teleponPengirim));
        });
        softCheck('Alamat Pengirim', () => {
            expect(alamatPengirim).toContain(testData.provinsiPengirim);
        });
        
        // penerima
        const namaPenerima = await this.namaPenerima(index).getText();
        const noPenerima = await this.noPenerima(index).getText();
        const alamatPenerima = await this.alamatPenerima(index).getText();

        softCheck('Nama Penerima', () => {
            expect(namaPenerima).toEqual(testData.namaPenerima);
        });
        softCheck('Nomor Penerima', () => {
            expect(this.normalizePhone(noPenerima)).toEqual(this.normalizePhone(testData.teleponPenerima));
        });
        softCheck('Alamat Penerima', () => {
            expect(alamatPenerima).toContain(testData.provinsiPenerima);
        });

        // deskripsi barang
        const rawDesc  = await this.deskripsi(index).getText();
        const uiDesc   = this.sanitizeDesc(rawDesc);
        const expectedDesc =
            (overrides?.expectedDesc ?? this.getExpectedDescription(testData, index) ?? testData.deskripsiBarang);

        softCheck('Deskripsi Barang', () => {
            expect(uiDesc.toUpperCase()).toContain(String(expectedDesc).toUpperCase());
        });
        
        // service
        const serviceText = await this.service(index).getText();
        softCheck('Service', () => {
            expect(serviceText).toEqual(testData.service);
        });
       
        // instruksi
        const rawInstruksi = await this.instruksi(index).getText();
        const instruksi = this.sanitizeInstruksi(rawInstruksi);
        const expectedInstruksi = (overrides?.instruksiKhusus ?? testData.instruksiKhusus ?? '').trim();

        softCheck('Instruksi Khusus', () => {
            expect(instruksi).toEqual(expectedInstruksi.toUpperCase());
        });

        // Berat (pakai helper)
        const beratText = await this.berat(index).getText();
        const beratValue = this.toNum(beratText);
        const expectedChargeable = this.computeExpectedChargeable(testData);

        softCheck('Berat Barang', () => {
            expect(beratValue).toEqual(expectedChargeable);
        });

        // jumlah kiriman
        const jumlahText = await this.jumlahKiriman(index).getText();
        const matchJum = jumlahText.match(/([0-9]+)/i);
        if (!matchJum) throw new Error(`Tidak menemukan Jumlah Kiriman di teks: "${jumlahText}"`);
        
        softCheck('Jumlah Kiriman', () => {
            expect(Number(matchJum[1])).toEqual(Number(testData.jumlah));
        });

        // pembayaran
        const pembayaranText = await this.pembayaran(index).getText();

        if (!paymentMethod) throw new Error('Payment method harus diberikan');

        const methodMap = {
            'CASH': 'Tunai',
            'COD ONGKIR': 'COD ONGKIR',
            'EPAY': 'EPAY',
            'COD': ' COD ',
            'CREDIT': 'CREDIT'
        };

        const expectedPembayaran = methodMap[paymentMethod.toUpperCase()];
        if (!expectedPembayaran) throw new Error(`Metode pembayaran "${paymentMethod}" tidak dikenali`);

        softCheck('Jenis Pembayaran', () => {
            expect(pembayaranText).toEqual(expectedPembayaran);
        });

        // ====== TANGGAL ======
        const elTanggal = await this.tanggalConnote(index);
        await elTanggal.waitForDisplayed({ timeout: 5000 });
        const tanggalText = await elTanggal.getText();
        console.log(`Sheet ${index} - Tanggal ditemukan:`, tanggalText);

        const tglMatch = tanggalText.match(/\b(\d{2}-\d{2}-\d{4})\b/);
        if (!tglMatch) throw new Error(`Tanggal tidak ditemukan di sheet index ${index}: "${tanggalText}"`);
        const tanggal = tglMatch[1];

        softCheck('Tanggal Pengiriman', () => {
            expect(tanggal).toMatch(/^\d{2}-\d{2}-\d{4}$/);
        }); 

        // maksimum delivery
        const maksText = await this.maxDelivery(index).getText();
        const maksMatch = maksText.match(/\b(\d{2}-\d{2}-\d{4})\b/);
        if (!maksMatch) throw new Error(`Maksimum Delivery tidak ditemukan di sheet index ${index}: "${maksText}"`);
        const tanggalMaksUI = maksMatch[1];

        // hitung expected maksimum delivery
        const [d, m, y] = tanggal.split('-').map(Number);
        let baseDate = new Date(y, m - 1, d);
        const serviceMap = { REG: 2, YES: 1, JTR: 4, CTC: 2, CTCYES: 1, CTCJTR: 4 };
        const offset = serviceMap[serviceText] || 0;
        baseDate.setDate(baseDate.getDate() + offset);

        const dd = String(baseDate.getDate()).padStart(2, '0');
        const mm = String(baseDate.getMonth() + 1).padStart(2, '0');
        const yyyy = baseDate.getFullYear();
        const expectedMaksDelivery = `${dd}-${mm}-${yyyy}`;

        console.log(`Service: ${serviceText}, Tanggal Kirim: ${tanggal}, Expected MaksDelivery: ${expectedMaksDelivery}, UI MaksDelivery: ${tanggalMaksUI}`);
        
        softCheck('Maksimum Delivery', () => {
            expect(tanggalMaksUI).toEqual(expectedMaksDelivery);
        });

        function toNumber(text) {
            let clean = String(text)
                .replace(/Rp\.?\s?/i, '') // buang "Rp" / "Rp."
                .replace(/\s+/g, '')      // buang spasi
                .replace(/-$/,'')         // buang strip di akhir 
                .replace(/,-$/,'');       // buang ",-" di akhir

            // Jika string berakhir dengan koma + 2 digit, artinya ini format desimal Indonesia
            if (/,(\d{2})$/.test(clean)) {
                // Hapus titik pemisah ribuan, ganti koma jadi titik
                clean = clean.replace(/\./g, '').replace(',', '.'); // "141.000,00" -> "141000,00" -> "141000.00"
            } else {
                // Kalau tidak ada desimal, berarti koma/titik hanya sebagai pemisah ribuan
                clean = clean.replace(/[.,]/g, ''); 
            }

            // Konversi string angka -> number
            const n = Number(clean);
            if (Number.isNaN(n)) {
                throw new Error(`Cannot parse currency: "${text}"`);
            }
            return n;
        }
        
        function formatRupiah(n) {
            return "Rp " + new Intl.NumberFormat('id-ID', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(n);
        }

        // GRAND TOTAL
        await this.total.waitForDisplayed({ timeout: 5000 });
        const totalPrint = await this.total.getText();

        const expected = formatRupiah(toNumber(this._grandTotalBefore));
        const actual   = formatRupiah(toNumber(totalPrint));

        softCheck('Total Biaya', () => {
            expect(actual).toEqual(expected);
        });

        // asuransi
        const asuransiText = (await this.asuransi(index).getText()).trim();
        if (asuransiText === "TIDAK" || asuransiText === "ASURANSI : TIDAK") {
            softCheck('Asuransi = Tidak', () => {
                expect(["TIDAK", "ASURANSI : TIDAK"]).toContain(asuransiText);
            });
        } else {
            const m = asuransiText.match(/([\d.]+,\d{2})\s*\+\s*([\d.]+,\d{2})/i);
            softCheck('Format Asuransi', () => {
                if (!m) throw new Error(`Format Asuransi tidak sesuai: "${asuransiText}"`);
            });
            const formatID = (n) => {
                const [i, f = '00'] = n.toFixed(2).split('.');
                return i.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + f;
            };

            // bandingkan sesuai tampilan
            const nilaiBarang = Number(testData.nilaiBarang);
            const expected = `${formatID(nilaiBarang * 0.002)} + ${formatID(5000)}`;
        
            softCheck('Asuransi = Ya', () => {
                expect(asuransiText).toEqual(expected);
            });
        }

    }

    async storeGrandTotal() {
        this._grandTotalBefore = await this.grandTotal.getText();
    }

    async getConnoteNumberFromPrint() {
        await this.connoteNumber.waitForDisplayed({ timeout: 10000 });
        const raw = await this.connoteNumber.getText();
        // amankan: ambil hanya digit agar clean dan tetap string (jaga leading zero)
        const digits = (raw.match(/\d+/g) || []).join('');
        return digits || raw.trim();
    }  

    // ====== FALLBACK MULTI-CONNOTE MATCHING =====
    async validateAllByMatching(connoteList = []) {
        await this.waitForPrintSheets(connoteList.length, 20000);

        const printedNames = [];
        const sheetCount = await this.countSheets();
        for (let i = 0; i < sheetCount; i++) {
            const nama = await this.namaPengirim(i).getText();
            printedNames.push({ name: nama, index: i });
        }

        for (const expected of connoteList) {
            const match = printedNames.find(x => x.name && x.name.includes(expected.namaPengirim));
            if (!match) throw new Error(`Tidak menemukan printed sheet untuk expected pengirim: ${expected.namaPengirim}`);
            console.log(`Matching sheet index ${match.index} untuk pengirim: ${expected.namaPengirim}`);
            await this.validatePrintData(expected, match.index);
        }
    }

    sanitizeDesc(text) {
        return String(text)
            .replace(/^\s*deskripsi\s*:?\s*/i, '') // buang "Deskripsi :" di awal
            .replace(/\s+/g, ' ')                  // rapikan newline/tab ke spasi tunggal
            .trim();
    }

    // ambil berat di blok atas (detail-info)
    totalBeratGlobal(index = 0) {
        return this.sheet(index).$(`span[data-testid="weight"]`);
    }

    // Validasi multi-koli
    async validateMultiKoli(testData, paymentMethod, soft = null) {
        const softCheck = async (title, fn) => {
            if (soft && typeof soft.check === 'function') return soft.check.call(soft, title, fn);
            return fn();
        };
        
        const expectedRaw = []
            .concat(testData.deskripsiBarang ?? [])
            .concat(testData.deskripsiBarang2 ?? [])
            .filter(Boolean).map(String);

        await this.waitForPrintSheets(expectedRaw.length, 20000);

        // Buat kandidat: { key: 'IKAN', index: i }
        const candidates = [];
        const cnt = await this.countSheets();
        for (let i = 0; i < cnt; i++) {
            const txt = await this.deskripsi(i).getText();
            candidates.push({ key: this.sanitizeDesc(txt).toUpperCase(), index: i });
        }

        for (const expRaw of expectedRaw) {
            const key = this.sanitizeDesc(expRaw).toUpperCase();

            let pos = candidates.findIndex(c => c.key === key);
            if (pos < 0) pos = candidates.findIndex(c => c.key.includes(key));

            await softCheck(`Match deskripsi "${expRaw}"`, () => {
                expect(pos).toBeGreaterThanOrEqual(0);
            });

            if (pos >= 0) {
                const { index } = candidates[pos];
                // validasi FULL isi sheet yang benar (kirim override expectedDesc biar pasti match)
                await this.validatePrintData(paymentMethod, testData, index, soft, { expectedDesc: expRaw });
                candidates.splice(pos, 1);
            }
        }

        // Tambahkan validasi GRAND TOTAL di akhir
        const toNumber = (text) => {
            let clean = String(text)
                .replace(/Rp\.?\s?/i, '')
                .replace(/\s+/g, '')
                .replace(/-$/,'')
                .replace(/,-$/,'');

            if (/,(\d{2})$/.test(clean)) {
                clean = clean.replace(/\./g, '').replace(',', '.');
            } else {
                clean = clean.replace(/[.,]/g, '');
            }
            const n = Number(clean);
            if (Number.isNaN(n)) throw new Error(`Cannot parse currency: "${text}"`);
            return n;
        };

        const formatRupiah = (n) => 
            "Rp " + new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

        // Tunggu total biaya muncul di UI
        await this.total.waitForDisplayed({ timeout: 5000 });
        const totalPrint = await this.total.getText();

        // Ambil nilai grand total sebelum print (sama seperti validatePrintData)
        const expected = formatRupiah(toNumber(this._grandTotalBefore));
        const actual = formatRupiah(toNumber(totalPrint));

        await softCheck('Total Biaya Multi-Koli', () => {
            expect(actual).toEqual(expected);
        });

        console.log(`[MultiKoli] Total biaya: Expected=${expected}, Actual=${actual}`);
    }

    // Validasi multi-connote
    async validateMultiConnote(connoteList, paymentMethod, soft = null) {
        const softCheck = async (title, fn) => {
            if (soft && typeof soft.check === 'function') return soft.check.call(soft, title, fn);
            return fn();
        };

        const up = (s) => String(s ?? '').normalize('NFKC').trim().toUpperCase();

        // jumlah sheet = jumlah connote yang diinput
        await this.waitForPrintSheets(connoteList.length, 20000);

        // kandidat dari UI (key = deskripsi di UI yang sudah disanitize)
        const candidates = [];
        const cnt = await this.countSheets();
        for (let i = 0; i < cnt; i++) {
            const txt = await this.deskripsi(i).getText();
            candidates.push({ key: up(this.sanitizeDesc(txt)), index: i });
        }

        // tiap connote input, cari sheet yang cocok lalu validasi full
        for (const connote of connoteList) {
            const wantKey = up(this.sanitizeDesc(connote.deskripsiBarang || ''));

            let pos = candidates.findIndex(c => c.key === wantKey);
            if (pos < 0) pos = candidates.findIndex(c => c.key.includes(wantKey));

            await softCheck(`Match deskripsi "${connote.deskripsiBarang}"`, () => {
                expect(pos).toBeGreaterThanOrEqual(0);
            });

            if (pos >= 0) {
            const { index } = candidates[pos];

            // override per-connote (yang beda-beda dari tiap form)
            const overrides = {
                expectedDesc: connote.deskripsiBarang || '',
                instruksiKhusus: connote.instruksiKhusus || '',
                connoteInfo: connote,
                totalConnote: connoteList.length
            };

            // panggil validator per-sheet (testData shared)
            await this.validatePrintData(paymentMethod, connote, index, soft, overrides);

            // hilangkan kandidat yang sudah terpakai
            candidates.splice(pos, 1);
            }
        }
    }



}

export default new ConnotePrintPage();
