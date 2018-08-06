const execSync = require('child_process').execSync;
var compressor = require('node-minify');
var pug = require('pug');
var path = require('path');
var fs = require('fs');

const Bundler = require('parcel-bundler');
require('parcel-bundler');

var finished = function (output, callback = false) {
    console.log(output);
    if (typeof(callback) === 'function') {
        callback();
    }
};

/*      PARCEL      */

var buildParcelJS = function () {
    
    const file = path.join(__dirname, './bundleJS.js');
    
    const options = {
        outDir: './public/javascripts', // The out directory to put the build files in, defaults to dist
        outFile: 'bundle.js', // The name of the outputFile
        publicUrl: './', // The url to server on, defaults to dist
        watch: true, // whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
        cache: true, // Enabled or disables caching, defaults to true
        cacheDir: '.cache', // The directory cache gets put in, defaults to .cache
        contentHash: false, // Disable content hash from being included on the filename
        minify: false, // Minify files, enabled if process.env.NODE_ENV === 'production'
        target: 'browser', // browser/node/electron, defaults to browser
        https: false, // Serve files over https or http, defaults to false
        logLevel: 3, // 3 = log everything, 2 = log warnings & errors, 1 = log errors
        hmrPort: 0, // The port the HMR socket runs on, defaults to a random free port (0 in node.js resolves to a random free port)
        sourceMaps: true, // Enable or disable sourcemaps, defaults to enabled (not supported in minified builds yet)
        hmrHostname: '', // A hostname for hot module reload, default to ''
        detailedReport: false // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
    };
    async function runBundle() {
        // Initializes a bundler using the entrypoint location and options provided
        const bundler = new Bundler(file, options);
        
        // Run the bundler, this returns the main bundle
        // Use the events if you're using watch mode as this promise will only trigger once and not for every rebuild
        const bundle = await bundler.bundle();
    }
    
    try {
        runBundle();
    } catch (err) {
        console.log("runBundle error", err);
    }
    
};

var buildParcelSCSS = function () {
    const file = path.join(__dirname, './public/scss/style.scss');
    
    const options = {
        outDir: './public/stylesheets', // The out directory to put the build files in, defaults to dist
        outFile: 'bundle.css', // The name of the outputFile
        publicUrl: './', // The url to server on, defaults to dist
        watch: true, // whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
        cache: true, // Enabled or disables caching, defaults to true
        cacheDir: '.cache', // The directory cache gets put in, defaults to .cache
        contentHash: false, // Disable content hash from being included on the filename
        minify: false, // Minify files, enabled if process.env.NODE_ENV === 'production'
        target: 'browser', // browser/node/electron, defaults to browser
        https: false, // Serve files over https or http, defaults to false
        logLevel: 3, // 3 = log everything, 2 = log warnings & errors, 1 = log errors
        hmrPort: 0, // The port the HMR socket runs on, defaults to a random free port (0 in node.js resolves to a random free port)
        sourceMaps: true, // Enable or disable sourcemaps, defaults to enabled (not supported in minified builds yet)
        hmrHostname: '', // A hostname for hot module reload, default to ''
        detailedReport: false // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
    };
    async function runBundle() {
        // Initializes a bundler using the entrypoint location and options provided
        const bundler = new Bundler(file, options);
        
        // Run the bundler, this returns the main bundle
        // Use the events if you're using watch mode as this promise will only trigger once and not for every rebuild
        const bundle = await bundler.bundle();
    }
    
    try {
        runBundle();
    } catch (err) {
        console.log("runBundle error", err);
    }
};

var buildTemplate = function (event, filepath) {
    var filename = false;
    console.log('filepath', filepath);
    if (filepath) {
        filename = _.last(filepath.split('\\'));
    }
    // console.log('buildTemplate', event, filepath, filename);
    var markup = pug.renderFile(filepath, {name: filepath});
    
    // console.log('   markup', markup);
    
    fs.writeFile('./public/' + filename.replace('.pug', '') + '.html', markup, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log('markup saved');
    });
};

/*      SCSS        */
var watchDirSCSS = './public/scss/';
console.log('<  watchDirSCSS   >', watchDirSCSS);
var timeoutFix = true;
require('chokidar').watch(watchDirSCSS, {ignored: /[\/\\]\./}).on('change', function (event, path) {
    // console.log('buildSCSS');
    if (timeoutFix === true) {
        timeoutFix = false;
        // buildSCSS(watchDirSCSS);
        buildParcelSCSS();
        setTimeout(function () {    timeoutFix = true; }, 100);
    }
});

/*      JAVASCRIPT      */
var watchDirJS = './public/js/';
console.log('<  watchDirJS   >', watchDirJS);
require('chokidar').watch(watchDirJS, {ignored: /[\/\\]\./}).on('change', function(event, path) {
    // console.log('buildJS');
    // buildJS(watchDirJS);
    buildParcelJS();
});
require('chokidar').watch(['./views/template'], {ignored: /[\/\\]\./}).on('change', function(filepath, event) {
    // console.log('buildJS');
    // buildJS(watchDirJS);
    buildTemplate(event, filepath);
});

buildParcelJS();
buildParcelSCSS();

jsonStringify = function (data = false) {
    var temp = data;
    if (temp) {
        return JSON.stringify(temp);
    } else {
        return false;
    }
};
getRequire = function (filepath) {
    var temp = false;
    try {
        temp = require(filepath);
    } catch (err) {
        temp = {};
        console.log("ERROR ( getRequire )", err);
    }
    return temp;
};
execCallback = function (callback) {
    if (typeof(callback) === 'function') {
        callback();
    }
};
module.exports = {};
