var Wireframe = {

    TEXT_LOREM : "text_lorem",
    TEXT_ORIGINAL : "text_original",
    TEXT_BOX : "text_box",

    IMAGE_BOX : "image_box",
    IMAGE_ORIGINAL : "image_original",
    IMAGE_BLUR : "image_blur",
    IMAGE_REMOVE : "image_remove",

    GRAY_TEXT : "#dfdfdf",
    GRAY_IMAGE : "#bfbfbf",
    GRAY_INPUT : "#b0b0b0",
    GRAY_OTHER : "#9d9d9d",

    elementTypes: ["DoNothing","Image","FormInputText","FormInputSubmit","FormTextarea", "FormSelect" ,"Text","Iframe","Svg","Element"],

    defaultNodeOptions:{
        position:true,
        positionTopAdd:0,
        positionLeftAdd:0
    },

    wireframeOptions:{},
    container : null,

    append : function(element){
        Wireframe.container.append(element);
    },

    copyCss: function(from, to, rule){
        to.css(rule,from.css(rule));
    },

    copyAttr: function(from, to, name){
        to.attr(name,from.attr(name));
    },

    doBaseFormat : function(node){
        node.css({
            color : "black",
            background : "none",
            textDecoration : "none",
            border : "none",
            boxShadow : "none",
            textShadow : "none",
            overflow : "hidden",
            transition : "none"
        });

        Wireframe.processPseudoElements(node);
    },

    processPseudoElements : function(node){
        var selector = node.getSelector(true);

        var pseudo_elements = ["before","after"];

        $.each(pseudo_elements, function(i,pseudo_element){
            var properties_before = window.getComputedStyle(node.get(0), ':'+pseudo_element) ;

            if(properties_before.getPropertyValue("background-image") !== "none"){
                switch (Wireframe.wireframeOptions.imageMode){
                    case Wireframe.IMAGE_BLUR:
                        jss.set(selector+":"+pseudo_element,{
                            "-webkit-filter" : "blur(10px)"
                        });
                        break;
                    case Wireframe.IMAGE_BOX:
                        jss.set(selector+":"+pseudo_element,{
                            "background-color" : Wireframe.GRAY_IMAGE,
                            "background-image" : "none"
                        });
                        break;
                    case Wireframe.IMAGE_REMOVE:
                        jss.set(selector+":"+pseudo_element,{
                            "display" : "none"
                        });
                        break;
                }
            }
            else if(properties_before.getPropertyValue("content").length > 0){
                jss.set(selector+":"+pseudo_element,{
                    "display" : "none"
                });
            }
        });

    },

    walk: function (node) {
        var $node = $(node);
        var walkChilds = true;

        var length = Wireframe.elementTypes.length;
        for(var i = 0;i<length;++i){
            var type = Wireframe.elementTypes[i];
            if($node.is(":is"+type)){
                if(typeof Wireframe["process"+type+"Before"] === "function"){
                    Wireframe["process"+type+"Before"]($node);
                }

                var result = Wireframe["process"+type]($node);

                if(typeof Wireframe["process"+type+"After"] === "function"){
                    var afterResult = Wireframe["process"+type+"After"]($node);
                }

                afterResult = typeof afterResult === "object" && afterResult !== null ? afterResult : {};
                result = $.extend(result, afterResult);

                walkChilds = result.walkChilds;

                break;
            }
        }

        if (walkChilds) {
            var childrens = $node.children();
            childrens.each(function (i, v) {
                Wireframe.walk(v);
            });
        }
    },

    run: function (element, options, response) {

        Wireframe.wireframeOptions = options;

        var container = $(element);

        if(typeof Wireframe.before === "function"){
            container = Wireframe.before(container, response);
        }

        if (container.is(document)) {
            Wireframe.container = container.find("body");

            this.walk(Wireframe.container,{});

            $("html,body",container).css("background","none");
            $("html,body",container).css("background-color","white");

        }

        if(typeof Wireframe.after === "function"){
            container = Wireframe.after(container, response);
        }

        return container;
    }
};