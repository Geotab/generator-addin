# v3.4.3
## March 23, 2023
- Added build-dev script for building and packaging the add-in for testing when uploading the files directly to MyG.
- Updated changelog file to correct typo.

## March 6, 2023
- Initial Issue: images references kept getting corrupted on build. image file names did not match their respective reference on the HTML file.
- Investigation: the issue seemed to occur due to something related to the image minimizer, as I noticed that removing the minimizers resolved the issue.
- Fix: setting the file name to match the original name instead of letting webpack generate the hash/filename.
