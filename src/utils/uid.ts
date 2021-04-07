import { MD5 } from 'crypto-js';
import { hexToDecimal, toHexString } from './converters';

const UID_ROOT = '2.25';

const unpackMd5Words = (bytes32: number[]): number[] => {
  const view = new DataView(new ArrayBuffer(16));
  for (let i = 0; i < 4; i++) {
    view.setInt32(i * 4, bytes32[i], false);
  }
  const bytes = [];
  for (let i = 0; i < 16; i++) {
    bytes.push(view.getUint8(i) - 256);
  }
  return bytes;
};

export const toUid = (value: string) => {
  const b17 = new Int8Array(17);
  const words8bit = unpackMd5Words(MD5(value).words);
  const mostSignificant = words8bit.slice(0, 8);
  const leastSignificant = words8bit.slice(8, 16);

  for (let i = 0; i < 8; i++) {
    b17[1 + i] = mostSignificant[i];
  }

  for (let i = 0; i < 8; i++) {
    b17[9 + i] = leastSignificant[i];
  }

  // Magic numbers for UUIDv3. See UUID#nameUUIDFromBytes implementation in Java
  b17[7] &= 0x0f;
  b17[7] |= 0x30;
  b17[9] &= 0x3f;
  b17[9] |= 0x80;

  const hexString = toHexString(b17);
  const decimalPart = hexToDecimal(hexString);

  let uid = `${UID_ROOT}.${decimalPart}`;
  if (uid.length % 2 === 1) {
    uid = uid + 0x00;
  }

  return uid;
};
