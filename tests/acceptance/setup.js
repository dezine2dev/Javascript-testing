import { remote } from 'webdriverio';
import Mugshot from 'mugshot';
import WebdriverIOAdapter from 'mugshot-webdriverio';
import path from 'path';


const { BROWSER } = process.env;
let mugshot;

before(function() {
  this.timeout(10 * 1000);

  const options = {
    host: 'selenium',
    desiredCapabilities: { browserName: BROWSER }
  };

  global.browser = remote(options).init();

  const adapter = new WebdriverIOAdapter(global.browser);
  mugshot = new Mugshot(adapter, {
    rootDirectory: path.join(__dirname, 'screenshots', BROWSER),
    acceptFirstBaseline: false
  });

  return global.browser;
});

async function checkForVisualChanges(test, name, selector = '.todoapp') {
  // TODO: defocus the add todo field because the _blinking_ caret is causing
  // the tests to be flaky; remove when Firefox 53 is released and leave it to
  // caret-color: transparent.
  return global.browser.click('.header h1').then(() => new Promise(resolve => {
    try {
      mugshot.test({ name, selector }, (err, result) => {
        if (err) {
          test.error(err);
          resolve();
          return;
        }

        if (!result.isEqual) {
          // If we reject the promise Mocha will halt the suite. Workaround from
          // https://github.com/mochajs/mocha/issues/1635#issuecomment-191019928
          test.error(new Error('Visual changes detected. Check screenshots'));
        }

        resolve();
      });
    } catch (e) {
      test.error(e);
      resolve();
    }
  }));
}

beforeEach(function() {
  return global.browser.url('http://app:3000/')
    // Wait for webpack to build the app.
    .then(() => global.browser.waitForVisible('.todoapp', 5 * 1000));
});

afterEach(function() {
  return checkForVisualChanges(this.test, this.currentTest.fullTitle());
});


after(function() {
  return global.browser.end();
});
