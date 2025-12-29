import NavigationFlow from '../../helpers/navigationflow.js';
import { $, $$, browser, expect } from '@wdio/globals';
import SuratmuatanPage from '../../pageobjects/Surat-Muatan/suratmuatan.page.js';
import SoftError from '../../helpers/softerror.js';

describe('AT-CORE-0022', () => {

    before(async () => {
        // Login and Flow
        await NavigationFlow.loginAndNavigateToSuratMuatan();
    });

    describe('AT-CORE-0022-09', () => {
        it('Validate Print Page', async() => {
            const soft = new SoftError();

            await SuratmuatanPage.checkPrint(soft);

            soft.flush();
        })
    })

})