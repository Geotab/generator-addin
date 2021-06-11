const Dialog = require('./Dialog');

class TakePicture {

    constructor() {
        this.id = 'capture-image';
        this.dialog = new Dialog(this.id);
        this.app = document.querySelector('#app');
    }

    setImageFromVideoFrame() {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        var video = document.getElementById('player');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    generateVideo() {
        var video = document.createElement('video');
        video.setAttribute('id', 'player');
        video.setAttribute('controls', '');
        video.setAttribute('autoplay', '');
        video.setAttribute('width', 320);
        video.setAttribute('height', 240);
        video.style.marginLeft = 'auto';
        video.style.marginRight = 'auto';
        video.style.display = 'block';

        var constraints = {
            video: true,
        };
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                video.srcObject = stream;
        });
        return video;
    }

    generateInnerDialog() {
        var innerDialog = document.createElement('div');
        innerDialog.setAttribute('class', 'dialog-box__inner-wrapper');
        var dialogContent = document.createElement('div');
        dialogContent.setAttribute('class', 'dialog-box__inner');
        dialogContent.setAttribute('id', `${this.id}-inner`);
        innerDialog.appendChild(dialogContent);
        
        return innerDialog;
    }

    generateButtonRegion() {
        var buttonRegion = document.createElement('div');
        buttonRegion.setAttribute('class', 'dialog-box__button-region');
        var buttonRowDiv = document.createElement('div');
        buttonRowDiv.setAttribute('class', 'dialog-box__button-row');
        buttonRegion.appendChild(buttonRowDiv);

        var captureImageButton = document.createElement('button');
        captureImageButton.setAttribute('class', 'dialog-box__button');
        captureImageButton.setAttribute('id', 'takePicture');
        captureImageButton.innerHTML = 'Capture';
        captureImageButton.addEventListener('click', () => {
            this.setImageFromVideoFrame();
            var submitButton = document.getElementById('submitImage');
            submitButton.click();
        });
        buttonRowDiv.appendChild(captureImageButton);
        
        return buttonRegion;
    }

    generateContent() {
        var dialogBox = this.dialog.generateDialog();
        var video = this.generateVideo();
        var innerDialog =this.generateInnerDialog();
        innerDialog.appendChild(video);
        var buttonRegion = this.generateButtonRegion();

        dialogBox.appendChild(innerDialog);
        dialogBox.appendChild(buttonRegion);
    }
}

module.exports = TakePicture;
