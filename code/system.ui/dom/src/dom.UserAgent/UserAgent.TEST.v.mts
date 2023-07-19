import { describe, it, expect, t } from '../test';
import { UserAgent } from '.';

describe('UserAgent', () => {
  const EXAMPLE = {
    macos: `'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'`,
  };

  it('parses user-agent string', () => {
    const res = UserAgent.parse(EXAMPLE.macos);
    expect(res.os.name).to.eql('Mac OS');
    expect(res.browser.name).to.eql('Chrome');
  });

  it('UserAgent.current (safe on server)', () => {
    const res = UserAgent.current;
    expect(res.browser.name).to.eql('WebKit');
    expect(res.engine.name).to.eql('WebKit');
  });
});
