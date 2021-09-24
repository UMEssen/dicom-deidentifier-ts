type TagParts = [group: string, element: string];
type IntTagRange = [start: number, end: number];
type TagDeconstructor = (tag: string) => TagParts;

// Transforms (gggg,eeee) to xggggeeee
export const dicomToJsFormat = (tag: string): string | null => {
  const tagParts = deconstructDicomTag(tag);
  if (tagParts === null) {
    return null;
  }
  const [group, element] = tagParts;
  return `x${group}${element}`;
};

// Transforms xggggeeee to (gggg,eeee)
export const jsToDicomFormat = (tag: string): string | null => {
  const tagParts = deconstructJsTag(tag);
  if (tagParts === null) {
    return null;
  }
  const [group, element] = tagParts;
  return `(${group},${element})`;
};

const deconstructTag =
  (regex: RegExp) =>
  (tag: string): TagParts => {
    const matches = regex.exec(tag);

    if (matches !== null && matches.length === 3) {
      const [, group, element] = matches;
      return [group, element];
    } else {
      return null;
    }
  };

export const deconstructDicomTag: TagDeconstructor = deconstructTag(/\((\w{4}),(\w{4})\)/i);
export const deconstructJsTag: TagDeconstructor = deconstructTag(/x(\w{4})(\w{4})/i);

export const getIntTag = (group: string, element: string): number => {
  return parseInt(group + element, 16);
};

export const getIntTagRange = (group: string, element: string): IntTagRange => {
  const start = parseInt((group + element).replace(/x/gi, '0'), 16);
  const end = parseInt((group + element).replace(/x/gi, 'F'), 16);
  return [start, end];
};
