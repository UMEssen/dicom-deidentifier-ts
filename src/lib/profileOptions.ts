import ProfileOption from '../types/ProfileOption';

export const BasicProfile: ProfileOption = deidentifier => deidentifier.profile['Basic Prof.'];

export const RetainLongModifDatesOption: ProfileOption = deidentifier => deidentifier.profile['Rtn. Long. Modif. Dates Opt.'];

export const RetainLongFullDatesOption: ProfileOption = deidentifier => deidentifier.profile['Rtn. Long. Full Dates Opt.'];

export const RetainUIDsOption: ProfileOption = deidentifier => deidentifier.profile['Rtn. UIDs Opt.'];

export const CleanGraphOption: ProfileOption = deidentifier => deidentifier.profile['Clean Graph. Opt.'];

export const RetainPatientCharsOption: ProfileOption = deidentifier => deidentifier.profile['Rtn. Pat. Chars. Opt.'];

export const RetainSafePrivateOption: ProfileOption = deidentifier => deidentifier.profile['Rtn. Safe Priv. Opt.'];

export const CleanDescOption: ProfileOption = deidentifier => deidentifier.profile['Clean Desc. Opt.'];

export const RetainDeviceIdentOption: ProfileOption = deidentifier => deidentifier.profile['Rtn. Dev. Id. Opt.'];

export const RetainInstIdentOption: ProfileOption = deidentifier => deidentifier.profile['Rtn. Inst. Id. Opt.'];

export const CleanStructContOption: ProfileOption = deidentifier => deidentifier.profile['Clean Struct. Cont. Opt.'];
