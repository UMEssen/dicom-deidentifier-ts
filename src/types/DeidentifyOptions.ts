import CleaningFunction from './CleaningFunction';
import TemporalShiftFunction from './TemporalShiftFunction';
import { ProfileOption } from './index';

type KeepOption = string;

type DummyOptions = {
  lookup: Record<string, any>;
  default: string;
};

type DeidentifyOptions = {
  profileOptions: ProfileOption[];
  keep?: KeepOption[];
  dummies?: DummyOptions;
  dateShiftFunction?: TemporalShiftFunction;
  timeShiftFunction?: TemporalShiftFunction;
  referenceDate: Date;
  referenceTime: Date;
  specialHandlers?: CleaningFunction[];
};

export default DeidentifyOptions;
