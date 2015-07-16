// some element
jQuery.expr[":"].isElement = function(elem){
    return true;
};

WireframeReplacing.processElement = function(node, nodeOptions){
    node.css("color","black");
    node.css("backround","none");
    return {walkChilds:true};
};

// dont process
jQuery.expr[":"].isDoNothing = function(elem){
    return $(elem).is(":displayNone") || $(elem).is(":toSmall") || $(elem).is("script");
};

WireframeReplacing.processDoNothing = function(){
    // dont walk childs
    return {walkChilds:false};
};

// image
jQuery.expr[":"].isImage = function(elem) {
    return $(elem).is("img");
};

WireframeReplacing.processImage = function(img, nodeOptions){
    img.css("border","none");
    switch (WireframeReplacing.wireframeOptions.imageMode){
        case "box":
            img.css("display","inline-block");
            img.css("background-color","#d7d7d7");
            img.css("color","#d7d7d7");
            img.css("width",img.width()+"px");
            img.css("height",img.height()+"px");
            img.removeAttr("src");
            img.removeAttr("alt");
            img.removeAttr("title");
            break;
        case "blur":
            img.css("-webkit-filter","blur(10px)");
            break;
        case "remove":
            img.removeAttr("src");
            img.removeAttr("alt");
            img.removeAttr("title");
            break;
    }

    return {walkChilds:false};
};

jQuery.expr[":"].displayNone = function(elem) {
    return $(elem).css("display") === "none";
};
jQuery.expr[":"].toSmall = function(elem) {
    return $(elem).width() < 2 && $(elem).height() < 2;
};
