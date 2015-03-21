function copyCss(from, to, rule) {
    to.css(rule, from.css(rule));
}

var Wireframe = {
    elementTypes: [ "FormSelect", "FormTextarea", "FormRadio", "FormCheckbox", "FormFile", "FormButton", "FormRange", "FormInput", "Slider", "Iframe", "Image", "OneLineText" ],
    walk: function(node) {
        var jq = $(node);
        var walkChilds = true;
        if (jq.is(":displayNone") || jq.is("script")) {
            walkChilds = false;
        } else {
            var length = Wireframe.elementTypes.length;
            for (var i = 0; i < length; ++i) {
                var type = Wireframe.elementTypes[i];
                if (jq.is(":is" + type)) {
                    walkChilds = Wireframe["process" + type](jq);
                    break;
                }
            }
        }
        if (walkChilds) {
            var childrens = jq.children();
            childrens.each(function(i, v) {
                Wireframe.walk(v);
            });
        }
    },
    wireframeContainer: "",
    run: function(element, options) {
        var container = $(element);
        if (container.is(document)) {
            wireframeContainer = $("<div />").css("position", "relative");
            this.walk(container.find("body"));
            container.find("html").css("background", "none");
            container.find("html").css("background-color", "white");
            container.find("body").replaceWith($("<body />"));
            container.find("body").append(wireframeContainer);
        }
        return container;
    }
};

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

jQuery.expr[":"].noChild = function(elem) {
    return jQuery(elem).children().length == 0 && isVisible(elem);
};

jQuery.expr[":"].visibleElement = function(elem) {
    return isVisible(elem);
};

jQuery.expr[":"].block = function(elem) {
    return $(elem).css("display") === "block";
};

jQuery.expr[":"].displayNone = function(elem) {
    return $(elem).css("display") === "none";
};

jQuery.expr[":"].isImage = function(elem) {
    return $(elem).is("img:visibleElement");
};

Wireframe.processImage = function(img) {
    var imgWF = $("<div />");
    imgWF.css("position", "absolute");
    imgWF.css("background-color", "#d7d7d7");
    imgWF.css("height", img.height() + "px");
    imgWF.css("width", img.width() + "px");
    imgWF.css("top", img.offset().top + "px");
    imgWF.css("left", img.offset().left + "px");
    imgWF.appendTo(wireframeContainer);
    return false;
};

jQuery.expr[":"].isOneLineText = function(elem) {
    return $(elem).is("span:noChild") || $(elem).is("a:noChild");
};

Wireframe.processOneLineText = function(elm) {
    var spanWF = $("<div />");
    spanWF.css("display", "block");
    spanWF.css("position", "absolute");
    spanWF.css("font-size", elm.css("font-size"));
    spanWF.css("font-family", elm.css("font-family"));
    spanWF.css("font-weight", elm.css("font-weight"));
    spanWF.css("line-height", elm.css("line-height"));
    copyCss(elm, spanWF, "font-size");
    copyCss(elm, spanWF, "font-family");
    copyCss(elm, spanWF, "font-weight");
    copyCss(elm, spanWF, "line-height");
    copyCss(elm, spanWF, "text-align");
    spanWF.css("word-wrap", "break-word");
    var trim = elm.text().length <= 10;
    spanWF.lorem({
        type: "characters",
        amount: elm.text().length,
        trim: trim
    });
    spanWF.css("height", elm.height() + "px");
    spanWF.css("width", elm.width() + "px");
    spanWF.css("top", elm.offset().top + "px");
    spanWF.css("left", elm.offset().left + "px");
    spanWF.appendTo(wireframeContainer);
    return false;
};

jQuery.expr[":"].isIframe = function(elem) {
    return $(elem).is("iframe");
};

Wireframe.processIframe = function(iframe) {
    var iframeWf = $("<div />");
    iframeWf.css("position", "absolute");
    iframeWf.css("height", iframe.height() + "px");
    iframeWf.css("width", iframe.width() + "px");
    iframeWf.css("top", iframe.offset().top + "px");
    iframeWf.css("left", iframe.offset().left + "px");
    iframeWf.css("background-color", "#d7d7d7");
    iframeWf.appendTo(wireframeContainer);
    return false;
};

jQuery.expr[":"].isSlider = function(elem) {
    elem = $(elem);
    var isSlider = false;
    if (elem.is("ul") || elem.is("ol")) {
        $("li", elem).each(function(i, v) {
            if (($(v).css("position") == "absolute" || $(v).css("float") == "left" || $(v).css("float") == "right") && ($(v).find("img").length > 0 || $(v).find("div:block").length > 0)) {
                isSlider = true;
            }
        });
    } else {
        isSlider = false;
    }
    return isSlider;
};

Wireframe.processSlider = function(slider) {
    var sliderWf = $("<div />");
    sliderWf.css("position", "absolute");
    sliderWf.css("background-color", "#d7d7d7");
    sliderWf.css("height", slider.find("li").height() + "px");
    sliderWf.css("width", slider.find("li").width() + "px");
    sliderWf.css("top", slider.offset().top + "px");
    sliderWf.css("left", slider.offset().left + "px");
    sliderWf.appendTo(wireframeContainer);
    return false;
};

jQuery.expr[":"].isFormRadio = function(elem) {
    return isVisible(elem) && $(elem).is("[type=radio]");
};

Wireframe.processFormRadio = function(radio) {
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

jQuery.expr[":"].isFormCheckbox = function(elem) {
    return isVisible(elem) && $(elem).is("[type=checkbox]");
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

jQuery.expr[":"].isFormFile = function(elem) {
    return isVisible(elem) && $(elem).is("[type=file]");
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

jQuery.expr[":"].isFormButton = function(elem) {
    return isVisible(elem) && ($(elem).is("[type=submit]") || $(elem).is("[type=reset]") || $(elem).is("[type=image]") || $(elem).is("button"));
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

jQuery.expr[":"].isFormRange = function(elem) {
    return isVisible(elem) && $(elem).is("[type=range]");
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

jQuery.expr[":"].isFormInput = function(elem) {
    return isVisible(elem) && $(elem).is("input") && !$(elem).is("[type=hidden]") && !$(elem).is(":isFormRadio") && !$(elem).is(":isFormCheckbox") && !$(elem).is(":isFormFile") && !$(elem).is(":isFormButton") && !$(elem).is(":isFormRange");
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

jQuery.expr[":"].isFormSelect = function(elem) {
    return isVisible(elem) && $(elem).is("select");
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

jQuery.expr[":"].isFormTextarea = function(elem) {
    return isVisible(elem) && $(elem).is("textarea");
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

(function($) {
    $.fn.wireframe = function(options, fn) {
        var defaults = {
            srvUrl: ""
        };
        var options = $.extend(defaults, options);
        return Wireframe.run(this, options);
    };
})(jQuery);