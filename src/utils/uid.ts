import md5 from 'crypto-js/md5';

const toHexString = (bytes: Int8Array): string => {
  let hexPrefix = '0x';
  const hexString = Array.from(bytes)
    .map((byte) => ('0' + (byte & 0xff).toString(16)).slice(-2))
    .join('');
  return hexPrefix + hexString;
};

const hexToDecimal = (hexString: string): string => {
  let hex = hexString;

  if (hex.length % 2) {
    hex = `0${hex}`;
  }

  const bigInt = BigInt(hex);
  return bigInt.toString(10);
};

const UID_ROOT = '2.25';

const unpackMd5Words = (bytes32: number[]): number[] => {
  const view = new DataView(new ArrayBuffer(16));
  for (let i = 0; i < 4; i++) {
    view.setInt32(i * 4, bytes32[i], false);
  }
  const bytes = [];
  for (let i = 0; i < 16; i++) {
    // @ts-ignore
    bytes.push(view.getUint8(i) - 256);
  }
  return bytes;
};

export const toUid = (value: string) => {
  const b17 = new Int8Array(17);
  const words8bit = unpackMd5Words(md5(value).words);
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
