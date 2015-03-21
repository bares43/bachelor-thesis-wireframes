(function ($) {
    $.fn.wireframe = function (options, fn) {

        var defaults = {
            srvUrl: ""
        };
        var options = $.extend(defaults, options);

        return Wireframe.run(this, options);
    };
})(jQuery);