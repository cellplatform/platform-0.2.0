import Root1 from 'sample.web.lib-1';
import Root2 from 'sample.web.lib-1/web';

import { Foo } from 'sample.web.lib-1/Foo';
import { Bar } from 'sample.web.lib-1/web/Bar';

console.log('Root1', Root1);
console.log('Root2', Root2);
console.log('Foo', Foo);
console.log('Bar', Bar);
