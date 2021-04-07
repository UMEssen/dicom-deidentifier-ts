import ConfidentialityProfileAttribute from './ConfidentialityProfileAttribute';

type DeidentificationParameters = {
  profile: ConfidentialityProfileAttribute;
  group?: string;
  element?: string;
};

export default DeidentificationParameters;
