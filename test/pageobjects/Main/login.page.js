import { $ } from '@wdio/globals';
import Page from './page.js';

class LoginPage extends Page {
    get inputUsername() {
        return $('#vs-input--20');
    }
    get inputPassword() {
        return $('#vs-input--29');
    }
    get btnSubmit() {
        return $('button[type="submit"]');
    }
    
    // Login dengan Username dan Password
    async login(username, password) {
        await this.inputUsername.waitForDisplayed({ timeout: 10000 });
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnSubmit.scrollIntoView({ timeout: 5000 });
        await this.btnSubmit.waitForDisplayed({ timeout: 5000 });
        await this.btnSubmit.click();
        
        // ======= Redirect Login Berhasil =======
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url.includes('core-staging.jne.co.id') && !url.includes('login');
            },
            { timeout: 10000, timeoutMsg: 'Login failed or redirect timeout' }
        );
    }

    open() {
        return super.open('login');
    }
}

export default new LoginPage();