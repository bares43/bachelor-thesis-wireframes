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

    elementTypes: ["DoNothing","Image","FormInputText","FormInputSubmit","FormTextarea" ,"Text",/*"BackgroundImage",*/"Iframe","Element"],

    defaultNodeOptions:{
        position:true,
        positionTopAdd:0,
        positionLeftAdd:0
    },

    wireframeOptions:{},
    container : null,

    basePosition: function(el, original,nodeOptions){
        //el.css("position", "absolute");
        //el.css("top", (original.offset().top + nodeOptions.positionTopAdd) + "px");
        //el.css("left", (original.offset().left + nodeOptions.positionLeftAdd) + "px");
        //el.css("width", original.width() + "px");
        //el.css("height", original.height() + "px");
    },

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
            textShadow : "none"
        });
    },

    walk: function (node, nodeOptions) {
        var $node = $(node);
        var walkChilds = true;
        nodeOptions = $.extend({},Wireframe.defaultNodeOptions, nodeOptions);

        var length = Wireframe.elementTypes.length;
        for(var i = 0;i<length;++i){
            var type = Wireframe.elementTypes[i];
            if($node.is(":is"+type)){
                if(typeof Wireframe["process"+type+"Before"] === "function"){
                    Wireframe["process"+type+"Before"]($node, nodeOptions);
                }

                var result = Wireframe["process"+type]($node, nodeOptions);

                if(typeof Wireframe["process"+type+"After"] === "function"){
                    var afterResult = Wireframe["process"+type+"After"]($node, nodeOptions);
                }

                afterResult = typeof afterResult === "object" && afterResult !== null ? afterResult : {};
                result = $.extend(result, afterResult);

                walkChilds = result.walkChilds;
                if(result.nodeOptions){
                    nodeOptions = result.nodeOptions;
                }
                break;
            }
        }

        if (walkChilds) {
            var childrens = $node.children();
            childrens.each(function (i, v) {
                Wireframe.walk(v, nodeOptions);
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