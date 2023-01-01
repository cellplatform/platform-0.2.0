import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { describe, expect, it } from '../../test';

import { Harness } from '.';

describe('<Dev.Harness>', () => {
  it('sample (simple)', () => {});

  it('root: DevHarness', async () => {
    const spec = import('./Harness.SPEC');
    render(<Harness spec={spec} />);

    await waitFor(() => {
      expect(screen.getByText(/MySample/i)).toBeDefined;
    });

    cleanup();
  });
});
