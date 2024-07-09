import { SampleMain as Sample } from './Main';
import { render } from './Main.u.render';

export const Dev = {
  Main: { render, Sample },
} as const;
