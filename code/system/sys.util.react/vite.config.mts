import { ViteConfig } from '../../../config.mjs';
export default ViteConfig.default(__dirname, (e) => {
  e.environment('web');
});
