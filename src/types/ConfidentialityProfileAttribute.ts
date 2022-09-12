import ActionCode from './ActionCode';

type ConfidentialityProfileAttribute = {
  'Attribute Name': string;
  Tag: string;

  'Retd. (from PS3.6)': boolean;
  'In Std. Comp. IOD (from PS3.3)': boolean;

  'Basic Prof.': ActionCode;
  'Rtn. Safe Priv. Opt.': ActionCode | null;
  'Rtn. UIDs Opt.': ActionCode | null;
  'Rtn. Dev. Id. Opt.': ActionCode | null;
  'Rtn. Inst. Id. Opt.': ActionCode | null;
  'Rtn. Pat. Chars. Opt.': ActionCode | null;
  'Rtn. Long. Full Dates Opt.': ActionCode | null;
  'Rtn. Long. Modif. Dates Opt.': ActionCode | null;
  'Clean Desc. Opt.': ActionCode | null;
  'Clean Struct. Cont. Opt.': ActionCode | null;
  'Clean Graph. Opt.': ActionCode | null;
};

export default ConfidentialityProfileAttribute;
