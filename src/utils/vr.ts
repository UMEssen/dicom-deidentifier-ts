import type VR from '../types/VR';

const STRING_VR_LIST = ['AE', 'AS', 'CS', 'DA', 'DS', 'DT', 'IS', 'LO', 'LT', 'PN', 'SH', 'ST', 'TM', 'UI', 'UR', 'UT'];
const TEMPORAL_VR_LIST = ['DA', 'DT', 'TM'];
const INTEGER_VR_LIST = ['IS', 'OL', 'OW', 'SL', 'SS', 'UL', 'US'];
const INLINE_BINARY_VR_LIST = ['OB', 'OD', 'OF'];

export const isStringVR = (vr: VR): boolean => {
  return STRING_VR_LIST.includes(vr);
};

export const isTemporalVr = (vr: string): boolean => {
  return TEMPORAL_VR_LIST.includes(vr);
};

export const isIntegerVr = (vr: string): boolean => {
  return INTEGER_VR_LIST.includes(vr);
};

export const isInlineBinaryVr = (vr: string): boolean => {
  return INLINE_BINARY_VR_LIST.includes(vr);
};
