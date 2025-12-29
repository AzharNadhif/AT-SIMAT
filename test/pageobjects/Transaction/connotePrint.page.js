import { $, $$, browser, expect } from '@wdio/globals';

class ConnotePrintPage {

    async softCheck(soft, label, fn) {
        if (soft?.checkAsync) return soft.checkAsync(label, fn);
        return fn();
    }

    // ====== CONTAINER PER SHEET (connote) ======
    sheet(index = 0) {
        return $(`(//section[contains(@class,'sheet')])[${index + 1}]`);
    }

    // ====== COUNT / WAIT HELPERS ======
    async countSheets() {
        const arr = await $$('//section[contains(@class,"sheet")]');
        return arr.length;
    }

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

    namaPengirim(index = 0) { return this.sheet(index).$(`span[data-testid="shipper-name"]`); }
    alamatPengirim(index = 0) { return this.sheet(index).$(`span[data-testid="shipper-address"]`); }
    noPengirim(index = 0) { return this.sheet(index).$(`span[data-testid="shipper-phone"]`); }

    namaPenerima(index = 0) { return this.sheet(index).$(`span[data-testid="receiver-name"]`); }
    alamatPenerima(index = 0) { return this.sheet(index).$(`span[data-testid="receiver-address"]`); }
    noPenerima(index = 0) { return this.sheet(index).$(`span[data-testid="receiver-phone"]`); }

    deskripsi(index = 0) { return this.sheet(index).$(`td[data-testid="description"]`); }
    instruksi(index = 0) { return this.sheet(index).$(`td[data-testid="remarks"]`); }
    service(index = 0) { return this.sheet(index).$(`td[data-testid="service-name"]`); }

    berat(index = 0) { return this.sheet(index).$(`span[data-testid="weight"]`); }
    jumlahKiriman(index = 0) { return this.sheet(index).$(`span[data-testid="koli-qty"]`); }
    asuransi(index = 0) { return this.sheet(index).$(`span[data-testid="insurance"]`); }
    pembayaran(index = 0) { return this.sheet(index).$(`span[data-testid="payment-type-detail"]`); }

    tanggalConnote(index = 0) { return this.sheet(index).$(`span[data-testid="transaction-date"]`); }
    maxDelivery(index = 0) { return this.sheet(index).$(`span[data-testid="maximum-delivery"]`); }

    get grandTotal() { return $("//td[h3[text()='Grand Total']]/following-sibling::td/h3"); }
    get total() { return $(`td[data-testid="total-price"]`); }
    get connoteNumber() { return $('span[data-testid="connote-number"]'); }

    // ===== WINDOW HANDLING =====
    async switchToPrintWindow() {
        const handles = await browser.getWindowHandles();
        const mainHandle = await browser.getWindowHandle();
        for (const handle of handles) {
            if (handle !== mainHandle) {
                await browser.switchToWindow(handle);
                return mainHandle;
            }
        }
    }

    async closePrintWindow(mainHandle) {
        await browser.closeWindow();
        if (mainHandle) await browser.switchToWindow(mainHandle);
    }

    normalizePhone(phone) {
        phone = phone.replace(/[\s\-]/g, '');
        if (phone.startsWith('08')) return '628' + phone.slice(2);
        if (phone.startsWith('8')) return '62' + phone;
        if (phone.startsWith('+62')) return phone.slice(1);
        return phone;
    }

    toNum(v) {
        return Number(String(v ?? '').trim().replace(',', '.')) || 0;
    }

    getExpectedDescription(testData, index = 0) {
        const keys = Object.keys(testData).filter(k => /^deskripsiBarang(\d+)?$/i.test(k));
        if (keys.length === 0) return undefined;

        const mapped = keys.map(k => {
            const m = k.match(/(\d+)$/);
            const i = m ? Number(m[1]) - 1 : 0;
            return { key: k, i };
        }).sort((a, b) => a.i - b.i);

        const chosen = mapped.find(x => x.i === index) ?? mapped[0];
        return testData[chosen.key];
    }

