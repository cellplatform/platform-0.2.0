import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('@testing-library/react', () => {
  it('sample (simple)', () => {
    render(<div>Hello</div>);
    expect(screen.getByText(/Hello/i)).toBeDefined();
  });
});
