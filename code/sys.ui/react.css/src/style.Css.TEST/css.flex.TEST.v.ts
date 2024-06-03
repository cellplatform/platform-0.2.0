import { expect, describe, it } from '../test';
import { Style } from '..';

describe('Flex', () => {
  it('does not fail when undefined is passed', () => {
    const result = Style.transform({ Flex: undefined });
    expect(result).to.eql({});
  });

  it('does not fail when false is passed', () => {
    const result = Style.transform({ Flex: false });
    expect(result).to.eql({});
  });
});
