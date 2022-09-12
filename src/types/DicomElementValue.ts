import DicomElement from './DicomElement';

type DicomElementValue = (string | number | ArrayBuffer | Record<string, DicomElement>)[];

export default DicomElementValue;
