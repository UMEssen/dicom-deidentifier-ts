import ConfidentialityProfileAttribute from './ConfidentialityProfileAttribute';

type DeidentificationMatcher = {
  profile: ConfidentialityProfileAttribute;
  matches: (intTag: number) => boolean;
};

export default DeidentificationMatcher;
