import fs from 'fs';
import path from 'path';

(async () => {
  //
  const text = fs.readFileSync(path.resolve('tmp/tmp.md')).toString();
  const modules = text.split('\n');

  console.log(text.toString());
  // npm deprecate <MODULE>@0.x "pre-release module deprecation"
})();
