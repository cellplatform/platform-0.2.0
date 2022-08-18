import { expect } from 'chai';
import { time } from '.';

const FORMAT = 'YYYY-MM-DD hh:mm:ss';
const format = (date: Date) => time.day(date).format(FORMAT);

describe('timer', () => {
  it('starts with current date', () => {
    const now = time.day().format(FORMAT);
    const timer = time.timer();
    expect(format(timer.startedAt)).to.eql(now);
  });

  it('starts with given date', () => {
    const start = time.day().add(1, 'd').toDate();
    const timer = time.timer(start);
    expect(format(timer.startedAt)).to.eql(format(start));
    expect(format(timer.startedAt)).to.not.eql(format(new Date()));
  });

  it('waits', async () => {
    const timer = time.timer();
    expect(timer.elapsed.msec).to.lessThan(5); // NB: 'msecs' default unit for `elapsed`.
    await time.wait(10);
    expect(timer.elapsed.msec).to.greaterThan(6);
    expect(timer.elapsed.msec).to.greaterThan(6);
  });

  it('reports elapsed seconds', () => {
    const start = time.day().subtract(1, 'm').subtract(30, 's').subtract(259, 'ms').toDate();

    expect(time.timer(start).elapsed.sec).to.eql(90.3);
    expect(time.timer(start, { round: 0 }).elapsed.sec).to.eql(90);

    const timer = time.timer(start);
    expect(timer.elapsed.toString('s')).to.eql('90s');
    expect(timer.elapsed.toString('sec')).to.eql('90s');
  });

  it('reports elapsed minutes', () => {
    const start = time.day().subtract(5, 'm').subtract(24, 's').subtract(123, 'ms').toDate();
    expect(time.timer(start, { round: 0 }).elapsed.min).to.eql(5);
    expect(time.timer(start, { round: 3 }).elapsed.min).to.eql(5.402);
    expect(time.timer(start).elapsed.min).to.eql(5.4);

    const timer = time.timer(start);
    expect(timer.elapsed.toString('m')).to.eql('5m');
    expect(timer.elapsed.toString('min')).to.eql('5m');
  });

  it('reports elapsed hours', () => {
    const start = time
      .day()
      .subtract(2, 'h')
      .subtract(37, 'm')
      .subtract(48, 's')
      .subtract(123, 'ms')
      .toDate();
    expect(time.timer(start).elapsed.hour).to.eql(2.6);
    expect(time.timer(start, { round: 0 }).elapsed.hour).to.eql(3);
    expect(time.timer(start, { round: 1 }).elapsed.hour).to.eql(2.6);
    expect(time.timer(start, { round: 2 }).elapsed.hour).to.eql(2.63);

    const timer = time.timer(start);
    expect(timer.elapsed.toString('h')).to.eql('3h');
    expect(timer.elapsed.toString('hour')).to.eql('3h');
  });

  it('reports elapsed days', () => {
    const start = time
      .day()
      .subtract(4, 'd')
      .subtract(18, 'h')
      .subtract(5, 'm')
      .subtract(123, 'ms')
      .toDate();
    expect(time.timer(start).elapsed.day).to.eql(4.8);
    expect(time.timer(start, { round: 0 }).elapsed.day).to.eql(5);
    expect(time.timer(start, { round: 1 }).elapsed.day).to.eql(4.8);
    expect(time.timer(start, { round: 2 }).elapsed.day).to.eql(4.75);

    const timer = time.timer(start);
    expect(timer.elapsed.toString('d')).to.eql('5d');
    expect(timer.elapsed.toString('day')).to.eql('5d');
  });

  it('toString()', () => {
    let start = time.day();
    const elapsed = () => time.timer(start.toDate()).elapsed;

    start = start.subtract(125, 'ms');
    expect(elapsed().toString().endsWith('ms')).to.eql(true);

    start = start.subtract(10, 's');
    expect(elapsed().toString()).to.eql('10s');

    start = start.subtract(25, 's');
    expect(elapsed().toString()).to.eql('35s');

    start = start.subtract(24, 's');
    expect(elapsed().toString()).to.eql('59s');

    start = start.subtract(1, 's');
    expect(elapsed().toString()).to.eql('1m');

    start = start.subtract(15, 'm');
    expect(elapsed().toString()).to.eql('16m');

    start = start.subtract(43, 'm');
    expect(elapsed().toString()).to.eql('59m');

    start = start.subtract(1, 'm');
    expect(elapsed().toString()).to.eql('1h');

    start = start.subtract(29, 'm');
    expect(elapsed().toString()).to.eql('1h');

    start = start.subtract(1, 'm');
    expect(elapsed().toString()).to.eql('2h');

    start = start.subtract(1, 'h');
    expect(elapsed().toString()).to.eql('3h');

    start = start.subtract(24, 'h');
    expect(elapsed().toString()).to.eql('1d');

    start = start.subtract(24, 'h');
    expect(elapsed().toString()).to.eql('2d');

    start = start.subtract(48, 'h');
    expect(elapsed().toString()).to.eql('4d');
  });
});
