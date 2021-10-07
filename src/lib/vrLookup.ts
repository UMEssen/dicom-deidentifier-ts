import * as lookupTable from '../resources/vrlookup.json';
import VR from '../types/VR';

type VRLookupTable = Record<string, VR | VR[]>;

/**
 * A lookup table based on the Data Dictionary from DICOM PS3.6 version 2013c.
 *
 * @since 0.3.0
 * @see https://www.dicomlibrary.com/dicom/dicom-tags/
 */
export const VR_LOOKUP_TABLE = lookupTable as VRLookupTable;

/**
 * A very basic lookup strategy based on VR_LOOKUP_TABLE.
 *
 * It will return 'UN' (unknown) for private tags.
 *
 * @param tag The tag in xGGGGEEEE format, e.g. x00100010
 * @since 0.3.0
 * @see https://www.dicomlibrary.com/dicom/dicom-tags/
 */
const defaultVrLookup = (tag: string): VR => {
  const vr = VR_LOOKUP_TABLE[tag];
  if (vr) {
    return Array.isArray(vr) ? vr[0] : vr;
  }
  return 'UN';
};

export default defaultVrLookup;
