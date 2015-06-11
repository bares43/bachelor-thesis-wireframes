var page = require('webpage').create();
var system = require('system');

var url = system.args[1];
var filename = system.args[2];
var srvUrl = system.args[3];

page.onConsoleMessage = function(msg) {
    console.log(msg);
};
page.onAlert  = function(msg) {
    console.log(msg);
};
page.onResourceError = function(trace){
    console.log(JSON.stringify(trace));
};

var includeJsUrls = ["https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js",srvUrl+"jquery.lorem.js",srvUrl+"wireframe_combined.js"];

var options = getOptions(system.args);

console.log(JSON.stringify(options));

options.srvUrl = srvUrl;

page.viewportSize = {width:options.viewport_width,height:options.viewport_height};
page.settings.localToRemoteUrlAccessEnabled = true;
page.open(url, function(status) {
    if ( status === "success" ) {
        includeJs(includeJsUrls, page, function() {
            page.evaluate(function(options) {
                $(document).wireframe(options);
            }, options);
           // console.log(page.content);

          //  setTimeout(function () {
                page.render(filename);
                phantom.exit();
            //}, 5000);
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