import { BasicProfile } from './profileOptions';
import cleaningFunctions from './cleaningFunctions';
import { deconstructJsTag, getIntTag } from '../utils/tag';
import { deidentifiers } from './deidentifier';
import DeidentifyOptions from '../types/DeidentifyOptions';
import DeidentificationContext from '../types/DeidentificationContext';
import { DataSet as DicomDataset, Element as DicomElement } from 'dicom-parser';
import { defaultDateShiftFunction, defaultTimeShiftFunction } from './temporalShiftFunctions';

const execute = (context: DeidentificationContext) => (element: DicomElement) => {
  if (context.keep?.includes(element.tag)) {
    return;
  }

  if (context.specialHandlers?.some(handler => handler(element, context))) {
    return;
  }

  if (element.vr === 'SQ') {
    element.items.forEach(item => execute({ ...context, dataset: item.dataSet })(item));
  }

  const deidentifier = deidentifiers.find(deidentifier => deidentifier.matches(getIntTag(...deconstructJsTag(element.tag))));

  if (deidentifier !== undefined) {
    const profileOption = context.profileOptions.reduce(
      (selectedProfile, nextProfile) => (nextProfile(deidentifier) == undefined ? selectedProfile : nextProfile),
      BasicProfile,
    );

    cleaningFunctions[profileOption(deidentifier)](element, {
      ...context,
      // Header must be encoded in Little Endian according to the DICOM specification
      isLittleEndian: element.tag <= 'x0002ffff' ? true : context.isLittleEndian,
    });
  }
};

const deidentify = (dataset: DicomDataset, options: DeidentifyOptions): Promise<DicomDataset> => {
  return new Promise((resolve, reject) => {
    try {
      const isLittleEndian = dataset.string('x00020010') !== '1.2.840.10008.1.2.2';

      const mergedOptions: DeidentifyOptions = {
        dateShiftFunction: defaultDateShiftFunction,
        timeShiftFunction: defaultTimeShiftFunction,
        dummies: {
          default: 'removed',
          lookup: {},
          ...options.dummies,
        },
        ...options,
      };

      Object.values(dataset.elements).forEach(
        execute({
          ...mergedOptions,
          dataset,
          isLittleEndian,
        }),
      );

      resolve(dataset);
    } catch (exception) {
      reject(exception);
    }
  });
};

export default deidentify;
