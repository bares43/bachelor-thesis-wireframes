jQuery.expr[":"].isFormRadio = function(elem){
    return (isVisible(elem) && $(elem).is("[type=radio]"));
};
jQuery.expr[":"].isFormCheckbox = function(elem){
    return (isVisible(elem) && $(elem).is("[type=checkbox]"));
};
jQuery.expr[":"].isFormFile = function(elem){
    return (isVisible(elem) && $(elem).is("[type=file]"));
};
jQuery.expr[":"].isFormButton = function(elem){
    return (isVisible(elem) && ($(elem).is("[type=submit]") || $(elem).is("[type=reset]") || $(elem).is("[type=image]") || $(elem).is("button")));
};
jQuery.expr[":"].isFormInput = function(elem){
    return (isVisible(elem) && $(elem).is("input") && !$(elem).is("[type=hidden]") && !$(elem).is(":isFormRadio") && !$(elem).is(":isFormCheckbox") && !$(elem).is(":isFormFile") && !$(elem).is(":isFormButton"));
};
jQuery.expr[":"].isFormSelect = function(elem){
    return (isVisible(elem) && $(elem).is("select"));
};
jQuery.expr[":"].isFormTextarea = function(elem){
    return (isVisible(elem) && $(elem).is("textarea"));
};

function processFormRadio(radio, wireframeContainer){
    var radioWf = $("<input />");
    radioWf.attr("type","radio");
    if(radio.is(":checked")){
        radioWf.attr("checked","checked");
    }

    radioWf.css("position","absolute");
    radioWf.css("top",radio.offset().top+"px");
    radioWf.css("left",radio.offset().left+"px");
    radioWf.css("width",radio.width()+"px");
    radioWf.css("height",radio.height()+"px");

    radioWf.appendTo(wireframeContainer);
}

function processFormCheckbox(checkbox, wireframeContainer){
    var checkboxWf = $("<input />");
    checkboxWf.attr("type","checkbox");
    if(checkbox.is(":checked")){
        checkboxWf.attr("checked","checked");
    }

    checkboxWf.css("position","absolute");
    checkboxWf.css("top",checkbox.offset().top+"px");
    checkboxWf.css("left",checkbox.offset().left+"px");
    checkboxWf.css("width",checkbox.width()+"px");
    checkboxWf.css("height",checkbox.height()+"px");

    checkboxWf.appendTo(wireframeContainer);
}

function processFormFile(file, wireframeContainer){
    var fileWf = $("<input />");
    fileWf.attr("type","file");

    fileWf.css("position","absolute");
    fileWf.css("top",file.offset().top+"px");
    fileWf.css("left",file.offset().left+"px");
    fileWf.css("width",file.width()+"px");
    fileWf.css("height",file.height()+"px");

    fileWf.appendTo(wireframeContainer);
}

function processFormButton(button, wireframeContainer){
    var buttonWf = $("<input />");
    buttonWf.attr("type","submit");

    buttonWf.attr("value","");

    buttonWf.css("position","absolute");
    buttonWf.css("top",button.offset().top+"px");
    buttonWf.css("left",button.offset().left+"px");
    buttonWf.css("width",button.width()+"px");
    buttonWf.css("height",button.height()+"px");

    buttonWf.appendTo(wireframeContainer);
}

function processFormInput(input, wireframeContainer){
    var inputWf = $("<input />");
    inputWf.attr("type","text");

    inputWf.css("position","absolute");
    inputWf.css("top",input.offset().top+"px");
    inputWf.css("left",input.offset().left+"px");
    inputWf.css("width",input.width()+"px");
    inputWf.css("height",input.height()+"px");

    inputWf.appendTo(wireframeContainer);
}

function processFormSelect(select, wireframeContainer){
    var selectWf = $("<select />");

    selectWf.css("position","absolute");
    selectWf.css("top",select.offset().top+"px");
    selectWf.css("left",select.offset().left+"px");
    selectWf.css("width",select.width()+"px");
    selectWf.css("height",select.height()+"px");

    selectWf.appendTo(wireframeContainer);
}

function processFormTextarea(textarea, wireframeContainer){
    var textareaWf = $("<textarea />");

    textareaWf.css("position","absolute");
    textareaWf.css("top",textarea.offset().top+"px");
    textareaWf.css("left",textarea.offset().left+"px");
    textareaWf.css("width",textarea.width()+"px");
    textareaWf.css("height",textarea.height()+"px");

    textareaWf.appendTo(wireframeContainer);
}