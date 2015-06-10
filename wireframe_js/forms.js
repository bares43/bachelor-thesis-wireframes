// input type radio
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
};