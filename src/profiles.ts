import type ProfileOption from './types/ProfileOption';

export const BasicProfile: ProfileOption = (matcher) => matcher.cpa['Basic Prof.'];

export const RetainLongModifDatesOption: ProfileOption = (matcher) => matcher.cpa['Rtn. Long. Modif. Dates Opt.'];

export const RetainLongFullDatesOption: ProfileOption = (matcher) => matcher.cpa['Rtn. Long. Full Dates Opt.'];

export const RetainUIDsOption: ProfileOption = (matcher) => matcher.cpa['Rtn. UIDs Opt.'];

export const CleanGraphOption: ProfileOption = (matcher) => matcher.cpa['Clean Graph. Opt.'];

export const RetainPatientCharsOption: ProfileOption = (matcher) => matcher.cpa['Rtn. Pat. Chars. Opt.'];

export const RetainSafePrivateOption: ProfileOption = (matcher) => matcher.cpa['Rtn. Safe Priv. Opt.'];

export const CleanDescOption: ProfileOption = (matcher) => matcher.cpa['Clean Desc. Opt.'];

export const RetainDeviceIdentOption: ProfileOption = (matcher) => matcher.cpa['Rtn. Dev. Id. Opt.'];

export const RetainInstIdentOption: ProfileOption = (matcher) => matcher.cpa['Rtn. Inst. Id. Opt.'];

export const CleanStructContOption: ProfileOption = (matcher) => matcher.cpa['Clean Struct. Cont. Opt.'];
