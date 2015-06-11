(function ($) {
    $.fn.wireframe = function (options, fn) {

        var defaults = {
            srvUrl: "",
            textMode: "lorem",
            imageMode: "box"
        };
        var options = $.extend({},defaults, options);

        console.log(JSON.stringify(options));

        return Wireframe.run(this, options);
    };
})(jQuery);