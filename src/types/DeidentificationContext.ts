import { DataSet as DicomDataset } from 'dicom-parser';
import DeidentifyOptions from './DeidentifyOptions';

type DeidentificationContext = {
  dataset: DicomDataset;
  isLittleEndian: boolean;
  isImplicit: boolean;
} & DeidentifyOptions;

export default DeidentificationContext;
