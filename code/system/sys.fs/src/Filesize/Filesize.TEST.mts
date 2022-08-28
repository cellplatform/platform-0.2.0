import { describe, expect, it } from '../TEST/index.mjs';
import { Filesystem } from '../index.mjs';
import { Filesize } from './index.mjs';

describe('Filesize', () => {
  it('default', () => {
    expect(Filesize(1000)).to.eql('1 kB');
  });

  it('round', () => {
    expect(Filesize(1234)).to.eql('1.23 kB');
    expect(Filesize(1234, { round: 1 })).to.eql('1.2 kB');
    expect(Filesize(1234, { round: 0 })).to.eql('1 kB');
  });

  it('spacer', () => {
    expect(Filesize(1234, { locale: undefined })).to.eql('1.23 kB');
    expect(Filesize(1234, { locale: 'de' })).to.eql('1,23 kB');
  });

  it('Filesystem.Filesize(...)', () => {
    expect(Filesystem.Filesize).to.equal(Filesize);
    expect(Filesystem.Filesize(1234)).to.eql('1.23 kB');
  });
});
