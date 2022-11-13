export { Pkg } from './index.pkg.mjs';

export const UI = {
  Icon: async () => (await import('./ui.Icon/Icon')).Icon,
  Spinner: async () => (await import('./ui.Spinner/Spinner')).Spinner,
  ZoomAndPan: async () => (await import('./ui.ZoomAndPan/ZoomAndPan')).ZoomAndPan,
};
