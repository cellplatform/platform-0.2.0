export const ServiceSpecs = {
  'sys.ui.video.Vimeo': () => import('../ui/vendor.Vimeo/dev/Vimeo.SPEC'),
  'sys.ui.video.VimeoBackground': () => import('../ui/vendor.Vimeo/dev/VimeoBackground.SPEC'),
  'sys.ui.video.YouTube': () => import('../ui/vendor.YouTube/YouTube.SPEC'),
};

export const Specs = {
  'sys.ui.video.MediaStream': () => import('../ui/MediaStream/MediaStream.SPEC'),
  'sys.ui.video.RecordButton': () => import('../ui/RecordButton/RecordButton.SPEC'),
  ...ServiceSpecs,
};

export default Specs;
