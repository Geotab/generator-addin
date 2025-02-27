import Generator from 'yeoman-generator'
import chalk from 'chalk'
import yosay from 'yosay'
import camelCase from 'camelcase'
import { createRequire } from 'module';
import { mygPageCategories, mygButtonCategories } from './utils/mygCategories.js'
const require = createRequire(import.meta.url);
const packageJson = require('../../package.json');

/**
 * As per release 2.0.0 (https://github.com/yeoman/generator/releases/tag/v2.0.0) .extends was depreciated in favor of es6 classes
 * 
 * This rebuild was necessary due to other breaking changes in yeoman-test updates (https://github.com/yeoman/yeoman-test/issues/43)
 * 
 * More info on the class system for yeoman: https://yeoman.io/authoring/#extending-generator
 */
export default class extends Generator {

  constructor(args, opts) {
    super(args, opts);

    this.env.options.nodePackageManager = 'npm';
  }

  initializing() {
    this.pkg = packageJson;
  }

  _generateGuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return (
      s4() +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      s4() +
      s4()
    )
  }

  _getAddinId = () => (
    new Promise((resolve, reject) => {
      var encoded = Buffer.from(this._generateGuid()).toString('base64')
      for (var i = 0; i < 22; i++) {
        switch (encoded[i].charCodeAt(0)) {
          case 47:
            encoded[i] = '\u005F'
            break
          case 43:
            encoded[i] = '-'
            break
        }
      }
      resolve('a' + encoded.substring(1, 23));
    })
  )

  async prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      chalk.blue('Add-in Generator ') + chalk.green(`(v${this.pkg.version})`)
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'What is the name of your add-in?',
      default: this.appname
    }, {
      type: 'confirm',
      name: 'isReactBased',
      message: 'Are you using React to develop this add-in?'
    }, {
      type: 'list',
      name: 'type',
      message: 'What type of add-in do you want to create?',
      default: 'MyGeotabPage',
      choices: [{
        name: 'MyGeotab Add-In Page',
        value: 'MyGeotabPage'
      }, {
        name: 'MyGeotab Add-In Button',
        value: 'MyGeotabButton'
      }, {
        name: 'Geotab Drive Add-In Page',
        value: 'DrivePage'
      }]
    }, {
      type: 'input',
      name: 'supportEmail',
      message: 'What is the support contact email address for the add-in?',
      default: ''
    }, {
      type: 'input',
      name: 'host',
      message: 'What is the deployment host URL?',
      default: 'https://www.example.com/myaddin/'
    }];

    // Getting the props values that yeoman stored before
    this.props = await this.prompt(prompts);
  }

  async processAnswers() {
    this.props.camelName = camelCase(this.props.name);

    if (this.props.host && this.props.host.indexOf('/', this.props.host.length - 1) === -1) {
      this.props.host += '/';
    }

    var MyGeotabPagePrompts = [{
      type: 'list',
      name: 'path',
      message: 'Select where your add-in will be located in MyGeotab side nav tree: (Geotab Drive specific add-in must choose "Geotab Drive")',
      default: false,
      choices: mygPageCategories
    }, {
      type: 'input',
      name: 'menuName',
      message: 'What is the add-in menu item name?',
      default: this.appname
    }];

    var MyGeotabButtonPrompts = [{
      type: 'list',
      name: 'page',
      message: 'Select which page your add-in button will be located in MyGeotab',
      default: 'Map',
      choices: mygButtonCategories
    }, {
      type: 'input',
      name: 'menuName',
      message: 'What is the add-in button text?',
      default: this.appname
    }];

    let nextPrompts;
    switch (this.props.type) {
      case 'MyGeotabPage':
        nextPrompts = MyGeotabPagePrompts;
        break;
      case 'MyGeotabButton':
        nextPrompts = MyGeotabButtonPrompts;
        this.props.isButton = true;
        break;
      case 'DrivePage':
        nextPrompts = [MyGeotabPagePrompts[1]];
        this.props.isDriveAddin = true;
        this.props.path = 'DriveAppLink/'
        break;
    }

    let secondaryAnswers = await this.prompt(nextPrompts);
    Object.assign(this.props, secondaryAnswers);
  }

  async reactPrompts() {
    const { isReactBased } = this.props;
    if (!isReactBased) return

    let reactAnswers = await this.prompt([{
      type: 'confirm',
      name: 'isZenithBased',
      message: 'Do you want to use Zenith components to develop the add-in?',
      default: 'y'
    }])

    Object.assign(this.props, reactAnswers);
  }

  async typeScriptPrompts() {
    const { isZenithBased } = this.props;
    if (!isZenithBased) return

    let typeScriptAnswers = await this.prompt([{
      type: 'confirm',
      name: 'isTypeScriptBased',
      message: 'Do you want to use TypeScript along with Zenith components to develop the add-in?',
      default: 'y'
    }])

    Object.assign(this.props, typeScriptAnswers);
  }

  reactFiles() {
    const { isReactBased, isTypeScriptBased } = this.props;
    const isDriveAddin = this.props.isDriveAddin ? this.props.isDriveAddin : false
    if (!isReactBased) return

    if (isTypeScriptBased) {
      this.fs.copyTpl(
        this.templatePath('react/typeScript/tsconfig.json'),
        this.destinationPath('tsconfig.json'),
      );
      this.fs.copyTpl(
        this.templatePath('react/typeScript/addinContext.ts'),
        this.destinationPath('src/app/scripts/contexts/addinContext.ts'),
      );
      this.fs.copyTpl(
        this.templatePath('react/typeScript/index.css'),
        this.destinationPath('src/app/styles/index.css'),
      );

      if (!isDriveAddin) {
        this.fs.copyTpl(
          this.templatePath('react/typeScript/mygPage/data.ts'),
          this.destinationPath('src/app/scripts/data.ts'),
        );
        this.fs.copyTpl(
          this.templatePath('react/typeScript/mygPage/App.tsx'),
          this.destinationPath('src/app/scripts/components/App.tsx'),
        );
        this.fs.copyTpl(
          this.templatePath('react/typeScript/mygPage/ProgressChart.tsx'),
          this.destinationPath('src/app/scripts/components/ProgressChart.tsx'),
        );
        this.fs.copyTpl(
          this.templatePath('react/typeScript/mygPage/ZenithSummary.tsx'),
          this.destinationPath('src/app/scripts/components/ZenithSummary.tsx'),
        );
        this.fs.copyTpl(
          this.templatePath('react/typeScript/mygPage/zenithSummary.css'),
          this.destinationPath('src/app/styles/zenithSummary.css'),
        );
      } else {
        this.fs.copyTpl(
          this.templatePath('react/typeScript/drive/App.tsx'),
          this.destinationPath('src/app/scripts/components/App.tsx'),
        );
        this.fs.copyTpl(
          this.templatePath('react/typeScript/drive/Tab1Content.tsx'),
          this.destinationPath('src/app/scripts/components/Tab1Content.tsx'),
        );
        this.fs.copyTpl(
          this.templatePath('react/typeScript/drive/Tab2Content.tsx'),
          this.destinationPath('src/app/scripts/components/Tab2Content.tsx'),
        );
        this.fs.copyTpl(
          this.templatePath('react/typeScript/drive/app.css'),
          this.destinationPath('src/app/styles/app.css'),
        );
      }

      return
    }

    this.fs.copyTpl(
      this.templatePath('react/components/App.jsx'),
      this.destinationPath('src/app/scripts/components/App.jsx'),
      {
        isZenithBased: this.props.isZenithBased ? this.props.isZenithBased : false,
        isDriveAddin,
      }
    );

    if (this.props.isZenithBased) {
      if (isDriveAddin) {
        this.fs.copyTpl(
          this.templatePath('react/components/DutyStatusLogs.jsx'),
          this.destinationPath('src/app/scripts/components/DutyStatusLogs.jsx')
        );
      } else {
        this.fs.copyTpl(
          this.templatePath('react/components/DevicesPage.jsx'),
          this.destinationPath('src/app/scripts/components/DevicesPage.jsx')
        );
      }
    } else {
      this.fs.copyTpl(
        this.templatePath('react/components/DevicePage.jsx'),
        this.destinationPath('src/app/scripts/components/DevicePage.jsx')
      );
    }

    this.fs.copyTpl(
      this.templatePath('react/contexts/Geotab.js'),
      this.destinationPath('src/app/scripts/contexts/Geotab.js')
    );
  }

  webpack() {
    const webpackDevPath = 'webpack.dev.js'
    const webpackProdPath = 'webpack.config.js'
    const { isReactBased, isTypeScriptBased } = this.props;

    this.fs.copyTpl(
      this.templatePath(webpackDevPath),
      this.destinationPath(webpackDevPath),
      {
        isReactBased,
        isTypeScriptBased,
        date: new Date().toISOString().split('T')[0],
        name: this.props.camelName,
        pkgname: this.pkg.name,
        version: this.pkg.version,
        isButton: this.props.isButton,
      },
    )

    this.fs.copyTpl(
      this.templatePath(webpackProdPath),
      this.destinationPath(webpackProdPath),
      {
        isReactBased,
        isTypeScriptBased,
        date: new Date().toISOString().split('T')[0],
        name: this.props.camelName,
        pkgname: this.pkg.name,
        version: this.pkg.version,
        isButton: this.props.isButton,
        isDriveAddin: this.props.isDriveAddin,
      },
    )
  }

  packageJSON() {
    const { isReactBased, isTypeScriptBased } = this.props;
    const packageJsonPath = isReactBased ? 'react/_package.json' : '_package.json'
    this.fs.copyTpl(
      this.templatePath(packageJsonPath),
      this.destinationPath('package.json'), {
      name: this.props.camelName,
      isButton: this.props.isButton,
      isDriveAddin: this.props.isDriveAddin,
      isZenithBased: this.props.isZenithBased ? this.props.isZenithBased : false,
      isTypeScriptBased,
    }
    );
  }

  git() {
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore'));

    this.fs.copy(
      this.templatePath('gitattributes'),
      this.destinationPath('.gitattributes'));
  }

  index() {
    var indexLocation = `src/app/${this.props.camelName}.html`;
    this.fs.copyTpl(
      this.templatePath('src/app/index.html'),
      this.destinationPath(indexLocation), {
      title: this.props.name,
      root: this.props.camelName,
      isDriveAddin: this.props.isDriveAddin,
      isButton: this.props.isButton,
      click: this.props.camelName + (this.props.isButton ? '.js' : '.html')
    }
    );
  }

  app() {
    this.fs.copyTpl(
      this.templatePath('src/app/index.js'),
      this.destinationPath('src/app/index.js'), {
      root: this.props.camelName,
      isButton: this.props.isButton
    }
    );
  }

  configuration() {
    this.fs.copyTpl(
      this.templatePath('src/config.json'),
      this.destinationPath('src/config.json'),
      {
        name: this.props.name,
        supportEmail: this.props.supportEmail,
        url: this.props.camelName + (this.props.isButton ? '.js' : '.html'),
        path: this.props.path,
        page: this.props.page,
        menuName: this.props.menuName,
        root: this.props.camelName,
        host: this.props.host,
        isButton: this.props.isButton,
        isTab: this.props.isTab,
        tabTitle: this.props.tabTitle,
        isDriveAddin: this.props.isDriveAddin,
        hasStartup: this.props.hasStartup,
        hasShutdown: this.props.hasShutdown,
      },
    )
  }

  scripts() {
    const { isReactBased, isTypeScriptBased } = this.props;

    if (this.props.isButton) {
      this.fs.copyTpl(
        this.templatePath('src/app/scripts/button.js'),
        this.destinationPath('src/app/scripts/' + this.props.camelName + '.js'), {
        root: this.props.camelName
      }
      );
    } else if (isTypeScriptBased) {
      this._getAddinId().then(addInId => {
        this.fs.copyTpl(
          this.templatePath('react/typeScript/mygPage/main.js'),
          this.destinationPath('src/app/scripts/main.js'), {
          isReactBased,
          isTypeScriptBased,
          addInId,
          root: this.props.camelName,
          isDriveAddin: this.props.isDriveAddin
        }
        );
      });
    } else {
      this._getAddinId().then(addInId => {
        this.fs.copyTpl(
          this.templatePath('src/app/scripts/main.js'),
          this.destinationPath('src/app/scripts/main.js'), {
          isReactBased,
          isTypeScriptBased,
          addInId,
          root: this.props.camelName,
          isDriveAddin: this.props.isDriveAddin
        }
        );
      });
    }
  }

  css() {
    if (!this.props.isButton) {
      this.fs.copyTpl(
        this.templatePath('src/app/styles/main.css'),
        this.destinationPath('src/app/styles/main.css'), {
        isDriveAddin: this.props.isDriveAddin
      }
      );
    }
  }

  icon() {
    this.fs.copy(
      this.templatePath('src/app/images/icon.svg'),
      this.destinationPath('src/app/images/icon.svg')
    );
  }

  utils() {
    this.fs.copy(
      this.templatePath('zip.util.js'),
      this.destinationPath('zip.util.js')
    );

    this.fs.copy(
      this.templatePath('src/app/scripts/utils/logger.js'),
      this.destinationPath('src/app/scripts/utils/logger.js')
    );
  }

  dev() {
    // Base
    this.fs.copy(
      this.templatePath('src/.dev/api.js'),
      this.destinationPath('src/.dev/api.js')
    );

    this.fs.copy(
      this.templatePath('src/.dev/rison.js'),
      this.destinationPath('src/.dev/rison.js')
    );

    this.fs.copyTpl(
      this.templatePath('src/.dev/index.js'),
      this.destinationPath('src/.dev/index.js'), {
      root: this.props.camelName,
      isButton: this.props.isButton,
      isDriveAddin: this.props.isDriveAddin
    }
    );

    this.fs.copy(
      this.templatePath('src/.dev/state.js'),
      this.destinationPath('src/.dev/state.js')
    );

    if (!this.props.isButton && !this.props.isDriveAddin) {
      // Group Filter
      this.fs.copy(
        this.templatePath('src/.dev/groups/_GroupHelper.js'),
        this.destinationPath('src/.dev/groups/_GroupHelper.js')
      );

      this.fs.copy(
        this.templatePath('src/.dev/groups/GroupListeners.js'),
        this.destinationPath('src/.dev/groups/GroupListeners.js')
      );

      this.fs.copyTpl(
        this.templatePath('src/.dev/groups/Groups.js'),
        this.destinationPath('src/.dev/groups/Groups.js'),
        {
          root: this.props.camelName
        }
      );

      // Languages
      this.fs.copy(
        this.templatePath('src/.dev/lang/Translator.js'),
        this.destinationPath('src/.dev/lang/Translator.js'),
      );

      this.fs.copy(
        this.templatePath('src/.dev/lang/languages.js'),
        this.destinationPath('src/.dev/lang/languages.js'),
      );

      this.fs.copy(
        this.templatePath('src/.dev/lang/ListMaker.js'),
        this.destinationPath('src/.dev/lang/ListMaker.js'),
      );

      this.fs.copy(
        this.templatePath('src/.dev/lang/TranslationHelper.js'),
        this.destinationPath('src/.dev/lang/TranslationHelper.js'),
      );

      this.fs.copyTpl(
        this.templatePath('src/app/translations/template.json'),
        this.destinationPath('src/app/translations/template.json'),
        {
          root: this.props.camelName
        }
      )
    }

    // Login
    this.fs.copyTpl(
      this.templatePath('src/.dev/login/loginTemplate.js'),
      this.destinationPath('src/.dev/login/loginTemplate.js'), {
      isDriveAddin: this.props.isDriveAddin,
      isButton: this.props.isButton,
      root: this.props.camelName
    }
    );

    this.fs.copyTpl(
      this.templatePath('src/.dev/login/loginLogic.js'),
      this.destinationPath('src/.dev/login/loginLogic.js'), {
      isButton: this.props.isButton,
      isDriveAddin: this.props.isDriveAddin,
      root: this.props.camelName
    }
    );

    if (this.props.isDriveAddin) {
      this.fs.copyTpl(
        this.templatePath('src/.dev/login/takePictureDialog/Dialog.js'),
        this.destinationPath('src/.dev/login/takePictureDialog/Dialog.js'), {
        root: this.props.camelName
      }
      );

      this.fs.copyTpl(
        this.templatePath('src/.dev/login/takePictureDialog/UploadImageDialog.js'),
        this.destinationPath('src/.dev/login/takePictureDialog/UploadImageDialog.js'), {
        root: this.props.camelName
      }
      );

      this.fs.copyTpl(
        this.templatePath('src/.dev/login/takePictureDialog/CaptureImageDialog.js'),
        this.destinationPath('src/.dev/login/takePictureDialog/CaptureImageDialog.js'), {
        root: this.props.camelName
      }
      );
    }

    // Navbar      
    this.fs.copyTpl(
      this.templatePath('src/.dev/navbar/navbar.js'),
      this.destinationPath('src/.dev/navbar/navbar.js'), {
      root: this.props.camelName,
    }
    );

    this.fs.copyTpl(
      this.templatePath('src/.dev/navbar/NavBuilder.js'),
      this.destinationPath('src/.dev/navbar/NavBuilder.js'), {
      root: this.props.camelName,
      isButton: this.props.isButton,
      isDriveAddin: this.props.isDriveAddin
    }
    );

    this.fs.copyTpl(
      this.templatePath('src/.dev/navbar/NavFactory.js'),
      this.destinationPath('src/.dev/navbar/NavFactory.js'), {
      root: this.props.camelName,
      isButton: this.props.isButton
    }
    );

    this.fs.copyTpl(
      this.templatePath('src/.dev/navbar/NavHandler.js'),
      this.destinationPath('src/.dev/navbar/NavHandler.js'), {
      root: this.props.camelName,
      isButton: this.props.isButton
    }
    );

    this.fs.copyTpl(
      this.templatePath('src/.dev/navbar/props.js'),
      this.destinationPath('src/.dev/navbar/props.js'), {
      path: this.props.path,
      root: this.props.camelName,
      label: this.props.menuName
    }
    );

    // Loaders
    this.fs.copy(
      this.templatePath('src/.dev/loaders/css-sandbox/css-sandbox.js'),
      this.destinationPath('src/.dev/loaders/css-sandbox/css-sandbox.js')
    );

    // Other
    this.fs.copy(
      this.templatePath('src/.dev/images/Font_Awesome_5_solid_chevron-left.svg'),
      this.destinationPath('src/.dev/images/Font_Awesome_5_solid_chevron-left.svg')
    );

    this.fs.copy(
      this.templatePath('src/.dev/images/close-round.svg'),
      this.destinationPath('src/.dev/images/close-round.svg')
    );

    this.fs.copy(
      this.templatePath('src/.dev/styles/styleGuide.css'),
      this.destinationPath('src/.dev/styles/styleGuide.css')
    );

    this.fs.copy(
      this.templatePath('src/.dev/styles/styleGuideMyGeotab.html'),
      this.destinationPath('src/.dev/styles/styleGuideMyGeotab.html')
    );

    this.fs.copyTpl(
      this.templatePath('src/.dev/ToggleHandler.js'),
      this.destinationPath('src/.dev/ToggleHandler.js'),
      {
        root: this.props.camelName,
      }
    )

    this.fs.copyTpl(
      this.templatePath('src/.dev/advancedGroupFilter/advancedGroupFilter.js'),
      this.destinationPath('src/.dev/advancedGroupFilter/advancedGroupFilter.js'), {
      root: this.props.camelName
    }
    );

    this.fs.copyTpl(
      this.templatePath('src/.dev/advancedGroupFilter/advancedGroupFilterListener.js'),
      this.destinationPath('src/.dev/advancedGroupFilter/advancedGroupFilterListener.js'), {
      root: this.props.camelName
    }
    );
  }

  end() {
    // Run npm install again to resolve dependencies.
    this.log('\n' + chalk.green('(generator-addin) Resolving dependencies...'));
    this.spawnCommand('npm', ['audit', 'fix']);
  }
};
