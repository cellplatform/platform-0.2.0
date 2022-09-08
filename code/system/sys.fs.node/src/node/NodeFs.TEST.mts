import { expect, describe, it } from '../TEST/index.mjs';
import { NodeGlob, NodeFs } from './index.mjs';

describe('NodeFs', () => {
  const methodExists = (method: keyof typeof NodeFs) => {
    expect(typeof NodeFs[method]).to.eql('function');
  };

  it('has "fs-extra"', () => {
    methodExists('lstat');
    methodExists('read');
    methodExists('readJson');
    methodExists('writeFile');
    methodExists('remove');
  });

  it('has "path"', () => {
    methodExists('join');
    methodExists('resolve');
  });

  it('has glob', () => {
    expect(NodeFs.glob).to.equal(NodeGlob.find);
  });
});
