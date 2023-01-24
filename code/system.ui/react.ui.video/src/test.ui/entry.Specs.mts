export const ServiceSpecs = {
  'sys.ui.video.Vimeo': () => import('../ui/vendor.Vimeo/dev/Vimeo.SPEC'),
  'sys.ui.video.VimeoBackground': () => import('../ui/vendor.Vimeo/dev/VimeoBackground.SPEC'),
  'sys.ui.video.YouTube': () => import('../ui/service.YouTube/YouTube.SPEC'),
};

export const Specs = {
  ...ServiceSpecs,
  'sys.ui.video.RecordButton': () => import('../ui/RecordButton/RecordButton.SPEC'),
  'sys.ui.video.MediaStream': () => import('../ui/MediaStream/MediaStream.SPEC'),
};

export default Specs;
