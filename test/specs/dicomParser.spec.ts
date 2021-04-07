import * as moment from 'moment';
import { expect } from 'chai';
import { readFileSync } from 'fs';
import { DataSet as DicomDataset, parseDicom } from 'dicom-parser';
import {
  deidentify,
  ensurePadding,
  formatDate,
  isTemporalVr,
  parseDate,
  RetainDeviceIdentOption,
  RetainLongModifDatesOption,
  toBytes,
  updateElement,
} from '../../src';
import { DeidentifyOptions } from '../../src/types';

// SETUP AND UTILS
const dicomFile = readFileSync('test/resources/test01.dcm');

const calcDiffMs = (a, b) => {
  if ([a, b].some(_ => _ === undefined)) return;
  const dateA = parseDate(a, 'TM');
  const dateB = parseDate(b, 'TM');
  return Math.abs(moment(dateA).diff(moment(dateB), 'milliseconds'));
};

const calcDiffY = (a, b) => {
  if ([a, b].some(_ => _ === undefined)) return;
  const dateA = parseDate(a, 'DA');
  const dateB = parseDate(b, 'DA');
  return Math.abs(moment(dateA).diff(moment(dateB), 'years'));
};

const printSummary = (dataset: DicomDataset) => {
  console.log('------------------------ [ Summary ] ------------------------');
  console.log('PatientName:', dataset.string('x00100010'));
  console.log('PatientID:', dataset.string('x00100020'));
  console.log('PatientBirthDate:', dataset.string('x00100030'));
  console.log('PatientAddress:', dataset.string('x00101040'));
  console.log('PregnancyStatus:', dataset.int16('x001021c0'));

  console.log('InstitutionName:', dataset.string('x00080080'));
  console.log('InstitutionalDepartmentName:', dataset.string('x00081040'));
  console.log('InstitutionAddress:', dataset.string('x00080081'));
  console.log('ReferringPhysicianName:', dataset.string('x00080090'));
  console.log('StationName:', dataset.string('x00081010'));

  console.log('StudyInstanceUID:', dataset.string('x0020000d'));
  console.log('StudyDescription:', dataset.string('x00081030'));
  console.log('RequestedProcedureDescription:', dataset.string('x00321060'));
  console.log('PerformedProcedureStepDescription:', dataset.string('x00400254'));
  console.log('SeriesDescription:', dataset.string('x0008103e'));
  console.log('ProtocolName:', dataset.string('x00181030'));
  console.log('DeviceSerialNumber:', dataset.string('x00181000'));

  console.log('StudyDate:', dataset.string('x00080020'));
  console.log('StudyTime:', dataset.string('x00080030'));
  console.log('InstanceCreationDate:', dataset.string('x00080012'));
  console.log('InstanceCreationTime:', dataset.string('x00080013'));
  console.log('Calculated age of Patient at StudyTime:', calcDiffY(dataset.string('x00100030'), dataset.string('x00080020')));
  console.log('Instance created at relative StudyTime:', calcDiffMs(dataset.string('x00080030'), dataset.string('x00080013')));
};

// TESTS
describe('deidentify', () => {
  it('should deidentify correctly', async () => {
    const byteArray = new Uint8Array(dicomFile);
    const dataset: DicomDataset = parseDicom(byteArray);

    const referenceDate = new Date('1967-10-12');
    const referenceTime = parseDate(dataset.string('x00080030'), 'TM');

    const options: DeidentifyOptions = {
      profileOptions: [RetainDeviceIdentOption, RetainLongModifDatesOption],
      dummies: {
        default: 'removed',
        lookup: {
          x00100010: 'JOHN^DOE',
        },
      },
      specialHandlers: [
        (element, context) => {
          const { vr, tag } = element;
          if (isTemporalVr(vr)) {
            if (dataset.string(tag) === undefined) {
              return;
            }
            const date =
              vr === 'TM'
                ? context.timeShiftFunction(referenceTime)(parseDate(dataset.string(tag), vr))
                : context.dateShiftFunction(referenceDate)(parseDate(dataset.string(tag), vr));

            updateElement({ value: ensurePadding(toBytes(formatDate(date, vr))), element, context });
            return true;
          }
          return false;
        },
      ],
      referenceDate: referenceDate,
      referenceTime: referenceTime,
    };

    printSummary(dataset);

    console.time('deidentify');
    await deidentify(dataset, options);
    console.timeEnd('deidentify');

    printSummary(dataset);
    // writeFileSync('test/resources/test01-deidentified.dcm', dataset.byteArray);

    // StudyTime
    expect(dataset.string('x00080030')).to.equal('130000.000000');
    // StudyDate
    expect(dataset.string('x00080020')).to.equal('20150604');
    // InstanceCreationTime
    expect(dataset.string('x00080013')).to.equal('130632.662000');
    // PatientName
    expect(dataset.string('x00100010')).to.equal('JOHN^DOE');
    // StudyInstanceUID
    expect(dataset.string('x0020000d')).to.equal('2.25.249548334295158846970995512124162104924');
  });
});
