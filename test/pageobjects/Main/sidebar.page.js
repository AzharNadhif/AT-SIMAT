import { $, browser } from '@wdio/globals';

class SidebarPage {
    // ======= SIDEBAR MENU =======
    get sidebarBtn() {
        return $('.vs-button__content i.bx.bx-menu');
    }

    // ======= DELIVERY =========
    get deliveryMenu() {
        return $('//div[@class="vs-sidebar__group__header"]//button[.//div[normalize-space()="Delivery"]]');
    }

    get runsheet() {
        return $('//p[normalize-space()="Delivery Runsheet"]/ancestor::button');
    }
    get HRS() {
        return $('//p[normalize-space()="Handover Runsheet"]/ancestor::button');

    }

    // ======= SETTINGS MENU =======
    get settingsMenu() {
        return $('//div[@class="vs-sidebar__group__header"]//button[.//div[normalize-space()="Settings"]]');
    }

    // ======= MENU SETTINGS =======
    get settingsRunsheet() {
        return $('//p[normalize-space()="Settings Runsheet"]/ancestor::button');
    }

    get settingsKPI() {
        return $('//p[normalize-space()="Settings KPI"]/ancestor::button');
    }

    get settingsBag() {
        return $('//p[normalize-space()="Settings Bag"]/ancestor::button');
    }

    get settingsDestination() {
        return $('//p[normalize-space()="Settings Destination"]/ancestor::button');
    }

    get settingsVehicle() {
        return $('//p[normalize-space()="Settings Vehicles"]/ancestor::button');
    }

    // New Transaction
    get newTransaction() {
        return $('//button[.//p[normalize-space()="New Transaction"]]');
    }

    // Inventory
    get inventory() {
        return $('//p[normalize-space()="Inventory"]/ancestor::button');
    }

    // Incoming
    get incoming() {
        return $('//p[normalize-space()="Incoming"]/ancestor::button');
    }

    // Outgoing
    get outgoing() {
        return $('//p[normalize-space()="Outgoing"]/ancestor::button');
    }

    get sortingMenu() {
        return $('//div[contains(@class,"vs-sidebar__group__header")]//div[normalize-space()="Sorting"]/ancestor::button');
    }

    get openBag() {
        return $('//p[normalize-space()="Open Bag"]/ancestor::button');
    }


    // ======= ACTIONS =======
    // Open Sidebar
    async openSidebar() {
        await this.sidebarBtn.scrollIntoView({ timeout: 5000 });
        await this.sidebarBtn.waitForDisplayed({ timeout: 5000 });
        await this.sidebarBtn.click();
        // ======= TUNGGU SIDEBAR KEBUKA FULL =======
        await browser.pause(1000);
    }

