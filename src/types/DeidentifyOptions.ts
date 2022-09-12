import type DicomDictionary from './DicomDictionary';
import type ExecutionOptions from './ExecutionOptions';
import type ProfileOption from './ProfileOption';
import DataElement from '../DataElement';

type DummyOptions = {
  lookup: Record<string, any>;
  default: string;
};

type SpecialHandler = (dataElement: DataElement, executionOptions: ExecutionOptions) => boolean;

type DeidentifyOptions = {
  profileOptions: ProfileOption[];
  getReferenceDate?: (dictionary: DicomDictionary) => Date;
  getReferenceTime?: (dictionary: DicomDictionary) => Date;
  timeShiftFunction?: (refDate: Date, date: Date) => Date;
  dateShiftFunction?: (refDate: Date, date: Date) => Date;
  dummies?: DummyOptions;
  keep?: string[];
  specialHandlers?: SpecialHandler[];
};

export default DeidentifyOptions;
