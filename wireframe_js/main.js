$.fn.wireframeReplacing = function(options, response){

    var defaults = {
        srvUrl: "",
        textMode: Wireframe.TEXT_LOREM,
        imageMode: Wireframe.IMAGE_BOX
    };
    var options = $.extend({},defaults, options);

    return Wireframe.run(this, options, response);
};