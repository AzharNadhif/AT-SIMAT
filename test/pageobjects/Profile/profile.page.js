import { $, $$, browser } from '@wdio/globals';
import path from 'path';


class ProfilePage {
    // ====== VALIDATION PAGE ======

    // Page Title
    get titleEdit() {
        return $('h3*=EDIT PROFILE');
    }

    // selector form input
    get inputFullName() { return $('input[data-testid="input-user_name"]'); }
    get inputUsername() { return $('input[data-testid="input-user_login"]'); }
    get inputPassword() { return $('input[data-testid="input-password"]'); }
    get inputEmail() { return $('input[data-testid="input-user_email"]'); }

    // selector upload foto
    get inputPhoto() {
        return $('.image-container input[type="file"]');
    }
    //  container image
    get avatarContainer() {
        return $('.image-container'); // parent avatar
    }
    // selector edit foto
    get btnEditPhoto() {
        return $('.hover-overlay'); // klik langsung overlay
    }

  


    // Button Save
    get btnSave() 
    { 
        return $('button=Save'); 
    }


    // ====== ACTIONS ======
    // Clear Value
    async clearAndType(element, newValue) {
        await element.scrollIntoView({ timeout: 5000 });
        await element.waitForDisplayed({ timeout: 5000 });
        await element.click(); // fokus dulu
        await browser.keys(['Control', 'a']); // select all (Windows/Linux)
        await browser.keys('Backspace'); // hapus semua
        await element.setValue(newValue); // isi yang baru
    }

    // Update Profile
    async updateProfile(data) {
        await this.clearAndType(this.inputFullName, data.fullName);
        await this.clearAndType(this.inputUsername, data.username);
        await this.clearAndType(this.inputPassword, data.password);
        await this.clearAndType(this.inputEmail, data.email);

        // hover biar tombol Edit muncul
        await this.avatarContainer.moveTo();
        await this.btnEditPhoto.click();

        // paksa input file biar kelihatan
        await browser.execute(() => {
            const input = document.querySelector('.image-container input[type="file"]');
            if (input) input.style.display = 'block';
        });

        // path ke file
        const filePath = path.resolve('./test/image/profile.png');
        await this.inputPhoto.setValue(filePath);

        await this.btnSave.scrollIntoView({ timeout: 5000 });
        await this.btnSave.waitForDisplayed({ timeout: 5000 });
        await this.btnSave.click();

        // Setelah klik save
        await browser.pause(1000); // atau tunggu notifikasi sukses jika ada
    }


}

export default new ProfilePage();
