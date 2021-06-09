'use strict';
const config = require('../../app/config.json');

/**
 * Geotab login class
 * 
 * Grabs the login screen, appends listeners, and creates the global
 * api object
 */
class GeotabLogin {

    /**
     * Constructor class -> Replaces the self firing function used with Gulp
     * @param {bool} isDriveAddin whether or not the addin is a drive addin
     * @param {Class} GeotabApi uninstantiated GeotabApi class
     */
    constructor(isDriveAddin, GeotabApi){
        global.api;
        global.state;
        this.elLoginDialog = document.querySelector('#loginDialog');
        this.elEmail = this.elLoginDialog.querySelector('#email');
        this.elPassword = this.elLoginDialog.querySelector('#password');
        this.elServer = this.elLoginDialog.querySelector('#server');
        this.elDatabase = this.elLoginDialog.querySelector('#database');
        this.elLoginError = this.elLoginDialog.querySelector('#loginError');
        this.elLoginBtn = this.elLoginDialog.querySelector('#loginBtn');
        this.elDeviceDialog = document.querySelector('#deviceDialog');
        this.elDevices = this.elDeviceDialog.querySelector('#devices');
        this.elDevicesOkBtn = this.elDeviceDialog.querySelector('#okBtn');
        this.elLogoutBtn = document.querySelector('#logoutBtn');
        this.elAddinButton = document.querySelector('.customButton');
        this.elNightModeToggle = document.querySelector('#nightMode');
        this.elStartStopToggle = document.querySelector('#startStopBtn');
        this.elSendNotification = document.querySelector('#sendNotificationBtn');
        this.elCancelNotification = document.querySelector('#cancelNotificationBtn');
        this.elUpdateNotification = document.querySelector('#updateNotificationBtn');
        this.elPermissionNotification = document.querySelector('#permissionNotificationBtn');
    
        if (this.elAddinButton) {
            this.elAddinButton.addEventListener('click', function (e) {
                Object.keys(global.geotab.customButtons).forEach(function (name) {
                    global.geotab.customButtons[name](e, global.api, global.state);
                });
            });
        }

        this.authenticationCallback;
        this.device = JSON.parse(localStorage.getItem('_device'));

        this.initializeGeotabApi(GeotabApi);
        this.intializeInterface(isDriveAddin);
    }

    initializeGeotabApi(GeotabApi) {
        global.api = new GeotabApi((detailsCallback) => {
            this.authenticationCallback = detailsCallback;

            if (!this.elLoginDialog.open) {
                this.elLoginDialog.showModal();
            }
        }, {
            rememberMe: true
        });
    }

    initializeAddin(isDriveAddin) {
        Object.keys(global.geotab.addin).forEach(function (name) {
            var addin = global.geotab.addin[name];

            if (addin.isInitialize) {
                addin.focus(global.api, global.state);
            } else {
                addin = typeof addin === 'function' ? global.geotab.addin[name] = addin(global.api, global.state) : addin;
                if(config.onStartup && isDriveAddin){
                    addin.startup(global.api, global.state, function () {
                        //call initialize after startup
                        addin.initialize(global.api, global.state, function () {
                            addin.isInitialize = true;
                            addin.focus(global.api, global.state);
                        });
                    });
                }
                else{
                    addin.initialize(global.api, global.state, function () {
                        addin.isInitialize = true;
                        addin.focus(global.api, global.state);
                    });
                }
            }
        });
    }

    initializeDevice() {
        // Mock device for drive addin
        global.api.call('Get', {
            typeName: 'Device',
            resultsLimit: 1000,
            search: {
                fromDate: new Date()
            }
        }, (devices) => {
            var options = devices.sort(function (d1, d2) {
                var name1 = d1.name.toLowerCase();
                var name2 = d2.name.toLowerCase();
                if (name1 < name2) {
                    return -1;
                } else if (name1 > name2) {
                    return 1;
                } else {
                    return 0;
                }
            }).map(function (d) {
                return '<option value="' + d.id + '">' + d.name + '</option>';
            });
            this.elDevices.innerHTML = '<option>Select Device</option>' + options.join('');
            this.elDeviceDialog.showModal();
        }, (e) => {
            console.error(`Could not get vehicles: ${e.message}`);
        });
    }

