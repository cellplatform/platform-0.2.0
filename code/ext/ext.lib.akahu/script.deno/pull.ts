/**
 * https://my.akahu.nz/developers
 * https://github.com/akahu-io/akahu-sdk-js
 */
import { client, userToken } from './u.client.ts';
import { DateTime, c, fs, type t } from './u.ts';

/**
 * Helpers.
 */
export const wrangle = {
  query(start: string, end: string): t.TransactionQueryParams {
    const suffix = 'T00:00:00.000Z';
    return { start: `${start}${suffix}`, end: `${end}${suffix}` };
  },
  formatDate(input: string = '', format = 'yyyy-MM-dd') {
    return DateTime.format(new Date(input), format);
  },
  monthName(input: string, length: 'long' | 'short' = 'long') {
    const date = new Date(input);
    return new Intl.DateTimeFormat('en-US', { month: length }).format(date);
  },
  sortByDate(items: t.Transaction[]): t.Transaction[] {
    const time = (input: string) => new Date(input).getTime();
    return [...items].sort((a, b) => time(a.date) - time(b.date));
  },
} as const;

/**
 * Pull stransactions.
 */
async function fetchTransactions(start: string, end: string, accountId: string) {
  const account = await client.accounts.get(userToken, accountId);
  const query = wrangle.query(start, end);
  const transactions: t.Transaction[] = [];
  do {
    const page = await client.accounts.listTransactions(userToken, accountId, query);
    transactions.push(...page.items);
    query.cursor = page.cursor.next;
  } while (query.cursor !== null);

  let _csv = '';
  return {
    account,
    transactions,
    query: wrangle.query(start, end),
    get csv() {
      const query = wrangle.query(start, end);
      return _csv || (_csv = toCSV({ account, query, transactions }));
    },
  } as const;
}

/**
 * Convert a set of tranasactions into a CSV.
 */
function toCSV(args: {
  account: t.Account;
  query: t.TransactionQueryParams;
  transactions: t.Transaction[];
}) {
  const { query, account } = args;
  let text = '';
  const append = (line: string = '') => (text += `${line}\n`);

  append(`Holder: ${account.meta?.holder || 'Unknown'}`);
  append(`Card Number: ${account.formatted_account} (${account.name})`);
  append(`From: ${wrangle.formatDate(query.start)}`);
  append(`To: ${wrangle.formatDate(query.end)}`);
  append(`Akahu,Date,Type,Amount,Description,Transaction Id`);
  append();
  wrangle.sortByDate(args.transactions).forEach((tx) => {
    const date = wrangle.formatDate(tx.date);
    const description = tx.description.replace(/"/g, "'");
    append(`,${date},${tx.type},${tx.amount},"${description}",${tx._id}`);
  });

  return text;
}

/**
 * Execute
 */
console.log();
const accounts = await client.accounts.list(userToken);
accounts.forEach((account) => {
  console.log(c.green(account.name));
});

/**
 * Use Case:
 *    When you get a moment, can you please send me a csv of your credit card
 *    transactions from [October 1 2023 - March 31 2024].
 *    Just doing the GST - @yeoro
 */
const accountId = accounts.find((acc) => acc.name === 'Visa Business')?._id || '';
const start = '2023-10-01';
const end = '2024-03-31';
const res = await fetchTransactions(start, end, accountId);

const dir = fs.resolve(fs.join(import.meta.dirname || '', '..'), '.tmp');
const path = fs.join(dir, `visa-${start}..${end}.csv`);
await fs.ensureDir(dir);
await Deno.writeTextFile(path, res.csv);

console.log();
console.log('• from:', c.yellow(start), wrangle.monthName(start));
console.log('• to:  ', c.yellow(end), wrangle.monthName(start));
console.log('• file:\n ', c.gray(path));
console.log();
