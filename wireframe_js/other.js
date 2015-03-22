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

jQuery.expr[":"].visibleElement = function(elem) {
    return isVisible(elem);
};

jQuery.expr[":"].noChild = function(elem) {
    return jQuery(elem).children().length == 0 && $(elem).is(":visibleElement");
};
jQuery.expr[":"].block = function(elem) {
    return $(elem).css("display") === "block";
};
jQuery.expr[":"].displayNone = function(elem) {
    return $(elem).css("display") === "none";
};
jQuery.expr[":"].toSmall = function(elem) {
    return $(elem).width() < 2 && $(elem).height() < 2;
};

// dont process
jQuery.expr[":"].isDoNothing = function(elem){
    return $(elem).is(":displayNone") || $(elem).is(":toSmall") || $(elem).is("script");
};

Wireframe.processDoNothing = function(){
    // dont walk childs
    return false;
};

// one line text
jQuery.expr[":"].isImage = function(elem) {
    return $(elem).is("img:visibleElement");
};

Wireframe.processImage = function(img){
    var imgWF = $("<div />");

    //imgWF.css("display","block");
    imgWF.css("position","absolute");

    imgWF.css("background-color","#d7d7d7");

    //imgWF.css("background-image","url('"+img.attr("src")+"')");


    Wireframe.basePosition(imgWF, img);
    Wireframe.append(imgWF);

    return false;
};

// one line text
jQuery.expr[":"].isOneLineText = function(elem) {
    return $(elem).is("span:noChild") || $(elem).is("a:noChild");
};

Wireframe.processOneLineText = function(elm){
    //dump(elm);

    var spanWF = $("<div />");

    spanWF.css("display","block");

    spanWF.css("font-size",elm.css("font-size"));
    spanWF.css("font-family",elm.css("font-family"));
    spanWF.css("font-weight",elm.css("font-weight"));
    spanWF.css("line-height",elm.css("line-height"));

    Wireframe.copyCss(elm,spanWF,"font-size");
    Wireframe.copyCss(elm,spanWF,"font-family");
    Wireframe.copyCss(elm,spanWF,"font-weight");
    Wireframe.copyCss(elm,spanWF,"line-height");
    Wireframe.copyCss(elm,spanWF,"text-align");

    spanWF.css("word-wrap","break-word");
    //console.log(elm.css("font-size"));


    //console.log(elm.text().length);
    var trim = elm.text().length <= 10;
    spanWF.lorem({type:"characters",amount:elm.text().length,trim:trim});

    //spanWF.text(elm.text().length);

    //spanWF.text(/*elm.text()+" "+*/elm.css("font-size"));

    Wireframe.basePosition(spanWF, elm);
    Wireframe.append(spanWF);

    return false;
};

// iframe
jQuery.expr[":"].isIframe = function(elem) {
    return $(elem).is("iframe");
};

Wireframe.processIframe = function(iframe){
    var iframeWf = $("<div />");


    iframeWf.css("background-color","#d7d7d7");

    //var src = iframe.attr("src");
    //if(/youtube.com/.test(src) || /youtu.be/.test(src)){
    //}

    Wireframe.basePosition(iframeWf, iframe);
    Wireframe.append(iframeWf);

    return false;
};
