import TestData from './testdata.js';
import SidebarPage from '../pageobjects/Main/sidebar.page.js';
import LoginPage from '../pageobjects/Main/login.page.js';
import ReceivingPage from '../pageobjects/Receiving/receiving.page.js';
import connotePage from '../pageobjects/Transaction/connote.page.js';
import InventoryPage from '../pageobjects/Inventory/inventory.page.js';
import OutBagPage from '../pageobjects/Outgoing/outBag.page.js';
import SuratMuatanPage from '../pageobjects/Surat-Muatan/suratmuatan.page.js';
import OutSJPage from '../pageobjects/Outgoing/outSJ.page.js';
import ObagPage from '../pageobjects/Open-Bag/obag.page.js';

class NavigationFlow {
    static async logout() {
        // buka profile menu
        const profile = await $('.vs-avatar i.bx.bx-user');
        await profile.waitForDisplayed({ timeout: 5000 });
        await profile.click();
        // klik tombol logout
        const logout = await $('//footer//button[.//div[normalize-space()="Logout"]]');
        await logout.waitForDisplayed({ timeout: 5000 });
        await logout.click();

        // pastikan redirect ke login
        await browser.waitUntil(
        async () => (await browser.getUrl()).includes('https://core-staging.jne.co.id/login'),
            {
                timeout: 5000,
                timeoutMsg: 'Tidak redirect ke halaman login setelah logout'
            }
        );
    }

    // NAVIGASI LOGIN -> New Transactions
    static async loginAndNavigateToNewTransaction(account = "RESI"){
        const credentials = TestData.getCredentials(account);
        // ======= OPEN LOGIN PAGE =======
        await LoginPage.open();
        
        // ======= LOGIN =======
        await LoginPage.login(credentials.username, credentials.password);
        
        // ======= NAVIGASI =======
        // Navigasi Ke Settings Vehicles Type
        await SidebarPage.openNewTransaction();

        // ======= VALIDASI =======
        // Validasi Halaman Settings Vehicles Type
        await connotePage.pageTitle.waitForDisplayed({ timeout: 10000 }); 
    }

    // NAVIGASI LOGIN -> INCOMING
    static async loginAndNavigateToIncoming(account = "BDO"){
        const credentials = TestData.getCredentials(account);
        // ======= OPEN LOGIN PAGE =======
        await LoginPage.open();
        
        // ======= LOGIN =======
        await LoginPage.login(credentials.username, credentials.password);
        
        // ======= NAVIGASI =======
        // Navigasi Ke Settings Vehicles Type
        await SidebarPage.openIncoming();

        // ======= VALIDASI =======
        // Validasi Halaman     
        await ReceivingPage.pageTitle.waitForDisplayed({ timeout: 10000 }); 
    }

    // NAVIGASI LOGIN -> INVENTORY KOLI
    static async loginAndNavigateToInventory(account = "BDO"){
        const credentials = TestData.getCredentials(account);
        // ======= OPEN LOGIN PAGE =======
        await LoginPage.open();
        
        // ======= LOGIN =======
        await LoginPage.login(credentials.username, credentials.password);
        
        // ======= NAVIGASI =======
        // Navigasi Ke Settings Vehicles Type
        await SidebarPage.openInventory();

        // ======= VALIDASI =======
        // Validasi Halaman Inventory
        await browser.pause(500);
        await InventoryPage.validateActiveNavbar('nav-k-KOLI');
    }

    //  NAVIGASI LOGIN -> OUTGOING BAG
    static async loginAndNavigateToOutgoingBag(account = "BDO") {
        const credentials = TestData.getCredentials(account);
        // ======= OPEN LOGIN PAGE =======
        await LoginPage.open();
        
        // ======= LOGIN =======
        await LoginPage.login(credentials.username, credentials.password);
        
        // ======= NAVIGASI =======
        // Navigasi Ke Settings Inventory
        await SidebarPage.openOutgoing();

        // ======= VALIDASI =======
        // Validasi Halaman Inventory
        await browser.pause(500);
        await OutBagPage.pageTitle.waitForDisplayed({ timeout: 10000 });
    }

