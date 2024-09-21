import { describe, expect, it } from '../common.ts';
import { Testing } from '../Testing/mod.ts';
import { TestingHttpServer } from './mod.ts';

describe('suite', () => {});

describe('Testing.Http (lightweight HTTP mocking server', () => {
  it('exposed from Root API', () => {
    expect(TestingHttpServer.create).to.not.equal(Testing.Http.server);
  });

  it('does', async () => {
    const server = TestingHttpServer.create((res) => Testing.Http.json({ foo: 123 }));
    const res = await fetch(server.url.join('/'));
    const json = await res.json();

    expect(res.status).to.eql(200);
    expect(json).to.eql({ foo: 123 });

    await server.dispose();
  });
});
