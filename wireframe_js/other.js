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

jQuery.expr[":"].noChild = function(elem) {
    return jQuery(elem).children().length == 0 && isVisible(elem);
};
jQuery.expr[":"].visibleElement = function(elem) {
    return isVisible(elem);
};
jQuery.expr[":"].block = function(elem) {
    return $(elem).css("display") === "block";
};

function processImg(img, wireframeContainer){
    dump(img);

    var imgWF = $("<div />");

    //imgWF.css("display","block");
    imgWF.css("position","absolute");

    imgWF.css("background-color","#d7d7d7");

    //imgWF.css("background-image","url('"+img.attr("src")+"')");

    imgWF.css("height",img.height()+"px");
    imgWF.css("width",img.width()+"px");

    imgWF.css("top",img.offset().top+"px");
    imgWF.css("left",img.offset().left+"px");

    imgWF.appendTo(wireframeContainer);
}

function processOneLineText(elm, wireframeContainer){
    //dump(elm);

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
    spanWF.lorem({type:"characters",amount:elm.text().length,trim:true});


    //spanWF.text(elm.text());

    spanWF.css("height",elm.height()+"px");
    spanWF.css("width",elm.width()+"px");

    spanWF.css("top",elm.offset().top+"px");
    spanWF.css("left",elm.offset().left+"px");

    spanWF.appendTo(wireframeContainer);
}
function processIframe(iframe, wireframeContainer){
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
