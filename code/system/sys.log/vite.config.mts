import { ViteConfig } from '../../../config.mjs';
export default ViteConfig.default(__dirname, async (e) => {
  e.addExternalDependency('sys.test');
});
