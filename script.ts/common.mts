import * as t from './types.mjs';
import fsextra from 'fs-extra';
import path from 'path';

export { t };
export const fs = { ...fsextra, ...path };
