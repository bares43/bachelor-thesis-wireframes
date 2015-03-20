var page = require('webpage').create();
var system = require('system');

var url = system.args[1];
var screen = system.args[2];

page.settings.localToRemoteUrlAccessEnabled = true;

page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.onError = function(msg, trace) {
    console.log("nervy moje");
    var msgStack = ['PHANTOM ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
        });
    }
    console.error(msgStack.join('\n'));
    phantom.exit(1);
};

page.onResourceError = function(trace){
    console.log(JSON.stringify(trace));
}


page.open(url, function(status) {
    console.log(url+" "+status);
    if(status === "success" && screen === "screen"){
        page.render("ping.png");
    }
    phantom.exit();
});