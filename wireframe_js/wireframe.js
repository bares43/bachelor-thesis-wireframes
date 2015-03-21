
var Wireframe =  {
    walk : function(node) {
        var jq = $(node);
        var walkChilds = true;


        //console.log(jq.attr("id"));

        if (jq.is(":displayNone")) {
            walkChilds = false;
        } else if (jq.is("script")) {
            walkChilds = false;
        }
        else if (jq.is(":isIframe")) {
            walkChilds = Wireframe.processIframe(jq);
        }
        else if (jq.is("select:isFormSelect")) {
            walkChilds = Wireframe.processFormSelect(jq);
        }
        else if (jq.is("textarea:isFormTextarea")) {
            walkChilds = Wireframe.processFormTextarea(jq);
        }
        else if (jq.is("input:isFormRadio")) {
            walkChilds = Wireframe.processFormRadio(jq);
        }
        else if (jq.is("input:isFormCheckbox")) {
            walkChilds = Wireframe.processFormCheckbox(jq);
        }
        else if (jq.is("input:isFormFile")) {
            walkChilds = Wireframe.processFormFile(jq);
        }
        else if (jq.is(":isFormButton")) {
            walkChilds = Wireframe.processFormButton(jq);
        }
        else if (jq.is("input:isFormRange")) {
            walkChilds = Wireframe.processFormRange(jq);
        }
        else if (jq.is("input:isFormInput")) {
            walkChilds = Wireframe.processFormInput(jq);
        }
        else if (jq.is(":isSlider")) {
            walkChilds = Wireframe.processSlider(jq);
        }
        else if (jq.is(":isImage")) {
            walkChilds = Wireframe.processImage(jq);
        }
        else if (jq.is(":isOneLineText")) {
            walkChilds = Wireframe.processOneLineText(jq);
        }
        // etc

        if (walkChilds) {
            var childrens = jq.children();
            childrens.each(function (i, v) {
                Wireframe.walk(v);
            });
        }


    },

    wireframeContainer :$(""),

    run : function(element, options){

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
