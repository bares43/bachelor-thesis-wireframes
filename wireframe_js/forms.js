// input type radio
jQuery.expr[":"].isFormRadio = function (elem) {
    return (isVisible(elem) && $(elem).is("[type=radio]"));
};

Wireframe.processFormRadio = function (radio) {
        var radioWf = $("<input />");
        radioWf.attr("type", "radio");
        if (radio.is(":checked")) {
            radioWf.attr("checked", "checked");
        }

        radioWf.css("position", "absolute");
        radioWf.css("top", radio.offset().top + "px");
        radioWf.css("left", radio.offset().left + "px");
        radioWf.css("width", radio.width() + "px");
        radioWf.css("height", radio.height() + "px");

        radioWf.appendTo(wireframeContainer);
        return false;
};

// input type checkbox
jQuery.expr[":"].isFormCheckbox = function (elem) {
    return (isVisible(elem) && $(elem).is("[type=checkbox]"));
};

Wireframe.processFormCheckbox = function(checkbox) {
    var checkboxWf = $("<input />");
    checkboxWf.attr("type", "checkbox");
    if (checkbox.is(":checked")) {
        checkboxWf.attr("checked", "checked");
    }

    checkboxWf.css("position", "absolute");
    checkboxWf.css("top", checkbox.offset().top + "px");
    checkboxWf.css("left", checkbox.offset().left + "px");
    checkboxWf.css("width", checkbox.width() + "px");
    checkboxWf.css("height", checkbox.height() + "px");

    checkboxWf.appendTo(wireframeContainer);
    return false;
};

// input type file
jQuery.expr[":"].isFormFile = function (elem) {
    return (isVisible(elem) && $(elem).is("[type=file]"));
};

Wireframe.processFormFile = function(file) {
    var fileWf = $("<input />");
    fileWf.attr("type", "file");

    fileWf.css("position", "absolute");
    fileWf.css("top", file.offset().top + "px");
    fileWf.css("left", file.offset().left + "px");
    fileWf.css("width", file.width() + "px");
    fileWf.css("height", file.height() + "px");

    fileWf.appendTo(wireframeContainer);
    return false;
};

// input type submit/reset/image or button
jQuery.expr[":"].isFormButton = function (elem) {
    return (isVisible(elem) && ($(elem).is("[type=submit]") || $(elem).is("[type=reset]") || $(elem).is("[type=image]") || $(elem).is("button")));
};

Wireframe.processFormButton = function(button) {
    var buttonWf = $("<input />");
    buttonWf.attr("type", "submit");

    buttonWf.attr("value", "");

    buttonWf.css("position", "absolute");
    buttonWf.css("top", button.offset().top + "px");
    buttonWf.css("left", button.offset().left + "px");
    buttonWf.css("width", button.width() + "px");
    buttonWf.css("height", button.height() + "px");

    buttonWf.appendTo(wireframeContainer);
    return false;
};

// input type range
jQuery.expr[":"].isFormRange = function (elem) {
    return (isVisible(elem) && $(elem).is("[type=range]"));
};

Wireframe.processFormRange = function(input) {
    var inputWf = $("<input />");
    inputWf.attr("type", "range");

    inputWf.css("position", "absolute");
    inputWf.css("top", input.offset().top + "px");
    inputWf.css("left", input.offset().left + "px");
    inputWf.css("width", input.width() + "px");
    inputWf.css("height", input.height() + "px");

    inputWf.appendTo(wireframeContainer);
    return false;
};

// input type text
jQuery.expr[":"].isFormInput = function (elem) {
    return (isVisible(elem) && $(elem).is("input") && !$(elem).is("[type=hidden]") && !$(elem).is(":isFormRadio") && !$(elem).is(":isFormCheckbox") && !$(elem).is(":isFormFile") && !$(elem).is(":isFormButton") && !$(elem).is(":isFormRange"));
};

Wireframe.processFormInput = function(input) {
    var inputWf = $("<input />");
    inputWf.attr("type", "text");

    inputWf.css("position", "absolute");
    inputWf.css("top", input.offset().top + "px");
    inputWf.css("left", input.offset().left + "px");
    inputWf.css("width", input.width() + "px");
    inputWf.css("height", input.height() + "px");

    inputWf.appendTo(wireframeContainer);
    return false;
};

// select
jQuery.expr[":"].isFormSelect = function (elem) {
    return (isVisible(elem) && $(elem).is("select"));
};

Wireframe.processFormSelect = function(select) {
    var selectWf = $("<select />");

    if (select.is("[multiple]")) {
        selectWf.attr("multiple", "multiple");
    }

    selectWf.css("position", "absolute");
    selectWf.css("top", select.offset().top + "px");
    selectWf.css("left", select.offset().left + "px");
    selectWf.css("width", select.width() + "px");
    selectWf.css("height", select.height() + "px");

    selectWf.appendTo(wireframeContainer);
    return false;
};


// textarea
jQuery.expr[":"].isFormTextarea = function (elem) {
    return (isVisible(elem) && $(elem).is("textarea"));
};

Wireframe.processFormTextarea = function(textarea) {
    var textareaWf = $("<textarea />");

    textareaWf.css("position", "absolute");
    textareaWf.css("top", textarea.offset().top + "px");
    textareaWf.css("left", textarea.offset().left + "px");
    textareaWf.css("width", textarea.width() + "px");
    textareaWf.css("height", textarea.height() + "px");

    textareaWf.appendTo(wireframeContainer);
    return false;
};