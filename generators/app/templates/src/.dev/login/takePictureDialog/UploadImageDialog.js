const CaptureImageDialog = require('./CaptureImageDialog');
const Dialog = require('./Dialog');

/**
 * Generates image options dialog content
 * 
 * Initial dialog box displayed when api.mobile.camera.takePicture() called
 */
class UploadImageDialog {

    constructor () {
        this.id = 'select-image';
        this.dialog = new Dialog(this.id);
        this.app = document.querySelector('#<%= root%>-app');
    }

    /**
     * Reads file input by user and draws it to canvas element for later base64 extraction
     * 
     * @param {event} evt Change event for file input 
     */
    setImageFromUpload(evt) {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        var imageFile = evt.target.files[0];
        var fileReader = new FileReader();
        var img = new Image();

        img.onload = () => {
            context.canvas.width = img.width;
            context.canvas.height = img.height;
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        fileReader.onloadend = () => {
            img.src = fileReader.result;
        }
        fileReader.readAsDataURL(imageFile);
    }

    generateDialogHeader() {
        var titleBar = document.createElement('div');
        titleBar.setAttribute('class', 'dialog-box__header');
        var title = document.createElement('span');
        title.setAttribute('class', 'dialog-box__title heading-3');
        title.setAttribute('id', `${this.id}-title`);
        title.innerHTML = 'Adding Image...';
        titleBar.appendChild(title);

        let closeButton = document.createElement('button');
        closeButton.setAttribute('class', 'dialog-box__close-button');
        closeButton.setAttribute('id', `closeButton-${this.id}`);
        closeButton.innerHTML = '<span style="color: #066ea8">&times</span>';
        closeButton.setAttribute('aria-label', 'Close');
        closeButton.addEventListener('click', () => {
            // Simulate exit button click so api promise can be rejected
            var exitBtn = document.getElementById('exit');
            exitBtn.click();
        });
        titleBar.appendChild(closeButton);
        return titleBar;
    }

    generateInnerDialog() {
        var innerDialog = document.createElement('div');
        innerDialog.setAttribute('class', 'dialog-box__inner-wrapper');
        var dialogContent = document.createElement('div');
        dialogContent.setAttribute('class', 'dialog-box__inner');
        dialogContent.setAttribute('id', `${this.id}-inner`);
        dialogContent.innerHTML = 'Please choose an option to add an image.';
        innerDialog.appendChild(dialogContent);
        return innerDialog;
    }

    /**
     * Generates button region and adds event listeners to buttons
     */
    generateButtonRegion() {
        var buttonRegion = document.createElement('div');
        buttonRegion.setAttribute('class', 'dialog-box__button-region');
        var buttonRowDiv = document.createElement('div');
        buttonRowDiv.setAttribute('class', 'dialog-box__button-row');
        buttonRegion.appendChild(buttonRowDiv);

        var newPictureButton = document.createElement('button');
        newPictureButton.setAttribute('class', 'dialog-box__button');
        newPictureButton.setAttribute('id', 'takePicture');
        newPictureButton.innerHTML = 'New Picture';
        newPictureButton.addEventListener('click', () => {
            // Check if media devices are supported before generating the camera interface
            var isSupported = 'mediaDevices' in navigator;
            if (!isSupported) {
                console.error('Media devices not supported in this browser.');
                return;
            }
            // Do not want to remove utility buttons and their event listeners, only visible dialog
            var removedVisibleDialog = this.dialog.removeAllDialog();
            if (removedVisibleDialog) {
                var captureImageDialog = new CaptureImageDialog();
                this.dialog = captureImageDialog.dialog;
                captureImageDialog.generateContent();
            }
        });
        buttonRowDiv.appendChild(newPictureButton);

        var uploadPictureInput = document.createElement('input');
        uploadPictureInput.setAttribute('type', 'file');
        uploadPictureInput.setAttribute('accept', 'image/*');
        uploadPictureInput.setAttribute('id', 'file-upload');
        uploadPictureInput.style.display = 'none';
        uploadPictureInput.addEventListener('change', (evt) => {
            this.setImageFromUpload(evt);
            var submitButton = document.getElementById('submitImage');
            // small timeout needed to load image before base64 can be extracted from canvas
            setTimeout(() => {
                // Simulate submit button click so that api promise can be resolved
                submitButton.click();
            }, 50);
        });
        
        // HTML file input styling does not match other buttons
        // This button is used for simulating click on file input
        var uploadPictureButton = document.createElement('button');
        uploadPictureButton.setAttribute('class', 'dialog-box__button');
        uploadPictureButton.setAttribute('id', 'uploadPicture');
        uploadPictureButton.innerHTML = 'Upload';
        uploadPictureButton.addEventListener('click', () => {
            uploadPictureInput.click();
        });
        buttonRowDiv.appendChild(uploadPictureButton);
        buttonRowDiv.appendChild(uploadPictureInput);
        return buttonRegion;
    }

    /**
     * Generates upload image options content then appends it to the dialog box
     */
    generateContent() {
        this.dialog.generateDialog();
        var dialogBox = document.getElementById(`${this.id}`);

        var header = this.generateDialogHeader();
        dialogBox.classList.add('_closable');
        dialogBox.classList.add('_titled');
        dialogBox.setAttribute('aria-labelledby', `${this.id}-title`);
        var innerDialog = this.generateInnerDialog();
        var buttonRegion = this.generateButtonRegion();

        dialogBox.appendChild(header);
        dialogBox.appendChild(innerDialog);
        dialogBox.appendChild(buttonRegion);
    }
}

module.exports = UploadImageDialog;
