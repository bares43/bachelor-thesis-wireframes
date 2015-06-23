var Wireframe = {

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
        Wireframe.popWireframeContainer.push(false);
        nodeOptions = $.extend({},Wireframe.defaultNodeOptions, nodeOptions);

        var length = Wireframe.elementTypes.length;
        for(var i = 0;i<length;++i){
            var type = Wireframe.elementTypes[i];
            if($node.is(":is"+type)){
                var result = Wireframe["process"+type]($node, nodeOptions);
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
                Wireframe.walk(v, nodeOptions);
            });
        }

        if(Wireframe.popWireframeContainer.pop()){
            Wireframe.append(Wireframe.wireframeContainer.pop());
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
        Wireframe.getCurrentWireframeContainer().append(element);
    },

    getCurrentWireframeContainer : function(){
        return Wireframe.wireframeContainer[Wireframe.wireframeContainer.length-1];
    },

    setWireframeContainer : function(element){
        Wireframe.wireframeContainer.push(element);
        Wireframe.popWireframeContainer.pop();
        Wireframe.popWireframeContainer.push(true);
    },

    run: function (element, options) {

        Wireframe.wireframeOptions = options;

        var container = $(element);

        //containerWf.find("html").replaceWith($("<html />"));
        //containerWf.find("body").replaceWith($("<body />"));

        if (container.is(document)) {
            //console.log("tvorim wf");

            Wireframe.wireframeContainer.push($("<div />").css("position", "relative"));


            this.walk(container.find("body"),{});

            //container.find("html").replaceWith($("<html />"));
            container.find("body").replaceWith($("<body />"));

            $("html,body",container).css("background","none");
            $("html,body",container).css("background-color","white");

            container.find("body").append(Wireframe.wireframeContainer[0]);

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

Wireframe.processDoNothing = function(){
    // dont walk childs
    return {walkChilds:false};
};

// one line text
jQuery.expr[":"].isImage = function(elem) {
    return $(elem).is("img:visibleElement");
};

Wireframe.processImage = function(img, nodeOptions){
    var imgWF = $("<div />");

    //imgWF.css("display","block");
    imgWF.css("position","absolute");

    switch (Wireframe.wireframeOptions.imageMode){
        case "box":
            imgWF.css("background-color","#d7d7d7");
        break;
        case "blur":
            var blurImg = $("<img />");
            blurImg.attr("src",img.attr("src"));
            Wireframe.copyCss(img,blurImg,"width");
            Wireframe.copyCss(img,blurImg,"height");
            //console.log("blur obrazku");
            blurImg.css("-webkit-filter","blur(10px)");
            imgWF.append(blurImg);
            break;
        case "original":
            var innerImg = $("<img />");
            innerImg.attr("src",img.attr("src"));
            Wireframe.copyCss(img,innerImg,"width");
            Wireframe.copyCss(img,innerImg,"height");
            imgWF.append(innerImg);
            break;
    }

    //imgWF.css("background-image","url('"+img.attr("src")+"')");


    if(nodeOptions.position){
        Wireframe.basePosition(imgWF, img, nodeOptions);
    }
    Wireframe.append(imgWF);

    return {walkChilds:false};
};

// one line text
jQuery.expr[":"].isOneLineText = function(elem) {
    return $(elem).is("span:noChild") || $(elem).is("a:noChild");
};

Wireframe.processOneLineText = function(elm, nodeOptions){
    //dump(elm);

    var spanWF = $("<div />");

    spanWF.css("display","block");

    //spanWF.css("font-size",elm.css("font-size"));
    //spanWF.css("font-family",elm.css("font-family"));
    //spanWF.css("font-weight",elm.css("font-weight"));
    //spanWF.css("line-height",elm.css("line-height"));

    Wireframe.copyCss(elm,spanWF,"font-size");
    Wireframe.copyCss(elm,spanWF,"font-family");
    Wireframe.copyCss(elm,spanWF,"font-weight");
    Wireframe.copyCss(elm,spanWF,"line-height");
    Wireframe.copyCss(elm,spanWF,"text-align");

    //spanWF.css("word-wrap","break-word");
    spanWF.css("overflow","hidden");
    Wireframe.copyCss(elm,spanWF,"height");
    Wireframe.copyCss(elm,spanWF,"width");

    switch (Wireframe.wireframeOptions.textMode){
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
            //spanWF.css("background-image",'url("'+Wireframe.wireframeOptions.srvUrl+'images/line.png")');
            //spanWF.text(Wireframe.wireframeOptions.srvUrl+'images/line.png');
            break;
    }

    if(nodeOptions.position){
        Wireframe.basePosition(spanWF, elm, nodeOptions);
    }
    Wireframe.append(spanWF);

    return {walkChilds:false,node:spanWF};
};

// iframe
jQuery.expr[":"].isIframe = function(elem) {
    return $(elem).is("iframe");
};

Wireframe.processIframe = function(iframe, nodeOptions){
    var iframeWf = $("<div />");


    iframeWf.css("background-color","#d7d7d7");

    //var src = iframe.attr("src");
    //if(/youtube.com/.test(src) || /youtu.be/.test(src)){
    //}

    if(nodeOptions.position){
        Wireframe.basePosition(iframeWf, iframe, nodeOptions);
    }
    Wireframe.append(iframeWf);

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

Wireframe.processHeadingInline = function (node, nodeOptions) {
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

    switch (Wireframe.wireframeOptions.textMode){
        case "lorem":
            var trim = node.text().length <= 10;
            $heading.lorem({type:"characters",amount:node.text().length,trim:trim});
            break;
        case "original":
            $heading.text(node.text());
            break;
        case "box":
            $heading.css("background-image",'url("'+Wireframe.wireframeOptions.srvUrl+'images/line.png")');
            Wireframe.copyCss(node,$heading,"height");
            Wireframe.copyCss(node,$heading,"width");
            break;
    }

    Wireframe.copyCss(node,$heading,"font-size");
    Wireframe.copyCss(node,$heading,"font-family");
    Wireframe.copyCss(node,$heading,"font-weight");
    Wireframe.copyCss(node,$heading,"line-height");
    Wireframe.copyCss(node,$heading,"text-align");

    if (nodeOptions.position) {
        Wireframe.basePosition($heading, node, nodeOptions);
    }
    Wireframe.append($heading);

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

Wireframe.processSlider = function(slider, nodeOptions){
    var sliderWf = $("<div />");

    sliderWf.css("background-color","#d7d7d7");

    //var img = slider.find("img");
    //sliderWf.css("background-image","url('"+img.attr("src")+"')");


    if(nodeOptions.position){
        Wireframe.basePosition(sliderWf, slider, nodeOptions);
    }
    sliderWf.css("height",slider.find("li").height()+"px");
    sliderWf.css("width",slider.find("li").width()+"px");
    Wireframe.append(sliderWf);

    return {walkChilds:false};
};// ol/ul
jQuery.expr[":"].isList = function (elem) {
    //console.log("expression list");
    var r = ($(elem).is(":visibleElement") && ($(elem).is("ol") || $(elem).is("ul")));
    //console.log(r);
    return r;
};

Wireframe.processList = function (list, nodeOptions) {
    if (list.is("ul")) {
        var listWf = $("<ul></ul>");
        //console.log("procesuji ul");
    }
    else if (list.is("ol")) {
        var listWf = $("<ol></ol>");
        //console.log("procesuji ol");
    }
    //console.log("procesuji list "+$(list).attr("id"));
    Wireframe.copyCss(list, listWf, "list-style-type");

    if (nodeOptions.position) {
        //Wireframe.basePosition(listWf, list);

    }
    Wireframe.wireframeContainer.push(listWf);
    Wireframe.popWireframeContainer.pop();
    Wireframe.popWireframeContainer.push(true);

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

Wireframe.processListItemInline = function (listItem, nodeOptions) {
    //console.log("inline li");
    var li = $("<li></li>");
    if (nodeOptions.position) {
        Wireframe.basePosition(li, listItem, nodeOptions);
    }
    var result = Wireframe.processOneLineText(listItem, $.extend({},nodeOptions, {position: false}));
    li.html(result.node);
    Wireframe.append(li);
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

Wireframe.processListItemChildrens = function (listItem, nodeOptions) {
    //console.log("li s potomky");
    var li = $("<li></li>");
    if (nodeOptions.position) {
        Wireframe.basePosition(li, listItem, nodeOptions);
    }
    Wireframe.setWireframeContainer(li);

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

Wireframe.processTable = function (node, nodeOptions) {
    var $table = $("<table></table>");
    Wireframe.copyCss(node,$table,"width");
    Wireframe.copyCss(node,$table,"height");
    if (nodeOptions.position) {
        Wireframe.basePosition($table, node, nodeOptions);
        nodeOptions.positionLeftAdd = -$(node).offset().left;
        nodeOptions.positionTopAdd = -$(node).offset().top;
    }
    Wireframe.copyAttr(node,$table,"border");
    Wireframe.setWireframeContainer($table);
    return {walkChilds: true, nodeOptions: nodeOptions};
};

// tr
jQuery.expr[":"].isTableRow = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("tr"));
};

Wireframe.processTableRow = function (node, nodeOptions) {
    var $tr = $("<tr></tr>");
    Wireframe.copyCss(node,$tr,"width");
    Wireframe.copyCss(node,$tr,"height");
    Wireframe.setWireframeContainer($tr);
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

Wireframe.processTableCellInline = function (node, nodeOptions) {
    if($(node).is("th")){
        var $cell = $("<th></th>");
    }else{
        var $cell = $("<td></td>");
    }
    //if (nodeOptions.position) {
    //    Wireframe.basePosition($cell, node, nodeOptions);
    //}

    Wireframe.copyAttr(node,$cell,"colspan");
    Wireframe.copyAttr(node,$cell,"rowspan");
    Wireframe.copyCss(node,$cell,"width");
    Wireframe.copyCss(node,$cell,"height");
    var result = Wireframe.processOneLineText(node, $.extend({},nodeOptions, {position: false}));
    $cell.html(result.node);
    Wireframe.append($cell);
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

Wireframe.processTableCellChildrens = function (node, nodeOptions) {
    if($(node).is("th")){
        var $cell = $("<th></th>");
    }else{
        var $cell = $("<td></td>");
    }

    //if (nodeOptions.position) {
    //    Wireframe.basePosition($cell, node, nodeOptions);
    //}

    Wireframe.copyAttr(node,$cell,"colspan");
    Wireframe.copyAttr(node,$cell,"rowspan");
    Wireframe.copyCss(node,$cell,"width");
    Wireframe.copyCss(node,$cell,"height");
    Wireframe.setWireframeContainer($cell);

    //nodeOptions.positionLeftAdd = -$(node).offset().left;
    //nodeOptions.positionTopAdd = -$(node).offset().top;
    nodeOptions.position = false;
    return {walkChilds: true, nodeOptions: nodeOptions};
};// input type radio
jQuery.expr[":"].isFormRadio = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("[type=radio]"));
};

Wireframe.processFormRadio = function (radio, nodeOptions) {
    var radioWf = $("<input />");
    radioWf.attr("type", "radio");
    if (radio.is(":checked")) {
        radioWf.attr("checked", "checked");
    }

    if (nodeOptions.position) {
        Wireframe.basePosition(radioWf, radio, nodeOptions);

    }
    Wireframe.append(radioWf);

    return {walkChilds: false};
};

// input type checkbox
jQuery.expr[":"].isFormCheckbox = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("[type=checkbox]"));
};

Wireframe.processFormCheckbox = function (checkbox, nodeOptions) {
    var checkboxWf = $("<input />");
    checkboxWf.attr("type", "checkbox");
    if (checkbox.is(":checked")) {
        checkboxWf.attr("checked", "checked");
    }

    if (nodeOptions.position) {
        Wireframe.basePosition(checkboxWf, checkbox, nodeOptions);

    }
    Wireframe.append(checkboxWf);

    return {walkChilds: false};
};

// input type file
jQuery.expr[":"].isFormFile = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("[type=file]"));
};

Wireframe.processFormFile = function (file, nodeOptions) {
    var fileWf = $("<input />");
    fileWf.attr("type", "file");

    if (nodeOptions.position) {
        Wireframe.basePosition(fileWf, file, nodeOptions);

    }
    Wireframe.append(fileWf);

    return {walkChilds: false};
};

// input type submit/reset/image or button
jQuery.expr[":"].isFormButton = function (elem) {
    return ($(elem).is(":visibleElement") && ($(elem).is("[type=submit]") || $(elem).is("[type=reset]") || $(elem).is("[type=image]") || $(elem).is("button")));
};

Wireframe.processFormButton = function (button, nodeOptions) {
    var buttonWf = $("<input />");
    buttonWf.attr("type", "submit");

    buttonWf.attr("value", "");

    if (nodeOptions.position) {
        Wireframe.basePosition(buttonWf, button, nodeOptions);

    }
    Wireframe.append(buttonWf);

    return {walkChilds: false};
};

// input type range
jQuery.expr[":"].isFormRange = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("[type=range]"));
};

