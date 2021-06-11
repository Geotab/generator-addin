class Dialog {

    constructor(dialogID) {
        this.dialogID = dialogID;
        this.app = document.querySelector('#app');
    }

    cleanUp() {
        var removeSuccess = this.removeAllDialog();
        if (removeSuccess) {
            this.removeUtilityButtons();
            return removeSuccess;
        }
        return !removeSuccess;
    }

    removeAllDialog() {
        var dialogBox = document.getElementById(`${this.dialogID}`);
        var overlay = document.getElementById(`overlay-${this.dialogID}`);
        var canvas = document.getElementById('canvas');
        var video = document.getElementById('player');

        if (video) {
            try {
                video.srcObject.getVideoTracks().forEach(track => track.stop());
            } catch(err) {
                console.error('Video not loaded yet.', err);
                // Removal unsuccessful since video still running, return false to keep UI so exit can be made properly
                return false;
            }
        }
        if (dialogBox) {
            dialogBox.remove();
        }
        if (overlay) {
            overlay.remove();
        }
        if (canvas) {
            canvas.remove();
        }
        // Successful removal and video stopped
        return true;
    }

    removeUtilityButtons() {
        var submitBtn = document.getElementById('submitImage');
        var exitBtn = document.getElementById('exit');

        if (submitBtn) {
            submitBtn.remove();
        }
        if (exitBtn) {
            exitBtn.remove();
        }
    }

    generateDialogBox() {
        var dialogBox = document.createElement('div');
        dialogBox.setAttribute('class', 'dialog-box');
        dialogBox.setAttribute('id', `${this.dialogID}`);
        dialogBox.setAttribute('aria-modal', 'true');
        dialogBox.style.zIndex = '8000';
        dialogBox.style.position = 'absolute';
        dialogBox.style.top = '50%';
        dialogBox.style.left = '50%';
        dialogBox.style.opacity = 1;
        dialogBox.style.transform = 'translate(-50%,-50%)';
        dialogBox.style.msTransform = 'translate(-50%,-50%)';
        return dialogBox;
    }

    generateOverlay() {
        var overlay = document.createElement('div');
        overlay.setAttribute('class', 'dialog-box-overlay');
        overlay.setAttribute('id', `overlay-${this.dialogID}`);
        overlay.style.zIndex = '7000';
        overlay.addEventListener('click', () => {
            var exitBtn = document.getElementById('exit');
            exitBtn.click();
        });
        return overlay;
    }

    generateCanvas() {
        // Not displayed, used for drawing image and extracting base64
        var canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'canvas');
        canvas.setAttribute('width', 320);
        canvas.setAttribute('height', 240);
        canvas.setAttribute('class', 'hidden');
        return canvas;
    }

    generateSubmitButton() {
        // Not displayed, used for signaling when promise should be resolved.
        var submitImageButton = document.createElement('button');
        submitImageButton.setAttribute('id', 'submitImage');
        submitImageButton.style.display = 'none';
        return submitImageButton;
    }

    generateExitButton() {
        // Not displayed, used for signaling when promise should be rejected.
        var exitButton = document.createElement('button');
        exitButton.setAttribute('id', 'exit');
        exitButton.style.display = 'none';
        return exitButton;
    }

    generateDialog() {
        var canvas = this.generateCanvas();
        var submitBtn = this.generateSubmitButton();
        var exitBtn = this.generateExitButton();
        var dialogBox = this.generateDialogBox();
        var overlay = this.generateOverlay();

        this.app.appendChild(dialogBox);
        this.app.appendChild(overlay);
        this.app.appendChild(canvas);
        this.app.appendChild(submitBtn);
        this.app.appendChild(exitBtn);

        return dialogBox;
    }
}

module.exports = Dialog;