    //  NAVIGASI LOGIN -> OUTGOING BAG
    static async loginAndNavigateToOutgoingBagSUB(account = "SUB") {
        const credentials = TestData.getCredentials(account);
        // ======= OPEN LOGIN PAGE =======
        await LoginPage.open();
        
        // ======= LOGIN =======
        await LoginPage.login(credentials.username, credentials.password);
        
        // ======= NAVIGASI =======
        // Navigasi Ke Settings Inventory
        await SidebarPage.openOutgoing();

        // ======= VALIDASI =======
        // Validasi Halaman Inventory
        await browser.pause(500);
        await OutBagPage.pageTitle.waitForDisplayed({ timeout: 10000 });
    }

    //  NAVIGASI LOGIN -> OUTGOING SURAT MUATAN
    static async loginAndNavigateToSuratMuatan(account = "BDO") {
        const credentials = TestData.getCredentials(account);
        // ======= OPEN LOGIN PAGE =======
        await LoginPage.open();
        
        // ======= LOGIN =======
        await LoginPage.login(credentials.username, credentials.password);
        
        // ======= NAVIGASI =======
        // Navigasi Ke Settings Inventory
        await SidebarPage.openOutgoing();

        // Click Tab Bag
        await SuratMuatanPage.tabSM.waitForDisplayed({timeout:5000});
        await SuratMuatanPage.tabSM.waitForClickable({timeout:5000});
        await SuratMuatanPage.tabSM.click();

        // ======= VALIDASI =======
        // Validasi Halaman Inventory
        await browser.pause(500);
        await SuratMuatanPage.pageTitle.waitForDisplayed({ timeout: 10000 });
    }

    //  NAVIGASI LOGIN -> OPEN BAG
    static async loginAndNavigateToSortingOpenBag(account = "SUB") {
        const credentials = TestData.getCredentials(account);
        // ======= OPEN LOGIN PAGE =======
        await LoginPage.open();
        
        // ======= LOGIN =======
        await LoginPage.login(credentials.username, credentials.password);
        
        // ======= NAVIGASI =======
        // Navigasi Ke Settings Inventory
        await SidebarPage.openSortingBag();

        // ======= VALIDASI =======
        // Validasi Halaman Inventory
        await browser.pause(500);
        await ObagPage.pageTitle.waitForDisplayed({ timeout: 10000 });
    }

    // NAVIGASI LOGIN -> INCOMING SUB
    static async loginAndNavigateToIncomingSUB(account = "SUB"){
        const credentials = TestData.getCredentials(account);
        // ======= OPEN LOGIN PAGE =======
        await LoginPage.open();
        
        // ======= LOGIN =======
        await LoginPage.login(credentials.username, credentials.password);
        
        // ======= NAVIGASI =======
        // Navigasi Ke Settings Vehicles Type
        await SidebarPage.openIncoming();

        // ======= VALIDASI =======
        // Validasi Halaman     
        await ReceivingPage.pageTitle.waitForDisplayed({ timeout: 10000 }); 
    }

    // NAVIGASI LOGIN -> INVENTORY MASTERBAG SUB
    static async loginAndNavigateToInventoryMasterBagSUB(account = "SUB"){
        const credentials = TestData.getCredentials(account);
        // ======= OPEN LOGIN PAGE =======
        await LoginPage.open();
        
        // ======= LOGIN =======
        await LoginPage.login(credentials.username, credentials.password);
        
        // ======= NAVIGASI =======
        // Navigasi Ke Settings Inventory
        await SidebarPage.openInventory();

        // Click Tab Bag
        await InventoryPage.btnBag.waitForDisplayed({timeout:5000});
        await InventoryPage.btnBag.waitForClickable({timeout:5000});
        await InventoryPage.btnBag.click();

        await InventoryPage.btnMasterbag.waitForDisplayed({ timeout: 5000 });
        await InventoryPage.btnMasterbag.waitForClickable({ timeout: 5000 });
        await InventoryPage.btnMasterbag.click();

        // ======= VALIDASI =======
        // Validasi Halaman Inventory
        await browser.pause(500);
        await InventoryPage.validateActiveNavbar('nav-k-MASTERBAG');
    }

