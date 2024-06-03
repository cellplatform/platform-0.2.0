import { resolve } from 'path';
import { Pkg } from './index.pkg';

/**
 * Sample log output.
 */
console.info(`Package: ${Pkg.name} | v${Pkg.version}`);
console.info(` - ${resolve('./')}`);
console.info(``);

export default Pkg;
