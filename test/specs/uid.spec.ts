import { expect } from 'chai';

import { toUid } from '../../src';

describe('uid', () => {
  it('should generate uid correctly', () => {
    // StudyInstanceUID
    expect(toUid('1.2.840.113619.6.95.31.0.3.4.1.3002.13.2117190')).to.equal('2.25.249548334295158846970995512124162104924');

    // SOPInstanceUID
    expect(toUid('1.3.12.2.1107.5.2.18.41005.2013031418505115721404487')).to.equal('2.25.205393696279877048532335227590000582574');
  });
});
