# Dicom Deidentifier

🧰 DICOM de-identification library for TypeScript.

## Getting Started

### Installing

```shell
npm install @ship/dicom-deidentifier

yarn add @ship/dicom-deidentifier
```

### Example usage

Usage is similar to [DicomDeidentify](https://github.com/luckfamousa/DicomDeidentify).

```typescript
const options: DeidentifyOptions = {
  profileOptions: [RetainDeviceIdentOption, RetainLongModifDatesOption],
  referenceDate,
  referenceTime,
  dummies: {
    default: 'removed',
    lookup: {
      x00100010: 'JOHN^DOE',
    }
  },
  specialHandlers: [
    (element, context) => {
      // element: current element that is now being processed
      // context: contains all user-options and some additional information
      
      // return true to skip further handlers for this element,
      // return false to allow further chaining
      return true;
    }
  ],
  keep: ["x00101040"] // keep PatientAddress (0010,1040) and skip all handlers for this tag 
};

deidentify(dataset, options)
  .then(console.log)
  .catch(console.error);
```

Note that `deidentify` will mutate the dataset to avoid expensive copies. If you
prefer to have a function without side effects, you should deep-copy it before.
A shallow copy will still mutate the dataset, so make sure you don't just copy
the reference.

### Byte array manipulation
Unfortunately `dicom-parser` is for parsing only. 
Unlike dcm4che for Java it doesn't contain functions to overwrite the dataset.
However, it does expose the internal byte array. 
dicom-deidentifier takes advantage of this and exposes a few helper functions to assist you 
in case you are writing your own special handlers:
 
- updateElement
    - replaces the value of an element. It handles endianness for you automagically.  
- deleteElement
    - As the name suggests, it will remove the entire element from the byte array. 
- ensurePadding
    - Adds padding bytes to a value
- formatDate
    - formats the date according to the VR specification (DA, DT, TM)

You should always use `ensurePadding` before passing a new value to `updateElement`. 
It will use 0x20 by default, but some VRs may require different padding bytes.
```ts
updateElement({ value: ensurePadding(toBytes(formatDate(date, vr))), element, context });
```
### Browser support
This library works in modern browsers and Node environments.
Please note that Internet Explorer (11) isn't supported due to `BigInt` usage and
possible other incompatibilities. 

Tested with the latest versions of Chromium and Firefox. 

## See also
- https://github.com/luckfamousa/DicomDeidentify
    - The original library written in Scala

## License

This project is Open Source Software provided under the terms of the MIT License. More information is available in embedded licensing files.
