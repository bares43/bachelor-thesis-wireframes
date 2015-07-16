// input type radio
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
};