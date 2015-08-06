function isElement(node,tags){
    for(var i = 0;i<tags.length;i++){
        if(node.is(tags[i])) return true;
    }
}

String.prototype.getAllOccurrences = function(char){
    var regex = new RegExp(char,"gi"), result, indices = [];
    while ( (result = regex.exec(this.toString())) ) {
        indices.push(result.index);
    }
    return indices;
};var WireframeCreating = {

    elementTypes: ["DoNothing","List","ListItemInline","ListItemChildrens","Table","TableRow","TableCellInline","TableCellChildrens", "FormSelect", "FormTextarea", "FormRadio", "FormCheckbox", "FormFile", "FormButton", "FormRange", "FormInput", "Slider", "Iframe", "Image","HeadingInline", "OneLineText"],

    wireframeContainer:[],

    popWireframeContainer:[],

    defaultNodeOptions:{
        position:true,
        positionTopAdd:0,
        positionLeftAdd:0
    },

    wireframeOptions:{},

    walk: function (node, nodeOptions) {
        var $node = $(node);
        var walkChilds = true;
        WireframeCreating.popWireframeContainer.push(false);
        nodeOptions = $.extend({},WireframeCreating.defaultNodeOptions, nodeOptions);

        var length = WireframeCreating.elementTypes.length;
        for(var i = 0;i<length;++i){
            var type = WireframeCreating.elementTypes[i];
            if($node.is(":is"+type)){
                var result = WireframeCreating["process"+type]($node, nodeOptions);
                walkChilds = result.walkChilds;
                if(result.nodeOptions){
                    nodeOptions = result.nodeOptions;
                }
                //console.log(JSON.stringify(nodeOptions));
                break;
            }
        }

        if (walkChilds) {
            var childrens = $node.children();
            childrens.each(function (i, v) {
                WireframeCreating.walk(v, nodeOptions);
            });
        }

        if(WireframeCreating.popWireframeContainer.pop()){
            WireframeCreating.append(WireframeCreating.wireframeContainer.pop());
        }

    },

    copyCss: function(from, to, rule){
        to.css(rule,from.css(rule));
    },

    copyAttr: function(from, to, name){
        to.attr(name,from.attr(name));
    },

    basePosition: function(el, original,nodeOptions){
        //console.log("top budu pricitat "+nodeOptions.positionTopAdd);
        //console.log("left budu pricitat "+nodeOptions.positionLeftAdd);
        el.css("position", "absolute");
        el.css("top", (original.offset().top + nodeOptions.positionTopAdd) + "px");
        el.css("left", (original.offset().left + nodeOptions.positionLeftAdd) + "px");
        el.css("width", original.width() + "px");
        el.css("height", original.height() + "px");
    },

    append : function(element){
        WireframeCreating.getCurrentWireframeContainer().append(element);
    },

    getCurrentWireframeContainer : function(){
        return WireframeCreating.wireframeContainer[WireframeCreating.wireframeContainer.length-1];
    },

    setWireframeContainer : function(element){
        WireframeCreating.wireframeContainer.push(element);
        WireframeCreating.popWireframeContainer.pop();
        WireframeCreating.popWireframeContainer.push(true);
    },

    run: function (element, options) {

        WireframeCreating.wireframeOptions = options;

        var container = $(element);

        //containerWf.find("html").replaceWith($("<html />"));
        //containerWf.find("body").replaceWith($("<body />"));

        if (container.is(document)) {
            //console.log("tvorim wf");

            WireframeCreating.wireframeContainer.push($("<div />").css("position", "relative"));


            this.walk(container.find("body"),{});

            //container.find("html").replaceWith($("<html />"));
            container.find("body").replaceWith($("<body />"));

            $("html,body",container).css("background","none");
            $("html,body",container).css("background-color","white");

            container.find("body").append(WireframeCreating.wireframeContainer[0]);

        }
        return container;
    }
};/*
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
// h1-h6
jQuery.expr[":"].isHeadingInline = function(elem) {
    var isInline = true;
    if ($(elem).is(":visibleElement") && ($(elem).is("h1") || $(elem).is("h2") || $(elem).is("h3") || $(elem).is("h4") || $(elem).is("h5") || $(elem).is("h6"))) {
        var childrens = $(elem).children();
        if (childrens.length == 0) return isInline;
        childrens.each(function (i, v) {
            //console.log($(v).attr("id"));
            if (!$(v).is(":isOneLineText")) {
                isInline = false;
            }
            if($(v).is("br")){
                isInline = true;
            }
        });
        return isInline;
    }
    return false;
};

WireframeCreating.processHeadingInline = function (node, nodeOptions) {
    //console.log($(node).prop("tagName"));
    switch($(node).prop("tagName")){
        case "H1":
            var $heading = $("<h1></h1>");
            break;
        case "H2":
            var $heading = $("<h2></h2>");
            break;
        case "H3":
            var $heading = $("<h3></h3>");
            break;
        case "H4":
            var $heading = $("<h4></h4>");
            break;
        case "H5":
            var $heading = $("<h5></h5>");
            break;
        case "H6":
            var $heading = $("<h6></h6>");
            break;
    }

    switch (WireframeCreating.wireframeOptions.textMode){
        case "lorem":
            var trim = node.text().length <= 10;
            $heading.lorem({type:"characters",amount:node.text().length,trim:trim});
            break;
        case "original":
            $heading.text(node.text());
            break;
        case "box":
            $heading.css("background-image",'url("'+WireframeCreating.wireframeOptions.srvUrl+'images/line.png")');
            WireframeCreating.copyCss(node,$heading,"height");
            WireframeCreating.copyCss(node,$heading,"width");
            break;
    }

    WireframeCreating.copyCss(node,$heading,"font-size");
    WireframeCreating.copyCss(node,$heading,"font-family");
    WireframeCreating.copyCss(node,$heading,"font-weight");
    WireframeCreating.copyCss(node,$heading,"line-height");
    WireframeCreating.copyCss(node,$heading,"text-align");

    if (nodeOptions.position) {
        WireframeCreating.basePosition($heading, node, nodeOptions);
    }
    WireframeCreating.append($heading);

    return {walkChilds:false,node:$heading};
};// try do detect if element is a slider
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

WireframeCreating.processSlider = function(slider, nodeOptions){
    var sliderWf = $("<div />");

    sliderWf.css("background-color","#d7d7d7");

    //var img = slider.find("img");
    //sliderWf.css("background-image","url('"+img.attr("src")+"')");


    if(nodeOptions.position){
        WireframeCreating.basePosition(sliderWf, slider, nodeOptions);
    }
    sliderWf.css("height",slider.find("li").height()+"px");
    sliderWf.css("width",slider.find("li").width()+"px");
    WireframeCreating.append(sliderWf);

    return {walkChilds:false};
};// ol/ul
jQuery.expr[":"].isList = function (elem) {
    //console.log("expression list");
    var r = ($(elem).is(":visibleElement") && ($(elem).is("ol") || $(elem).is("ul")));
    //console.log(r);
    return r;
};

WireframeCreating.processList = function (list, nodeOptions) {
    if (list.is("ul")) {
        var listWf = $("<ul></ul>");
        //console.log("procesuji ul");
    }
    else if (list.is("ol")) {
        var listWf = $("<ol></ol>");
        //console.log("procesuji ol");
    }
    //console.log("procesuji list "+$(list).attr("id"));
    WireframeCreating.copyCss(list, listWf, "list-style-type");

    if (nodeOptions.position) {
        //WireframeCreating.basePosition(listWf, list);

    }
    WireframeCreating.wireframeContainer.push(listWf);
    WireframeCreating.popWireframeContainer.pop();
    WireframeCreating.popWireframeContainer.push(true);

    return {walkChilds: true, nodeOptions: nodeOptions};
};

// li inline
jQuery.expr[":"].isListItemInline = function (elem) {
    var isInline = true;
    if ($(elem).is(":visibleElement") && $(elem).is("li")) {
        var childrens = $(elem).children();
        //console.log("id: "+$(elem).attr("id"));
        //console.log("deti: "+childrens.length);
        if (childrens.length == 0) return isInline;
        childrens.each(function (i, v) {
            //console.log($(v).attr("id"));
            if (!$(v).is(":isOneLineText")) {
                isInline = false;
            }
        });
        //console.log("je inline");
        return isInline;
    }
    return false;
};

WireframeCreating.processListItemInline = function (listItem, nodeOptions) {
    //console.log("inline li");
    var li = $("<li></li>");
    if (nodeOptions.position) {
        WireframeCreating.basePosition(li, listItem, nodeOptions);
    }
    var result = WireframeCreating.processOneLineText(listItem, $.extend({},nodeOptions, {position: false}));
    li.html(result.node);
    WireframeCreating.append(li);
    return {walkChilds: false, nodeOptions:nodeOptions };
};

// li with childrens
jQuery.expr[":"].isListItemChildrens = function (elem) {
    var r = true;
    if ($(elem).is(":visibleElement") && $(elem).is("li")) {
        var childrens = $(elem).children();
        if (childrens.length == 0) r = false;
        return r;
    }
    return false;
};

WireframeCreating.processListItemChildrens = function (listItem, nodeOptions) {
    //console.log("li s potomky");
    var li = $("<li></li>");
    if (nodeOptions.position) {
        WireframeCreating.basePosition(li, listItem, nodeOptions);
    }
    WireframeCreating.setWireframeContainer(li);

    nodeOptions.positionLeftAdd = -$(listItem).offset().left;
    nodeOptions.positionTopAdd = -$(listItem).offset().top;
    //console.log("odecitam top "+$(listItem).offset().top);
    //console.log("top je "+nodeOptions.positionTopAdd);
    //console.log("odecitam left "+$(listItem).offset().left);
    //console.log("left je "+nodeOptions.positionLeftAdd);
    nodeOptions.position = true;
    return {walkChilds: true, nodeOptions: nodeOptions};
};// table
jQuery.expr[":"].isTable = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("table"));
};

WireframeCreating.processTable = function (node, nodeOptions) {
    var $table = $("<table></table>");
    WireframeCreating.copyCss(node,$table,"width");
    WireframeCreating.copyCss(node,$table,"height");
    if (nodeOptions.position) {
        WireframeCreating.basePosition($table, node, nodeOptions);
        nodeOptions.positionLeftAdd = -$(node).offset().left;
        nodeOptions.positionTopAdd = -$(node).offset().top;
    }
    WireframeCreating.copyAttr(node,$table,"border");
    WireframeCreating.setWireframeContainer($table);
    return {walkChilds: true, nodeOptions: nodeOptions};
};

// tr
jQuery.expr[":"].isTableRow = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("tr"));
};

WireframeCreating.processTableRow = function (node, nodeOptions) {
    var $tr = $("<tr></tr>");
    WireframeCreating.copyCss(node,$tr,"width");
    WireframeCreating.copyCss(node,$tr,"height");
    WireframeCreating.setWireframeContainer($tr);
    return {walkChilds: true, nodeOptions: nodeOptions};
};

// td/th
jQuery.expr[":"].isTableCellInline = function (elem) {
    var isInline = true;
    if ($(elem).is(":visibleElement") && ($(elem).is("td") || $(elem).is("th"))) {
        var childrens = $(elem).children();
        if (childrens.length == 0) return isInline;
        childrens.each(function (i, v) {
            if (!$(v).is(":isOneLineText")) {
                isInline = false;
            }
        });
        return isInline;
    }
    return false;
};

WireframeCreating.processTableCellInline = function (node, nodeOptions) {
    if($(node).is("th")){
        var $cell = $("<th></th>");
    }else{
        var $cell = $("<td></td>");
    }
    //if (nodeOptions.position) {
    //    WireframeCreating.basePosition($cell, node, nodeOptions);
    //}

    WireframeCreating.copyAttr(node,$cell,"colspan");
    WireframeCreating.copyAttr(node,$cell,"rowspan");
    WireframeCreating.copyCss(node,$cell,"width");
    WireframeCreating.copyCss(node,$cell,"height");
    var result = WireframeCreating.processOneLineText(node, $.extend({},nodeOptions, {position: false}));
    $cell.html(result.node);
    WireframeCreating.append($cell);
    return {walkChilds: false, nodeOptions:nodeOptions };
};

// td/th
jQuery.expr[":"].isTableCellChildrens = function (elem) {
    var r = true;
    if ($(elem).is(":visibleElement") && ($(elem).is("td") || $(elem).is("th"))) {
        var childrens = $(elem).children();
        if (childrens.length == 0) r = false;
        return r;
    }
    return false;
};

WireframeCreating.processTableCellChildrens = function (node, nodeOptions) {
    if($(node).is("th")){
        var $cell = $("<th></th>");
    }else{
        var $cell = $("<td></td>");
    }

    //if (nodeOptions.position) {
    //    WireframeCreating.basePosition($cell, node, nodeOptions);
    //}

    WireframeCreating.copyAttr(node,$cell,"colspan");
    WireframeCreating.copyAttr(node,$cell,"rowspan");
    WireframeCreating.copyCss(node,$cell,"width");
    WireframeCreating.copyCss(node,$cell,"height");
    WireframeCreating.setWireframeContainer($cell);

    //nodeOptions.positionLeftAdd = -$(node).offset().left;
    //nodeOptions.positionTopAdd = -$(node).offset().top;
    nodeOptions.position = false;
    return {walkChilds: true, nodeOptions: nodeOptions};
};// input type radio
jQuery.expr[":"].isFormRadio = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("[type=radio]"));
};

WireframeCreating.processFormRadio = function (radio, nodeOptions) {
    var radioWf = $("<input />");
    radioWf.attr("type", "radio");
    if (radio.is(":checked")) {
        radioWf.attr("checked", "checked");
    }

    if (nodeOptions.position) {
        WireframeCreating.basePosition(radioWf, radio, nodeOptions);

    }
    WireframeCreating.append(radioWf);

    return {walkChilds: false};
};

// input type checkbox
jQuery.expr[":"].isFormCheckbox = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("[type=checkbox]"));
};

WireframeCreating.processFormCheckbox = function (checkbox, nodeOptions) {
    var checkboxWf = $("<input />");
    checkboxWf.attr("type", "checkbox");
    if (checkbox.is(":checked")) {
        checkboxWf.attr("checked", "checked");
    }

    if (nodeOptions.position) {
        WireframeCreating.basePosition(checkboxWf, checkbox, nodeOptions);

    }
    WireframeCreating.append(checkboxWf);

    return {walkChilds: false};
};

// input type file
jQuery.expr[":"].isFormFile = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("[type=file]"));
};

WireframeCreating.processFormFile = function (file, nodeOptions) {
    var fileWf = $("<input />");
    fileWf.attr("type", "file");

    if (nodeOptions.position) {
        WireframeCreating.basePosition(fileWf, file, nodeOptions);

    }
    WireframeCreating.append(fileWf);

    return {walkChilds: false};
};

// input type submit/reset/image or button
jQuery.expr[":"].isFormButton = function (elem) {
    return ($(elem).is(":visibleElement") && ($(elem).is("[type=submit]") || $(elem).is("[type=reset]") || $(elem).is("[type=image]") || $(elem).is("button")));
};

WireframeCreating.processFormButton = function (button, nodeOptions) {
    var buttonWf = $("<input />");
    buttonWf.attr("type", "submit");

    buttonWf.attr("value", "");

    if (nodeOptions.position) {
        WireframeCreating.basePosition(buttonWf, button, nodeOptions);

    }
    WireframeCreating.append(buttonWf);

    return {walkChilds: false};
};

// input type range
jQuery.expr[":"].isFormRange = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("[type=range]"));
};

WireframeCreating.processFormRange = function (input, nodeOptions) {
    var inputWf = $("<input />");
    inputWf.attr("type", "range");

    if (nodeOptions.position) {
        WireframeCreating.basePosition(inputWf, input, nodeOptions);

    }
    WireframeCreating.append(inputWf);

    return {walkChilds: false};
};

// input type text
jQuery.expr[":"].isFormInput = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("input") && !$(elem).is("[type=hidden]") && !$(elem).is(":isFormRadio") && !$(elem).is(":isFormCheckbox") && !$(elem).is(":isFormFile") && !$(elem).is(":isFormButton") && !$(elem).is(":isFormRange"));
};

WireframeCreating.processFormInput = function (input, nodeOptions) {
    var inputWf = $("<input />");
    inputWf.attr("type", "text");

    if (nodeOptions.position) {
        WireframeCreating.basePosition(inputWf, input, nodeOptions);

    }
    WireframeCreating.append(inputWf);

    return {walkChilds: false};
};

// select
jQuery.expr[":"].isFormSelect = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("select"));
};

WireframeCreating.processFormSelect = function (select, nodeOptions) {
    var selectWf = $("<select />");

    if (select.is("[multiple]")) {
        selectWf.attr("multiple", "multiple");
    }

    if (nodeOptions.position) {
        WireframeCreating.basePosition(selectWf, select, nodeOptions);

    }
    WireframeCreating.append(selectWf);

    return {walkChilds: false};
};

// textarea
jQuery.expr[":"].isFormTextarea = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("textarea"));
};

WireframeCreating.processFormTextarea = function (textarea, nodeOptions) {
    var textareaWf = $("<textarea />");

    if (nodeOptions.position) {
        WireframeCreating.basePosition(textareaWf, textarea, nodeOptions);

    }
    WireframeCreating.append(textareaWf);

    return {walkChilds: false};
};var WireframeReplacing = {
    elementTypes: ["DoNothing","Image","Text","Iframe","Element"],

    defaultNodeOptions:{
        position:true,
        positionTopAdd:0,
        positionLeftAdd:0
    },

    wireframeOptions:{},
    container : null,

    basePosition: function(el, original,nodeOptions){
        //el.css("position", "absolute");
        //el.css("top", (original.offset().top + nodeOptions.positionTopAdd) + "px");
        //el.css("left", (original.offset().left + nodeOptions.positionLeftAdd) + "px");
        //el.css("width", original.width() + "px");
        //el.css("height", original.height() + "px");
    },

    append : function(element){
        WireframeReplacing.container.append(element);
    },

    copyCss: function(from, to, rule){
        to.css(rule,from.css(rule));
    },

    copyAttr: function(from, to, name){
        to.attr(name,from.attr(name));
    },

    doBaseFormat : function(node){
      $(node).css("color","black");
      $(node).css("background","none");
      $(node).css("text-decoration","none");
      $(node).css("border","none");
    },

    walk: function (node, nodeOptions) {
        var $node = $(node);
        var walkChilds = true;
        nodeOptions = $.extend({},WireframeReplacing.defaultNodeOptions, nodeOptions);

        var length = WireframeReplacing.elementTypes.length;
        for(var i = 0;i<length;++i){
            var type = WireframeReplacing.elementTypes[i];
            if($node.is(":is"+type)){
                var result = WireframeReplacing["process"+type]($node, nodeOptions);
                walkChilds = result.walkChilds;
                if(result.nodeOptions){
                    nodeOptions = result.nodeOptions;
                }
                break;
            }
        }

        if (walkChilds) {
            var childrens = $node.children();
            childrens.each(function (i, v) {
                WireframeReplacing.walk(v, nodeOptions);
            });
        }
    },

    run: function (element, options) {

        WireframeReplacing.wireframeOptions = options;

        var container = $(element);


        if (container.is(document)) {
            WireframeReplacing.container = container.find("body");

            //WireframeReplacing.container.append('<style>img.image-badge::after{color: black; content: "test";}</style>');
            WireframeReplacing.container.append('<style>img.image-badge::after{color: black; content: "◪";}</style>');
            this.walk(WireframeReplacing.container,{});


            $("html,body",container).css("background","none");
            $("html,body",container).css("background-color","white");

        }
        return container;
    }
};// some element
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
    $node_wf = $("<div></div>").css("width",$(node).width()+"px").css("height",$(node).height()+"px").css("background-color","#9d9d9d");
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
            img.addClass("image-badge");
            //img.css("color","black");
            //img.css("content","❏");
            //img.after().css("content","❏");
            //img.after().css("color","black");
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
                    $(v).replaceWith($("<span></span>").text(v.nodeValue).css("color","#dfdfdf").css("background-color","#bfbfbf").css("text-decoration","none"));
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
$.fn.wireframeCreating = function (options, fn) {

    var defaults = {
        srvUrl: "",
        textMode: "lorem",
        imageMode: "box"
    };
    var options = $.extend({},defaults, options);

    console.log(JSON.stringify(options));

    return WireframeCreating.run(this, options);
};

$.fn.wireframeReplacing = function(options, fn){

    var defaults = {
        srvUrl: "",
        textMode: "lorem",
        imageMode: "box"
    };
    var options = $.extend({},defaults, options);

    console.log(JSON.stringify(options));

    return WireframeReplacing.run(this, options);
};