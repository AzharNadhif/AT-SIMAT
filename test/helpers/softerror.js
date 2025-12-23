class SoftError {
    constructor() {
        this.errors = [];
    }

    check(label, fn) {
        try {
            fn();
        }   catch (e) {
            this.errors.push(`[${label}] ${e?.message || String(e)}`);
        }
    }

    async checkAsync(label, fn) {
        try {
            await fn();
        }   catch (e) {
            this.errors.push(`[${label}] ${e?.message || String(e)}`);
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