# March 6, 2023 - SOLENG-40909

- Initial Issue: images references kept getting corrupted on build. image file names did not match their respective reference on the HTML file.
- Investigation: the issue seemed to occur due to something related to the image minimizer, as I noticed that removing the minimizers resolved the issue.
- Fix: setting the file name to match the original name instead of letting webpack generate the hash/filename.
