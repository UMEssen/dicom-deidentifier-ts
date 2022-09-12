import type DicomDictionary from '../types/DicomDictionary';

// Minimal type declarations for dcmjs
declare namespace data {
  export class DicomMessage {
    static readFile(file: ArrayBufferLike): DicomDataset;
  }

  export class DicomDataset {
    dict: DicomDictionary;

    write(): ArrayBufferLike;
  }
}
