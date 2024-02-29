import { cleanup, render, screen, waitFor } from '@testing-library/react';

import { Harness } from '.';
import { describe, expect, it } from '../../test';

describe('<Dev.Harness>', () => {
  it('root: DevHarness', async () => {
    const spec = import('../../test.ui/sample.specs.unit-test/Sample-1.SPEC');
    render(<Harness spec={spec} />);

    await waitFor(() => {
      const el1 = screen.getByText(/Hello Subject/i);
      const el2 = screen.getByText(/Hello Row!/i);
      expect(el1).toBeDefined;
      expect(el2).toBeDefined;
    });

    cleanup();
  });

  it.only('root: DevHarness with {env}', async () => {
    const spec = import('../../test.ui/sample.specs.unit-test/Sample-1.SPEC');
    const env = { msg: 'Yo environment!' };
    render(<Harness spec={spec} env={env} />);

    await waitFor(() => {
      const el = screen.getByText(/Yo environment!/i);
      expect(el).toBeDefined;
    });

    cleanup();
  });
});
