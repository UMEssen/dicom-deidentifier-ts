import VR from './VR';
import DicomElementValue from './DicomElementValue';

type DicomElement = {
  vr: VR,
  Value: DicomElementValue
}


export default DicomElement;