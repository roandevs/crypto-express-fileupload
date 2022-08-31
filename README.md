# Crypto Express File Upload


## Information

- This is a proof of concept project. By default express-fileupload does not have a way nor make it easy to encrypt and decrypt your file buffers that you upload, so I've tweaked the library and left an example/proof of concept that shows how you can encrypt & decrypt file buffers when using express-fileupload so that files stored on a server cannot be read by a sys-admin or third-party without modifying this code.

- This has been tested with images and works well. You cannot view an image while it's on the disk, but can only read/view it properly when going through the API that is ran in this project. I've incorporated this into many of my projects that require uploading and storing private files.

## Features

- Privacy for your files ❤ 

