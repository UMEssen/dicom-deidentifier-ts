import TemporalShiftFunction from '../types/TemporalShiftFunction';
import * as moment from 'moment';

export const defaultTimeShiftFunction: TemporalShiftFunction = referenceDate => date => {
  const diff = moment
    .unix(43200) // unix() + 12h
    .diff(referenceDate);

  return moment(date).add(diff).toDate();
};

export const defaultDateShiftFunction: TemporalShiftFunction = referenceDate => date => {
  const diff = moment.unix(0).utc().diff(referenceDate);

  return moment(date).add(diff).toDate();
};
