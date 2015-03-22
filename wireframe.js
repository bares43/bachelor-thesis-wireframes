var Wireframe = {
    elementTypes: [ "DoNothing", "FormSelect", "FormTextarea", "FormRadio", "FormCheckbox", "FormFile", "FormButton", "FormRange", "FormInput", "Slider", "Iframe", "Image", "OneLineText" ],
    wireframeContainer: "",
    walk: function(node) {
        var jq = $(node);
        var walkChilds = true;
        var length = Wireframe.elementTypes.length;
        for (var i = 0; i < length; ++i) {
            var type = Wireframe.elementTypes[i];
            if (jq.is(":is" + type)) {
                walkChilds = Wireframe["process" + type](jq);
                break;
            }
        }
        if (walkChilds) {
            var childrens = jq.children();
            childrens.each(function(i, v) {
                Wireframe.walk(v);
            });
        }
    },
    copyCss: function(from, to, rule) {
        to.css(rule, from.css(rule));
    },
    basePosition: function(el, original) {
        el.css("position", "absolute");
        el.css("top", original.offset().top + "px");
        el.css("left", original.offset().left + "px");
        el.css("width", original.width() + "px");
        el.css("height", original.height() + "px");
    },
    append: function(element) {
        wireframeContainer.append(element);
    },
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

jQuery.expr[":"].isDoNothing = function(elem) {
    return $(elem).is(":displayNone") || $(elem).is(":toSmall") || $(elem).is("script");
};

Wireframe.processDoNothing = function() {
    return false;
};

jQuery.expr[":"].isImage = function(elem) {
    return $(elem).is("img:visibleElement");
};

Wireframe.processImage = function(img) {
    var imgWF = $("<div />");
    imgWF.css("position", "absolute");
    imgWF.css("background-color", "#d7d7d7");
    Wireframe.basePosition(imgWF, img);
    Wireframe.append(imgWF);
    return false;
};

jQuery.expr[":"].isOneLineText = function(elem) {
    return $(elem).is("span:noChild") || $(elem).is("a:noChild");
};

Wireframe.processOneLineText = function(elm) {
    var spanWF = $("<div />");
    spanWF.css("display", "block");
    spanWF.css("font-size", elm.css("font-size"));
    spanWF.css("font-family", elm.css("font-family"));
    spanWF.css("font-weight", elm.css("font-weight"));
    spanWF.css("line-height", elm.css("line-height"));
    Wireframe.copyCss(elm, spanWF, "font-size");
    Wireframe.copyCss(elm, spanWF, "font-family");
    Wireframe.copyCss(elm, spanWF, "font-weight");
    Wireframe.copyCss(elm, spanWF, "line-height");
    Wireframe.copyCss(elm, spanWF, "text-align");
    spanWF.css("word-wrap", "break-word");
    var trim = elm.text().length <= 10;
    spanWF.lorem({
        type: "characters",
        amount: elm.text().length,
        trim: trim
    });
    Wireframe.basePosition(spanWF, elm);
    Wireframe.append(spanWF);
    return false;
};

jQuery.expr[":"].isIframe = function(elem) {
    return $(elem).is("iframe");
};

Wireframe.processIframe = function(iframe) {
    var iframeWf = $("<div />");
    iframeWf.css("background-color", "#d7d7d7");
    Wireframe.basePosition(iframeWf, iframe);
    Wireframe.append(iframeWf);
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
    sliderWf.css("background-color", "#d7d7d7");
    Wireframe.basePosition(sliderWf, slider);
    sliderWf.css("height", slider.find("li").height() + "px");
    sliderWf.css("width", slider.find("li").width() + "px");
    Wireframe.append(sliderWf);
    return false;
};

jQuery.expr[":"].isFormRadio = function(elem) {
    return $(elem).is(":visibleElement") && $(elem).is("[type=radio]");
};

Wireframe.processFormRadio = function(radio) {
    var radioWf = $("<input />");
    radioWf.attr("type", "radio");
    if (radio.is(":checked")) {
        radioWf.attr("checked", "checked");
    }
    Wireframe.basePosition(radioWf, radio);
    Wireframe.append(radioWf);
    return false;
};

jQuery.expr[":"].isFormCheckbox = function(elem) {
    return $(elem).is(":visibleElement") && $(elem).is("[type=checkbox]");
};

Wireframe.processFormCheckbox = function(checkbox) {
    var checkboxWf = $("<input />");
    checkboxWf.attr("type", "checkbox");
    if (checkbox.is(":checked")) {
        checkboxWf.attr("checked", "checked");
    }
    Wireframe.basePosition(checkboxWf, checkbox);
    Wireframe.append(checkboxWf);
    return false;
};

jQuery.expr[":"].isFormFile = function(elem) {
    return $(elem).is(":visibleElement") && $(elem).is("[type=file]");
};

Wireframe.processFormFile = function(file) {
    var fileWf = $("<input />");
    fileWf.attr("type", "file");
    Wireframe.basePosition(fileWf, file);
    Wireframe.append(fileWf);
    return false;
};

jQuery.expr[":"].isFormButton = function(elem) {
    return $(elem).is(":visibleElement") && ($(elem).is("[type=submit]") || $(elem).is("[type=reset]") || $(elem).is("[type=image]") || $(elem).is("button"));
};

Wireframe.processFormButton = function(button) {
    var buttonWf = $("<input />");
    buttonWf.attr("type", "submit");
    buttonWf.attr("value", "");
    Wireframe.basePosition(buttonWf, button);
    Wireframe.append(buttonWf);
    return false;
};

jQuery.expr[":"].isFormRange = function(elem) {
    return $(elem).is(":visibleElement") && $(elem).is("[type=range]");
};

Wireframe.processFormRange = function(input) {
    var inputWf = $("<input />");
    inputWf.attr("type", "range");
    Wireframe.basePosition(inputWf, input);
    Wireframe.append(inputWf);
    return false;
};

jQuery.expr[":"].isFormInput = function(elem) {
    return $(elem).is(":visibleElement") && $(elem).is("input") && !$(elem).is("[type=hidden]") && !$(elem).is(":isFormRadio") && !$(elem).is(":isFormCheckbox") && !$(elem).is(":isFormFile") && !$(elem).is(":isFormButton") && !$(elem).is(":isFormRange");
};

Wireframe.processFormInput = function(input) {
    var inputWf = $("<input />");
    inputWf.attr("type", "text");
    Wireframe.basePosition(inputWf, input);
    Wireframe.append(inputWf);
    return false;
};

jQuery.expr[":"].isFormSelect = function(elem) {
    return $(elem).is(":visibleElement") && $(elem).is("select");
};

Wireframe.processFormSelect = function(select) {
    var selectWf = $("<select />");
    if (select.is("[multiple]")) {
        selectWf.attr("multiple", "multiple");
    }
    Wireframe.basePosition(selectWf, select);
    Wireframe.append(selectWf);
    return false;
};

jQuery.expr[":"].isFormTextarea = function(elem) {
    return $(elem).is(":visibleElement") && $(elem).is("textarea");
};

Wireframe.processFormTextarea = function(textarea) {
    var textareaWf = $("<textarea />");
    Wireframe.basePosition(textareaWf, textarea);
    Wireframe.append(textareaWf);
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