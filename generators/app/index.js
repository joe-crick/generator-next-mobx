'use strict';
const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {

  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'Please enter your project\'s name',
      default: this.appname
    }]).then(props => {
      this.props = props;
    });
  }

  writing() {
    const baselineFolders = ['pages', 'stores', 'components'];
    const files = ['.babelrc', '.gitignore', 'server.js', 'readme.md'];

    baselineFolders.forEach(folder => {
      mkdirp(folder);
    });

    files.forEach(file => {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file)
      );
    });

    const pkg = {
      name: this.props.name,
      version: '1.0.0',
      description: '',
      main: 'index.js',
      scripts: {
        dev: 'node server.js',
        build: 'next build',
        start: 'NODE_ENV=production node server.js'
      },
      keywords: [],
      author: '',
      license: 'ISC'
    };

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }

  install() {
    this.npmInstall(['next', 'react', 'react-dom', 'mobx', 'mobx-react', 'axios'], {save: true});
    this.npmInstall(['babel-plugin-transform-decorators-legacy', 'babel-plugin-root-import', 'mobx-react-devtools'], {'save-dev': true});
  }

  end() {
    this.spawnCommandSync('git', ['init']);
    this.spawnCommandSync('git', ['add', '.']);
    this.spawnCommandSync('git', ['commit', '-m', '"Baseline"']);
  }

};
