// table
jQuery.expr[":"].isTable = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("table"));
};

Wireframe.processTable = function (node, nodeOptions) {
    var $table = $("<table></table>");
    Wireframe.copyCss(node,$table,"width");
    Wireframe.copyCss(node,$table,"height");
    if (nodeOptions.position) {
        Wireframe.basePosition($table, node, nodeOptions);
        nodeOptions.positionLeftAdd = -$(node).offset().left;
        nodeOptions.positionTopAdd = -$(node).offset().top;
    }
    Wireframe.copyAttr(node,$table,"border");
    Wireframe.setWireframeContainer($table);
    return {walkChilds: true, nodeOptions: nodeOptions};
};

// tr
jQuery.expr[":"].isTableRow = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("tr"));
};

Wireframe.processTableRow = function (node, nodeOptions) {
    var $tr = $("<tr></tr>");
    Wireframe.copyCss(node,$tr,"width");
    Wireframe.copyCss(node,$tr,"height");
    Wireframe.setWireframeContainer($tr);
    return {walkChilds: true, nodeOptions: nodeOptions};
};

// td/th
jQuery.expr[":"].isTableCellInline = function (elem) {
    var isInline = true;
    if ($(elem).is(":visibleElement") && ($(elem).is("td") || $(elem).is("th"))) {
        var childrens = $(elem).children();
        if (childrens.length == 0) return isInline;
        childrens.each(function (i, v) {
            if (!$(v).is(":isOneLineText")) {
                isInline = false;
            }
        });
        return isInline;
    }
    return false;
};

Wireframe.processTableCellInline = function (node, nodeOptions) {
    if($(node).is("th")){
        var $cell = $("<th></th>");
    }else{
        var $cell = $("<td></td>");
    }
    //if (nodeOptions.position) {
    //    Wireframe.basePosition($cell, node, nodeOptions);
    //}

    Wireframe.copyAttr(node,$cell,"colspan");
    Wireframe.copyAttr(node,$cell,"rowspan");
    Wireframe.copyCss(node,$cell,"width");
    Wireframe.copyCss(node,$cell,"height");
    var result = Wireframe.processOneLineText(node, $.extend({},nodeOptions, {position: false}));
    $cell.html(result.node);
    Wireframe.append($cell);
    return {walkChilds: false, nodeOptions:nodeOptions };
};

// td/th
jQuery.expr[":"].isTableCellChildrens = function (elem) {
    var r = true;
    if ($(elem).is(":visibleElement") && ($(elem).is("td") || $(elem).is("th"))) {
        var childrens = $(elem).children();
        if (childrens.length == 0) r = false;
        return r;
    }
    return false;
};

Wireframe.processTableCellChildrens = function (node, nodeOptions) {
    if($(node).is("th")){
        var $cell = $("<th></th>");
    }else{
        var $cell = $("<td></td>");
    }

    //if (nodeOptions.position) {
    //    Wireframe.basePosition($cell, node, nodeOptions);
    //}

    Wireframe.copyAttr(node,$cell,"colspan");
    Wireframe.copyAttr(node,$cell,"rowspan");
    Wireframe.copyCss(node,$cell,"width");
    Wireframe.copyCss(node,$cell,"height");
    Wireframe.setWireframeContainer($cell);

    //nodeOptions.positionLeftAdd = -$(node).offset().left;
    //nodeOptions.positionTopAdd = -$(node).offset().top;
    nodeOptions.position = false;
    return {walkChilds: true, nodeOptions: nodeOptions};
};