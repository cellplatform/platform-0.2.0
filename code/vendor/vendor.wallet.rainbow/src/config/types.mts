import type { Import } from './Config.Import.mjs';
import type { configure } from './Config.mjs';

export type AllImports = Awaited<ReturnType<typeof Import.all>>;
export type ConfigureResponse = Awaited<ReturnType<typeof configure>>;
