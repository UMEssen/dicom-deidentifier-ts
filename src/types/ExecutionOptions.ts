import DeidentifyOptions from './DeidentifyOptions';

type ExecutionOptions = {
  referenceDate: Date;
  referenceTime: Date;
} & Omit<DeidentifyOptions, 'getReferenceTime' | 'getReferenceDate'>;

export default ExecutionOptions;
