import { expect } from 'chai';
import { fs } from './index.mjs';
import { NodeGlob } from '../Node.Glob/index.mjs';

describe('NodeFs', () => {
  const methodExists = (method: keyof typeof fs) => {
    expect(typeof fs[method]).to.eql('function');
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
    expect(fs.glob).to.equal(NodeGlob.find);
  });
});
