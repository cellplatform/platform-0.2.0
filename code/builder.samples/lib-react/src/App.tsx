import { useState } from 'react';
import './App.css';

import { Foo } from 'lib-1';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div>Foo: {Foo.msg}</div>
    </div>
  );
}

export default App;
