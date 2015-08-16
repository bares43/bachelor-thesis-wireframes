$.fn.wireframeReplacing = function(options, response){

    var defaults = {
        srvUrl: "",
        textMode: "lorem",
        imageMode: "box"
    };
    var options = $.extend({},defaults, options);

    return WireframeReplacing.run(this, options, response);
};