    computeExpectedChargeable(testData) {
        const weightKeys = Object.keys(testData).filter(k => /^weight\d*$/i.test(k));
        let actual = 0;

        if (weightKeys.length) {
            for (const k of weightKeys) actual += this.toNum(testData[k]);
        } else {
            actual = this.toNum(testData.weight);
        }

        if (testData.packingKayu) actual *= 2;

        const vol = this.toNum(testData.length) * this.toNum(testData.width) * this.toNum(testData.height);
        const volumetric = vol ? Math.round(vol / 6000) : 0;

        return Math.max(actual, volumetric);
    }

    sanitizeInstruksi(text) {
        return String(text)
            .replace(/^Instruksi\s*Khusus\s*:?\s*/i, '')
            .trim();
    }

    sanitizeDesc(text) {
        return String(text)
            .replace(/^\s*deskripsi\s*:?\s*/i, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // ====== VALIDATION =====
    async validatePrintData(paymentMethod, testData, index = 0, soft = null, overrides = {}) {
        // pengirim
        const namaPengirim = await this.namaPengirim(index).getText();
        const noPengirim = await this.noPengirim(index).getText();
        const alamatPengirim = await this.alamatPengirim(index).getText();

        await this.softCheck(soft, 'Nama Pengirim', async () => {
            expect(namaPengirim).toEqual(testData.namaPengirim);
        });
        await this.softCheck(soft, 'Nomor Pengirim', async () => {
            expect(this.normalizePhone(noPengirim)).toEqual(this.normalizePhone(testData.teleponPengirim));
        });
        await this.softCheck(soft, 'Alamat Pengirim', async () => {
            expect(alamatPengirim).toContain(testData.provinsiPengirim);
        });

        // penerima
        const namaPenerima = await this.namaPenerima(index).getText();
        const noPenerima = await this.noPenerima(index).getText();
        const alamatPenerima = await this.alamatPenerima(index).getText();

        await this.softCheck(soft, 'Nama Penerima', async () => {
            expect(namaPenerima).toEqual(testData.namaPenerima);
        });
        await this.softCheck(soft, 'Nomor Penerima', async () => {
            expect(this.normalizePhone(noPenerima)).toEqual(this.normalizePhone(testData.teleponPenerima));
        });
        await this.softCheck(soft, 'Alamat Penerima', async () => {
            expect(alamatPenerima).toContain(testData.provinsiPenerima);
        });

        // deskripsi
        const rawDesc = await this.deskripsi(index).getText();
        const uiDesc = this.sanitizeDesc(rawDesc);
        const expectedDesc = (overrides?.expectedDesc ?? this.getExpectedDescription(testData, index) ?? testData.deskripsiBarang);

        await this.softCheck(soft, 'Deskripsi Barang', async () => {
            expect(uiDesc.toUpperCase()).toContain(String(expectedDesc).toUpperCase());
        });

        // service
        const serviceText = await this.service(index).getText();
        await this.softCheck(soft, 'Service', async () => {
            expect(serviceText).toEqual(testData.service);
        });

        // instruksi
        const rawInstruksi = await this.instruksi(index).getText();
        const instruksi = this.sanitizeInstruksi(rawInstruksi);
        const expectedInstruksi = String(overrides?.instruksiKhusus ?? testData.instruksiKhusus ?? '').trim();

        await this.softCheck(soft, 'Instruksi Khusus', async () => {
            // kamu sebelumnya compare ke upperCase, tapi expected belum di-uppercased → aku samain aman:
            expect(instruksi.toUpperCase()).toEqual(expectedInstruksi.toUpperCase());
        });

        // berat
        const beratText = await this.berat(index).getText();
        const beratValue = this.toNum(beratText);
        const expectedChargeable = this.computeExpectedChargeable(testData);

        await this.softCheck(soft, 'Berat Barang', async () => {
            expect(beratValue).toEqual(expectedChargeable);
        });

        // jumlah kiriman
        const jumlahText = await this.jumlahKiriman(index).getText();
        const matchJum = jumlahText.match(/([0-9]+)/i);

        await this.softCheck(soft, 'Jumlah Kiriman (format)', async () => {
            if (!matchJum) throw new Error(`Tidak menemukan Jumlah Kiriman di teks: "${jumlahText}"`);
        });

        if (matchJum) {
            await this.softCheck(soft, 'Jumlah Kiriman (value)', async () => {
                expect(Number(matchJum[1])).toEqual(Number(testData.jumlah));
            });
        }

        // pembayaran
        const pembayaranText = await this.pembayaran(index).getText();

        await this.softCheck(soft, 'Payment method harus diberikan', async () => {
            if (!paymentMethod) throw new Error('Payment method harus diberikan');
        });

        const methodMap = {
            'CASH': 'Tunai',
            'COD ONGKIR': 'COD ONGKIR',
            'EPAY': 'EPAY',
            'COD': ' COD ',
            'CREDIT': 'CREDIT'
        };

        const expectedPembayaran = methodMap[String(paymentMethod).toUpperCase()];

        await this.softCheck(soft, `Metode pembayaran "${paymentMethod}" dikenali`, async () => {
            if (!expectedPembayaran) throw new Error(`Metode pembayaran "${paymentMethod}" tidak dikenali`);
        });

        if (expectedPembayaran) {
            await this.softCheck(soft, 'Jenis Pembayaran', async () => {
                expect(pembayaranText).toEqual(expectedPembayaran);
            });
        }

        // ====== TANGGAL ======
        const elTanggal = await this.tanggalConnote(index);
        await elTanggal.waitForDisplayed({ timeout: 5000 });
        const tanggalText = await elTanggal.getText();
        console.log(`Sheet ${index} - Tanggal ditemukan:`, tanggalText);

        const tglMatch = tanggalText.match(/\b(\d{2}-\d{2}-\d{4})\b/);

        await this.softCheck(soft, `Tanggal ditemukan di sheet ${index}`, async () => {
            if (!tglMatch) throw new Error(`Tanggal tidak ditemukan di sheet index ${index}: "${tanggalText}"`);
        });

        const tanggal = tglMatch ? tglMatch[1] : '';

        if (tanggal) {
            await this.softCheck(soft, 'Tanggal Pengiriman format', async () => {
                expect(tanggal).toMatch(/^\d{2}-\d{2}-\d{4}$/);
            });
        }

        // maksimum delivery
        const maksText = await this.maxDelivery(index).getText();
        const maksMatch = maksText.match(/\b(\d{2}-\d{2}-\d{4})\b/);

        await this.softCheck(soft, `Maksimum Delivery ditemukan di sheet ${index}`, async () => {
            if (!maksMatch) throw new Error(`Maksimum Delivery tidak ditemukan di sheet index ${index}: "${maksText}"`);
        });

        const tanggalMaksUI = maksMatch ? maksMatch[1] : '';

        if (tanggal && tanggalMaksUI) {
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

            await this.softCheck(soft, 'Maksimum Delivery', async () => {
                expect(tanggalMaksUI).toEqual(expectedMaksDelivery);
            });
        }

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

        // TOTAL BIAYA (grand total)
        await this.total.waitForDisplayed({ timeout: 5000 });
        const totalPrint = await this.total.getText();

        await this.softCheck(soft, 'Grand total before sudah di-store', async () => {
            if (this._grandTotalBefore == null) throw new Error('Grand total before belum disimpan. Panggil storeGrandTotal() sebelum validasi print.');
        });

        if (this._grandTotalBefore != null) {
            const expected = formatRupiah(toNumber(this._grandTotalBefore));
            const actual = formatRupiah(toNumber(totalPrint));

            await this.softCheck(soft, 'Total Biaya', async () => {
                expect(actual).toEqual(expected);
            });
        }

        // asuransi
        const asuransiText = (await this.asuransi(index).getText()).trim();
        if (asuransiText === "TIDAK" || asuransiText === "ASURANSI : TIDAK") {
            await this.softCheck(soft, 'Asuransi = Tidak', async () => {
                expect(["TIDAK", "ASURANSI : TIDAK"]).toContain(asuransiText);
            });
        } else {
            const m = asuransiText.match(/([\d.]+,\d{2})\s*\+\s*([\d.]+,\d{2})/i);

            await this.softCheck(soft, 'Format Asuransi', async () => {
                if (!m) throw new Error(`Format Asuransi tidak sesuai: "${asuransiText}"`);
            });

            if (m) {
                const formatID = (n) => {
                    const [i, f = '00'] = n.toFixed(2).split('.');
                    return i.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + f;
                };

                const nilaiBarang = Number(testData.nilaiBarang);
                const expected = `${formatID(nilaiBarang * 0.002)} + ${formatID(5000)}`;

                await this.softCheck(soft, 'Asuransi = Ya', async () => {
                    expect(asuransiText).toEqual(expected);
                });
            }
        }
    }

    async storeGrandTotal() {
        this._grandTotalBefore = await this.grandTotal.getText();
    }

    async getConnoteNumberFromPrint() {
        await this.connoteNumber.waitForDisplayed({ timeout: 10000 });
        const raw = await this.connoteNumber.getText();
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
            await this.validatePrintData(expected.paymentMethod ?? 'CASH', expected, match.index, null);
        }
    }

    // ambil berat di blok atas (detail-info)
    totalBeratGlobal(index = 0) {
        return this.sheet(index).$(`span[data-testid="weight"]`);
    }

    // Validasi multi-koli
    async validateMultiKoli(testData, paymentMethod, soft = null) {
        const expectedRaw = []
            .concat(testData.deskripsiBarang ?? [])
            .concat(testData.deskripsiBarang2 ?? [])
            .filter(Boolean).map(String);

        await this.waitForPrintSheets(expectedRaw.length, 20000);

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

            await this.softCheck(soft, `Match deskripsi "${expRaw}"`, async () => {
                expect(pos).toBeGreaterThanOrEqual(0);
            });

            if (pos >= 0) {
                const { index } = candidates[pos];
                await this.validatePrintData(paymentMethod, testData, index, soft, { expectedDesc: expRaw });
                candidates.splice(pos, 1);
            }
        }

        // total biaya multi-koli
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

        await this.total.waitForDisplayed({ timeout: 5000 });
        const totalPrint = await this.total.getText();

        await this.softCheck(soft, 'Grand total before sudah di-store (Multi-Koli)', async () => {
            if (this._grandTotalBefore == null) throw new Error('Grand total before belum disimpan. Panggil storeGrandTotal() sebelum validasi print.');
        });

        if (this._grandTotalBefore != null) {
            const expected = formatRupiah(toNumber(this._grandTotalBefore));
            const actual = formatRupiah(toNumber(totalPrint));

            await this.softCheck(soft, 'Total Biaya Multi-Koli', async () => {
                expect(actual).toEqual(expected);
            });

            console.log(`[MultiKoli] Total biaya: Expected=${expected}, Actual=${actual}`);
        }
    }

