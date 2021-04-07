import { DataSet as DicomDataset, Element as DicomElement } from 'dicom-parser';
import { convert, converterInt16, converterInt32 } from './converters';
import DeidentificationContext from '../types/DeidentificationContext';

export const toBytes = (text: string, littleEndian: boolean = false): number[] => {
  let chars = text.split('');
  if (littleEndian) {
    chars = chars.reverse();
  }
  return chars.map(char => char.charCodeAt(0));
};

export const ensurePadding = (bytes: number[], paddingChar: number = 0x20, prepend: boolean = false) => {
  if (bytes.length % 2 === 0) return bytes;
  else return prepend ? [paddingChar, ...bytes] : [...bytes, paddingChar];
};

type UpdateElementOptions = {
  value: number[];
  element: DicomElement;
  context: DeidentificationContext;
};

export const updateElement = ({ value, element, context }: UpdateElementOptions) => {
  if (value.length !== element.length) {
    updateByteArray(value, element, context);
    updateElementOffsets(context.dataset, element.dataOffset, value.length - element.length);
    element.length = value.length;
  } else {
    for (let i = 0; i < value.length; i++) {
      context.dataset.byteArray[element.dataOffset + i] = value[i];
    }
  }
};

export const updateElementOffsets = (dataset: DicomDataset, dataOffset: number, shift: number) => {
  Object.values(dataset.elements).forEach(element => {
    if (element.dataOffset > dataOffset) {
      element.dataOffset += shift;
    }
  });
};

export const updateByteArray = (value: number[], element: DicomElement, context: DeidentificationContext) => {
  const leftPart = context.dataset.byteArray.slice(0, element.dataOffset);
  const rightPart = context.dataset.byteArray.slice(element.dataOffset + element.length, context.dataset.byteArray.length);
  const newContentArray = Array.from({ length: value.length }, (_, i) => value[i]);

  const lengthField = getByteLength(element.vr);
  const converter = lengthField === 16 ? converterInt16 : converterInt32;
  leftPart.set(convert(value.length, converter, context.isLittleEndian), leftPart.length - lengthField / 8);

  const updatedByteArray = new Uint8Array(leftPart.length + value.length + rightPart.length);
  updatedByteArray.set(leftPart, 0);
  updatedByteArray.set(newContentArray, leftPart.length);
  updatedByteArray.set(rightPart, leftPart.length + newContentArray.length);
  context.dataset.byteArray = updatedByteArray;
};

// Get length based on 7.1.2 Data Element Structure with Explicit VR
const getByteLength = (vr: string): 16 | 32 => {
  const vr16bit = [
    'AE',
    'AS',
    'AT',
    'CS',
    'DA',
    'DS',
    'DT',
    'FL',
    'FD',
    'IS',
    'LO',
    'LT',
    'PN',
    'SH',
    'SL',
    'SS',
    'ST',
    'TM',
    'UI',
    'UL',
    'US',
  ];
  return vr16bit.includes(vr) ? 16 : 32;
};

export const deleteElement = (dataset: DicomDataset, tag: string) => {
  const is32bit = getByteLength(dataset.elements[tag].vr) === 32;
  const { dataOffset, length } = dataset.elements[tag];

  const leftPart = dataset.byteArray.slice(0, dataOffset);
  leftPart.set(is32bit ? [0, 0, 0, 0] : [0, 0], leftPart.length - (is32bit ? 4 : 2));

  const rightPart = dataset.byteArray.slice(dataOffset + length, dataset.byteArray.length);
  const updatedByteArray = new Uint8Array(leftPart.length + rightPart.length);
  updatedByteArray.set(leftPart, 0);
  updatedByteArray.set(rightPart, leftPart.length);
  dataset.byteArray = updatedByteArray;

  delete dataset.elements[tag];

  Object.values(dataset.elements).forEach(element => {
    if (element.dataOffset > dataOffset) {
      element.dataOffset = element.dataOffset - length;
    }
  });
};
