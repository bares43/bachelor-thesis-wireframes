// input type radio
jQuery.expr[":"].isFormRadio = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("[type=radio]"));
};

Wireframe.processFormRadio = function (radio) {
    var radioWf = $("<input />");
    radioWf.attr("type", "radio");
    if (radio.is(":checked")) {
        radioWf.attr("checked", "checked");
    }

    Wireframe.basePosition(radioWf, radio);
    Wireframe.append(radioWf);

    return false;
};

// input type checkbox
jQuery.expr[":"].isFormCheckbox = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("[type=checkbox]"));
};

Wireframe.processFormCheckbox = function (checkbox) {
    var checkboxWf = $("<input />");
    checkboxWf.attr("type", "checkbox");
    if (checkbox.is(":checked")) {
        checkboxWf.attr("checked", "checked");
    }

    Wireframe.basePosition(checkboxWf, checkbox);
    Wireframe.append(checkboxWf);

    return false;
};

// input type file
jQuery.expr[":"].isFormFile = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("[type=file]"));
};

Wireframe.processFormFile = function (file) {
    var fileWf = $("<input />");
    fileWf.attr("type", "file");

    Wireframe.basePosition(fileWf, file);
    Wireframe.append(fileWf);

    return false;
};

// input type submit/reset/image or button
jQuery.expr[":"].isFormButton = function (elem) {
    return ($(elem).is(":visibleElement") && ($(elem).is("[type=submit]") || $(elem).is("[type=reset]") || $(elem).is("[type=image]") || $(elem).is("button")));
};

Wireframe.processFormButton = function (button) {
    var buttonWf = $("<input />");
    buttonWf.attr("type", "submit");

    buttonWf.attr("value", "");

    Wireframe.basePosition(buttonWf, button);
    Wireframe.append(buttonWf);

    return false;
};

// input type range
jQuery.expr[":"].isFormRange = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("[type=range]"));
};

Wireframe.processFormRange = function (input) {
    var inputWf = $("<input />");
    inputWf.attr("type", "range");

    Wireframe.basePosition(inputWf, input);
    Wireframe.append(inputWf);

    return false;
};

// input type text
jQuery.expr[":"].isFormInput = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("input") && !$(elem).is("[type=hidden]") && !$(elem).is(":isFormRadio") && !$(elem).is(":isFormCheckbox") && !$(elem).is(":isFormFile") && !$(elem).is(":isFormButton") && !$(elem).is(":isFormRange"));
};

Wireframe.processFormInput = function (input) {
    var inputWf = $("<input />");
    inputWf.attr("type", "text");

    Wireframe.basePosition(inputWf, input);
    Wireframe.append(inputWf);

    return false;
};

// select
jQuery.expr[":"].isFormSelect = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("select"));
};

Wireframe.processFormSelect = function (select) {
    var selectWf = $("<select />");

    if (select.is("[multiple]")) {
        selectWf.attr("multiple", "multiple");
    }

    Wireframe.basePosition(selectWf, select);
    Wireframe.append(selectWf);

    return false;
};

// textarea
jQuery.expr[":"].isFormTextarea = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("textarea"));
};

Wireframe.processFormTextarea = function (textarea) {
    var textareaWf = $("<textarea />");

    Wireframe.basePosition(textareaWf, textarea);
    Wireframe.append(textareaWf);

    return false;
};