    // Validasi multi-connote
    async validateMultiConnote(connoteList, paymentMethod, soft = null) {
        const up = (s) => String(s ?? '').normalize('NFKC').trim().toUpperCase();

        await this.waitForPrintSheets(connoteList.length, 20000);

        const candidates = [];
        const cnt = await this.countSheets();
        for (let i = 0; i < cnt; i++) {
            const txt = await this.deskripsi(i).getText();
            candidates.push({ key: up(this.sanitizeDesc(txt)), index: i });
        }

        for (const connote of connoteList) {
            const wantKey = up(this.sanitizeDesc(connote.deskripsiBarang || ''));

            let pos = candidates.findIndex(c => c.key === wantKey);
            if (pos < 0) pos = candidates.findIndex(c => c.key.includes(wantKey));

            await this.softCheck(soft, `Match deskripsi "${connote.deskripsiBarang}"`, async () => {
                expect(pos).toBeGreaterThanOrEqual(0);
            });

            if (pos >= 0) {
                const { index } = candidates[pos];

                const overrides = {
                    expectedDesc: connote.deskripsiBarang || '',
                    instruksiKhusus: connote.instruksiKhusus || '',
                    connoteInfo: connote,
                    totalConnote: connoteList.length
                };

                await this.validatePrintData(paymentMethod, connote, index, soft, overrides);
                candidates.splice(pos, 1);
            }
        }
    }
}

export default new ConnotePrintPage();
