import { describe, it, expect, t, TestSample } from '../test';

describe('Context', () => {
  it('update and flush', async () => {
    const { events, instance } = await TestSample.create();
    const info1 = await events.info.get();

    expect(info1.render.props).to.eql(undefined);

    console.log('-------------------------------------------');
    console.log('info', info1);

    events.dispose();
  });
});
