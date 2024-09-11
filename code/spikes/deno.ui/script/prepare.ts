import { Fs, Path } from '../src/common/libs.ts';

const sourceDir = Path.resolve('../deno.ui.vite/dist/web');
const targetDir = Path.resolve('./dist');

await Fs.copyDir(sourceDir, targetDir);
