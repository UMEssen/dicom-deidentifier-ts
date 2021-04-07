import DeidentificationParameters from './DeidentificationParameters';
import DeidentificationMatcher from '../types/DeidentificationMatcher';

type Deidentifier = (parameters: DeidentificationParameters) => DeidentificationMatcher;

export default Deidentifier;
