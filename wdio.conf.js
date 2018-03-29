/* eslint-disable import/no-extraneous-dependencies */
const wdioConf = require('terra-toolkit/lib/wdio/conf');
const ExpressDevService = require('terra-toolkit/lib/wdio/services/index').ExpressDevService;
const localIP = require('ip');
const path = require('path');
const webpackConfig = require('./webpack.config');

const webpackPort = 8080;

// Flex specs search between local pacakge and repo
let specs = path.join('tests', 'wdio', '**', '*-spec.js');
if (__dirname === process.cwd()) {
  specs = path.join('packages', '*', specs);
}

const config = {
  ...wdioConf.config,

  baseUrl: `http://${localIP.address()}:${webpackPort}`,
  specs,

  seleniumDocker: {
    enabled: !process.env.TRAVIS,
  },

  // Ignore deprecation warnings. When chrome supports /actions API we'll update to use those.
  deprecationWarnings: false,

  webpackConfig,

  axe: {
    inject: true,
    options: {
      rules: [{
        id: 'landmark-one-main',
        enabled: false,
      }],
    },
  },

  terra: {
    selector: '[data-terra-dev-site-content] *:first-child',
  },
  
  // Define suites
  suites: {
    suite1: [
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-alert/tests/wdio/**/*-spec.js',
      'packages/terra-arrange/tests/wdio/**/*-spec.js',
      'packages/terra-avatar/tests/wdio/**/*-spec.js',
      'packages/terra-badge/tests/wdio/**/*-spec.js',
      'packages/terra-base/tests/wdio/**/*-spec.js',
      'packages/terra-button-group/tests/wdio/**/*-spec.js',
      'packages/terra-button/tests/wdio/**/*-spec.js',
      'packages/terra-card/tests/wdio/**/*-spec.js',
      'packages/terra-collapsible-menu-view/tests/wdio/**/*-spec.js',
    ],
    suite2: [
      'packages/terra-content-container/tests/wdio/**/*-spec.js',
      'packages/terra-date-picker/tests/wdio/**/*-spec.js',
      'packages/terra-date-time-picker/tests/wdio/**/*-spec.js',
      'packages/terra-demographics-banner/tests/wdio/**/*-spec.js',
      'packages/terra-dialog/tests/wdio/**/*-spec.js',
      'packages/terra-divider/tests/wdio/**/*-spec.js',
      'packages/terra-dynamic-grid/tests/wdio/**/*-spec.js',
      'packages/terra-embedded-content-container/tests/wdio/**/*-spec.js',
      'packages/terra-form-checkbox/tests/wdio/**/*-spec.js',
      'packages/terra-form-field/tests/wdio/**/*-spec.js',
    ],
    suite3: [
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
    ],
    suite4: [
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
    ],
    suite5: [
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
    ],
    suite6: [
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
      'packages/terra-action-footer/tests/wdio/**/*-spec.js',
    ],
  },

  beforeHook() {
    // Being Terra tests are executed on an SPA, a full refresh is required
    // in order to reset the site. This ensures customProperty tests and any
    // other dom modifications are cleared before starting a test.
    global.browser.refresh();
  },
};

config.services = wdioConf.config.services.concat([ExpressDevService]);
exports.config = config;
