// h1-h6
jQuery.expr[":"].isHeadingInline = function(elem) {
    var isInline = true;
    if ($(elem).is(":visibleElement") && ($(elem).is("h1") || $(elem).is("h2") || $(elem).is("h3") || $(elem).is("h4") || $(elem).is("h5") || $(elem).is("h6"))) {
        var childrens = $(elem).children();
        if (childrens.length == 0) return isInline;
        childrens.each(function (i, v) {
            console.log($(v).attr("id"));
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

Wireframe.processHeadingInline = function (node, nodeOptions) {
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

    switch (Wireframe.wireframeOptions.textMode){
        case "lorem":
            var trim = node.text().length <= 10;
            $heading.lorem({type:"characters",amount:node.text().length,trim:trim});
            break;
        case "original":
            $heading.text(node.text());
            break;
        case "box":
            $heading.css("background-image",'url("'+Wireframe.wireframeOptions.srvUrl+'images/line.png")');
            Wireframe.copyCss(node,$heading,"height");
            Wireframe.copyCss(node,$heading,"width");
            break;
    }

    Wireframe.copyCss(node,$heading,"font-size");
    Wireframe.copyCss(node,$heading,"font-family");
    Wireframe.copyCss(node,$heading,"font-weight");
    Wireframe.copyCss(node,$heading,"line-height");
    Wireframe.copyCss(node,$heading,"text-align");

    if (nodeOptions.position) {
        Wireframe.basePosition($heading, node, nodeOptions);
    }
    Wireframe.append($heading);

    return {walkChilds:false,node:$heading};
};