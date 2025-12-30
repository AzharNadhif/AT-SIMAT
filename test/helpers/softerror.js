import { browser } from '@wdio/globals';
import AllureReporter from '@wdio/allure-reporter';

class SoftError {
    constructor(prefix = 'SoftCheck') {
        this.errors = [];
        this.prefix = prefix;
        this.count = 0;
    }

    _attachText(name, text) {
        try {
            // reporter Allure WDIO
            if (AllureReporter?.addAttachment) {
                AllureReporter.addAttachment(name, text, 'text/plain');
                return;
            }
            // fallback kalau ada global allure
            if (globalThis.allure?.addAttachment) {
                globalThis.allure.addAttachment(name, text, 'text/plain');
            }
        } catch (_) {}
    }

    _attachPng(name, base64Png) {
        try {
            const buf = Buffer.from(base64Png, 'base64');
            if (AllureReporter?.addAttachment) {
                AllureReporter.addAttachment(name, buf, 'image/png');
                return;
            }
            if (globalThis.allure?.addAttachment) {
                globalThis.allure.addAttachment(name, buf, 'image/png');
            }
        } catch (_) {}
    }

    async _capture(label, err) {
        this.count += 1;

        const msg = `[${label}] ${err?.message || String(err)}`;
        this.errors.push(msg);

        // attach error text biar kebaca di Allure
        this._attachText(`${this.prefix} Error #${this.count}`, msg);

        // screenshot per error
        try {
            const pngBase64 = await browser.takeScreenshot();
            this._attachPng(`${this.prefix} Screenshot #${this.count} (${label})`, pngBase64);

            // tanda kalau udah ada screenshot dari SoftError di test ini
            globalThis.__SOFT_SS_TAKEN__ = true;
        } catch (ssErr) {
            const ssMsg = `[${label}] Screenshot failed: ${ssErr?.message || String(ssErr)}`;
            this.errors.push(ssMsg);
            this._attachText(`${this.prefix} Screenshot Error #${this.count}`, ssMsg);
        }
    }

    async checkAsync(label, fn) {
        try {
            await fn();
        } catch (e) {
            await this._capture(label, e);
        }
    }

    flush() {
        if (this.errors.length) {
            const detail = this.errors.map((e, i) => `${i + 1}. ${e}`).join('\n');
            throw new Error(`Soft assertions failed:\n${detail}`);
        }
    }
}

export default SoftError;
