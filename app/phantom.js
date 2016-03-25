var page = require('webpage').create();
var system = require('system');

var url = system.args[1];
var filename_wf = system.args[2];

page.onConsoleMessage = function(msg) {
    console.log(msg);
};
page.onAlert  = function(msg) {
    console.log(msg);
};
page.onResourceError = function(trace){
    console.log(JSON.stringify(trace));
};

var options = getOptions(system.args);

var includeJsUrls = ["https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"];
var injectJsFiles = ["../libs/lorem_ipsum_generator.min.js","../libs/jss.min.js","./wireframe.js"];

if(options.customRules !== undefined && options.customRules.length > 0){
    injectJsFiles.push("./custom/"+options.customRules+".js");
}

console.log(JSON.stringify(options));

var response = {};

switch(options.userAgent){
    case "android":
        page.settings.userAgent = "Mozilla/5.0 (Linux; Android 5.0.2; D5503 Build/14.5.A.0.270) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.133 Mobile Safari/537.36";
        break;
}

page.viewportSize = {width:options.viewportWidth,height:options.viewportHeight};
page.settings.localToRemoteUrlAccessEnabled = true;
page.open(url, function(status) {
    if ( status === "success" ) {
        if(options.originalScreenName){
            page.render(options.originalScreenName);
        }
        includeJs(includeJsUrls, page, function() {
            injectJs(injectJsFiles, page);
            page.evaluate(function(options, response) {
                $(document).wireframe(options,response);
                console.log(JSON.stringify(response));
            }, options, response);

            setTimeout(function () {
                console.log(filename_wf);
                    page.render(filename_wf);
                    phantom.exit();
            }, 0);
        });
    }else{
        phantom.exit();
    }
});

/**
 * Include more js and then call callback
 * @param urls
 * @param page
 * @param callback
 */
function includeJs(urls,page, callback){
    if(urls.length === 0 && typeof callback === "function"){
        callback();
    }else if(typeof callback === "function"){
        var url = urls.shift();
        page.includeJs(url, function(){
            includeJs(urls, page, callback);
        })
    }
}

/**
 * Inject more js
 * @param files
 * @param page
 */
function injectJs(files, page){
    for (var i in files) {
        page.injectJs(files[i]);
    }
}


function getOptions(args){
    var options = {};
    var testPatternValue = /^-[a-zA-Z]+=[a-zA-Z0-9_.\/\\]+$/;
    var testPatternBoolean = /^-[a-zA-Z]+$/;
    for(var i = 0;i<args.length;i++){
        if(testPatternValue.test(args[i])){
            var name = /^-([a-zA-Z]+)=/.exec(args[i])[1];
            var value = /=([a-zA-Z0-9_.\/\\]+)$/.exec(args[i])[1];
            if(/^\d+$/.test(value)){
                value = parseInt(value);
            }
            options[name] = value;
        }else if(testPatternBoolean.test(args[i])){
            var name = /^-([a-zA-Z]+)$/.exec(args[i])[1];
            options[name] = true;
        }
    }
    return options;
}