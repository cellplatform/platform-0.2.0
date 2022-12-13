import { Color, COLORS, css, t } from '../common';
import { HarnessHost } from '../Harness.Host';
import { HarnessSpecColumn } from '../Harness.SpecColumn';
import { useSpecRunner } from './__useSpecRunner.mjs';
import { useBusController } from '../../ui.Bus.hooks';

export type HarnessProps = {
  instance?: t.DevInstance;
  spec?: t.BundleImport;
  style?: t.CssValue;
};

export const Harness: React.FC<HarnessProps> = (props) => {
  const controller = useBusController({
    bundle: props.spec,
    bus: props.instance?.bus,
    id: props.instance?.id,
    runOnLoad: true,
  });

  const runner = useSpecRunner(controller.instance, props.spec);
  const { instance } = controller;

  console.log('-------------------------------------------');
  console.log('info', controller.info);
  console.log('runner.args', runner.args);

  /**
   * [Render]
   */
  const styles = {
    reset: css({
      color: COLORS.DARK,
      fontFamily: 'sans-serif',
      fontSize: 16,
    }),
    base: css({
      position: 'relative',
      Flex: 'x-stretch-stretch',
    }),
    left: css({
      flex: 1,
      position: 'relative',
      display: 'flex',
    }),
    right: css({
      boxSizing: 'border-box',
      position: 'relative',
      display: 'flex',
      width: 400,
      borderLeft: `solid 1px ${Color.format(-0.1)}`,
      padding: 20, // TEMP 🐷
    }),
  };

  return (
    <div {...css(styles.reset, styles.base, props.style)}>
      <div {...styles.left}>
        <HarnessHost instance={instance} renderArgs={runner.args} />
      </div>
      <div {...styles.right}>
        <HarnessSpecColumn instance={instance} renderArgs={runner.args} />
      </div>
    </div>
  );
};
