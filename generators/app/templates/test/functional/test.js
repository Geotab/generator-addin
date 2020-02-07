const puppeteer = require('puppeteer');
const mocks = require('./mocks/mocks.js');
const assert = require('chai').assert;

// JSON-RPC helpers
const rpcRequest = body => {
    let decodedBody = decodeURIComponent(body);
    let json = decodedBody.replace('JSON-RPC=', '');
    return JSON.parse(json);
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

// test
describe('User visits addin', () => {

    let browser,
        page;

    // Open Page
    before(async () => {
        browser = await puppeteer.launch(opts);
        page = await browser.newPage();
        // Allowing puppeteer access to the request - needed for mocks
        await page.setRequestInterception(true);

        // Setup mocks
        await page.on('request', request => {
            if (request.url() === `http://${mocks.server}/apiv1`) {

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
        let loggedIn = await page.evaluate( () => {
            let dialogWindow = document.getElementById("loginDialog");
            return (dialogWindow.style.display = "none" ? true : false);

        })
        if(loggedIn){
            await page.click("#logoutBtn");
        }
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

    <% if (!isDriveAddin) { %>
        <% if (!isButton) { %>
    // Navbar tests
    it('should have a navbar', async () => {
        let navbar = await page.$("#menuId") !== null;
        assert.isTrue(navbar, "Navbar does not exist");
    });

    it('nav bar should collapse', async () => {
        await page.click("#menuToggle");
        let collapsed = await page.evaluate( () => {
            let nav = document.querySelector("#menuId");
            return nav.className.includes("menuCollapsed");
        });
        assert.isTrue(collapsed, "Navbar does not collapse");
    });

    it('nav bar should extend from collapsed state', async () => {
        await page.click("#menuToggle");

        let extended = await page.evaluate( () => {
            let nav = document.querySelector("#menuId");
            return !nav.className.includes("menuCollapsed");
        });
        assert.isTrue(extended, "Navbar did not re-extend");
    });
        <% } %>
    it('blur button should blur addin', async () => {
        await page.click("#toggleBtn");
        let hidden = await page.evaluate( () => {
            let toggled = false;
            let addin = document.getElementById("<%= root%>");
            if(addin.className.includes("hidden")){
                toggled = true;
            }
            return toggled;
        });
        assert.isTrue(hidden, "add-in is hidden");
    });

    it('focus button should focus addin', async () => {
        await page.click("#toggleBtn");

        let hidden = await page.evaluate( () => {
            let toggled = false;
            let addin = document.getElementById("<%= root%>");
            if(addin.className.includes("hidden")){
                toggled = true;
            }
            return toggled;
        });
        assert.isFalse(hidden, "add-in is hidden");
    });
    <% } %>
    // Mock function tests
    it('should authenticate api', async () => {
        let success = await page.evaluate( () => {
            let authenticated = false;
            api.getSession( (credentials, server) => {
                if(server !== "undefined" && credentials !== "undefined"){
                    authenticated = true;
                }
            });
            return authenticated;
        });
        assert.isTrue(success, "api is not authenticating properly");
    })

    it('add-in should exist in geotab object', async () => {
        let keyLength = await page.evaluate( () => {
            <% if (isButton) { %>
            let len = Object.keys(geotab.customButtons).length
            <% } else { %>
            let len = Object.keys(geotab.addin).length
            <% } %>
            return len;
        });
        assert.isTrue(keyLength > 0, `Add-in is not present in mock backend`);
    });  

    it('should load the state object', async () => {
        let state = await page.evaluate( () => {
            let stateExists = typeof state == "object";
            return stateExists;
        });
        assert.isTrue(state, "State is not defined");
    });

    // Tests Finished
    after(async () => {
        await browser.close();
    });

    <% if (isDriveAddin) { %>
        // Optional setup for Drive apps -> Selecting the device used
        // select a device (only part of local add-in debugging)
        before(done => {
            browser
                .click('option[value="' + mocks.device.id + '"]')
                .click('#okBtn');
        });
    <% } %>
});
