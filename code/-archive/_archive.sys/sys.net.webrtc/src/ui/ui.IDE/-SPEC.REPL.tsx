import { type t, Color, css, COLORS } from './common';

/**
 * Read, Eval, Print, Loop - Helpers
 */
export const REPL = {
  render(args: { state: any }) {
    const { state } = args;
    if (typeof state !== 'object' || state === null) return null;

    const images = state?.images;
    if (!Array.isArray(images)) return null;

    const image = images[0];
    if (typeof image !== 'string') return null;

    const styles = {
      base: css({
        backgroundImage: `url(${image})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backdropFilter: 'blur(10px)',
        backgroundColor: Color.alpha(COLORS.DARK, 0.3),
      }),
    };
    return <div {...styles.base}></div>;
  },
};
