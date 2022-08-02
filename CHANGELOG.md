# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2022-08-01
### Added 
- Changelog
- New property `isImplicit` in `DeidentificationContext`

### Changed
- Automatically detect transfer syntaxes with implicit VRs and use VR lookup table by default.
- `deleteElement` requires `DeidentificationContext` now
- Updated dependencies

### Fixed
- Wrong value length for transfer syntaxes with implicit VRs

[0.4.0]: https://github.com/UMEssen/dicom-deidentifier-ts
[Unreleased]: https://github.com/UMEssen/dicom-deidentifier-ts/tree/master