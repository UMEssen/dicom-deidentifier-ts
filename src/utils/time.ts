import moment from 'moment';
import { Tag } from './tag';
import { isTemporalVr } from './vr';
import type DicomDictionary from '../types/DicomDictionary';
import type VR from '../types/VR';
import type { MomentInput } from 'moment';

export const defaultTimeShiftFunction = (referenceDate: Date, date: Date) => {
  const diff = moment.unix(43200).diff(referenceDate);
  return moment(date).add(diff).toDate();
};

export const defaultDateShiftFunction = (referenceDate: Date, date: Date) => {
  const diff = moment.unix(0).utc().diff(referenceDate);
  return moment(date).add(diff).toDate();
};

export const getDefaultReferenceTime = (dict: DicomDictionary) => parseDate(dict[Tag.forName('StudyTime')].Value[0] as string, 'TM');
export const getDefaultReferenceDate = (dict: DicomDictionary) => parseDate(dict[Tag.forName('PatientBirthDate')].Value[0] as string, 'DA');

export const parseDate = (value: string, vr: Extract<VR, 'DA' | 'DT' | 'TM'>): Date => {
  switch (vr) {
    case 'DA':
      return moment.utc(value, 'YYYYMMDD').toDate();
    case 'DT':
      return moment.parseZone(value, 'YYYYMMDDHHmmss.SSSSSSZZ').toDate();
    case 'TM':
      return moment.utc(value, 'HHmmss.SSSSSS').toDate();
  }
};

export const formatDate = (date: MomentInput, vr: Extract<VR, 'DA' | 'DT' | 'TM'>): string => {
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
