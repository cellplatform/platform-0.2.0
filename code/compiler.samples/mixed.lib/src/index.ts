import { Pkg } from './index.pkg';

/**
 * Sample log output.
 */
console.info(`Package: ${Pkg.name} | v${Pkg.version}`);
console.info('');

export { Math } from './Math';
export { Pkg };
export default Pkg;
