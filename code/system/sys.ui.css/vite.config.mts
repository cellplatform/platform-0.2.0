import { ViteConfig } from '../../../Config.mjs';
import pkg from './package.json';
export default ViteConfig.default(__dirname, pkg.name);
