var page = require('webpage').create();
var system = require('system');

var url = system.args[1];
var filename = system.args[2];
var srvUrl = system.args[3];
var textMode = system.args[4];

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

page.viewportSize = {width:1280,height:720};
page.settings.localToRemoteUrlAccessEnabled = true;
page.open(url, function(status) {
    if ( status === "success" ) {
        includeJs(includeJsUrls, page, function() {
            page.evaluate(function(srvUrl,textMode) {
                $(document).wireframe({
                    srvUrl: srvUrl,
                    textMode: textMode
                });
            }, srvUrl, textMode);
            //console.log(page.content);

            setTimeout(function () {
                page.render(filename);
                phantom.exit();
            }, 5000);
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