# sys.fs.spec
Filesystem specifications.

### About
Executable specifications to run against `sys.fs` (filesystem) implementations 
to certify that they comply with the intended behavior of the 
filesystem `<Type>` abstraction.

<p>&nbsp;</p>

---

<p>&nbsp;</p>

### Usage
See [`Spec.TEST.mts`](/src/Spec.TEST.mts) for usage example of running within a test-runner.


```ts

  describe('Run (against MemoryMock)', () => {
    const factory: t.FsDriverFactory = async (dir?: string) => MemoryMock.create(dir).driver;
    Spec.every({ describe, it, factory });
  });

```

