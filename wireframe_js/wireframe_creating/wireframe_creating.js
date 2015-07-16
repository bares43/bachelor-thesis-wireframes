var WireframeCreating = {

    elementTypes: ["DoNothing","List","ListItemInline","ListItemChildrens","Table","TableRow","TableCellInline","TableCellChildrens", "FormSelect", "FormTextarea", "FormRadio", "FormCheckbox", "FormFile", "FormButton", "FormRange", "FormInput", "Slider", "Iframe", "Image","HeadingInline", "OneLineText"],

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
        WireframeCreating.popWireframeContainer.push(false);
        nodeOptions = $.extend({},WireframeCreating.defaultNodeOptions, nodeOptions);

        var length = WireframeCreating.elementTypes.length;
        for(var i = 0;i<length;++i){
            var type = WireframeCreating.elementTypes[i];
            if($node.is(":is"+type)){
                var result = WireframeCreating["process"+type]($node, nodeOptions);
                walkChilds = result.walkChilds;
                if(result.nodeOptions){
                    nodeOptions = result.nodeOptions;
                }
                //console.log(JSON.stringify(nodeOptions));
                break;
            }
        }

        if (walkChilds) {
            var childrens = $node.children();
            childrens.each(function (i, v) {
                WireframeCreating.walk(v, nodeOptions);
            });
        }

        if(WireframeCreating.popWireframeContainer.pop()){
            WireframeCreating.append(WireframeCreating.wireframeContainer.pop());
        }

    },

    copyCss: function(from, to, rule){
        to.css(rule,from.css(rule));
    },

    copyAttr: function(from, to, name){
        to.attr(name,from.attr(name));
    },

    basePosition: function(el, original,nodeOptions){
        //console.log("top budu pricitat "+nodeOptions.positionTopAdd);
        //console.log("left budu pricitat "+nodeOptions.positionLeftAdd);
        el.css("position", "absolute");
        el.css("top", (original.offset().top + nodeOptions.positionTopAdd) + "px");
        el.css("left", (original.offset().left + nodeOptions.positionLeftAdd) + "px");
        el.css("width", original.width() + "px");
        el.css("height", original.height() + "px");
    },

    append : function(element){
        WireframeCreating.getCurrentWireframeContainer().append(element);
    },

    getCurrentWireframeContainer : function(){
        return WireframeCreating.wireframeContainer[WireframeCreating.wireframeContainer.length-1];
    },

    setWireframeContainer : function(element){
        WireframeCreating.wireframeContainer.push(element);
        WireframeCreating.popWireframeContainer.pop();
        WireframeCreating.popWireframeContainer.push(true);
    },

    run: function (element, options) {

        WireframeCreating.wireframeOptions = options;

        var container = $(element);

        //containerWf.find("html").replaceWith($("<html />"));
        //containerWf.find("body").replaceWith($("<body />"));

        if (container.is(document)) {
            //console.log("tvorim wf");

            WireframeCreating.wireframeContainer.push($("<div />").css("position", "relative"));


            this.walk(container.find("body"),{});

            //container.find("html").replaceWith($("<html />"));
            container.find("body").replaceWith($("<body />"));

            $("html,body",container).css("background","none");
            $("html,body",container).css("background-color","white");

            container.find("body").append(WireframeCreating.wireframeContainer[0]);

        }
        return container;
    }
};