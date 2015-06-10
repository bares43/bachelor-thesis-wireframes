var Wireframe = {

    elementTypes: ["DoNothing","List","ListItemInline","ListItemChildrens","Table","TableRow","TableCellInline","TableCellChildrens", "FormSelect", "FormTextarea", "FormRadio", "FormCheckbox", "FormFile", "FormButton", "FormRange", "FormInput", "Slider", "Iframe", "Image", "OneLineText"],

    wireframeContainer:[],

    popWireframeContainer:[],

    defaultNodeOptions:{
        position:true,
        positionTopAdd:0,
        positionLeftAdd:0
    },

    wireframeOptions:{},

    walk: function (node, nodeOptions) {
        var $node = $(node);
        var walkChilds = true;
        Wireframe.popWireframeContainer.push(false);
        nodeOptions = $.extend({},Wireframe.defaultNodeOptions, nodeOptions);

        var length = Wireframe.elementTypes.length;
        for(var i = 0;i<length;++i){
            var type = Wireframe.elementTypes[i];
            if($node.is(":is"+type)){
                var result = Wireframe["process"+type]($node, nodeOptions);
                walkChilds = result.walkChilds;
                if(result.nodeOptions){
                    nodeOptions = result.nodeOptions;
                }
                console.log(JSON.stringify(nodeOptions));
                break;
            }
        }

        if (walkChilds) {
            var childrens = $node.children();
            childrens.each(function (i, v) {
                Wireframe.walk(v, nodeOptions);
            });
        }

        if(Wireframe.popWireframeContainer.pop()){
            Wireframe.append(Wireframe.wireframeContainer.pop());
        }

    },

    copyCss: function(from, to, rule){
        to.css(rule,from.css(rule));
    },

    copyAttr: function(from, to, name){
        to.attr(name,from.attr(name));
    },

    basePosition: function(el, original,nodeOptions){
        console.log("top budu pricitat "+nodeOptions.positionTopAdd);
        console.log("left budu pricitat "+nodeOptions.positionLeftAdd);
        el.css("position", "absolute");
        el.css("top", (original.offset().top + nodeOptions.positionTopAdd) + "px");
        el.css("left", (original.offset().left + nodeOptions.positionLeftAdd) + "px");
        el.css("width", original.width() + "px");
        el.css("height", original.height() + "px");
    },

    append : function(element){
        Wireframe.getCurrentWireframeContainer().append(element);
    },

    getCurrentWireframeContainer : function(){
        return Wireframe.wireframeContainer[Wireframe.wireframeContainer.length-1];
    },

    setWireframeContainer : function(element){
        Wireframe.wireframeContainer.push(element);
        Wireframe.popWireframeContainer.pop();
        Wireframe.popWireframeContainer.push(true);
    },

    run: function (element, options) {

        Wireframe.wireframeOptions = options;

        var container = $(element);
        if (container.is(document)) {

            Wireframe.wireframeContainer.push($("<div />").css("position", "relative"));


            this.walk(container.find("body"),{});


            container.find("html").css("background", "none");
            container.find("html").css("background-color", "white");

            container.find("body").replaceWith($("<body />"));

            container.find("body").append(Wireframe.wireframeContainer[0]);

        }

        return container;
    }
};