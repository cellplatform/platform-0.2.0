// import greetings from './greetings.json' with { type: 'json' } ;
import { parseArguments, printHelp } from './u.ts';

const greetings = {
  list: ['good evening', 'good night', 'good morning', 'hello'],
};

async function main(inputArgs: string[]) {
  const args = parseArguments(inputArgs);

  // If help flag enabled, print help.
  if (args.help) {
    printHelp();
    Deno.exit(0);
  }

  let name: string | null = args.name || '';
  let color: string | null = args.color;
  let save: boolean = args.save;

  const kv = await Deno.openKv('/tmp/kv.db');
  let askToSave = false;

  if (!name) {
    name = (await kv.get(['name'])).value as string;
    if (!name) {
      name = prompt('What is your name?');
      askToSave = true;
    }
  }
  if (!color) {
    color = (await kv.get(['color'])).value as string;
    if (!color) {
      color = prompt('What is your favorite color?');
      askToSave = true;
    }
  }
  if (!save && askToSave) {
    const savePrompt: string | null = prompt('Do you want to save these settings? Y/n');
    if (savePrompt?.toUpperCase() === 'Y') save = true;
  }

  if (save) {
    await kv.set(['name'], name);
    await kv.set(['color'], color);
  }

  const index = Math.floor(Math.random() * greetings.list.length);
  const randomGreeting = greetings.list[index];
  console.log(`%c${randomGreeting}, ${name}!`, `color: ${color}; font-weight: bold`);
}
/**
 * Run CLI
 */
await main(Deno.args);
