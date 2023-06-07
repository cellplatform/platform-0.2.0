const { Specs: Media } = await import('sys.ui.react.media/specs');
const { Specs: Monaco } = await import('sys.ui.react.monaco/specs');

export const Specs = {
  'spike.dev': () => import('../ui/Root/-dev/Root.SPEC.devenv'),
  'spike.ui.Root.entry': () => import('../ui/Root/-dev/Root.SPEC'),
  'spike.ui.Root.holding': () => import('../ui/Root.HoldingPattern/Root.SPEC'),
  'spike.ui.TileOutline': () => import('../ui/Tile.Outline/TileOutline.SPEC'),
  'spike.ui.Video.Diagram': () => import('../ui/Video.Diagram/ui.VideoDiagram.SPEC'),
  'spike.ui.Video.ProgressBar': () => import('../ui/Video.ProgressBar/ui.ProgressBar.SPEC'),
  'spike.ui.Concept.Playlist': () => import('../ui/Concept.Playlist/Playlist.SPEC'),

  ...Media,
  ...Monaco,
};

export default Specs;
