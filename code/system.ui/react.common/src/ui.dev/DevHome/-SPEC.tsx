import { useEffect, useState, useRef, isValidElement } from 'react';

import { Dev, Pkg } from '../../test.ui';
import { DevHome, DevHomeProps } from '.';

type T = {
  props: DevHomeProps;
  debug: {};
};
const DEFAULTS = DevHome.DEFAULTS;
const initial: T = {
  props: {
    center: DEFAULTS.center,
    keyboard: DEFAULTS.keyboard,
    pkg: Pkg.toString(),
  },
  debug: {},
};

export default Dev.describe('DevHome', (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <DevHome {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => `center`)
          .value((e) => e.state.props.center)
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'center'))),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `keyboard`)
          .value((e) => e.state.props.keyboard)
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'keyboard'))),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `pkg`)
          .value((e) => Boolean(e.state.props.pkg))
          .onClick((e) =>
            e.change((d) => {
              //
              const current = d.props.pkg;
              const next = current ? undefined : Pkg.toString();
              d.props.pkg = next;
            }),
          ),
      );
    });

    dev.hr(5, 20);

    dev.section('Samples', (dev) => {
      dev.button((btn) =>
        btn
          .label('none (default)')
          .right((e) => (!e.state.props.children ? '←' : ''))
          .onClick((e) => e.change((d) => (d.props.children = undefined))),
      );

      dev.button((btn) =>
        btn
          .label('sample element')
          .right((e) => (isValidElement(e.state.props.children) ? '←' : ''))
          .onClick((e) =>
            e.change((d) => {
              d.props.children = <div>hello 👋</div>;
            }),
          ),
      );
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'Dev.DevHome'} data={data} expand={1} />;
    });
  });
});
