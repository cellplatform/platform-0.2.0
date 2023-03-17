import { describe, it, expect } from '../test';

import { type t } from '../common';
import { Time } from '../Time';
import { WorkerMemoryStub } from '.';

describe('WorkerMemoryStub', () => {
  it('adds worker to list and initialized with self/context', () => {
    const stub = WorkerMemoryStub();
    expect(stub.workers).to.eql([]);

    let workerSelf: t.WorkerSelf | undefined;
    const worker = stub.worker('worker.foo', (self) => (workerSelf = self));

    expect(stub.workers.length).to.eql(1);
    expect(stub.workers[0].name).to.eql('worker.foo');
    expect(stub.workers[0].instance).to.equal(worker);
    expect(workerSelf?.name).to.eql('worker.foo');
  });

  it('passes message from [Main] to [Worker] event listener', () => {
    const stub = WorkerMemoryStub();
    const messages: MessageEvent[] = [];

    let workerSelf: t.WorkerSelf | undefined;
    let callbackThis: any | undefined;

    const worker = stub.worker('worker.foo', (self) => {
      workerSelf = self;
      self.addEventListener('message', function (ev) {
        callbackThis = this;
        messages.push(ev);
      });
    });

    worker.postMessage('foo');
    worker.postMessage({ count: 123 });

    expect(messages.length).to.eql(2);
    expect(messages[0]).to.eql({ data: 'foo' });
    expect(messages[1]).to.eql({ data: { count: 123 } });

    expect(workerSelf).to.equal(callbackThis);
  });

  it('passes message from [Worker] to [Main] thread', async () => {
    const stub = WorkerMemoryStub();
    const messages: MessageEvent[] = [];

    const worker = stub.worker('worker.foo', (self) => {
      Time.delay(0, () => {
        self.postMessage('foo');
        self.postMessage({ count: 123 });
      });
    });

    worker.onmessage = (ev) => messages.push(ev);
    await Time.wait(10);

    expect(messages.length).to.eql(2);
    expect(messages[0]).to.eql({ data: 'foo' });
    expect(messages[1]).to.eql({ data: { count: 123 } });
  });
});
