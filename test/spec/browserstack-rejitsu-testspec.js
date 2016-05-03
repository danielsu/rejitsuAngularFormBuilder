//var webdriver = require('browserstack-webdriver');
var webdriver = require( 'selenium-webdriver' );
var fs = require( 'fs' );

webdriver.WebDriver.prototype.saveScreenshot = function ( filename ) {
    return driver.takeScreenshot().then( function ( data ) {
        fs.writeFile( filename, data.replace( /^data:image\/png;base64,/, '' ), 'base64', function ( err ) {
            if ( err ) {
                throw err;
            }
        } );
    } )
};


// Input capabilities
//var capabilities = {
//  'browserName' : 'firefox'//,
//  'browserstack.user' : 'danielsuess1',
//  'browserstack.key' : 'axuqnDpVGW9zyh4cnpV2'
//}

var capabilities = webdriver.Capabilities.chrome();

var driver = new webdriver.Builder().
//  usingServer('http://hub.browserstack.com/wd/hub').
//        withCapabilities( capabilities ).
        build();

describe( 'basic test', function () {
    it( 'should select process item and do click in task form', function () {

        driver.get( 'http://172.20.207.201:3002/pages/main.html' );
        //driver.findElement(webdriver.By.name('q')).sendKeys('BrowserStack');
        //driver.findElement(webdriver.By.name('btnG')).click();
        var processList = driver.findElement( webdriver.By.id( 'processListWrapper' ) );
        expect( processList ).toBeDefined();
        expect( processList ).toEqual('hallo');

        // click on 3rd table row (a process with tasks to do)
        var processRowWithTasks = processList.findElements( webdriver.By.tagName( 'tr' ) ); // elements = plural
        expect( processRowWithTasks ).toBeDefined();
        expect( processRowWithTasks.length ).toBeGreaterThan( 0 );
        expect( processRowWithTasks[2] ).toBeDefined();

        processRowWithTasks[2].click();

        // check details page is shown
        var isDetailsVisible = driver.findElement( webdriver.By.className( 'selectedProcessDetails' ) ).classList.contains( 'ng-hide' );
        console.log( 'Details page is ' + (isDetailsVisible ? '' : 'not' ) + ' visible' );

        // click on detail page 'task'
        // ...

        // check 'approval person field' is currently disabled
        // ...

        // click on 'active approval fields'
        // ...

        // check 'approval person field' is no disabled
        // ...

        //driver.saveScreenshot('snapshot1.png');

        driver.getTitle().then( function ( title ) {
            console.log( title );
        } );

        driver.quit();
    } );
} )
;
