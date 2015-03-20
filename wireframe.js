(function($){
    $.fn.wireframe = function(options, fn) {
        var defaults = {
            srvUrl:""
        };
        var options = $.extend(defaults, options);

        var container = $(this);

        function walk(node) {
            var jq = $(node);
            var walkChilds = true;

            //console.log(jq.attr("id"));

            if(jq.is("script")){
                walkChilds = false;
            }
            else if(jq.is("iframe")){
                processIframe(jq);
                walkChilds = false;
            }
            else if(jq.is(":isSlider")){
                console.log("slider vyhodnoceno "+jq.attr("id"));
                processSlider(jq);
                walkChilds = false;
            }
            else if(jq.is("img:visibleElement")){
                console.log("obrazek "+jq.attr("src"));
                processImg(jq);
                walkChilds = false;
            }
            // zpracuje jednoravkoe texty
            else if(jq.is("span:noChild") || jq.is("a:noChild")){
                processOneLineText(jq);
                walkChilds = true;
            }
            // etc

            if(walkChilds){
                var childrens = jq.children();
                childrens.each(function(i,v){
                    walk(v);
                });
            }


        }

        function processIframe(iframe){
            var iframeWf = $("<div />");

            iframeWf.css("position","absolute");
            iframeWf.css("height",iframe.height()+"px");
            iframeWf.css("width",iframe.width()+"px");
            iframeWf.css("top",iframe.offset().top+"px");
            iframeWf.css("left",iframe.offset().left+"px");

            iframeWf.css("background-color","#d7d7d7");

            //var src = iframe.attr("src");
            //if(/youtube.com/.test(src) || /youtu.be/.test(src)){
            //}

            iframeWf.appendTo(wireframeContainer);
        }

        function processSlider(slider){
            var sliderWf = $("<div />");

            sliderWf.css("position","absolute");
            sliderWf.css("background-color","#d7d7d7");
            sliderWf.css("height",slider.find("li").height()+"px");
            sliderWf.css("width",slider.find("li").width()+"px");

            //var img = slider.find("img");
            //sliderWf.css("background-image","url('"+img.attr("src")+"')");

            sliderWf.css("top",slider.offset().top+"px");
            sliderWf.css("left",slider.offset().left+"px");

            sliderWf.appendTo(wireframeContainer);
        }

        function processImg(img){
            dump(img);

            var imgWF = $("<div />");

            //imgWF.css("display","block");
            imgWF.css("position","absolute");

            //imgWF.css("background-color","#d7d7d7");

            imgWF.css("background-image","url('"+img.attr("src")+"')");

            imgWF.css("height",img.height()+"px");
            imgWF.css("width",img.width()+"px");

            imgWF.css("top",img.offset().top+"px");
            imgWF.css("left",img.offset().left+"px");

            imgWF.appendTo(wireframeContainer);
        }

        function processOneLineText(elm){
            dump(elm);

            var spanWF = $("<div />");

            spanWF.css("display","block");
            spanWF.css("position","absolute");

            spanWF.css("font-size",elm.css("font-size"));
            spanWF.css("font-family",elm.css("font-family"));
            spanWF.css("font-weight",elm.css("font-weight"));
            spanWF.css("line-height",elm.css("line-height"));

            copyCss(elm,spanWF,"font-size");
            copyCss(elm,spanWF,"font-family");
            copyCss(elm,spanWF,"font-weight");
            copyCss(elm,spanWF,"line-height");
            copyCss(elm,spanWF,"text-align");

            //console.log(elm.css("font-size"));

            //console.log(elm.text().length);
            //spanWF.lorem({type:"characters",amount:elm.text().length,trim:true});


            spanWF.text(elm.text());

            spanWF.css("height",elm.height()+"px");
            spanWF.css("width",elm.width()+"px");

            spanWF.css("top",elm.offset().top+"px");
            spanWF.css("left",elm.offset().left+"px");

            spanWF.appendTo(wireframeContainer);
        }

        function copyCss(from,to,rule){
            to.css(rule,from.css(rule));
        }

        function dump(node){
            return;
            node = $(node);
            if(node.is("a")){
                console.log("a "+node.text());
            }
            else if(node.is("div")){
                console.log("div");
            }
            else if(node.is("p")){
                console.log("p");
            }
            else if(node.is("body")){
                console.log("body");
            }
            else if(node.is("script")){
                console.log("script");
            }
        }

        if(container.is(document)){
            //var webContainer = $("body");
            //
            var wireframeContainer = $("<div />").css("position","relative");

            walk(container.find("body"));


            container.find("html").css("background","none");
            container.find("html").css("background-color","white");

            container.find("body").replaceWith($("<body />"));

            container.find("body").append(wireframeContainer);

        }

        return container;
    };
})(jQuery);

jQuery.expr[":"].noChild = function(elem) {
    return jQuery(elem).children().length == 0 && isVisible(elem);
};
jQuery.expr[":"].visibleElement = function(elem) {
    return isVisible(elem);
};
jQuery.expr[":"].block = function(elem) {
    return $(elem).css("display") === "block";
};

// try do detect if element is a slider
jQuery.expr[":"].isSlider = function(elem) {
    elem = $(elem);
    var isSlider = false;
    if(elem.is("ul") || elem.is("ol")){
        $("li", elem).each(function(i,v){
            if(($(v).css("position") == "absolute" || $(v).css("float") == "left" || $(v).css("float") == "right") &&
                ($(v).find("img").length > 0 || $(v).find("div:block").length > 0/* || $(v).find("a:block").length > 0)*/)){
                isSlider = true;
            }
        });
    }else{
        isSlider = false;
    }
    return isSlider;
};
/*
 isVisible, v1.0.0
 by Riki Fridrich <riki@fczbkk.com> (https://github.com/fczbkk)
 https://github.com/fczbkk/isvisible
 */
(function() {
    var checkVisibility, getStyle, isVisible;
    getStyle = function(element, property) {
        if (element.currentStyle) {
            return element.currentStyle[property];
        } else if (window.getComputedStyle) {
            return document.defaultView.getComputedStyle(element, null).getPropertyValue(property);
        } else {
            return null;
        }
    };
    checkVisibility = function(element) {
        var is_displayed, is_visible;
        is_displayed = getStyle(element, "display") !== "none";
        is_visible = getStyle(element, "visibility") !== "hidden";
        return is_displayed && is_visible;
    };
    isVisible = function(element) {
        if (!document.body.contains(element)) {
            return false;
        }
        while (element != null && element !== document.body) {
            if (!checkVisibility(element)) {
                return false;
            }
            element = element.parentNode;
        }
        return true;
    };
    window.isVisible = isVisible;
}).call(this);