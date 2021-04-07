import { expect } from 'chai';
import { describe } from 'mocha';
import { dicomToJsFormat } from '../../src/utils/tag';

describe('formatters', () => {
  it('should format dicom tag correctly', function() {
    expect(dicomToJsFormat('(0010,0010)')).to.equal('x00100010');
    expect(dicomToJsFormat('(0010,XXXX)')).to.equal('x0010XXXX');
    expect(dicomToJsFormat('(XXXX,XXXX)')).to.equal('xXXXXXXXX');
    expect(dicomToJsFormat('(gggg,eeee) where gggg is odd')).to.equal('xggggeeee');
    expect(dicomToJsFormat('(iamtoolong,foratag)')).to.equal(null);
    expect(dicomToJsFormat('(too,short)')).to.equal(null);
  });
});