Wireframe.processFormRange = function (input, nodeOptions) {
    var inputWf = $("<input />");
    inputWf.attr("type", "range");

    if (nodeOptions.position) {
        Wireframe.basePosition(inputWf, input, nodeOptions);

    }
    Wireframe.append(inputWf);

    return {walkChilds: false};
};

// input type text
jQuery.expr[":"].isFormInput = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("input") && !$(elem).is("[type=hidden]") && !$(elem).is(":isFormRadio") && !$(elem).is(":isFormCheckbox") && !$(elem).is(":isFormFile") && !$(elem).is(":isFormButton") && !$(elem).is(":isFormRange"));
};

Wireframe.processFormInput = function (input, nodeOptions) {
    var inputWf = $("<input />");
    inputWf.attr("type", "text");

    if (nodeOptions.position) {
        Wireframe.basePosition(inputWf, input, nodeOptions);

    }
    Wireframe.append(inputWf);

    return {walkChilds: false};
};

// select
jQuery.expr[":"].isFormSelect = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("select"));
};

Wireframe.processFormSelect = function (select, nodeOptions) {
    var selectWf = $("<select />");

    if (select.is("[multiple]")) {
        selectWf.attr("multiple", "multiple");
    }

    if (nodeOptions.position) {
        Wireframe.basePosition(selectWf, select, nodeOptions);

    }
    Wireframe.append(selectWf);

    return {walkChilds: false};
};

// textarea
jQuery.expr[":"].isFormTextarea = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("textarea"));
};

Wireframe.processFormTextarea = function (textarea, nodeOptions) {
    var textareaWf = $("<textarea />");

    if (nodeOptions.position) {
        Wireframe.basePosition(textareaWf, textarea, nodeOptions);

    }
    Wireframe.append(textareaWf);

    return {walkChilds: false};
};(function ($) {
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