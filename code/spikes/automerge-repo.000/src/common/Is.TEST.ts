import { Repo } from '@automerge/automerge-repo';
import { BroadcastChannelNetworkAdapter } from '@automerge/automerge-repo-network-broadcastchannel';
import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb';

import { Test, expect } from '../test.ui';
import { Store } from '../crdt.Store';
import { Is } from '.';

export default Test.describe('Is', (e) => {
  const NON_OBJECTS = [true, 123, '', [], {}, null, undefined];

  const repo1 = new Repo({ network: [] });
  const repo2 = new Repo({ network: [new BroadcastChannelNetworkAdapter()] });
  const repo3 = new Repo({
    network: [new BroadcastChannelNetworkAdapter()],
    storage: new IndexedDBStorageAdapter(),
  });

  e.it('Is.repo', (e) => {
    NON_OBJECTS.forEach((v) => expect(Is.repo(v)).to.eql(false));
    expect(Is.repo(repo1)).to.eql(true);
    expect(Is.repo(repo2)).to.eql(true);
    expect(Is.repo(repo3)).to.eql(true);
    expect(Is.repo(Store.repo)).to.eql(true);
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
    const doc = Store.repo.create();
    expect(Is.automergeUrl(doc.url)).to.eql(true);
    NON_OBJECTS.forEach((v) => expect(Is.automergeUrl(v)).to.eql(false));
  });
});
