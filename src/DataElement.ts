import type DicomElement from './types/DicomElement';
import type DicomDictionary from './types/DicomDictionary';
import type DicomElementValue from './types/DicomElementValue';
import type VR from './types/VR';

export class DataElement {
  private readonly element: DicomElement;
  private readonly dictionary: DicomDictionary;
  private readonly tag: string;

  constructor(dictionary: DicomDictionary, tag: string, element: DicomElement) {
    this.dictionary = dictionary;
    this.tag = tag;
    this.element = element;
  }

  delete(): void {
    delete this.getDictionary()[this.tag];
  }

  setValue(value: DicomElementValue): void {
    this.getDictionary()[this.getTag().toString()].Value = value;
  }

  getValue(): DicomElementValue {
    return this.element.Value;
  }

  getDictionary(): DicomDictionary {
    return this.dictionary;
  }

  // ggggeeee format
  getTag(): string {
    return this.tag;
  }

  getVR(): VR {
    return this.element.vr;
  }
}

export default DataElement;
