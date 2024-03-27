import { Repo } from '@automerge/automerge-repo';
import { BroadcastChannelNetworkAdapter } from '@automerge/automerge-repo-network-broadcastchannel';
import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb';

import { Is } from '.';
import { WebStore } from '../logic/Store.Web';
import { Test, TestDb, expect } from '../test.ui';
import { RepoList } from '../ui/ui.RepoList';

export default Test.describe('Is (flags)', (e) => {
  const NON_OBJECTS = [true, 123, '', [], {}, null, undefined];
  const storage = TestDb.Unit.name;
  const store = WebStore.init({ network: false, storage });

  const repo1 = new Repo({ network: [] });
  const repo2 = new Repo({ network: [new BroadcastChannelNetworkAdapter()] });
  const repo3 = new Repo({
    network: [new BroadcastChannelNetworkAdapter()],
    storage: new IndexedDBStorageAdapter(TestDb.Unit.name),
  });

  e.it('NOTE: other "Is" flag tests run in server-side unit-test file', (e) => {});

  e.it('Is.repo', (e) => {
    NON_OBJECTS.forEach((v) => expect(Is.repo(v)).to.eql(false));
    expect(Is.repo(repo1)).to.eql(true);
    expect(Is.repo(repo2)).to.eql(true);
    expect(Is.repo(repo3)).to.eql(true);
  });

  e.it('Is.repoListState', async (e) => {
    const model = await RepoList.model(store);
    NON_OBJECTS.forEach((v) => expect(Is.repoListState(v)).to.eql(false));
    expect(Is.repoListState(model.list.state)).to.eql(true);
    model.dispose();
  });

  e.it('Is.repoListModel', async (e) => {
    const model = await RepoList.model(store);
    NON_OBJECTS.forEach((v) => expect(Is.repoListState(v)).to.eql(false));
    expect(Is.repoListModel(model.list.state)).to.eql(false);
    expect(Is.repoListModel(model.list)).to.eql(false);
    expect(Is.repoListModel(model)).to.eql(true);
    model.dispose();
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
});
