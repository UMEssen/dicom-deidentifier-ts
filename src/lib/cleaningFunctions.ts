import { isStringVr } from 'dicom-parser';
import {
  deleteElement,
  ensurePadding,
  formatDate,
  isInlineBinaryVr,
  isIntegerVr,
  isTemporalVr,
  parseDate,
  toBytes,
  toUid,
  updateElement,
} from '..';

import ActionCode from '../types/ActionCode';
import CleaningFunction from '../types/CleaningFunction';

export const xCleanFunction: CleaningFunction = (element, context) => {
  deleteElement(context.dataset, element.tag, context);
  return true;
};

export const cCleanFunction: CleaningFunction = (element, context) => {
  const { tag, vr } = element;
  const { dataset, referenceDate, dateShiftFunction, dummies } = context;

  if (vr === 'SQ') {
    deleteElement(dataset, tag, context);
  } else if (isTemporalVr(vr)) {
    const date = dateShiftFunction(referenceDate)(parseDate(dataset.string(tag), vr));
    updateElement({ value: ensurePadding(toBytes(formatDate(date, vr))), element, context });
  } else if (isStringVr(vr) && isIntegerVr(vr)) {
    const number = dummies.lookup[tag] || '0';
    updateElement({ value: ensurePadding(toBytes(number)), element, context });
  } else if (isStringVr(vr)) {
    const text = dummies.lookup[tag] || dummies.default;
    updateElement({ value: ensurePadding(toBytes(text)), element, context });
  } else if (isIntegerVr(vr)) {
    updateElement({ value: ensurePadding([0]), element, context });
  } else if (isInlineBinaryVr(vr)) {
    updateElement({ value: ensurePadding([0]), element, context });
  } else {
    return false;
  }

  return true;
};

export const dCleanFunction: CleaningFunction = (element, context) => {
  const { tag, vr } = element;
  const { dataset, dummies } = context;

  if (vr === 'SQ') {
    deleteElement(dataset, tag, context);
  } else if (isTemporalVr(vr)) {
    updateElement({ value: ensurePadding(toBytes(formatDate(new Date(0), vr))), element, context });
  } else if (isStringVr(vr) && isIntegerVr(vr)) {
    const number = dummies.lookup[tag] || '0';
    updateElement({ value: ensurePadding(toBytes(number)), element, context });
  } else if (isStringVr(vr)) {
    const text = dummies.lookup[tag] || dummies.default;
    updateElement({ value: ensurePadding(toBytes(text)), element, context });
  } else if (isIntegerVr(vr)) {
    updateElement({ value: ensurePadding([0]), element, context });
  } else if (isInlineBinaryVr(vr)) {
    const binary = toBytes(dummies.lookup[tag]) || [0];
    updateElement({ value: ensurePadding(binary), element, context });
  } else {
    return false;
  }

  return true;
};

export const uCleanFunction: CleaningFunction = (element, context) => {
  const { tag } = element;
  const uid = toUid(context.dataset.string(tag));

  updateElement({ value: ensurePadding(toBytes(uid), 0x00), element, context });

  return true;
};

export const kCleanFunction: CleaningFunction = (element, context) => {
  const { tag, vr } = element;
  const { dataset } = context;

  if (vr === 'SQ') {
    deleteElement(dataset, tag, context);
    return true;
  } else {
    return false;
  }
};

const cleaningFunctions: Record<ActionCode, CleaningFunction> = {
  X: xCleanFunction,
  C: cCleanFunction,
  D: dCleanFunction,
  Z: dCleanFunction,
  U: uCleanFunction,
  K: kCleanFunction,
  'X/D': xCleanFunction,
  'X/Z': xCleanFunction,
  'X/Z/D': xCleanFunction,
  'X/Z/U*': xCleanFunction,
  'Z/D': dCleanFunction,
};

export default cleaningFunctions;
