import dcmjs from 'dcmjs';

type IntTagRange = [start: number, end: number];
type TagParts = [group: string, element: string];

export namespace Tag {
  /**
   * Performs a name lookup in the DICOM dictionary.
   *
   * @param name The human-friendly tag name
   * @returns The tag in ggggeeee format
   *
   * @see https://dicom.nema.org/medical/dicom/2017e/output/chtml/part06/chapter_6.html
   */
  export const forName = (name: string): string => {
    const matchingTag = dcmjs.data.DicomMetaDictionary.nameMap[name]?.tag;
    if (!matchingTag) {
      throw new Error(`Could not resolve tag for name ${name}`);
    } else {
      return deconstructDicomTag(matchingTag).join('');
    }
  };
}

/**
 * @param tag A DICOM tag in (gggg,eeee) format
 * @returns An array containing the group and the element ([group, element])
 */
export const deconstructDicomTag = (tag: string): TagParts => {
  return deconstructTag(/\((\w{4}),(\w{4})\)/i, tag);
};

/**
 * @param tag A DICOM tag in ggggeeee format
 * @returns An array containing the group and the element ([group, element])
 */
export const deconstructJsTag = (tag: string): TagParts => {
  return deconstructTag(/(\w{4})(\w{4})/i, tag);
};

const deconstructTag = (regex: RegExp, tag: string): TagParts => {
  const matches = regex.exec(tag);

  if (matches !== null && matches.length === 3) {
    const [, group, element] = matches;
    return [group, element];
  } else {
    throw new Error('Cannot deconstruct tag');
  }
};

export const getIntTagRange = (group: string, element: string): IntTagRange => {
  const start = parseInt((group + element).replace(/x/gi, '0'), 16);
  const end = parseInt((group + element).replace(/x/gi, 'F'), 16);
  return [start, end];
};
