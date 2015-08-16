var WireframeReplacing = {
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
        WireframeReplacing.container.append(element);
    },

    copyCss: function(from, to, rule){
        to.css(rule,from.css(rule));
    },

    copyAttr: function(from, to, name){
        to.attr(name,from.attr(name));
    },

    doBaseFormat : function(node){
      $(node).css("color","black");
      $(node).css("background","none");
      $(node).css("text-decoration","none");
      $(node).css("border","none");
      $(node).css("box-shadow","none");
      $(node).css("text-shadow","none");
    },

    walk: function (node, nodeOptions) {
        var $node = $(node);
        var walkChilds = true;
        nodeOptions = $.extend({},WireframeReplacing.defaultNodeOptions, nodeOptions);

        var length = WireframeReplacing.elementTypes.length;
        for(var i = 0;i<length;++i){
            var type = WireframeReplacing.elementTypes[i];
            if($node.is(":is"+type)){
                var result = WireframeReplacing["process"+type]($node, nodeOptions);
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
                WireframeReplacing.walk(v, nodeOptions);
            });
        }
    },

    run: function (element, options, response) {

        WireframeReplacing.wireframeOptions = options;

        var container = $(element);

        if (container.is(document)) {
            WireframeReplacing.container = container.find("body");

            this.walk(WireframeReplacing.container,{});


            $("html,body",container).css("background","none");
            $("html,body",container).css("background-color","white");

        }

        return container;
    }
};