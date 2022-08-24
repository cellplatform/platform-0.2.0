export * from './types.mjs';

import { Logger } from './Log/index.mjs';

const Log = Logger.create();
export { Logger, Log, Log as log, Log as default };
