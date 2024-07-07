import { Pkg, type t } from './common';
import { SampleMain } from './-ui.dev.Main';
import { render } from './-ui.dev.Main.render';

export const Dev = {
  Main: {
    render,
    Sample: SampleMain,
  },
} as const;
