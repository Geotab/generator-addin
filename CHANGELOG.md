# v5.0.0
## October 13, 2026
- Updated to yeoman-generator v10 and resolved transitive dependency audit vulnerabilities.
- Updated generated-project dependencies to address audit findings; removed unused CSS sandbox and ESLint webpack plugin dependencies.
- The `braces` advisory remains in the webpack development-server dependency chain; see `DEPENDENCY-AUDIT.md`.
- **Breaking:** The generator requires Node.js 22.18.0 or later in the 22.x line, or 24.11.0 or later. Generated add-in projects require Node.js 22.15.0 or later.

# v4.1.1
## February 27, 2025
# v4.1.1
- Updated dependencies to address vulnerabilities in npm packages.

## February 27, 2025
- Updated MyGeotab page category options to use the updated [redesigned left-hand navigation menu categories](https://developers.geotab.com/myGeotab/addIns/developingAddIns#geotab-redesigned-left-hand-navigation-menu)
# v4.1.0
## February 25, 2025
- Added Zenith components as a development option.
- Added TypeScript as a development option when using Zenith components.

# v4.0.5
## December 9, 2024
- Updated dependencies to address vulnerabilities in npm packages.
- Updated project to use yo v5.0.0 and yeoman-generator v7.3.x

# v4.0.4
## November 26, 2024
- Updated dependencies to address vulnerabilities in npm packages.
- Updated Yeoman title to include the current version of the add-in generator.

# v4.0.3
## August 16, 2024
- Added meta object as part of the main callback function for the add-in
- Added api and state callback objects as part of the main callback function for the add-in.

# v4.0.2
## August 02, 2024
- Updated dependencies to address vulnerabilities in npm packages.

# v4.0.1
## May 22, 2024
- Updated dependencies to address vulnerabilities in npm packages.

# v4.0.0
## March 29, 2024
- Updated dependencies to address vulnerabilities in npm packages.
- Removed unit testing capabilities to remove additional vulnerabilities.
- Added React as a development option.
- Added support for advanced group filter testing in local environment.

# v3.4.3
## March 23, 2023
- Added build-dev script for building and packaging the add-in for testing when uploading the files directly to MyG.

## March 6, 2023
- Fixed incorrect image references on build process
