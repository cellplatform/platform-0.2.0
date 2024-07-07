import { SampleMain } from './-ui.dev.Main';
import { render } from './-ui.dev.Main.u.render';

export const Dev = {
  Main: {
    render,
    Sample: SampleMain,
  },
} as const;
