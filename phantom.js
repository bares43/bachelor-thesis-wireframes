var page = require('webpage').create();
var system = require('system');

var url = system.args[1];
var filename_wf = system.args[2];
var filename = system.args[3];
var srvUrl = system.args[4];

page.onConsoleMessage = function(msg) {
    console.log(msg);
};
page.onAlert  = function(msg) {
    console.log(msg);
};
page.onResourceError = function(trace){
    console.log(JSON.stringify(trace));
};

var includeJsUrls = ["https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js",srvUrl+"lorem_ipsum_generator.min.js",srvUrl+"wireframe_combined.js"];

var options = getOptions(system.args);

console.log(JSON.stringify(options));

options.srvUrl = srvUrl;

var response = {};

page.viewportSize = {width:options.viewportWidth,height:options.viewportHeight};
page.settings.localToRemoteUrlAccessEnabled = true;
page.open(url, function(status) {
    if ( status === "success" ) {
        page.render(filename);
        includeJs(includeJsUrls, page, function() {
            page.evaluate(function(options, response) {
                $(document).wireframeReplacing(options,response);
                console.log(JSON.stringify(response));
            }, options, response);

            setTimeout(function () {
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
 * @param callback
 */
function includeJs(urls,page, callback){
    if(urls.length == 0 && typeof callback === "function"){
        callback();
    }else if(typeof callback === "function"){
        var url = urls.shift();
        page.includeJs(url, function(){
            includeJs(urls, page, callback);
        })
    }
}

function getOptions(args){
    var options = {};
    var testPatternValue = /^-[a-zA-Z]+=\w+$/;
    var testPatternBoolean = /^-[a-zA-Z]+$/;
    for(var i = 0;i<args.length;i++){
        if(testPatternValue.test(args[i])){
            var name = /^-([a-zA-Z]+)=/.exec(args[i])[1];
            var value = /=(\w+)$/.exec(args[i])[1];
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