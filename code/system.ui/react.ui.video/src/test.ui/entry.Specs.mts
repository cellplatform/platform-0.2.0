export const ServiceSpecs = {
  'sys.ui.media.video.Vimeo': () => import('../ui/vendor.Vimeo/dev/Vimeo.SPEC'),
  'sys.ui.media.video.VimeoBackground': () => import('../ui/vendor.Vimeo/dev/VimeoBackground.SPEC'),
  'sys.ui.media.video.YouTube': () => import('../ui/vendor.YouTube/YouTube.SPEC'),
};

export const Specs = {
  'sys.ui.media.MediaStream': () => import('../ui/MediaStream/MediaStream.SPEC'),
  'sys.ui.media.ProgressBar': () => import('../ui/ProgressBar/-SPEC'),
  'sys.ui.media.AudioPlayer': () => import('../ui/AudioPlayer/-SPEC'),
  'sys.ui.media.RecordButton': () => import('../ui/RecordButton/RecordButton.SPEC'),
  ...ServiceSpecs,
};

export default Specs;