    intializeInterface(isDriveAddin) {
        this.elLoginBtn.addEventListener('click', (event) => {
            var server = this.elServer.value || 'my.geotab.com',
                database = this.elDatabase.value,
                email = this.elEmail.value,
                password = this.elPassword.value;

            event.preventDefault();
            localStorage.setItem('_user', JSON.stringify(email));

            global.api.user = email;
            this.elLoginError.style.display = 'none';

            this.authenticationCallback(server, database, email, password, (err) => {
                this.elLoginDialog.showModal();

                if (err) {
                    this.elLoginError.textContent = err;
                }

                this.elLoginError.style.display = 'block';
            });

            if (!isDriveAddin) {
                this.initializeAddin(isDriveAddin);
            }

            this.elLoginDialog.close();
        });

        this.elLogoutBtn.addEventListener('click', (event) => {
            event.preventDefault();
            if(config.onShutdown && isDriveAddin){
                Object.keys(global.geotab.addin).forEach(function (name) {
                    global.geotab.addin[name].shutdown(global.api, global.state, function(){});
                });
            }

            if (global.api !== undefined) {
                global.api.forget();
            }

            Object.keys(global.geotab.addin).forEach(function (name) {
                global.geotab.addin[name].isInitialize = false;
            });

            this.device = null;
            global.state.device = this.device;
            localStorage.setItem('_device', JSON.stringify(this.device));
            
            if (isDriveAddin) {
                this.initializeDevice();
            }

            Object.keys(global.geotab.addin).forEach(function (name) {
                global.geotab.addin[name].blur(global.api, global.state);
            });
        });

        this.elDevices.addEventListener('change', (event) => {
            var id = event.target.value;

            event.preventDefault();

            if (id) {
                this.device = {
                    id: id
                };
                global.state.device = this.device;
                localStorage.setItem('_device', JSON.stringify(this.device));
            }
        });

        this.elDevicesOkBtn.addEventListener('click', (event) => {
            event.preventDefault();

            if (this.device) {
                this.initializeAddin(isDriveAddin);

                // in this order becasue zombiejs errors out on close
                this.elDeviceDialog.close();
            }
        });

        if (isDriveAddin) {
            this.elNightModeToggle.addEventListener('click', evt => {
                const NightMode = 'nightMode';
                let app = document.querySelector('#app');
                let body = document.body;

                if (this.elNightModeToggle.checked) {
                    app.classList.add(NightMode);
                    body.classList.add(NightMode);
                } else {
                    app.classList.remove(NightMode);
                    body.classList.remove(NightMode);
                }
            });

            this.elStartStopToggle.addEventListener('click', evt => {                 
                if (this.elStartStopToggle.classList.contains('start')) {
                    this.elStartStopToggle.classList.remove('start');
                    this.elStartStopToggle.classList.add('stop');  
                    this.elStartStopToggle.innerHTML = 'Stop add-in';
                    Object.keys(global.geotab.addin).forEach(function (name) {
                        var addin = global.geotab.addin[name];
                        addin.isInitialize = false;
                    });
                    this.initializeAddin(isDriveAddin);
                } else {
                    this.elStartStopToggle.classList.remove('stop');
                    this.elStartStopToggle.classList.add('start');
                    this.elStartStopToggle.innerHTML = 'Start add-in';
                    Object.keys(global.geotab.addin).forEach(function (name) {
                        global.geotab.addin[name].shutdown(global.api, global.state, function(){});                
                    }); 
                }
            });
        }

        if (!isDriveAddin) {
            this.initializeAddin(isDriveAddin);
            return;
        }
        // mock Drive properties
        global.api.mobile = {
            exists: function () {
                return true;
            },
            getVersion: function () {
                return '1.1.1';
            },
            speak: function (message) {
                if (!('SpeechSynthesisUtterance' in window)) {
                    console.log('This browser does not supports speech synthesis');
                } else {
                    var utterThis = new SpeechSynthesisUtterance(message);
                    utterThis.lang = 'en-US';
                    window.speechSynthesis.speak(utterThis);
                }
            },
            notification: {
                hasPermission: function(){
                    var permission = false;
                    if(Notification.permission === 'granted')
                    {
                        permission = true;
                    }
                    return permission;
                },
                requestPermission: function(){
                    return Notification.requestPermission();
                },
                notify: function(message, title, tag){
                    var notification,
                        options = {
                            title: title,
                            body: message,
                            tag: tag
                        };

                    if (Notification.permission === 'granted') {
                        notification = new Notification(title, options);
                    } else if (Notification.permission !== 'denied') {
                        Notification.requestPermission(function (permission) {
                            if (permission === 'granted') {
                                notification = new Notification(title, options);
                            }
                        });
                    }
                    return notification;
                },
                //tag is used to identify a notification, if a notification with same tag
                // exists and has already been dispalyed, previous notification will be closed
                //and new one will be displayed
                update: function(message, title, tag){
                    var notification,
                        options = {
                            title: title,
                            body: message,
                            tag: tag
                        };
                    notification = new Notification(title, options);
                    return notification;
                },
                cancel: function(notification){
                    notification.close();
                },
            },
            camera: {
                base64: '',
                removeDialog: function() {
                    var imageOptionsDialog = document.getElementById('select-image');
                    var imageOptionsOverlay = document.getElementById('overlay-select-image');
                    var cameraInterfaceDialog = document.getElementById('capture-image');
                    var cameraInterfaceOverlay = document.getElementById('overlay-capture-image');
                    var submitButton = document.getElementById('submitImage');
                    var canvas = document.getElementById('canvas');

                    if (imageOptionsOverlay) {
                        imageOptionsOverlay.remove();
                    }
                    if (cameraInterfaceOverlay) {
                        cameraInterfaceOverlay.remove();
                    }
                    if (imageOptionsDialog) {
                        imageOptionsDialog.remove();
                    }
                    if (cameraInterfaceDialog) {
                        cameraInterfaceDialog.remove();
                    }
                    if (submitButton) {
                        submitButton.remove();
                    }
                    if (canvas) {
                       canvas.remove();
                   }
                },
                setImageUrlFromCanvas: function() {
                    var canvas = document.getElementById('canvas');
                    var video = document.getElementById('player');
                    this.base64 = canvas.toDataURL('image/png');
                    if (video) {
                        video.srcObject.getVideoTracks().forEach(track => track.stop());
                    }
                },
                getImageFromVideoFrame: function() {
                    var canvas = document.getElementById('canvas');
                    var context = canvas.getContext('2d');
                    var video = document.getElementById('player');
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    this.setImageUrlFromCanvas();
                },
                getImageFromUpload: function(evt) {
                    var canvas = document.getElementById('canvas');
                    var context = canvas.getContext('2d');
                    var imageFile = evt.target.files[0];
                    var fileReader = new FileReader();
                    var img = new Image();

                    img.onload = () => {
                        context.canvas.width = img.width;
                        context.canvas.height = img.height;
                        context.drawImage(img, 0, 0, canvas.width, canvas.height);
                        this.setImageUrlFromCanvas();
                    }
                    fileReader.onloadend = () => {
                        img.src = fileReader.result;
                    }
                    fileReader.readAsDataURL(imageFile);
                },
                initializeCameraInterface: function() {
                    var isSupported = 'mediaDevices' in navigator;
                    if (!isSupported) {
                        console.error('Media devices not supported in this browser.');
                        return;
                    }

                    var overlay = document.createElement('div');
                    overlay.setAttribute('class', 'dialog-box-overlay');
                    overlay.setAttribute('id', 'overlay-capture-image');
                    overlay.style.zIndex = '7000';
                    overlay.addEventListener('click', () => {
                        this.removeDialog();
                    }, false);

                    var dialog = document.createElement('div');
                    dialog.setAttribute('class', 'dialog-box');
                    dialog.setAttribute('id', 'capture-image');
                    dialog.style.zIndex = '8000';
                    dialog.setAttribute('aria-modal', 'true');

                    var video = document.createElement('video');
                    video.setAttribute('id', 'player');
                    video.setAttribute('controls', '');
                    video.setAttribute('autoplay', '');
                    video.setAttribute('width', 320);
                    video.setAttribute('height', 240);
                    video.style.marginLeft = 'auto';
                    video.style.marginRight = 'auto';
                    video.style.display = 'block';
                    

                    var innerDialog = document.createElement('div');
                    innerDialog.setAttribute('class', 'dialog-box__inner-wrapper');
                    var dialogContent = document.createElement('div');
                    dialogContent.setAttribute('class', 'dialog-box__inner');
                    dialogContent.setAttribute('id', 'capture-image-inner');
                    dialogContent.appendChild(video);
                    innerDialog.appendChild(dialogContent);
                    dialog.appendChild(innerDialog);

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
                        this.getImageFromVideoFrame();
                        // result is ready to be sent off. Simulate submit image click so 
                        // that promise can be resolved at this point.
                        var submitButton = document.getElementById('submitImage');
                        submitButton.click();

                    });
                    buttonRowDiv.appendChild(captureImageButton);
                    dialog.appendChild(buttonRegion);

                    var constraints = {
                        video: true,
                    };

                    navigator.mediaDevices.getUserMedia(constraints)
                        .then((stream) => {
                            video.srcObject = stream;
                    });
                    
                    dialog.style.position = 'absolute';
                    dialog.style.top = '50%';
                    dialog.style.left = '50%';
                    dialog.style.opacity = 1;
                    dialog.style.transform = 'translate(-50%,-50%)';

                    var app = document.querySelector('#app');
                    app.appendChild(overlay);
                    app.appendChild(dialog);
                    
                },
                initializeImageOptionsInterface: function() {
                    var cameraInterface = document.getElementById('capture-image');
                    if (cameraInterface) {
                        console.log('Removing cameraInterface from the DOM');
                        cameraInterface.remove();
                    }

                    var imageOptionsExists = document.getElementById('select-image') != null;
                    if (imageOptionsExists) {
                        console.log('Image Option Interface already exists');
                        return;
                    }

                    var overlay = document.createElement('div');
                    overlay.setAttribute('class', 'dialog-box-overlay');
                    overlay.setAttribute('id', 'overlay-select-image');
                    overlay.style.zIndex = '7000';
                    overlay.addEventListener('click', () => {
                        this.removeDialog();
                    }, false);

                    var dialog = document.createElement('div');
                    dialog.setAttribute('class', 'dialog-box');
                    dialog.setAttribute('id', 'select-image');
                    dialog.style.zIndex = '8000';
                    dialog.setAttribute('aria-modal', 'true');

                    var titleBar = document.createElement('div');
                    titleBar.setAttribute('class', 'dialog-box__header');
                    var title = document.createElement('span');
                    title.setAttribute('class', 'dialog-box__title heading-3');
                    title.setAttribute('id', 'select-image-title');
                    title.innerHTML = 'Adding Image...';
                    titleBar.appendChild(title);
                    dialog.classList.add('_titled');
                    dialog.appendChild(titleBar);
                    dialog.setAttribute('aria-labelledby', 'select-image-title');

                    let closeButton = document.createElement('button');
                    closeButton.setAttribute('class', 'dialog-box__close-button');
                    closeButton.setAttribute('id', 'closeButton-select-image');
                    dialog.classList.add('_closable');
                    closeButton.innerHTML = '<span style="color: #066ea8">&times</span>';
                    closeButton.setAttribute("aria-label", 'Close');
                    closeButton.addEventListener("click", () => {
                        this.removeDialog();
                    }, false);
                    titleBar.appendChild(closeButton);

                    var innerDialog = document.createElement('div');
                    innerDialog.setAttribute('class', 'dialog-box__inner-wrapper');
                    var dialogContent = document.createElement('div');
                    dialogContent.setAttribute('class', 'dialog-box__inner');
                    dialogContent.setAttribute('id', 'select-image-inner');
                    dialogContent.innerHTML = 'Please choose an option to add an image.';
                    innerDialog.appendChild(dialogContent);
                    dialog.appendChild(innerDialog);

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
                        dialog.remove();
                        overlay.remove();
                        this.initializeCameraInterface();
                    }, false)
                    buttonRowDiv.appendChild(newPictureButton);

