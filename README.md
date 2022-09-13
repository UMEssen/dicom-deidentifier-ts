# Dicom Deidentifier

🧰 DICOM de-identification library for TypeScript.

A configurable TypeScript port of [DicomDeidentify](https://github.com/UMEssen/DicomDeidentify) to
deidentify DICOM files according to
http://dicom.nema.org/medical/dicom/current/output/html/part15.html#table_E.1-1

## Getting Started

### Installing

```shell
npm i @umessen/dicom-deidentifier
```

### Usage

Usage is similar to [DicomDeidentify](https://github.com/luckfamousa/DicomDeidentify).

```typescript
const deidentifier = new Deidentifier({
  profileOptions: [RetainDeviceIdentOption, RetainLongModifDatesOption],
  dummies: {
    default: 'removed',
    lookup: {
      [Tag.forName("PatientName")]: 'JOHN^DOE',
    },
  },
  keep: [Tag.forName("PatientAddress")],
})

const result = deidentifier.deidentify(new Uint8Array(dicomFile));
writeFileSync('deidentified.dcm', result);
```

### Special Handlers

You can add special handlers for custom processing:

```typescript
new Deidentifier({
  /* ... */
  specialHandlers: [
    // Special handler that removes all date elements
    (element, options) => {
      if (element.getVR() === 'DA' || element.getVR() === 'DT') {
        element.delete();
        // Return true to skip the default deidentification logic and any futher special handlers for this element.
        return true;
      } else {
        // Return false if you want to run further special handlers, including the default deidentification logic.
        return false;
      }
    },
    // Logging special handler
    // Note: This will not run for date elements as the previous special handler will return early.
    (element, options) => {
      console.log(element);
      return false;
    }
  ],
});
```

## License

This project is Open Source Software provided under the terms of the MIT License. More information
is available in embedded licensing files.
