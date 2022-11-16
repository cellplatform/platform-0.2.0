export * from './Root';

export const Imports = {
  'spike.ui.Root': () => import('./dev/Root.SPEC'),
  'spike.ui.Root.dev': () => import('./dev/Root.DevEnv.SPEC'),
  'spike.ui.TileOutline': () => import('../Tile.Outline/TileOutline.SPEC'),
  'spike.ui.VideoDiagram': () => import('../VideoDiagram/VideoDiagram.SPEC'),
};
