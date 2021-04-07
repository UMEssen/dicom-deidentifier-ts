import NumberConverterFunction from '../types/NumberConverterFunction';

export const toHexString = (bytes: Int8Array): string => {
  let hexPrefix = '0x';
  const hexString = Array.from(bytes)
    .map(byte => ('0' + (byte & 0xff).toString(16)).slice(-2))
    .join('');
  return hexPrefix + hexString;
};

/*
 * TODO: provide alternative implementation for
 *       older browsers that do not support BigInt
 */
export const hexToDecimal = (hexString: string): string => {
  let hex = hexString;

  if (hex.length % 2) {
    hex = `0${hex}`;
  }

  const bigInt = BigInt(hex);
  return bigInt.toString(10);
};

export const convert = (num: number, converter: NumberConverterFunction, isLittleEndian: boolean = false) => {
  return converter(num, isLittleEndian);
};

export const converterInt32: NumberConverterFunction = (num: number, isLittleEndian: boolean = false) => {
  const arrayBuffer = new ArrayBuffer(4);
  const dataView = new DataView(arrayBuffer);
  dataView.setUint32(0, num, isLittleEndian);
  return new Uint8Array(arrayBuffer);
};

export const converterInt16: NumberConverterFunction = (num: number, isLittleEndian: boolean = false) => {
  const arrayBuffer = new ArrayBuffer(2);
  const dataView = new DataView(arrayBuffer);
  dataView.setUint16(0, num, isLittleEndian);
  return new Uint8Array(arrayBuffer);
};

export const converterFloat32: NumberConverterFunction = (num: number, isLittleEndian: boolean = false) => {
  const arrayBuffer = new ArrayBuffer(4);
  const dataView = new DataView(arrayBuffer);
  dataView.setFloat32(0, num, isLittleEndian);
  return new Uint8Array(arrayBuffer);
};

export const converterFloat64: NumberConverterFunction = (num: number, isLittleEndian: boolean = false) => {
  const arrayBuffer = new ArrayBuffer(8);
  const dataView = new DataView(arrayBuffer);
  dataView.setFloat64(0, num, isLittleEndian);
  return new Uint8Array(arrayBuffer);
};

export const converter: Record<string, NumberConverterFunction> = {
  US: converterInt16,
  SS: converterInt16,
  UL: converterInt32,
  SL: converterInt32,
  FL: converterFloat32,
  FD: converterFloat64,
};

export const numberByteSize = {
  AS: 4,
  AT: 4,
  FL: 4,
  FD: 8,
  SL: 4,
  SS: 2,
  UL: 4,
  US: 2,
};
