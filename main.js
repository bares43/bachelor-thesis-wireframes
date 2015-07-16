$.fn.wireframeCreating = function (options, fn) {

    var defaults = {
        srvUrl: "",
        textMode: "lorem",
        imageMode: "box"
    };
    var options = $.extend({},defaults, options);

    console.log(JSON.stringify(options));

    return WireframeCreating.run(this, options);
};

$.fn.wireframeReplacing = function(options, fn){

    var defaults = {
        srvUrl: "",
        textMode: "lorem",
        imageMode: "box"
    };
    var options = $.extend({},defaults, options);

    console.log(JSON.stringify(options));

    return WireframeReplacing.run(this, options);
};