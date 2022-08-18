import { expect } from 'chai';
import { time } from '.';

describe('time.utc', () => {
  it('now', () => {
    const utc = time.utc();
    expect(utc.date).to.eql(new Date(utc.timestamp));
    expect(utc.timestamp).to.eql(new Date(utc.date).getTime());
    expect(utc.unix).to.eql(time.day(utc.date).unix());
  });

  it('from timestamp', () => {
    const now = new Date();
    const utc = time.utc();
    expect(utc.date).to.eql(now);
    expect(utc.timestamp).to.eql(now.getTime());
    expect(utc.unix).to.eql(time.day(now).unix());
  });

  it('from date', () => {
    const now = new Date();
    const utc = time.utc(now);
    expect(utc.date).to.eql(now);
    expect(utc.timestamp).to.eql(now.getTime());
    expect(utc.unix).to.eql(time.day(now).unix());
  });
});

describe('time.now', () => {
  it('now', () => {
    const d = new Date();
    const dt = d.getTime();
    const utc = time.now;
    expect(utc.date.getTime()).to.be.within(dt - 10, dt + 10);
    expect(utc.timestamp).to.be.within(dt - 10, dt + 10);
    expect(utc.unix).to.eql(time.day(d).unix());
  });

  it('now.format()', () => {
    const d = time.day();
    const template = 'YYYY-MM-DD';
    const res = time.now.format(template);
    expect(res).to.eql(d.format(template));
  });
});
