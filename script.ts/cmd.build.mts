import { Builder } from './common/index.mjs';

const dir = process.cwd();
Builder.build(dir, { syncDeps: true });
