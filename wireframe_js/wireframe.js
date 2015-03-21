var Wireframe = {

    elementTypes: ["FormSelect", "FormTextarea", "FormRadio", "FormCheckbox", "FormFile", "FormButton", "FormRange", "FormInput", "Slider", "Iframe", "Image", "OneLineText"],

    walk: function (node) {
        var jq = $(node);
        var walkChilds = true;

        if (jq.is(":displayNone") || jq.is("script")) {
            walkChilds = false;
        }
        else {
            var length = Wireframe.elementTypes.length;
            for(var i = 0;i<length;++i){
                var type = Wireframe.elementTypes[i];
                if(jq.is(":is"+type)){
                    Wireframe["process"+type](jq);
                    break;
                }
            }
        }

        if (walkChilds) {
            var childrens = jq.children();
            childrens.each(function (i, v) {
                Wireframe.walk(v);
            });
        }
    },

    wireframeContainer:"",

    run: function (element, options) {

        var container = $(element);
        if (container.is(document)) {
            //var webContainer = $("body");
            //
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
