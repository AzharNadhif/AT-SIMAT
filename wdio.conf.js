import path from 'path';
import 'dotenv/config';
import fs from 'fs';

const isHeadless = /^(1|true|yes|on)$/i.test(process.env.HEADLESS || '');

export const config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    // WebdriverIO supports running e2e tests as well as unit and component tests.
    runner: 'local',

    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // of the configuration file being run.
    //
    // The specs are defined as an array of spec files (optionally using wildcards
    // that will be expanded). The test for each spec file will be run in a separate
    // worker process. In order to have a group of spec files run in the same worker
    // process simply enclose them in an array within the specs array.
    //
    // The path of the spec files will be resolved relative from the directory of
    // of the config file unless it's absolute.
    //
    // Config URL To .env
    baseUrl: process.env.BASE_URL,

    specs: [
        './test/specs/**/*.js'
    ],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],

    // Suites Per Test Case
    suites: {
        receivingConnote: [
            './test/specs/Receiving-Connote/assertTitle.e2e.js',
            './test/specs/Receiving-Connote/test.e2e.js',
        ],
        RegularBag: [
            './test/specs/Outgoing-Bag/createRegBag.e2e.js',
        ],
        PraRunsheetBag: [
            './test/specs/Outgoing-Bag/createPRA.e2e.js',
        ],
        HVOBag: [
            './test/specs/Outgoing-Bag/createHVO.e2e.js',
        ],
        MasterBag: [
            './test/specs/Outgoing-Bag/createMasterbag.e2e.js',
        ],
        HACBBag: [
            './test/specs/Outgoing-Bag/createHACB.e2e.js',
        ],
        OMBag: [
            './test/specs/Outgoing-Bag/createOM.e2e.js',
        ],
        SuratMuatanKereta: [
            './test/specs/Outgoing-SM/createSMDK.e2e.js',
        ],
        SuratMuatanTruk: [
            './test/specs/Outgoing-SM/createSMDT.e2e.js',
        ],
        SuratMuatanLaut: [
            './test/specs/Outgoing-SM/createSML.e2e.js',
        ],
        SuratMuatanUdara: [
            './test/specs/Outgoing-SM/createSMU.e2e.js',
        ],
        receiveSM: [
            './test/specs/Receive-Surat/receiveSM.e2e.js',
        ],
        receiveSJ: [
            './test/specs/Receive-Surat/receiveSJ.e2e.js',
        ],
        SuratJalanRegular: [
            './test/specs/Outgoing-SJ/createSJReg.e2e.js',
        ],
        SuratJalanDO: [
            './test/specs/Outgoing-SJ/createSJDO.e2e.js',
        ],
        SuratJalanMTS: [
            './test/specs/Outgoing-SJ/createSJMTS.e2e.js',
        ],
        inventoryKoli: [
            './test/specs/Inventory-Koli/assertTitle.e2e.js',
            './test/specs/Inventory-Koli/read.e2e.js',
            './test/specs/Inventory-Koli/columnfilter.e2e.js',
            './test/specs/Inventory-Koli/tableheader.e2e.js',
            './test/specs/Inventory-Koli/idHeader.e2e.js',
            './test/specs/Inventory-Koli/rows1000.e2e.js',
            './test/specs/Inventory-Koli/rows3.e2e.js',
            './test/specs/Inventory-Koli/pagination.e2e.js',
            './test/specs/Inventory-Koli/exportCsv.e2e.js',
        ],
        inventoryConnote: [
            './test/specs/Inventory-Connote/assertTitle.e2e.js',
            './test/specs/Inventory-Connote/read.e2e.js',
            './test/specs/Inventory-Connote/columnfilter.e2e.js',
            './test/specs/Inventory-Connote/tableheader.e2e.js',
            './test/specs/Inventory-Connote/idHeader.e2e.js',
            './test/specs/Inventory-Connote/rows1000.e2e.js',
            './test/specs/Inventory-Connote/rows3.e2e.js',
            './test/specs/Inventory-Connote/pagination.e2e.js',
            './test/specs/Inventory-Connote/exportCsv.e2e.js',
        ],
        SuratMuatan: [
            './test/specs/Surat-Muatan/assertTitle.e2e.js',
            './test/specs/Surat-Muatan/read.e2e.js',
            './test/specs/Surat-Muatan/columnfilter.e2e.js',
            './test/specs/Surat-Muatan/tableheader.e2e.js',
            './test/specs/Surat-Muatan/idHeader.e2e.js',
            './test/specs/Surat-Muatan/rows1000.e2e.js',
            './test/specs/Surat-Muatan/rows3.e2e.js',
            './test/specs/Surat-Muatan/pagination.e2e.js',
            './test/specs/Surat-Muatan/exportCsv.e2e.js',
            './test/specs/Surat-Muatan/checkPrint.e2e.js',
        ],
    },

    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    maxInstances: 1,

    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://saucelabs.com/platform/platform-configurator
    //

    capabilities: [{
        browserName: 'chrome',  
        'goog:chromeOptions': {
            args: [
                ...(isHeadless ? ['--headless=new', '--disable-gpu'] : []), // toggle dari .env
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--window-size=1440,900',
                '--disable-blink-features=AutomationControlled', // cegah deteksi automation
                '--disable-extensions', // mencegah extension ganggu test
            ],
            prefs: {
                'download.default_directory': path.resolve('./test/downloads'),
                'download.prompt_for_download': false,
                'download.directory_upgrade': true,
                'safebrowsing.enabled': true
            }
        }
    }],

    before: async () => {
        console.log('Headless mode:', isHeadless);
        // Set ukuran window agar konsisten (meski sudah ada di args)
        await browser.setWindowSize(1440, 900);

        // Implicit wait kecil untuk stabilitas di headless
        await browser.setTimeout({ implicit: 5000 });
    },

    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'info',

    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/browserstack-service, @wdio/lighthouse-service, @wdio/sauce-service
    // - @wdio/local-runner
    // - @wdio/cli, @wdio/config, @wdio/utils
    // logLevels: {
    //     webdriver: 'info',
    //     '@wdio/appium-service': 'info'
    // },

    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,

    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 10000,

    //
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 120000,

    //
    // Default request retries count
    connectionRetryCount: 3,

    //
    // Framework you want to run your specs with.
    framework: 'mocha',

    reporters: [
        ['allure', {
            outputDir: '_results_/allure-raw',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
        }],
    ],

    // Options to be passed to Mocha.
    // See the full list at http://mochajs.org/
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000000,
        retries: 0
    },

    //
    // =====
    // Hooks
    // =====

    /**
     * Function to be executed after a test (in Mocha/Jasmine only)
     * @param {object}  test             test object
     * @param {object}  context          scope object the test was executed with
     * @param {Error}   result.error     error object in case the test fails, otherwise `undefined`
     * @param {*}       result.result    return object of test function
     * @param {number}  result.duration  duration of test
     * @param {boolean} result.passed    true if test has passed, otherwise false
     * @param {object}  result.retries   information about spec related retries, e.g. `{ attempts: 0, limit: 0 }`
     */
    afterTest: async function(test, context, { error, result, duration, passed, retries }) {
        if (!passed) {
            await browser.takeScreenshot();
        }
    },

    /**
     * Gets executed after all workers got shut down and the process is about to exit. An error
     * thrown in the onComplete hook will result in the test run failing.
     * @param {object} exitCode 0 - success, 1 - fail
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */
    // onComplete: function(exitCode, config, capabilities, results) {
    // },
};
