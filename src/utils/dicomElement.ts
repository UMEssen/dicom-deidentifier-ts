export const isTemporalVr = (vr: string): boolean => {
  return vr === 'DA' || vr === 'DT' || vr === 'TM';
};

export const isIntegerVr = (vr: string): boolean => {
  return vr === 'IS' || vr === 'OL' || vr === 'OW' || vr === 'SL' || vr === 'SS' || vr === 'UL' || vr === 'US';
};

export const isInlineBinaryVr = (vr: String): boolean => {
  return vr === 'OB' || vr === 'OD' || vr === 'OF';
};
