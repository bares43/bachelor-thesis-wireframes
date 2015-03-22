var Wireframe = {

    elementTypes: ["DoNothing","FormSelect", "FormTextarea", "FormRadio", "FormCheckbox", "FormFile", "FormButton", "FormRange", "FormInput", "Slider", "Iframe", "Image", "OneLineText"],

    wireframeContainer:"",

    walk: function (node) {
        var jq = $(node);
        var walkChilds = true;

        var length = Wireframe.elementTypes.length;
        for(var i = 0;i<length;++i){
            var type = Wireframe.elementTypes[i];
            if(jq.is(":is"+type)){
                walkChilds = Wireframe["process"+type](jq);
                break;
            }
        }

        if (walkChilds) {
            var childrens = jq.children();
            childrens.each(function (i, v) {
                Wireframe.walk(v);
            });
        }
    },

    copyCss: function(from, to, rule){
        to.css(rule,from.css(rule));
    },

    basePosition: function(el, original){
        el.css("position", "absolute");
        el.css("top", original.offset().top + "px");
        el.css("left", original.offset().left + "px");
        el.css("width", original.width() + "px");
        el.css("height", original.height() + "px");
    },

    append : function(element){
        wireframeContainer.append(element);
    },

    run: function (element, options) {

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