// h1-h6
jQuery.expr[":"].isHeadingInline = function(elem) {
    var isInline = true;
    if ($(elem).is(":visibleElement") && ($(elem).is("h1") || $(elem).is("h2") || $(elem).is("h3") || $(elem).is("h4") || $(elem).is("h5") || $(elem).is("h6"))) {
        var childrens = $(elem).children();
        if (childrens.length == 0) return isInline;
        childrens.each(function (i, v) {
            //console.log($(v).attr("id"));
            if (!$(v).is(":isOneLineText")) {
                isInline = false;
            }
            if($(v).is("br")){
                isInline = true;
            }
        });
        return isInline;
    }
    return false;
};

WireframeCreating.processHeadingInline = function (node, nodeOptions) {
    //console.log($(node).prop("tagName"));
    switch($(node).prop("tagName")){
        case "H1":
            var $heading = $("<h1></h1>");
            break;
        case "H2":
            var $heading = $("<h2></h2>");
            break;
        case "H3":
            var $heading = $("<h3></h3>");
            break;
        case "H4":
            var $heading = $("<h4></h4>");
            break;
        case "H5":
            var $heading = $("<h5></h5>");
            break;
        case "H6":
            var $heading = $("<h6></h6>");
            break;
    }

    switch (WireframeCreating.wireframeOptions.textMode){
        case "lorem":
            var trim = node.text().length <= 10;
            $heading.lorem({type:"characters",amount:node.text().length,trim:trim});
            break;
        case "original":
            $heading.text(node.text());
            break;
        case "box":
            $heading.css("background-image",'url("'+WireframeCreating.wireframeOptions.srvUrl+'images/line.png")');
            WireframeCreating.copyCss(node,$heading,"height");
            WireframeCreating.copyCss(node,$heading,"width");
            break;
    }

    WireframeCreating.copyCss(node,$heading,"font-size");
    WireframeCreating.copyCss(node,$heading,"font-family");
    WireframeCreating.copyCss(node,$heading,"font-weight");
    WireframeCreating.copyCss(node,$heading,"line-height");
    WireframeCreating.copyCss(node,$heading,"text-align");

    if (nodeOptions.position) {
        WireframeCreating.basePosition($heading, node, nodeOptions);
    }
    WireframeCreating.append($heading);

    return {walkChilds:false,node:$heading};
};