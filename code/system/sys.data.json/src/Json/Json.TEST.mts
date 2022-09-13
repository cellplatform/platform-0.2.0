import { describe, it, expect } from '../TEST/index.mjs';
import { Json } from './index.mjs';

import JsonDefault from '../index.mjs';

// import { JsonBus } from '../Json.Bus';
import { Patch } from '../Json.Patch/index.mjs';

describe('Json', () => {
  it('default module export', () => {
    expect(JsonDefault).to.equal(Json);
  });

  it.skip('exposes [JsonBus]', () => {
    // expect(Json.Bus).to.equal(JsonBus);
  });

  it('exposes [Patch]', () => {
    expect(Json.Patch).to.equal(Patch);
  });
});
