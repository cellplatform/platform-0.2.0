export { Markdown, Markdown as default } from './Markdown/index.mjs';

import { Pkg } from './index.pkg.mjs';
export async function Foo() {
  console.info(Pkg.toString());
}