                    var uploadPictureInput = document.createElement('input');
                    uploadPictureInput.setAttribute('type', 'file');
                    uploadPictureInput.setAttribute('accept', 'image/*');
                    uploadPictureInput.setAttribute('id', 'file-upload');
                    uploadPictureInput.style.display = 'none';
                    uploadPictureInput.addEventListener('change', (evt) => {
                        this.getImageFromUpload(evt);
                        // result is ready to be sent off. Simulate submit image click so 
                        // that promise can be resolved at this point.
                        var submitButton = document.getElementById('submitImage');
                        setTimeout(() => {
                            submitButton.click();
                        }, 100);

                    });
                    
                    var uploadPictureButton = document.createElement('button');
                    uploadPictureButton.setAttribute('class', 'dialog-box__button');
                    uploadPictureButton.setAttribute('id', 'uploadPicture');
                    uploadPictureButton.innerHTML = 'Upload';
                    uploadPictureButton.addEventListener('click', () => {
                        uploadPictureInput.click();
                    });
                    buttonRowDiv.appendChild(uploadPictureButton);
                    buttonRowDiv.appendChild(uploadPictureInput);
                    dialog.appendChild(buttonRegion);
                    
                    var canvas = document.createElement('canvas');
                    canvas.setAttribute('id', 'canvas');
                    canvas.setAttribute('width', 320);
                    canvas.setAttribute('height', 240);
                    canvas.setAttribute('class', 'hidden');

