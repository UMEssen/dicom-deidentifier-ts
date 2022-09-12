import moment from 'moment';
import dcmjs from 'dcmjs';
import { readFileSync } from 'fs';
import { DicomDeidentifier, Tag, RetainDeviceIdentOption, RetainLongModifDatesOption, formatDate, parseDate } from '../src';
import type DicomElement from '../src/types/DicomElement';

describe('DicomDeidentifier', () => {
  const dicomFile = readFileSync('test/resources/test01.dcm');

  test('deidentify example file', () => {
    console.time('Duration of deidentification');

    const deidentifier = new DicomDeidentifier({
      profileOptions: [RetainDeviceIdentOption, RetainLongModifDatesOption],
      getReferenceTime: (dictionary) => parseDate(dictionary['00080030'].Value[0] as string, 'TM'),
      getReferenceDate: () => new Date('1967-10-12'),
      dummies: {
        default: 'removed',
        lookup: { [Tag.forName('PatientName')]: 'JOHN^DOE' },
      },
      specialHandlers: [
        (element, options) => {
          if (element.getVR() === 'DA' || element.getVR() === 'DT') {
            const date = options.dateShiftFunction!(
              options.referenceDate,
              parseDate(element.getValue()[0] as string, element.getVR() as any),
            );
            element.setValue([formatDate(date, element.getVR() as any)]);
            return true;
          } else if (element.getVR() === 'TM') {
            const date = options.timeShiftFunction!(
              options.referenceTime,
              parseDate(element.getValue()[0] as string, element.getVR() as any),
            );
            element.setValue([formatDate(date, element.getVR() as any)]);
            return true;
          } else {
            return false;
          }
        },
      ],
    });

    const result = deidentifier.deidentify(new Uint8Array(dicomFile));
    //writeFileSync('test/resources/test01-deidentified.dcm', result);

    const deidentified = dcmjs.data.DicomMessage.readFile(result.buffer);
    printSummary(deidentified.dict);
    console.timeEnd('Duration of deidentification');

    expect(deidentified.dict[Tag.forName('StudyTime')].Value[0]).toEqual('130000.000000');
    expect(deidentified.dict[Tag.forName('StudyDate')].Value[0]).toEqual('20150604');
    expect(deidentified.dict[Tag.forName('InstanceCreationTime')].Value[0]).toEqual('130632.662000');
    expect(deidentified.dict[Tag.forName('PatientName')].Value[0]).toEqual('JOHN^DOE');
    expect(deidentified.dict[Tag.forName('StudyInstanceUID')].Value[0]).toEqual('2.25.249548334295158846970995512124162104924');
  });
});

beforeEach(() => {
  global.console = require('console');
});

const calcDiffMs = (a: DicomElement, b: DicomElement) => {
  if ([a, b].some((_) => _ === undefined)) return;
  const dateA = parseDate(a.Value[0] as string, 'TM');
  const dateB = parseDate(b.Value[0] as string, 'TM');
  return Math.abs(moment(dateA).diff(moment(dateB), 'milliseconds'));
};

const calcDiffY = (a: DicomElement, b: DicomElement) => {
  if ([a, b].some((_) => _ === undefined)) return;
  const dateA = parseDate(a.Value[0] as string, 'DA');
  const dateB = parseDate(b.Value[0] as string, 'DA');
  return Math.abs(moment(dateA).diff(moment(dateB), 'years'));
};

const printSummary = (dictionary: dcmjs.DicomDictionary) => {
  const logValue = (name: string) => console.log(name.padEnd(42), dictionary[Tag.forName(name)]?.Value?.[0]);
  const diffY = calcDiffY(dictionary[Tag.forName('PatientBirthDate')], dictionary[Tag.forName('StudyDate')]);
  const diffMs = calcDiffMs(dictionary[Tag.forName('StudyTime')], dictionary[Tag.forName('InstanceCreationTime')]);

  console.group('[Summary]');
  logValue('PatientName');
  logValue('PatientID');
  logValue('PatientBirthDate');
  logValue('PatientAddress');
  logValue('PregnancyStatus');
  logValue('InstitutionName');
  logValue('InstitutionalDepartmentName');
  logValue('InstitutionAddress');
  logValue('ReferringPhysicianName');
  logValue('StationName');
  logValue('StudyInstanceUID');
  logValue('StudyDescription');
  logValue('RequestedProcedureDescription');
  logValue('PerformedProcedureStepDescription');
  logValue('SeriesDescription');
  logValue('ProtocolName');
  logValue('DeviceSerialNumber');
  logValue('StudyDate');
  logValue('StudyTime');
  logValue('InstanceCreationDate');
  logValue('InstanceCreationTime');
  console.log('Calculated age of Patient at StudyTime:'.padEnd(42), diffY);
  console.log('Instance created at relative StudyTime:'.padEnd(42), diffMs);
  console.groupEnd();
};
