import { describe, expect, it, Pkg } from './test/index.mjs';

describe('main', () => {
  it('UpdateService (HTTP Router)', () => {
    // expect(Pkg.version.length).to.greaterThan(0);

    /**
     * TODO 🐷
     */
    console.log('Pkg:', Pkg.toString());
    console.log('Docs:', 'https://tauri.app/v1/guides/distribution/updater');

    // REF: https://tauri.app/v1/guides/distribution/updater
    //
    //   "updater": {
    //     "active": true,
    //     "endpoints": [
    //         "https://releases.myapp.com/{{target}}/{{current_version}}"
    //     ],
    //     "dialog": true,
    //     "pubkey": "YOUR_UPDATER_SIGNATURE_PUBKEY_HERE"
    // }
    //
  });
});
