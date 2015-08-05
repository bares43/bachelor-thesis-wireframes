// some element
jQuery.expr[":"].isElement = function(elem){
    return true;
};

WireframeReplacing.processElement = function(node, nodeOptions){
    WireframeReplacing.doBaseFormat(node);
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

// one line text
jQuery.expr[":"].isText = function(elem) {
    return $(elem).is(":hasText")/* && isElement($(elem),["span","a","p","li","div","h1","h2","h3","h4","h5","h6","em","strong","b","u","i","s"])*/;
};

jQuery.expr[":"].hasText = function(node){
    var hasText = false;
    $(node).contents().each(function(i,v){
        console.log(v.nodeType+" "+ v.nodeValue);
       if(v.nodeType === 3 && v.nodeValue.trim().length > 0){
           hasText = true;
       }
    });
    return hasText;
};

WireframeReplacing.processText = function(node, nodeOptions){
    var walkChilds = false;
    $(node).contents().each(function(i,v){
        if(v.nodeType === 3 && v.nodeValue.trim().length > 0){
            var text = this.nodeValue;

            switch (WireframeReplacing.wireframeOptions.textMode){
                case "lorem":
                    v.nodeValue = lorem_ipsum_generator({length : text.length, remove : true, addChars : [{char : " ", positions: text.getAllOccurrences(" ")}]});
                    break;
                case "box":
                    $(v).replaceWith($("<span></span>").text(v.nodeValue).css("color","#dfdfdf").css("background-color","#dfdfdf").css("text-decoration","none"));
                    break;
            }

        }else if(v.nodeType === 1){
            walkChilds = true;
        }
    });

    WireframeReplacing.doBaseFormat(node);
    return {walkChilds:walkChilds};
};

jQuery.expr[":"].displayNone = function(elem) {
    return $(elem).css("display") === "none";
};
jQuery.expr[":"].toSmall = function(elem) {
    return $(elem).width() < 2 && $(elem).height() < 2;
};