                    dialog.style.position = 'absolute';
                    dialog.style.top = '50%';
                    dialog.style.left = '50%';
                    dialog.style.opacity = 1;
                    dialog.style.transform = 'translate(-50%,-50%)';
                    dialog.style.msTransform = 'translate(-50%,-50%)';

                    // Used to tie event and promise together. When event occurs, promise resolves.
                    var submitImageButton = document.createElement('button');
                    submitImageButton.setAttribute('id', 'submitImage');
                    submitImageButton.style.display = 'none';

                    var app = document.querySelector('#app');
                    app.appendChild(overlay);
                    app.appendChild(dialog);
                    app.appendChild(canvas);
                    app.appendChild(submitImageButton);

                },
                takePicture: function() {
                    
                    this.base64 = '';
                    this.initializeImageOptionsInterface();
                    var submitButton = document.getElementById('submitImage');

                    return new Promise(resolve => {
                        submitButton.onclick = () => {
                            this.removeDialog();
                            resolve(this.base64);
                        };
                    });
                },
            },
            geolocation: navigator.geolocation
        };

        global.api.user = JSON.parse(localStorage.getItem('_user'));

        // Drive properties
        global.state.device = this.device;
        global.state.driving = true;
        global.state.charging = true;
        global.state.background = false;
        global.state.online = true;
        global.state.deviceCommunicating = true;

        if (!this.device) {
            this.initializeDevice();
        } else {
            this.initializeAddin(isDriveAddin);
        }
    }
}

module.exports = GeotabLogin;
