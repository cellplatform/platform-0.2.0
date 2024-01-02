const startTimeStr = Deno.env.get('START_TIME');

console.log('Current Time:', new Date().toISOString());

if (startTimeStr) {
  const startTime = new Date(startTimeStr);
  const elapsedTime = Date.now() - startTime.getTime();
  console.log('Elapsed Time (ms):', elapsedTime);
} else {
  console.log('Start time not available.');
}