    // Actions Open Settings Runsheet 
    async openRunsheetSettings() {
        // Open Sidebar
        await this.openSidebar();

        // Settings Dropdown
        await this.settingsMenu.scrollIntoView({ timeout: 5000 });
        await this.settingsMenu.waitForDisplayed({ timeout: 10000 });
        await this.settingsMenu.click();
        await browser.pause(500);

        // Settings Runsheet
        try {
            await this.settingsRunsheet.scrollIntoView({ timeout: 5000 });
            await this.settingsRunsheet.waitForDisplayed({ timeout: 5000 });
            await this.settingsRunsheet.click();
        } catch (error) {
            // ======= ALTERNATIF SELECTOR JIKA ERROR =======
            await this.settingsRunsheetAlt.scrollIntoView({ timeout: 5000 });
            await this.settingsRunsheetAlt.waitForDisplayed({ timeout: 5000 });
            await this.settingsRunsheetAlt.click();
        }

        // Load Page
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url.includes('settings') && url.includes('runsheet');
            },
            { timeout: 10000, timeoutMsg: 'Runsheet Settings page did not load' }
        );
    }

    // Actions Open Settings KPI
    async openKPISettings() {
        // Step 1: Buka sidebar
        await this.openSidebar();

        // Step 2: Klik settings dropdown
        await this.settingsMenu.scrollIntoView({ timeout: 5000 });
        await this.settingsMenu.waitForDisplayed({ timeout: 10000 });
        await this.settingsMenu.click();
        
        // Tunggu dropdown terlihat
        await browser.pause(500);

        // Step 3: Klik Settings KPI
        try {
            await this.settingsKPI.scrollIntoView({ timeout: 5000 });
            await this.settingsKPI.waitForDisplayed({ timeout: 5000 });
            await this.settingsKPI.click();
        } catch (error) {
            // Alternatif 
            await this.settingsKPIAlt.scrollIntoView({ timeout: 5000 });
            await this.settingsKPIAlt.waitForDisplayed({ timeout: 5000 });
            await this.settingsKPIAlt.click();
        }

        // Tunggu hinga page terbuka
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url.includes('settings') && url.includes('kpi');
            },
            { timeout: 10000, timeoutMsg: 'KPI Settings page did not load' }
        );
    }

    // Actions Open Settings Bag
    async openBagSettings() {
        // Step 1: Buka Sidebar
        await this.openSidebar();

        // Step 2: Klik Settings Dropdown
        await this.settingsMenu.scrollIntoView({ timeout: 5000 });
        await this.settingsMenu.waitForDisplayed({ timeout:10000 });
        await this.settingsMenu.click();

        // Tunggu dropdown terlihat
        await browser.pause(500);
        
        // Step 3: Klik Settings Bag
        try {
            await this.settingsBag.scrollIntoView({ timeout: 5000 });
            await this.settingsBag.waitForDisplayed({ timeout:5000 });
            await this.settingsBag.click();
        } catch (error) {
            // Alternatif
            await this.settingsBagAlt.scrollIntoView({ timeout: 5000 });
            await this.settingsBagAlt.waitForDisplayed({ timeout:5000 });
            await this.settingsBagAlt.click();
        }
        // Tunggu Hingga Page Terbuka
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url.includes('settings') && url.includes('bag');
            },
            { timeout: 10000, timeoutMsg: 'Bag Settings page did not load'}
        );
    }

    // Actions Open Settings Destination
    async openDestinationSettings() {
        // Step 1: Buka Sidebar
        await this.openSidebar();

        // Step 2: Klik Settings Dropdown
        await this.settingsMenu.scrollIntoView({ timeout: 5000 });
        await this.settingsMenu.waitForDisplayed({ timeout:10000 });
        await this.settingsMenu.click();

        // Tunggu dropdown terlihat
        await browser.pause(500);
        
        // Step 3: Klik Settings Bag
        try {
            await this.settingsDestination.scrollIntoView({ timeout: 5000 });
            await this.settingsDestination.waitForDisplayed({ timeout:5000 });
            await this.settingsDestination.click();
        } catch (error) {
            // Alternatif
            await this.settingsDestinationAlt.scrollIntoView({ timeout: 5000 });
            await this.settingsDestinationAlt.waitForDisplayed({ timeout:5000 });
            await this.settingsDestinationAlt.click();
        }
        // Tunggu Hingga Page Terbuka
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url.includes('settings') && url.includes('destination');
            },
            { timeout: 10000, timeoutMsg: 'Destination Settings page did not load'}
        );
    }

    // Actions Open Settings Vehicle
    async openVehicleSettings() {
        // Step 1: Buka Sidebar
        await this.openSidebar();

        // Step 2: Klik Settings Dropdown
        await this.settingsMenu.scrollIntoView({ timeout: 5000 });
        await this.settingsMenu.waitForDisplayed({ timeout:10000 });
        await this.settingsMenu.click();

        // Tunggu dropdown terlihat
        await browser.pause(500);
        
        // Step 3: Klik Settings Bag
        try {
            await this.settingsVehicle.scrollIntoView({ timeout: 5000 });
            await this.settingsVehicle.waitForDisplayed({ timeout:5000 });
            await this.settingsVehicle.click();
        } catch (error) {
            // Alternatif
            await this.settingsVehicleAlt.scrollIntoView({ timeout: 5000 });
            await this.settingsVehicleAlt.waitForDisplayed({ timeout:5000 });
            await this.settingsVehicleAlt.click();
        }
        // Tunggu Hingga Page Terbuka
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url.includes('settings') && url.includes('vehicles');
            },
            { timeout: 10000, timeoutMsg: 'Vehicles Settings page did not load'}
        );
    }

    // Actions Open Settings Vehicle
    async openNewTransaction() {
        // Step 1: Buka Sidebar
        await this.openSidebar();

        // Step 2: Klik new transaction
        await this.newTransaction.scrollIntoView({ timeout: 5000 });
        await this.newTransaction.waitForDisplayed({ timeout:10000 });
        await this.newTransaction.click();

        // Tunggu Hingga Page Terbuka
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url.includes('new') && url.includes('transactions');
            },
            { timeout: 10000, timeoutMsg: 'New Transaction page did not load'}
        );
    }

    // Actions Open Inventory
    async openInventory() {
         // Step 1: Buka Sidebar
        await this.openSidebar();

        // Step 2: Klik new transaction
        await this.inventory.scrollIntoView({ timeout: 5000 });
        await this.inventory.waitForDisplayed({ timeout:10000 });
        await this.inventory.click();

        // Tunggu Hingga Page Terbuka
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url.includes('inventory') && url.includes('connote');
            },
            { timeout: 10000, timeoutMsg: 'Inventory page did not load'}
        );
    }

    // Actions Open Incoming
    async openIncoming() {
         // Step 1: Buka Sidebar
        await this.openSidebar();

        // Step 2: Klik new transaction
        await this.incoming.scrollIntoView({ timeout: 5000 });
        await this.incoming.waitForDisplayed({ timeout:10000 });
        await this.incoming.click();

        // Tunggu Hingga Page Terbuka
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url.includes('incoming') && url.includes('pre-alert');
            },
            { timeout: 10000, timeoutMsg: 'Incoming page did not load'}
        );
    }
    
    // Actions Open OutGoing
    async openOutgoing() {
        // Step 1: Buka Sidebar
        await this.openSidebar();

        // Step 2: Klik new transaction
        await this.outgoing.scrollIntoView({ timeout: 5000 });
        await this.outgoing.waitForDisplayed({ timeout:10000 });
        await this.outgoing.click();

        // Tunggu Hingga Page Terbuka
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url.includes('outgoing') && url.includes('bag');
            },
            { timeout: 10000, timeoutMsg: 'Outgoing page did not load'}
        );
    }

    // Actions Open Bag
    async openSortingBag() {
        // Step 1: Buka Sidebar
        await this.openSidebar();

        // Step 2: Klik settings dropdown
        await this.sortingMenu.scrollIntoView({ timeout: 5000 });
        await this.sortingMenu.waitForDisplayed({ timeout: 10000 });
        await this.sortingMenu.click();
        
        // Tunggu dropdown terlihat
        await browser.pause(500);

        // Step 3: Klik Settings KPI
        await this.openBag.scrollIntoView({ timeout: 5000 });
        await this.openBag.waitForDisplayed({ timeout: 5000 });
        await this.openBag.click();
        

        // Tunggu hinga page terbuka
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url.includes('sorting') && url.includes('unbagging');
            },
            { timeout: 10000, timeoutMsg: 'Sorting Unbagging page did not load' }
        );
    }

    // Actions Open Delivery
    async openDeliveryRunsheet() {
        // Step 1: Buka Sidebar
        await this.openSidebar();

        // Step 2: Klik Settings Dropdown
        await this.deliveryMenu.scrollIntoView({ timeout: 5000 });
        await this.deliveryMenu.waitForDisplayed({ timeout:10000 });
        await this.deliveryMenu.click();

        // Tunggu dropdown terlihat
        await browser.pause(500);
        
        // Step 3: Klik Delivery Menu
        try {
            await this.runsheet.scrollIntoView({ timeout: 5000 });
            await this.runsheet.waitForDisplayed({ timeout:5000 });
            await this.runsheet.click();
        } catch (error) {
            // Alternatif
            await this.runsheetAlt.scrollIntoView({ timeout: 5000 });
            await this.runsheetAlt.waitForDisplayed({ timeout:5000 });
            await this.runsheetAlt.addRoutes().click();
        }
        // Tunggu Hingga Page Terbuka
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url.includes('delivery') && url.includes('runsheet');
            },
            { timeout: 10000, timeoutMsg: 'Delivery Runsheet page did not load'}
        );
    }

    // Actions Open HRS
    async openHRS() {
        // Step 1: Buka Sidebar
        await this.openSidebar();

        // Step 2: Klik Settings Dropdown
        await this.deliveryMenu.scrollIntoView({ timeout: 5000 });
        await this.deliveryMenu.waitForDisplayed({ timeout:10000 });
        await this.deliveryMenu.click();

        // Tunggu dropdown terlihat
        await browser.pause(500);
        
        // Step 3: Klik Delivery Menu
        try {
            await this.HRS.scrollIntoView({ timeout: 5000 });
            await this.HRS.waitForDisplayed({ timeout:5000 });
            await this.HRS.click();
        } catch (error) {
            // Alternatif
            await this.HRSAlt.scrollIntoView({ timeout: 5000 });
            await this.HRSAlt.waitForDisplayed({ timeout:5000 });
            await this.HRSAlt.click();
        }
        // Tunggu Hingga Page Terbuka
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url.includes('hrs');
            },
            { timeout: 10000, timeoutMsg: 'HRS page did not load'}
        );
    }
}

export default new SidebarPage();