'use strict';

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
        const self = this;
        global.api = new GeotabApi(function (detailsCallback) {
            self.authenticationCallback = detailsCallback;
            if (!self.elLoginDialog.open) {
                self.elLoginDialog.showModal();
            }
        }, {
            rememberMe: true
        });
    }

    initalizeAddin() {
        Object.keys(global.geotab.addin).forEach(function (name) {
            var addin = global.geotab.addin[name];

            if (addin.isInitialize) {
                addin.focus(global.api, global.state);
            } else {
                addin = typeof addin === 'function' ? global.geotab.addin[name] = addin(global.api, global.state) : addin;
                addin.initialize(global.api, global.state, function () {
                    addin.isInitialize = true;
                    addin.focus(global.api, global.state);
                });
            }
        });
    }

    initializeDevice() {
        let self = this;
        // Mock device for drive addin
        global.api.call('Get', {
            typeName: 'Device',
            resultsLimit: 1000,
            search: {
                fromDate: new Date()
            }
        }, function (devices) {
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
            self.elDevices.innerHTML = '<option>Select Device</option>' + options.join('');
            self.elDeviceDialog.showModal();
        }, function (e) {
            console.error(`Could not get vehicles: ${e.message}`);
        });
    }

    intializeInterface(isDriveAddin) {
        const self = this;

        this.elLoginBtn.addEventListener('click', function (event) {
            var server = self.elServer.value || 'my.geotab.com',
                database = self.elDatabase.value,
                email = self.elEmail.value,
                password = self.elPassword.value;

            event.preventDefault();

            localStorage.setItem('_user', JSON.stringify(email));
            global.api.user = email;

            self.elLoginError.style.display = 'none';

            self.authenticationCallback(server, database, email, password, function (err) {
                self.elLoginDialog.showModal();
                if (err) {
                    self.elLoginError.textContent = err;
                }
                self.elLoginError.style.display = 'block';
            });

            if (!isDriveAddin) {
                self.initalizeAddin();
            }

            self.elLoginDialog.close();
        });

        this.elLogoutBtn.addEventListener('click', function (event) {
            event.preventDefault();

            if (global.api !== undefined) {
                global.api.forget();
            }

            Object.keys(global.geotab.addin).forEach(function (name) {
                global.geotab.addin[name].isInitialize = false;
            });
            self.device = null;
            global.state.device = self.device;
            localStorage.setItem('_device', JSON.stringify(self.device));
            if (isDriveAddin) {
                self.initializeDevice();
            }
            Object.keys(global.geotab.addin).forEach(function (name) {
                global.geotab.addin[name].blur(global.api, global.state);
            });
        });

        this.elDevices.addEventListener('change', function (event) {
            var id = event.target.value;

            event.preventDefault();

            if (id) {
                self.device = {
                    id: id
                };
                global.state.device = self.device;
                localStorage.setItem('_device', JSON.stringify(self.device));
            }
        });

        this.elDevicesOkBtn.addEventListener('click', function (event) {
            event.preventDefault();

            if (self.device) {
                this.initalizeAddin();

                // in this order becasue zombiejs errors out on close
                this.elDeviceDialog.close();
            }
        });

        if (isDriveAddin) {
            this.elNightModeToggle.addEventListener('click', evt => {
                const NightMode = 'nightMode';
                let app = document.querySelector('#app');
                let body = document.body;

                if (self.elNightModeToggle.checked) {
                    app.classList.add(NightMode);
                    body.classList.add(NightMode);
                } else {
                    app.classList.remove(NightMode);
                    body.classList.remove(NightMode);
                }
            });
        }

        if (!isDriveAddin) {
            this.initalizeAddin();
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
            notify: function (message, title, id, jsonData, permanent) {
                var notification,
                    options = {
                        tag: id,
                        body: message,
                        data: jsonData
                    };

                if (!('Notification' in window)) {
                    console.log('This browser does not support notifications');
                } else if (Notification.permission === 'granted') {
                    notification = new Notification(title, options);
                } else if (Notification.permission !== 'denied') {
                    Notification.requestPermission(function (permission) {
                        if (permission === 'granted') {
                            notification = new Notification(title, options);
                        }
                    });
                }
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
            this.initalizeAddin();
        }
    }
}

module.exports = GeotabLogin;