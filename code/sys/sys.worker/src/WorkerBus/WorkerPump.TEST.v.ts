import { rx, slug, type t } from '../common';
import { describe, expect, it, WorkerMemoryStub } from '../test';
import { WorkerPump } from '.';

describe('WorkerPump', () => {
  it('fires between [worker] and [main]', () => {
    const stub = WorkerMemoryStub();
    const bus = rx.bus();
    let workerPump: t.WorkerPump | undefined;

    const firedMain: t.NetworkMessageEvent[] = [];
    const firedWorker: t.NetworkMessageEvent[] = [];
    bus.$.subscribe((e) => firedMain.push(e as any));

    const workerId = `worker.${slug()}`;
    const worker = stub.worker(workerId, (ctx) => {
      const bus = rx.bus();
      bus.$.subscribe((e) => firedWorker.push(e as any));
      workerPump = WorkerPump.worker({ ctx, bus });
    });

    const mainPump = WorkerPump.main({ worker: worker, bus });

    expect(mainPump.id).to.eql('Main');
    expect(workerPump?.id).to.eql(workerId);

    mainPump.fire({ type: 'foo', payload: {} });

    expect(firedMain.length).to.eql(1);
    expect(firedWorker.length).to.eql(1);
    expect(firedMain[0]).to.eql(firedWorker[0]);
    expect(firedMain[0].payload.sender).to.eql('Main');

    workerPump?.fire({ type: 'foo', payload: {} });

    expect(firedMain.length).to.eql(2);
    expect(firedWorker.length).to.eql(2);
    expect(firedMain[1]).to.eql(firedWorker[1]);
    expect(firedMain[1].payload.sender).to.eql(workerId);
  });
});
