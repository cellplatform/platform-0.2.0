# ext.lib.automerge
Primary system wrapper around the `automerge` and `automerge-repo` CRDT library/stack.


## Cmd (Command)
Distributed function execution via CRDT sync (aka. "Command" invokation).  
Provides a way to invoke functions remotely via a principled API.  
Beyond it's direct use, `Cmd` provides the foundations for a basic "[actor system](https://youtu.be/vMDHpPN_p08?si=6LQLGrnSopX6zmkm)" implementation.

Command instantiation:
```ts
const cmd = Cmd.create<C>(crdt);
const events = cmd.events(dispose$);
```

Sample command type definitions:

```ts
type P = { a: number; b: number };
type R = { sum: number };
type E = { message: string; code: number; type: 'out-of-bounds' };

type C = C1 | C2 | C3;
type C1 = t.CmdType<'add', P, C2, E>;
type C2 = t.CmdType<'add:res', R>;
type C3 = t.CmdType<'foo', { msg?: string }>;
   
```

Invoke, no response:
```ts
cmd.invoke('foo', { msg: "👋" });
cmd.invoke('add', { a: 1, b: 2 }); // NB: doesn't make sense, as the response would be useful.
```

Invoke response async/await:
```ts
const res = await cmd.invoke(['add', 'add:res'], { a: 1, b: 2 }).promise()
```

Invoke response with callback:
```ts
cmd.invoke(['add', 'add:res'], { a: 1, b: 2 }, (e) => {
  e.error; /* handle error */
  e.result /* do something with result */
});
```

Sample chained invocation call:
```ts
await cmd
  .invoke(['add', 'add:res'], { a: 1, b: 2 })
  .onError((e) => /* log error */)
  .onComplete((e) => /* success */)
  .promise();
```

Sample command implementation (service):
```ts
const sum = ({ a, b }: P): R => ({ sum: a + b });
const cmd = Cmd.create<C>(crdt);
const events = cmd.events(dispose$);

events
  .on('add')
  .subscribe((e) => cmd.invoke('add:res', sum(e.params), e.tx));
```



## References
- [podcast/PVH: Intro to Localfirst](https://www.localfirst.fm/1)
- [podcast/Martin Kleppmann: CRDTs](https://www.localfirst.fm/4)


## Development Opportunities
https://automerge.slack.com/archives/D05MVKQF0TX/p1696212200522649
@pvh:
>> There are some pretty obvious holes right now: 
>>
>>  - connection authentication, and
>>  - deciding what documents to share with whom
>>
>> ..probably the biggest
