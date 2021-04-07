import DeidentificationContext from './DeidentificationContext';
import { Element as DicomElement } from 'dicom-parser';

type CleaningFunction = (element: DicomElement, context: DeidentificationContext) => boolean;

export default CleaningFunction;
