# Changelog
All notable changes to this project will be documented in this file.

## [1.0.0-beta.1] - 2022-09-12
Please keep in mind that this library is still 
### Added
- Added `Tag.forName(string)` to resolve tag names (e.g. "PatientName" => 00100010).
- New tests for Deidentifier tag matchers

### Changed
- Moved to `dcmjs` for data manipulation which should fix most issues with previous 0.x.x versions

### Removed
- Removed methods related to byte array manipulation. Use the `DataElement#setValue` method instead.

[1.0.0-beta.1]: https://github.com/UMEssen/dicom-deidentifier-ts