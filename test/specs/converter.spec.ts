import { expect } from 'chai';
import { convert, converterInt16, converterInt32 } from '../../src/utils/converters';

describe('converter utils', () => {
  it('should convert correctly', function () {
    expect(convert(255, converterInt32)).to.deep.equal(new Uint8Array([0, 0, 0, 255]));
    expect(convert(256, converterInt32)).to.deep.equal(new Uint8Array([0, 0, 1, 0]));
    expect(convert(255, converterInt16)).to.deep.equal(new Uint8Array([0, 255]));
    expect(convert(256, converterInt16)).to.deep.equal(new Uint8Array([1, 0]));
  });
});
