var pkg = require('./package.json');
require('./src/scss/scoped-theme.scss');

module.exports = {
  themeName: `${pkg.name}`
}
