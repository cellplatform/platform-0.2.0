export function printHelp(): void {
  console.log(`Usage: greetme [OPTIONS...]`);
  console.log('\nOptional flags:');
  console.log('  -h, --help                Display this help and exit');
  console.log('  -s, --save                Save settings for future greetings');
  console.log('  -n, --name                Set your name for the greeting');
  console.log('  -c, --color               Set the color of the greeting');
}
