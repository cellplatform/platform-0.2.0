import { ViteConfig } from '../../../config.mjs';
import pkg from './package.json';
export default ViteConfig.default(__dirname, pkg.name, async (modify) => {
  modify.externalDependency('sys.util');
  modify.externalDependency('sys.test')
});
