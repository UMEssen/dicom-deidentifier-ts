import { DataSet as DicomDataset, Element as DicomElement } from 'dicom-parser';

import cleaningFunctions from './cleaningFunctions';
import { BasicProfile } from './profileOptions';
import { deconstructJsTag, getIntTag } from '../utils/tag';
import { defaultDateShiftFunction, defaultTimeShiftFunction } from './temporalShiftFunctions';
import { deidentifiers } from './deidentifier';

import DeidentificationContext from '../types/DeidentificationContext';
import DeidentifyOptions from '../types/DeidentifyOptions';

const execute = (context: DeidentificationContext) => async (element: DicomElement) => {
  // This lookup is required for files with implicit VRs
  if (!element.vr && context.vrLookup) {
    element.vr = await context.vrLookup(element.tag);
  }

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

/**
 * Deidentifies a dicom dataset from `dicom-parser`.
 *
 * @param dataset A dataset from `dicom-parser`
 * @param options The options for the deidentification process
 *
 * @example
 * import { parseDicom } from "dicom-parser";
 * const dataset = parseDicom(byteArray);
 *
 * const deidentifiedDataset = await deidentify(dataset, { ... });
 *
 * @see https://www.npmjs.com/package/dicom-parser
 * @see DeidentifyOptions
 */
const deidentify = async (dataset: DicomDataset, options: DeidentifyOptions): Promise<DicomDataset> => {
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

  await Promise.all(
    Object.values(dataset.elements).map(
      execute({
        ...mergedOptions,
        dataset,
        isLittleEndian,
      }),
    ),
  );

  return dataset;
};

export default deidentify;
