import { describe, it, expect, t } from '../test';
import { ContentBundler } from '../Content.Bundler';
import { ContentLogger } from '../Content.Logger';
import { Content } from '.';

describe('Content', () => {
  it('bundler', () => {
    expect(Content.Bundler).to.equal(ContentBundler);
    expect(Content.bundler).to.equal(ContentBundler.create);
  });

  it('log', () => {
    expect(Content.Logger).to.equal(ContentLogger);
    expect(Content.logger).to.equal(ContentLogger.create);
  });
});
