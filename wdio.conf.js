import path from 'path';
import 'dotenv/config';
import video from 'wdio-video-reporter';
import fs from 'fs';

const isHeadless = /^(1|true|yes|on)$/i.test(process.env.HEADLESS || '');
const videoDir = path.join(process.cwd(), '_results_/videos');

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
    specs: ['./test/specs/**/*.js'],
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
        SuratMuatanKereta:[
            './test/specs/Outgoing-SM/createSMDK.e2e.js',
        ],
        SuratMuatanTruk:[
            './test/specs/Outgoing-SM/createSMDT.e2e.js',
        ],
        SuratMuatanLaut:[
            './test/specs/Outgoing-SM/createSML.e2e.js',
        ],
        SuratMuatanUdara:[
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
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    //     webdriver: 'info',
    //     '@wdio/appium-service': 'info'
    // },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    // baseUrl: 'http://localhost:8080',
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
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    // services: [],
    //
    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'mocha',
    
    //
    // The number of times to retry the entire specfile when it fails as a whole
    // specFileRetries: 1,
    //
    // Delay in seconds between the spec file retry attempts
    // specFileRetriesDelay: 0,
    //
    // Whether or not retried spec files should be retried immediately or deferred to the end of the queue
    // specFileRetriesDeferred: false,
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: https://webdriver.io/docs/dot-reporter
    // reporters: ['spec',['allure', {outputDir: 'allure-results'}]],

//    afterTest: async function(test, context, { error, result, duration, passed, retries }) {
//         if (!passed) {
//             await browser.takeScreenshot();
//         }
//     },

//     onComplete: function(exitCode, config, capabilities, results) {
//         console.log('\n🎬 Cleaning up videos and screenshots...');
        
//         if (!fs.existsSync(videoDir)) {
//             console.log('⚠️  Video directory not found');
//             return;
//         }

//         // Hapus folder screenshots
//         const screenshotsDir = path.join(videoDir, '.video-reporter-screenshots');
//         if (fs.existsSync(screenshotsDir)) {
//             try {
//                 fs.rmSync(screenshotsDir, { recursive: true, force: true });
//                 console.log('🗑️  Deleted .video-reporter-screenshots folder');
//             } catch (err) {
//                 console.log('⚠️  Failed to delete screenshots:', err.message);
//             }
//         }

//         // Cleanup video lama
//         const allVideos = fs.readdirSync(videoDir)
//             .filter(f => f.endsWith('.webm') || f.endsWith('.mp4'))
//             .map(f => ({
//                 name: f,
//                 path: path.join(videoDir, f),
//                 time: fs.statSync(path.join(videoDir, f)).mtime.getTime()
//             }))
//             .sort((a, b) => b.time - a.time);

//         if (allVideos.length === 0) {
//             console.log('📹 No videos found');
//             return;
//         }

//         const videoGroups = {};
        
//         allVideos.forEach(video => {
//             const baseName = video.name
//                 .replace(/--CHROME--.*\.(webm|mp4)$/i, '')
//                 .replace(/--FIREFOX--.*\.(webm|mp4)$/i, '')
//                 .replace(/-0-0$/, '');
            
//             if (!videoGroups[baseName]) {
//                 videoGroups[baseName] = [];
//             }
//             videoGroups[baseName].push(video);
//         });

//         let deletedCount = 0;
//         Object.keys(videoGroups).forEach(baseName => {
//             const videos = videoGroups[baseName];
            
//             if (videos.length > 1) {
//                 console.log(`\n📂 Test case: ${baseName}`);
//                 console.log(`   Found ${videos.length} videos`);
                
//                 videos.slice(1).forEach(video => {
//                     try {
//                         fs.unlinkSync(video.path);
//                         console.log(`   🗑️  Deleted: ${video.name}`);
//                         deletedCount++;
//                     } catch (err) {
//                         console.log(`   ⚠️  Failed to delete: ${video.name}`);
//                     }
//                 });
                
//                 console.log(`   ✅ Kept: ${videos[0].name}`);
//             }
//         });

//         console.log(`\n🎉 Cleanup complete! Deleted ${deletedCount} old video(s)\n`);
//     },

//     reporters: [
//         [video, {
//             saveAllVideos: true,
//             videoSlowdownMultiplier: 1,
//             outputDir: videoDir,
//             videoRenderTimeout: 5,
//             saveAllScreenshots: false,  // ← Disable screenshots
//             filename: function(options) {
//                 const specName = options.specs[0].split('/').pop().replace('.js', '');
//                 return `${specName}.mp4`;
//             }
//         }],
//         ['allure', {
//             outputDir: '_results_/allure-raw',
//             disableWebdriverStepsReporting: true,
//             disableWebdriverScreenshotsReporting: false,
//         }],
//     ],

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
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    /**
     * Gets executed once before all workers get launched.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    // onPrepare: function (config, capabilities) {
    // },
    /**
     * Gets executed before a worker process is spawned and can be used to initialize specific service
     * for that worker as well as modify runtime environments in an async fashion.
     * @param  {string} cid      capability id (e.g 0-0)
     * @param  {object} caps     object containing capabilities for session that will be spawn in the worker
     * @param  {object} specs    specs to be run in the worker process
     * @param  {object} args     object that will be merged with the main configuration once worker is initialized
     * @param  {object} execArgv list of string arguments passed to the worker process
     */
    // onWorkerStart: function (cid, caps, specs, args, execArgv) {
    // },
    /**
     * Gets executed just after a worker process has exited.
     * @param  {string} cid      capability id (e.g 0-0)
     * @param  {number} exitCode 0 - success, 1 - fail
     * @param  {object} specs    specs to be run in the worker process
     * @param  {number} retries  number of retries used
     */
    // onWorkerEnd: function (cid, exitCode, specs, retries) {
    // },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     * @param {string} cid worker id (e.g. 0-0)
     */
    // beforeSession: function (config, capabilities, specs, cid) {
    // },
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs        List of spec file paths that are to be run
     * @param {object}         browser      instance of created browser/device session
     */
    // before: function (capabilities, specs) {
    // },
    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {string} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    // beforeCommand: function (commandName, args) {
    // },
    /**
     * Hook that gets executed before the suite starts
     * @param {object} suite suite details
     */
    // beforeSuite: function (suite) {
    // },
    /**
     * Function to be executed before a test (in Mocha/Jasmine) starts.
     */
    // beforeTest: function (test, context) {
    // },
    /**
     * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
     * beforeEach in Mocha)
     */
    // beforeHook: function (test, context, hookName) {
    // },
    /**
     * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
     * afterEach in Mocha)
     */
    // afterHook: function (test, context, { error, result, duration, passed, retries }, hookName) {
    // },
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
     * Hook that gets executed after the suite has ended
     * @param {object} suite suite details
     */
    // afterSuite: function (suite) {
    // },
    /**
     * Runs after a WebdriverIO command gets executed
     * @param {string} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {number} result 0 - command success, 1 - command error
     * @param {object} error error object if any
     */
    // afterCommand: function (commandName, args, result, error) {
    // },
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // after: function (result, capabilities, specs) {
    // },
    /**
     * Gets executed right after terminating the webdriver session.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // afterSession: function (config, capabilities, specs) {
    // },
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
    /**
    * Gets executed when a refresh happens.
    * @param {string} oldSessionId session ID of the old session
    * @param {string} newSessionId session ID of the new session
    */
    // onReload: function(oldSessionId, newSessionId) {
    // }
    /**
    * Hook that gets executed before a WebdriverIO assertion happens.
    * @param {object} params information about the assertion to be executed
    */
    // beforeAssertion: function(params) {
    // }
    /**
    * Hook that gets executed after a WebdriverIO assertion happened.
    * @param {object} params information about the assertion that was executed, including its results
    */
    // afterAssertion: function(params) {
    // }
}