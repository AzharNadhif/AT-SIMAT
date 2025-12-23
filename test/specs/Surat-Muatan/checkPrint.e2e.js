import NavigationFlow from '../../helpers/navigationflow.js';
import { $, $$, browser, expect } from '@wdio/globals';
import SuratmuatanPage from '../../pageobjects/Surat-Muatan/suratmuatan.page.js';

describe('AT-CORE-0022', () => {
    let testData;

    before(async () => {
        // Login and Flow
        await NavigationFlow.loginAndNavigateToSuratMuatan();
    });

    describe('AT-CORE-0022-09', () => {

        it('Validate Print Page', async() => {
            await SuratmuatanPage.checkPrint();
        })
    })

})