import { describe, expect, it } from '../test';
import { WrangleUrl } from './Wrangle.mjs';

describe('Entry', () => {
  it('isDev', () => {
    const isDev = WrangleUrl.navigate.isDev;
    expect(isDev('https://domain.com/')).to.eql(false);
    expect(isDev('https://domain.com/?d')).to.eql(true);
    expect(isDev('https://domain.com/?dev')).to.eql(true);
  });
});