    // NAVIGASI LOGIN -> INVENTORY BAG
    static async loginAndNavigateToInventoryBagSUB(account = "SUB"){
        const credentials = TestData.getCredentials(account);
        // ======= OPEN LOGIN PAGE =======
        await LoginPage.open();
        
        // ======= LOGIN =======
        await LoginPage.login(credentials.username, credentials.password);
        
        // ======= NAVIGASI =======
        // Navigasi Ke Settings Inventory
        await SidebarPage.openInventory();

        // Click Tab Bag
        await InventoryPage.btnBag.waitForDisplayed({timeout:5000});
        await InventoryPage.btnBag.waitForClickable({timeout:5000});
        await InventoryPage.btnBag.click();

        // ======= VALIDASI =======
        // Validasi Halaman Inventory
        await browser.pause(500);
        await InventoryPage.validateActiveNavbar('nav-k-BAG');
    }

    //  NAVIGASI LOGIN -> OUTGOING SURAT JALAN
    static async loginAndNavigateToSuratJalan(account = "SUB") {
        const credentials = TestData.getCredentials(account);
        // ======= OPEN LOGIN PAGE =======
        await LoginPage.open();
        
        // ======= LOGIN =======
        await LoginPage.login(credentials.username, credentials.password);
        
        // ======= NAVIGASI =======
        // Navigasi Ke Settings Inventory
        await SidebarPage.openOutgoing();

        // Click Tab Bag
        await OutSJPage.tabSJ.waitForDisplayed({timeout:5000});
        await OutSJPage.tabSJ.waitForClickable({timeout:5000});
        await OutSJPage.tabSJ.click();

        // ======= VALIDASI =======
        // Validasi Halaman Inventory
        await browser.pause(500);
        await OutSJPage.pageTitle.waitForDisplayed({ timeout: 10000 });
    }

    // INCOMING JOG
    static async loginAndNavigateToIncomingJOG(account = "JOG"){
        const credentials = TestData.getCredentials(account);
        // ======= OPEN LOGIN PAGE =======
        await LoginPage.open();
        
        // ======= LOGIN =======
        await LoginPage.login(credentials.username, credentials.password);
        
        // ======= NAVIGASI =======
        // Navigasi Ke Settings Vehicles Type
        await SidebarPage.openIncoming();

        // ======= VALIDASI =======
        // Validasi Halaman     
        await ReceivingPage.pageTitle.waitForDisplayed({ timeout: 10000 }); 
    }

    // READ
    // NAVIGASI LOGIN -> INVENTORY CONNOTE
    static async loginAndNavigateToInventoryConnote(account = "BDO"){
        const credentials = TestData.getCredentials(account);
        // ======= OPEN LOGIN PAGE =======
        await LoginPage.open();
        
        // ======= LOGIN =======
        await LoginPage.login(credentials.username, credentials.password);
        
        // ======= NAVIGASI =======
        // Navigasi Ke Settings Vehicles Type
        await SidebarPage.openInventory();

        // Click Navbar Connote
        await InventoryPage.btnConnote.waitForDisplayed({timeout:5000});
        await InventoryPage.btnConnote.waitForClickable({timeout:5000});
        await InventoryPage.btnConnote.click();

        // ======= VALIDASI =======
        // Validasi Halaman Inventory
        await browser.pause(500);
        await InventoryPage.validateActiveNavbar('nav-k-CONNOTE');
    }
}

export default NavigationFlow;

