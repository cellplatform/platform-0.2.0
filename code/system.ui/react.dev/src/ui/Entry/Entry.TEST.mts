import { describe, it, expect, t } from '../../test';
import { Entry } from '.';

describe('Entry', () => {
  it('isDev', () => {
    expect(Entry.isDev('https://domain.com/')).to.eql(false);
    expect(Entry.isDev('https://domain.com/?d')).to.eql(true);
    expect(Entry.isDev('https://domain.com/?dev')).to.eql(true);
  });
});
