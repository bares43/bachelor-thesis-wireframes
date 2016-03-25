$.fn.wireframe = function(options, response){

    var defaults = {
        textMode: Wireframe.TEXT_LOREM,
        imageMode: Wireframe.IMAGE_BOX
    };
    var options = $.extend({},defaults, options);

    return Wireframe.run(this, options, response);
};