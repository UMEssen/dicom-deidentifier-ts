import { expect } from 'chai';
import { parseDate, formatDate } from '../../src';

describe('date formatting', () => {
  it('should format DT correctly', () => {
    const date1 = '1999-12-11T16:23:57.123+01:00';
    const formattedDate1 = formatDate(date1, 'DT');
    expect(formattedDate1).to.equal('19991211162357.123000+0100');

    const date2 = '1999-12-11T00:00:00.000+05:00';
    const formattedDate2 = formatDate(date2, 'DT');
    expect(formattedDate2).to.equal('19991211000000.000000+0500');

    const date3 = '1999-12-11T00:00:00.000-05:00';
    const formattedDate3 = formatDate(date3, 'DT');
    expect(formattedDate3).to.equal('19991211000000.000000-0500');

    const date4 = '1999-12-11T23:59:59.999999+05:00';
    const formattedDate4 = formatDate(date4, 'DT');
    expect(formattedDate4).to.equal('19991211235959.999000+0500');
  });

  it('should format DA correctly', () => {
    const testDate = '1999-12-11T16:23:57.123+01:00';
    const formattedDate = formatDate(testDate, 'DA');
    expect(formattedDate).to.equal('19991211');
  });

  it('should format TM correctly', () => {
    const testDate = '1999-12-11T16:23:57.123+01:00';
    const formattedDate = formatDate(testDate, 'TM');
    expect(formattedDate).to.equal('162357.123000');
  });
});

describe('date parsing', () => {
  it('should parse TM correctly', () => {
    // Section 6.2-1 example 1 for TM VR
    const tm1 = parseDate('070907.0705', 'TM');
    expect(tm1.toISOString().split('T')[1]).to.equal('07:09:07.070Z');

    // partial TM, Section 6.2-1 example 2 for TM VR
    const tm2 = parseDate('1010', 'TM');
    expect(tm2.toISOString().split('T')[1]).to.equal('10:10:00.000Z');

    // upper bound
    const tm3 = parseDate('235959.999999', 'TM');
    expect(tm3.toISOString().split('T')[1]).to.equal('23:59:59.999Z');

    // lower bound
    const tm4 = parseDate('000000', 'TM');
    expect(tm4.toISOString().split('T')[1]).to.equal('00:00:00.000Z');
  });

  it('should parse DA correctly', () => {
    const da1 = parseDate('19991112', 'DA');
    expect(da1.toISOString().split('T')[0]).to.equal('1999-11-12');
  });

  it('should parse DT correctly', () => {
    // NOTE: Testing for UTC dates as Javascript's toISOString omits the time zone and converts to UTC automagically
    const dt1 = parseDate('19991112164213.945000+0100', 'DT');
    expect(dt1.toISOString()).to.equal('1999-11-12T15:42:13.945Z'); // 1999-11-12T16:42:13.945+01:00

    const dt2 = parseDate('19991112164213.945000-0500', 'DT');
    expect(dt2.toISOString()).to.equal('1999-11-12T21:42:13.945Z'); // 1999-11-12T16:42:13.945-05:00

    const dt3 = parseDate('19991112000000.000000-0500', 'DT');
    expect(dt3.toISOString()).to.equal('1999-11-12T05:00:00.000Z'); // 1999-11-12T00:00:00.000-05:00

    const dt4 = parseDate('19991112000000.000000+0500', 'DT');
    expect(dt4.toISOString()).to.equal('1999-11-11T19:00:00.000Z'); // 1999-11-12T00:00:00.000+05:00

    const dt5 = parseDate('19991112235959.999999+0500', 'DT');
    expect(dt5.toISOString()).to.equal('1999-11-12T18:59:59.999Z'); // 1999-11-12T23:59:59.999+05:00

    const dt6 = parseDate('19991112235959.999999-0500', 'DT');
    expect(dt6.toISOString()).to.equal('1999-11-13T04:59:59.999Z'); // 1999-11-12T23:59:59.999-05:00
  });
});
