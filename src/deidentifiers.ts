import ProfileAttributesJson from './deidentify.json';
import { deconstructDicomTag, getIntTagRange } from './utils/tag';
import type ConfidentialityProfileAttribute from './types/ConfidentialityProfileAttribute';

export abstract class Deidentifier {
  public cpa: ConfidentialityProfileAttribute;

  protected constructor(cpa: ConfidentialityProfileAttribute) {
    this.cpa = cpa;
  }

  abstract matches(intTag: number): boolean;
}

export class TagDeidentifier extends Deidentifier {
  private group: string;
  private element: string;

  constructor(cpa: ConfidentialityProfileAttribute, group: string, element: string) {
    super(cpa);
    this.group = group;
    this.element = element;
  }

  matches(intTag: number): boolean {
    const i = parseInt(this.group + this.element, 16);
    return intTag === i;
  }
}

export class RangeDeidentifier extends Deidentifier {
  private group: string;
  private element: string;

  constructor(cpa: ConfidentialityProfileAttribute, group: string, element: string) {
    super(cpa);
    this.group = group;
    this.element = element;
  }

  matches(intTag: number): boolean {
    const [start, end] = getIntTagRange(this.group, this.element);
    return intTag >= start && intTag <= end;
  }
}

export class OddGroupDeidentifier extends Deidentifier {
  constructor(cpa: ConfidentialityProfileAttribute) {
    super(cpa);
  }

  matches(intTag: number): boolean {
    return (intTag >>> 16) % 2 == 1;
  }
}

const profileAttributes = ProfileAttributesJson as ConfidentialityProfileAttribute[];

export const deidentifiers: Deidentifier[] = profileAttributes.map((cpa: ConfidentialityProfileAttribute) => {
  const [group, element] = deconstructDicomTag(cpa.Tag);

  if (cpa.Tag.includes('odd')) {
    return new OddGroupDeidentifier(cpa);
  } else if (cpa.Tag.includes('x')) {
    return new RangeDeidentifier(cpa, group, element);
  } else {
    return new TagDeidentifier(cpa, group, element);
  }
});
