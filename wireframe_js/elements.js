// some element
jQuery.expr[":"].isElement = function(elem){
    return true;
};

WireframeReplacing.processElement = function(node, nodeOptions){
    WireframeReplacing.doBaseFormat(node);
    return {walkChilds:true};
};

jQuery.expr[":"].isIframe = function(node){
  return $(node).is("iframe");
};

WireframeReplacing.processIframe = function(node, nodeOptions){
    var $node_wf = $("<div></div>").css("width", $(node).width() + "px").css("height", $(node).height() + "px").css("background-color", "#9d9d9d");
    $(node).replaceWith($node_wf);
    return {walkChildes:false};
};

// dont process
jQuery.expr[":"].isDoNothing = function(elem){
    return $(elem).is(":displayNone") || /*$(elem).is(":toSmall") ||*/ $(elem).is("script");
};

WireframeReplacing.processDoNothing = function(){
    // dont walk childs
    return {walkChilds:false};
};

jQuery.expr[":"].isBackgroundImage = function(elem){
   return $(elem).children().length === 0 && $(elem).text().length === 0 && $(elem).css("background-image") !== "" && $(elem).css("background-image") !== "none";
};

WireframeReplacing.processBackgroundImage = function(node, nodeOptions){
    switch (WireframeReplacing.wireframeOptions.imageMode) {
        case "box":
            $(node).css("background-image","none");
            $(node).css("background-color","#bfbfbf");
            break;
        case "blur":
            $(node).css("-webkit-filter","blur(10px)");
            break;
        case "remove":
            $(node).css("background-image","none");
            $(node).css("background-color","white");
            break;
    }

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
            img.css("background-color","#bfbfbf");
            img.css("color","#bfbfbf");
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
            img.css("opacity",0);
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

jQuery.expr[":"].isFormInputText = function(node){
  return $(node).is("input") && !$(node).is("[type=submit]") && !$(node).is("[type=image]") && !$(node).is("[type=search]");
};

WireframeReplacing.processFormInputText = function(node, nodeOptions){

    WireframeReplacing.doBaseFormat(node);

    $(node).css("background-color","white");
    $(node).css("border","1px solid #b0b0b0");

    switch (WireframeReplacing.wireframeOptions.textMode){
      case "lorem":
          var placeholder = $(node).attr("placeholder");
          if(placeholder !== undefined && placeholder.length > 0){
              console.log("resim placeholder");
              $(node).attr("placeholder",lorem_ipsum_generator({length : placeholder.length, remove : true, addChars : [{char : " ", positions : placeholder.getAllOccurrences(" ")}]}));
          }

          var value = $(node).val();
          if(value !== undefined && value.length > 0){
              $(node).val(lorem_ipsum_generator({length : value.length, remove : true, addChars : [{char : " ", positions : value.getAllOccurrences(" ")}]}))
          }
          break;
      case "box":
        $(node).removeAttr("placeholder");
        $(node).css("color","#b0b0b0");
        break;
    }

    return {walkChilds : false};
};

jQuery.expr[":"].isFormInputSubmit = function (node) {
    return $(node).is("input[type=submit]") || $(node).is("input[type=image]") || $(node).is("input[type=search]") || $(node).is("button");
};

WireframeReplacing.processFormInputSubmit = function(node, nodeOptions){
    WireframeReplacing.doBaseFormat(node);
    $(node).removeAttr("src");
    $(node).css("background-color","#b0b0b0");

    switch (WireframeReplacing.wireframeOptions.textMode){
        case "lorem":
            var value = $(node).val();
            if(value !== undefined && value.length > 0){
                $(node).val(lorem_ipsum_generator({length : value.length, remove : true, addChars : [{char : " ", positions : value.getAllOccurrences(" ")}]}));
            }
            break;
        case "box":
            $(node).css("color","#b0b0b0");
            break;
    }

    return {walkChilds : false};
};

jQuery.expr[":"].isFormTextarea = function(node){
    return $(node).is("textarea");
};

WireframeReplacing.processFormTextarea = function(node, nodeOptions){
    WireframeReplacing.doBaseFormat(node);

    switch (WireframeReplacing.wireframeOptions.textMode){
        case "lorem":
            var text = $(node).text();
            $(node).text(lorem_ipsum_generator({length : text.length, remove : true, addChars : [{char : " ", positions : text.getAllOccurrences(" ")}]}));
            break;
        case "box":
            $(node).css("color","white");
    }

    $(node).css("border","1px solid black");

    return {walkChilds : false};
};

jQuery.expr[":"].displayNone = function(elem) {
    return $(elem).css("display") === "none";
};
jQuery.expr[":"].toSmall = function(elem) {
    return $(elem).width() < 2 && $(elem).height() < 2;
};
