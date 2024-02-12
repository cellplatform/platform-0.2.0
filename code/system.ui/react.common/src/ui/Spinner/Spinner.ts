import { SpinnerPuff as Puff } from './ui.Puff';
import { SpinnerBar as Bar } from './ui.Bar';
import { SpinnerOrbit as Orbit } from './ui.Orbit';
import { Center } from '../Center';

export const Spinner = {
  /**
   * Spinner Variants.
   */
  Puff,
  Bar,
  Orbit,

  /**
   * Helpers
   */
  Center,
} as const;
