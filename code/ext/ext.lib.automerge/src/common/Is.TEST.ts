import { Repo } from '@automerge/automerge-repo';
import { BroadcastChannelNetworkAdapter } from '@automerge/automerge-repo-network-broadcastchannel';
import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb';

import { type t, Test, expect, TestDb } from '../test.ui';
import { Store } from '../Store';
import { WebStore } from '../Store.Web';
import { Is } from '.';

export default Test.describe('Is', (e) => {
  const NON_OBJECTS = [true, 123, '', [], {}, null, undefined];

  const repo1 = new Repo({ network: [] });
  const repo2 = new Repo({ network: [new BroadcastChannelNetworkAdapter()] });
  const repo3 = new Repo({
    network: [new BroadcastChannelNetworkAdapter()],
    storage: new IndexedDBStorageAdapter(TestDb.name),
  });

  e.it('Is.store', (e) => {
    const store = Store.init();
    expect(Is.store(store)).to.eql(true);
    NON_OBJECTS.forEach((value) => expect(Is.store(value)).to.eql(false));
  });

  e.it('Is.webStore', (e) => {
    expect(Is.webStore(WebStore.init({ storage: false }))).to.eql(true);
    expect(Is.webStore(Store.init())).to.eql(false);
    NON_OBJECTS.forEach((value) => expect(Is.store(value)).to.eql(false));
  });

  e.it('Is.repo', (e) => {
    NON_OBJECTS.forEach((v) => expect(Is.repo(v)).to.eql(false));
    expect(Is.repo(repo1)).to.eql(true);
    expect(Is.repo(repo2)).to.eql(true);
    expect(Is.repo(repo3)).to.eql(true);
  });

  e.it('Is.repoIndex', (e) => {
    NON_OBJECTS.forEach((v) => expect(Is.repoIndex(v)).to.eql(false));
    const index: t.RepoIndex = { docs: [] };
    expect(Is.repoIndex(index)).to.eql(true);
  });

  e.it('Is.networkSubsystem', (e) => {
    NON_OBJECTS.forEach((v) => expect(Is.networkSubsystem(v)).to.eql(false));
    expect(Is.networkSubsystem(repo1)).to.eql(false);
    expect(Is.networkSubsystem(repo1.networkSubsystem)).to.eql(true);
    expect(Is.networkSubsystem(repo2.networkSubsystem)).to.eql(true);
    expect(Is.networkSubsystem(repo3.networkSubsystem)).to.eql(true);
  });

  e.it('Is.storageSubsystem', (e) => {
    NON_OBJECTS.forEach((v) => expect(Is.storageSubsystem(v)).to.eql(false));
    expect(Is.storageSubsystem(repo1.storageSubsystem)).to.eql(false);
    expect(Is.storageSubsystem(repo2.storageSubsystem)).to.eql(false);
    expect(Is.storageSubsystem(repo3.storageSubsystem)).to.eql(true);
  });

  e.it('Is.automergeUrl', (e) => {
    const store = Store.init();
    const doc = store.repo.create();
    expect(Is.automergeUrl(doc.url)).to.eql(true);
    NON_OBJECTS.forEach((v) => expect(Is.automergeUrl(v)).to.eql(false));
  });

  e.it('Is.broadcastChannel', (e) => {
    const adapter = new BroadcastChannelNetworkAdapter();
    expect(Is.broadcastChannel(adapter)).to.eql(true);
    NON_OBJECTS.forEach((v) => expect(Is.broadcastChannel(v)).to.eql(false));
  });
});
