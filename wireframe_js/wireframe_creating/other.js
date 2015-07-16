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

WireframeCreating.processDoNothing = function(){
    // dont walk childs
    return {walkChilds:false};
};

// one line text
jQuery.expr[":"].isImage = function(elem) {
    return $(elem).is("img:visibleElement");
};

WireframeCreating.processImage = function(img, nodeOptions){
    var imgWF = $("<div />");

    //imgWF.css("display","block");
    imgWF.css("position","absolute");

    switch (WireframeCreating.wireframeOptions.imageMode){
        case "box":
            imgWF.css("background-color","#d7d7d7");
        break;
        case "blur":
            var blurImg = $("<img />");
            blurImg.attr("src",img.attr("src"));
            WireframeCreating.copyCss(img,blurImg,"width");
            WireframeCreating.copyCss(img,blurImg,"height");
            //console.log("blur obrazku");
            blurImg.css("-webkit-filter","blur(10px)");
            imgWF.append(blurImg);
            break;
        case "original":
            var innerImg = $("<img />");
            innerImg.attr("src",img.attr("src"));
            WireframeCreating.copyCss(img,innerImg,"width");
            WireframeCreating.copyCss(img,innerImg,"height");
            imgWF.append(innerImg);
            break;
    }

    //imgWF.css("background-image","url('"+img.attr("src")+"')");


    if(nodeOptions.position){
        WireframeCreating.basePosition(imgWF, img, nodeOptions);
    }
    WireframeCreating.append(imgWF);

    return {walkChilds:false};
};

// one line text
jQuery.expr[":"].isOneLineText = function(elem) {
    return $(elem).is("span:noChild") || $(elem).is("a:noChild");
};

WireframeCreating.processOneLineText = function(elm, nodeOptions){
    //dump(elm);

    var spanWF = $("<div />");

    spanWF.css("display","block");

    //spanWF.css("font-size",elm.css("font-size"));
    //spanWF.css("font-family",elm.css("font-family"));
    //spanWF.css("font-weight",elm.css("font-weight"));
    //spanWF.css("line-height",elm.css("line-height"));

    WireframeCreating.copyCss(elm,spanWF,"font-size");
    WireframeCreating.copyCss(elm,spanWF,"font-family");
    WireframeCreating.copyCss(elm,spanWF,"font-weight");
    WireframeCreating.copyCss(elm,spanWF,"line-height");
    WireframeCreating.copyCss(elm,spanWF,"text-align");

    //spanWF.css("word-wrap","break-word");
    spanWF.css("overflow","hidden");
    WireframeCreating.copyCss(elm,spanWF,"height");
    WireframeCreating.copyCss(elm,spanWF,"width");

    switch (WireframeCreating.wireframeOptions.textMode){
        case "lorem":
            var trim = elm.text().length <= 10;
            spanWF.lorem({type:"characters",amount:elm.text().length,trim:trim});
            break;
        case "original":
            spanWF.text(elm.text());
            break;
        case "box":
            spanWF.css("background-image",'url("https://cdn.tutsplus.com/net/uploads/legacy/2161_phantom/preview.png")');
            spanWF.css("border","1px solid black");
            //spanWF.css("background-image",'url("'+WireframeCreating.wireframeOptions.srvUrl+'images/line.png")');
            //spanWF.text(WireframeCreating.wireframeOptions.srvUrl+'images/line.png');
            break;
    }

    if(nodeOptions.position){
        WireframeCreating.basePosition(spanWF, elm, nodeOptions);
    }
    WireframeCreating.append(spanWF);

    return {walkChilds:false,node:spanWF};
};

// iframe
jQuery.expr[":"].isIframe = function(elem) {
    return $(elem).is("iframe");
};

WireframeCreating.processIframe = function(iframe, nodeOptions){
    var iframeWf = $("<div />");


    iframeWf.css("background-color","#d7d7d7");

    //var src = iframe.attr("src");
    //if(/youtube.com/.test(src) || /youtu.be/.test(src)){
    //}

    if(nodeOptions.position){
        WireframeCreating.basePosition(iframeWf, iframe, nodeOptions);
    }
    WireframeCreating.append(iframeWf);

    return {walkChilds:false};
};
