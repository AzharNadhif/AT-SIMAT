import { $, $$, browser, expect } from '@wdio/globals';

class ColumnFilterPage {
    // ========= Element Page ==========

    // Column TOggle
    get colToggle() {
        return $('div[data-testid="column-toggle-header"]');
    }
    // Button Trigger Dropdown Columns
    get btnFilterColumns() {
        return this.colToggle.$$('button[data-testid="filter-column-btn"]');
    }

    // Panel Dropdown Columns
    get  DropdownColumn() {
        return $$('[data-testid="column-dropdown-panel"]');
    }

    // Input Search in Dropdown
    get searchInput() {
        return $('[data-testid="column-search"]');
    }

    // Checkbox Column By Label
    getColumnCheckbox(testId) {
        return $(`input[data-testid="column-checkbox-${testId}"]`);
    }

    // ========= ACTIONS ==========

    // Open Dropdown
    async openDropdown() {
        // Cari semua tombol dropdown
        const buttons = await this.btnFilterColumns;
        if (buttons.length === 0) {
            throw new Error('Tidak ada tombol filter column ditemukan.');
        }

        // Ambil tombol pertama yang clickable
        const button = buttons[0];
        await button.waitForDisplayed({ timeout: 5000 });
        await button.waitForClickable({ timeout: 5000 });
        await button.click();

        // Tunggu panel dropdown muncul di DOM
        await browser.waitUntil(
            async () => (await this.DropdownColumn).length > 0,
            {
                timeout: 5000,
                timeoutMsg: 'Panel dropdown belum muncul di DOM',
            }
        );

        // Ambil panel yang sedang displayed
        const visiblePanel = await browser.waitUntil(
            async () => {
                const els = await this.DropdownColumn;
                for (const el of els) {
                    if (await el.isDisplayed()) return el;
                }
                return false;
            },
            {
                timeout: 5000,
                timeoutMsg: 'Tidak ada panel dropdown yang displayed',
            }
        );

        // Pastikan panel terlihat
        await visiblePanel.waitForDisplayed({ timeout: 2000 });
        await browser.pause(200);

        // return panel untuk aksi lanjutan
        return visiblePanel;
    }



    // Search by keyboard
    async searchBy(columnLabel) {
        await this.searchInput.setValue(columnLabel);
    }

    // Checkbox Function
    async CheckboxByTestId(testId, shouldCheck = true) {
        const checkboxInput = await this.getColumnCheckbox(testId);
        await checkboxInput.waitForExist({ timeout: 5000 });

        const isChecked = await checkboxInput.isSelected();
        if (isChecked !== shouldCheck) {
            await checkboxInput.click();
        }

        await browser.pause(1000);
    }
}

export default new ColumnFilterPage();