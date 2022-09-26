export {};

console.log('-------------------------------------------');

import React from 'react';
import { createRoot } from 'react-dom/client';

console.log('-------------------------------------------');
console.log('React', React);

const style: React.CSSProperties = { fontSize: 80, fontFamily: 'sans-serif', margin: 20 };
const el = <div style={style}>Hello</div>;

const root = createRoot(document.body);
root.render(el);
