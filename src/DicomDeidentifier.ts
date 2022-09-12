import dcmjs from 'dcmjs';

import { deidentifiers } from './deidentifiers';
import DeidentifyOptions from './types/DeidentifyOptions';
import DicomDictionary from './types/DicomDictionary';
import ExecutionOptions from './types/ExecutionOptions';
import DicomElement from './types/DicomElement';
import DataElement from './DataElement';
import {
  defaultDateShiftFunction,
  defaultTimeShiftFunction,
  formatDate,
  getDefaultReferenceDate,
  getDefaultReferenceTime,
  parseDate,
} from './utils/time';
import { isInlineBinaryVr, isIntegerVr, isStringVR, isTemporalVr } from './utils/vr';
import { toUid } from './utils/uid';
import { BasicProfile } from './profiles';

class DicomDeidentifier {
  private readonly options: DeidentifyOptions;

  constructor(options: DeidentifyOptions) {
    const defaultOptions: Partial<DeidentifyOptions> = {
      dummies: { default: 'removed', lookup: [] },
      dateShiftFunction: defaultDateShiftFunction,
      timeShiftFunction: defaultTimeShiftFunction,
      getReferenceDate: getDefaultReferenceDate,
      getReferenceTime: getDefaultReferenceTime,
    };
    this.options = Object.assign(defaultOptions, options);
  }

  deidentify(dicomFile: Uint8Array): Uint8Array {
    const dataset = dcmjs.data.DicomMessage.readFile(dicomFile.buffer);
    const dictionary: DicomDictionary = dataset.dict;

    const executionOptions: ExecutionOptions = {
      referenceDate: this.options.getReferenceDate!(dictionary),
      referenceTime: this.options.getReferenceTime!(dictionary),
      ...this.options,
    };

    for (const [tag, element] of Object.entries(dictionary)) {
      const dataElement = new DataElement(dictionary, tag, element);
      this.execute(dataElement, executionOptions);
    }

    return new Uint8Array(dataset.write());
  }

  private execute(dataElement: DataElement, execOptions: ExecutionOptions) {
    const deidentifier = deidentifiers.find((matcher) => matcher.matches(parseInt(dataElement.getTag(), 16)));

    if (this.options.keep?.includes(dataElement.getTag())) {
      return;
    }

    if (this.options.specialHandlers?.some((handler) => handler(dataElement, execOptions))) {
      return;
    }

    // Recursive processing of sequence elements
    if (dataElement.getVR() === 'SQ') {
      const items = dataElement.getValue() as Record<string, DicomElement>[];
      for (const item of items) {
        for (const [itemTag, itemElement] of Object.entries(item)) {
          this.execute(new DataElement(item, itemTag, itemElement), execOptions);
        }
      }
    }

    if (deidentifier === undefined) {
      return;
    }

    const profileOption = this.options.profileOptions.reduce(
      (selectedProfile, nextProfile) => (nextProfile(deidentifier) == undefined ? selectedProfile : nextProfile),
      BasicProfile,
    );

    switch (profileOption(deidentifier)) {
      case 'X':
        this.xClean(dataElement, execOptions);
        break;
      case 'C':
        this.cClean(dataElement, execOptions);
        break;
      case 'D':
        this.dClean(dataElement, execOptions);
        break;
      case 'Z':
        this.dClean(dataElement, execOptions);
        break;
      case 'U':
        this.uClean(dataElement, execOptions);
        break;
      case 'K':
        this.kClean(dataElement, execOptions);
        break;
      case 'X/D':
        this.xClean(dataElement, execOptions);
        break;
      case 'X/Z':
        this.xClean(dataElement, execOptions);
        break;
      case 'X/Z/D':
        this.xClean(dataElement, execOptions);
        break;
      case 'X/Z/U*':
        this.xClean(dataElement, execOptions);
        break;
      case 'Z/D':
        this.dClean(dataElement, execOptions);
        break;
    }
  }

  private xClean(element: DataElement, _execOptions: ExecutionOptions) {
    element.delete();
  }

  private cClean(element: DataElement, execOptions: ExecutionOptions) {
    if (element.getVR() === 'SQ') {
      element.delete();
    } else if (element.getVR() === 'DA' || element.getVR() === 'DT' || element.getVR() === 'TM') {
      const date = this.options.dateShiftFunction!(
        execOptions.referenceDate,
        parseDate(element.getValue()[0] as string, element.getVR() as any),
      );
      element.setValue([formatDate(date, element.getVR() as any)]);
    } else if (isStringVR(element.getVR())) {
      element.setValue([this.options.dummies?.lookup?.[element.getTag()] || this.options.dummies?.default]);
    } else if (isIntegerVr(element.getVR())) {
      element.setValue([0]);
    } else if (isInlineBinaryVr(element.getVR())) {
      element.setValue([this.options.dummies?.lookup[element.getTag()] || 0]);
    }
  }

  private dClean(element: DataElement, _execOptions: ExecutionOptions) {
    if (element.getVR() === 'SQ') {
      element.delete();
    } else if (isTemporalVr(element.getVR())) {
      element.setValue([formatDate(new Date(0), element.getVR() as any)]);
    } else if (isStringVR(element.getVR())) {
      element.setValue([this.options.dummies?.lookup[element.getTag()] || this.options.dummies?.default]);
    } else if (isIntegerVr(element.getVR())) {
      element.setValue([0]);
    } else if (isInlineBinaryVr(element.getVR())) {
      element.setValue([this.options.dummies?.lookup[element.getTag()] || 0]);
    }
  }

  private uClean(element: DataElement, _execOptions: ExecutionOptions) {
    const uid = toUid(element.getValue()[0] as string);
    element.setValue([uid]);
  }

  private kClean(element: DataElement, _execOptions: ExecutionOptions) {
    if (element.getVR() === 'SQ') {
      element.delete();
    }
  }
}

export default DicomDeidentifier;
