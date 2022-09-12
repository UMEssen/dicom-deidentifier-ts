import { OddGroupDeidentifier, RangeDeidentifier, TagDeidentifier } from '../src/deidentifiers';
import { deconstructDicomTag } from '../src/utils/tag';

describe('deidentifiers', () => {
  describe('tagDeidentifier', () => {
    test.each(['(0800,0010)', '(5200,FF10)'])('tagDeidentifier is matching tag %s', (testTag) => {
      const [group, element] = deconstructDicomTag(testTag);
      const tag = parseInt(group + element, 16);
      const matcher = new TagDeidentifier(undefined as any, group, element);
      expect(matcher.matches(tag)).toBe(true);
    });
    test.each(['(1900,0010)', '(5200,FF10)'])('tagDeidentifier is not matching tag %s for (0800,0010)', (testTag) => {
      const [group, element] = deconstructDicomTag(testTag);
      const tag = parseInt(group + element, 16);
      const matcher = new TagDeidentifier(undefined as any, '0800', '0010');
      expect(matcher.matches(tag)).toBe(false);
    });
  });

  describe('rangeDeidentifier', () => {
    test.each(['(5000,0000)', '(50FF,FFFF)', '(5001,1234)'])('rangeDeidentifier is matching tag %s', (testTag) => {
      const [group, element] = deconstructDicomTag(testTag);
      const tag = parseInt(group + element, 16);
      const matcher = new RangeDeidentifier(undefined as any, '50xx', 'xxxx');
      expect(matcher.matches(tag)).toBe(true);
    });

    test.each(['(5100,0000)', '(4900,0000)', '(0000,0000)', '(FFFF,FFFF)'])('rangeDeidentifier is not matching tag %s', (testTag) => {
      const [group, element] = deconstructDicomTag(testTag);
      const tag = parseInt(group + element, 16);
      const matcher = new RangeDeidentifier(undefined as any, '50xx', 'xxxx');
      expect(matcher.matches(tag)).toBe(false);
    });
  });

  describe('oddGroupDeidentifier', () => {
    test.each(['(0009,0000)', '(0009,FFFF))', '(FFFF,FFFF)', '(FFFD,FFFF)'])('oddGroupDeidentifier is matching tag %s', (testTag) => {
      const [group, element] = deconstructDicomTag(testTag);
      const tag = parseInt(group + element, 16);
      const matcher = new OddGroupDeidentifier({} as any);
      expect(matcher.matches(tag)).toBe(true);
    });

    test.each(['(0008,0000)', '(0008,FFFF)', '(FFFE,FFFF)', '(FFFC,FFFF)'])('oddGroupDeidentifier is not matching tag %s', (testTag) => {
      const [group, element] = deconstructDicomTag(testTag);
      const tag = parseInt(group + element, 16);
      const matcher = new OddGroupDeidentifier({} as any);
      expect(matcher.matches(tag)).toBe(false);
    });
  });
});
