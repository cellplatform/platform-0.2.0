import { useState } from 'react';
// import './App.css';

import { css } from 'sys.ui.css';

import { Foo } from 'lib-1';

function App() {
  const [count, setCount] = useState(0);

  const styles = {
    base: css({
      Absolute: 0,
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      // Flex: 'center-center',
      display: 'flex',
    }),
    title: css({ backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */ }),
  };

  return (
    <div {...styles.base}>
      <div {...styles.title}>hello</div>
    </div>
  );
}

export default App;
