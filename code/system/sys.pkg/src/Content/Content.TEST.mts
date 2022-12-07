import { describe, it, expect, t } from '../test';
import { ContentBundle } from '../Content.Bundle';
import { ContentLog } from '../Content.Log';
import { Content } from '.';

describe('Content', () => {
  it('bundler', () => {
    expect(Content.Bundle).to.equal(ContentBundle);
    expect(Content.bundle).to.equal(ContentBundle.create);
  });

  it('log', () => {
    expect(Content.Log).to.equal(ContentLog);
    expect(Content.log).to.equal(ContentLog.create);
  });
});
