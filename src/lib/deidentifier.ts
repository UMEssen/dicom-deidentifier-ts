import * as ProfileAttributesJson from '../resources/deidentify.json';
import ConfidentialityProfileAttribute from '../types/ConfidentialityProfileAttribute';
import { deconstructDicomTag, getIntTag, getIntTagRange } from '../utils/tag';
import Deidentifier from '../types/Deidentifier';
import DeidentificationMatcher from '../types/DeidentificationMatcher';

export const tagDeidentifier: Deidentifier = parameters => ({
  profile: parameters.profile,
  matches: intTag => {
    const i = getIntTag(parameters.group, parameters.element);
    return intTag === i;
  },
});

export const rangeDeidentifier: Deidentifier = parameters => ({
  profile: parameters.profile,
  matches: intTag => {
    const [start, end] = getIntTagRange(parameters.group, parameters.element);
    return intTag >= start && intTag <= end;
  },
});

export const oddGroupDeidentifier: Deidentifier = parameters => ({
  profile: parameters.profile,
  matches: intTag => (intTag >> 16) % 2 == 1,
});

const json = ProfileAttributesJson as unknown as ConfidentialityProfileAttribute[];

export const deidentifiers: DeidentificationMatcher[] = json.map(profile => {
  const [group, element] = deconstructDicomTag(profile.Tag);

  if (profile.Tag.includes('odd')) {
    return oddGroupDeidentifier({ profile, group, element });
  } else if (profile.Tag.includes('x')) {
    return rangeDeidentifier({ profile, group, element });
  } else {
    return tagDeidentifier({ profile, group, element });
  }
});
