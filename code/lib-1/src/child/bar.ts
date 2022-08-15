const Bar = { msg: 'bar' };

export { Bar };
export default Bar;

const Two = import('./two');
console.log('Two', Two);
