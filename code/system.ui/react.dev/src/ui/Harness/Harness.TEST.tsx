import { cleanup, render, screen, waitFor } from '@testing-library/react';

import { Harness } from '.';
import { describe, expect, it } from '../../test';

describe('<Dev.Harness>', () => {
  it('root: DevHarness', async () => {
    const spec = import('../../test.sample/specs.unit/Sample-1.SPEC');
    render(<Harness spec={spec} />);

    await waitFor(() => {
      const el = screen.getByText(/Hello Component/i);
      expect(el).toBeDefined;
    });

    cleanup();
  });
});
