'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var camelCase = require('camelcase');

module.exports = yeoman.Base.extend({

    initializing: function() {
        this.pkg = require('../../package.json');
    },

    prompting: function() {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the spectacular ' + chalk.red('generator-addin') + ' generator!'
        ));

        var prompts = [{
            type: 'input',
            name: 'name',
            message: 'What is the name of your add-in?',
            default: this.appname
        }, {
                type: 'list',
                name: 'path',
                message: 'Select where your add-in will be located in MyGeotab side nav tree: (Geotab Drive specific add-in must choose "Geotab Drive")',
                default: false,
                choices: [{
                    name: 'Root',
                    value: '/'
                }, {
                        name: 'Getting Started',
                        value: 'GettingStartedLink/'
                    }, {
                        name: 'Activity',
                        value: 'ActivityLink/'
                    }, {
                        name: 'Engine & Maintenance',
                        value: 'EngineMaintenanceLink/'
                    }, {
                        name: 'Zones & Messages',
                        value: 'ZoneAndMessagesLink/'
                    }, {
                        name: 'Rules & Groups',
                        value: 'RuleAndGroupsLink/'
                    }, {
                        name: 'Administration',
                        value: 'AdministrationLink/'
                    }, {
                        name: 'Geotab Drive',
                        value: 'DriveAppLink/'
                    }]
            }, {
                type: 'input',
                name: 'menuName',
                message: 'What is the add-in menu item name?',
                default: this.appname
            }, {
                type: 'input',
                name: 'supportEmail',
                message: 'What is the support contact email address for the add-in?',
                default: ''
            }];

        this.prompt(prompts, function(props) { 
            props.camelName = camelCase(props.name);
            props.fileName = props.camelName + '.html';
            props.isDriveAddin = props.path === 'DriveAppLink/';
            this.props = props;
            done();
        }.bind(this));
    },

    writing: {
        gulpfile: function() {
            this.fs.copyTpl(
                this.templatePath('gulpfile.babel.js'),
                this.destinationPath('gulpfile.babel.js'),
                {
                    date: (new Date).toISOString().split('T')[0],
                    name: this.pkg.name,
                    version: this.pkg.version
                }
            );
             
        },

        packageJSON: function() {
            this.fs.copyTpl(
                this.templatePath('_package.json'),
                this.destinationPath('package.json'),
                {
                    name: this.props.camelName
                }
            ); 
        },

        babel: function() {
            this.fs.copy(
                this.templatePath('babelrc'),
                this.destinationPath('.babelrc')
            ); 
        },

        git: function() {
            this.fs.copy(
                this.templatePath('gitignore'),
                this.destinationPath('.gitignore'));

            this.fs.copy(
                this.templatePath('gitattributes'),
                this.destinationPath('.gitattributes')); 
        },

        bower: function() {
            this.fs.copyTpl(
                this.templatePath('_bower.json'),
                this.destinationPath('bower.json'),
                {
                    name: this.props.camelName.toLowerCase()
                }
            );

            this.fs.copy(
                this.templatePath('bowerrc'),
                this.destinationPath('.bowerrc')
            ); 
        },

        index: function() {
            this.fs.copyTpl(
                this.templatePath('app/addin.html'),
                this.destinationPath('app/' + this.props.fileName),
                {
                    title: this.props.name,
                    root: this.props.camelName
                }
            ); 
        },

        config: function() {
            this.fs.copyTpl(
                this.templatePath('app/config.json'),
                this.destinationPath('app/config.json'),
                {
                    title: this.props.name,
                    supportEmail: this.props.supportEmail,
                    url: this.props.fileName,
                    path: this.props.path,
                    menuName: this.props.menuName,
                    root: this.props.camelName
                }
            ); 
        },

        scripts: function() {
             this.fs.copyTpl(
                this.templatePath('app/scripts/main.js'),
                this.destinationPath('app/scripts/main.js'),
                {
                    root: this.props.camelName
                }
            );
        },

        css: function() {
            this.fs.copy(
                this.templatePath('app/styles/main.css'),
                this.destinationPath('app/styles/main.css')
            ); 
        },

        icon: function() {
            this.fs.copy(
                this.templatePath('app/images/icon.svg'),
                this.destinationPath('app/images/icon.svg')
            ); 
        },

        test: function() {
            
            this.fs.copy(
                this.templatePath('test/functional/mocks/mocks.js'),
                this.destinationPath('test/functional/mocks/mocks.js')
            );

            this.fs.copyTpl(
                this.templatePath('test/functional/test.js'),
                this.destinationPath('test/functional/test.js'),
                {
                    isDriveAddin: this.props.isDriveAddin,
                    root: this.props.camelName
                }
            );
            
        },

        dev: function() {
            this.fs.copy(
                this.templatePath('_dev/api.js'),
                this.destinationPath('.dev/api.js')
            );

            this.fs.copy(
                this.templatePath('_dev/login.html'),
                this.destinationPath('.dev/login.html')
            );

            this.fs.copy(
                this.templatePath('_dev/login.js'),
                this.destinationPath('.dev/login.js')
            );

            this.fs.copy(
                this.templatePath('_dev/rison.js'),
                this.destinationPath('.dev/rison.js')
            ); 
        }
    },

    install: function() {
        this.installDependencies();
    }
});
