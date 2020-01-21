const puppeteer = require('puppeteer');
const mocks = require('./mocks/mocks.js');
const assert = require('chai').assert;

// JSON-RPC helpers
const rpcRequest = body => {
    return JSON.parse(body['JSON-RPC']);
};

const rpcResponse = (response, err) => {
    return {
        id: -1,
        result: response,
        error: err
    };
};

// puppeteer options
const opts = {
    headless: true,
    slowMo: 0,
    timeout: 10000
};

// Mocks
const mockServer = mocks.server;
const responseHeaders = {
    'Access-Control-Allow-Origin': '*'
};

// test
describe('User visits addin', () => {

    let browser,
        page;

    // Open Page
    before(async () => {
        browser = await puppeteer.launch(opts);
        const context = browser.defaultBrowserContext();
        page = await browser.newPage();
        // Allowing puppeteer access to the request - needed for mocks
        await page.setRequestInterception(true);

        // Setup mocks
        await page.on('request', request => {
            if (request.url() === `https://${mocks.server}/apiv1`) {

                let rpcBody = rpcRequest(request.postData());
                let payload = '';

                switch (rpcBody.method) {
                    case 'Authenticate':
                        payload = mocks.credentials;
                        break;
                    case 'Get':
                        switch (rpcBody.params.typeName) {
                            case 'Device':
                                payload = [mocks.device];
                                break;
                            case 'User':
                                payload = [mocks.user];
                                break;
                        }
                }

                request.respond({
                    content: 'application/json',
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify(rpcResponse(payload))
                });
            } else {
                request.continue();
            }
        });

        // Login
        await page.goto('http://localhost:9000/'); 
        await page.waitFor('#loginDialog');
        await page.type('#email', mocks.login.userName);
        await page.type('#password', mocks.login.password);
        await page.type('#database', mocks.login.database);
        await page.type('#server', mocks.server);
        await page.click('#loginBtn');
    });

    // Confirm page has loaded
    it('should be loaded', async () => {
        await page.waitFor('html', {
            visible: true
        });      
    });
  
   // Confirm page displaying after initialized and focus is called
    it('should display root div', async () => {
        await page.waitFor('#<%= root %>', {
            visible: true
        });   
    });

    // Tests Finished
    after(async () => {
        await browser.close();
    });

    // Optional setup for Drive apps -> Selecting the device used
    <% if (isDriveAddin) { %>
        // select a device (only part of local add-in debugging)
        before(done => {
            browser
                .click('option[value="' + mocks.device.id + '"]')
                .click('#okBtn');
        });
    <% } %>
});
