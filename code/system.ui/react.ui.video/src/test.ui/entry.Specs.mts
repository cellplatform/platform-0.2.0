export const Specs = {
  'sys.ui.video.Vimeo': () => import('../ui/Vimeo/dev/Vimeo.SPEC'),
  'sys.ui.video.VimeoBackground': () => import('../ui/Vimeo/dev/VimeoBackground.SPEC'),
  'sys.ui.video.RecordButton': () => import('../ui/RecordButton/RecordButton.SPEC'),
  'sys.ui.video.MediaStream': () => import('../ui/MediaStream/MediaStream.SPEC'),
};

export default Specs;
