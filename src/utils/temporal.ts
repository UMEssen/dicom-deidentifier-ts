import * as moment from 'moment';
import { MomentInput } from 'moment';
import { isTemporalVr } from './dicomElement';

export const parseDate = (value: string, vr: string): Date => {
  switch (vr) {
    case 'DA':
      return moment.utc(value, 'YYYYMMDD').toDate();
    case 'DT':
      return moment.parseZone(value, 'YYYYMMDDHHmmss.SSSSSSZZ').toDate();
    case 'TM':
      return moment.utc(value, 'HHmmss.SSSSSS').toDate();
  }
};

export const formatDate = (date: MomentInput, vr: string): string => {
  if (!isTemporalVr(vr)) {
    throw Error(`${vr} is not a temporal VR`);
  }

  switch (vr) {
    // YYYYMMDD
    case 'DA': {
      return moment.parseZone(date).format('YYYYMMDD');
    }
    // YYYYMMDDHHMMSS.FFFFFF&ZZXX
    case 'DT': {
      return moment.parseZone(date).format('YYYYMMDDHHmmss.SSSSSSZZ');
    }
    // HHMMSS.FFFFFF
    case 'TM': {
      return moment.parseZone(date).format('HHmmss.SSSSSS');
    }
  }
};
