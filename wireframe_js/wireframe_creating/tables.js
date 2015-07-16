// table
jQuery.expr[":"].isTable = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("table"));
};

WireframeCreating.processTable = function (node, nodeOptions) {
    var $table = $("<table></table>");
    WireframeCreating.copyCss(node,$table,"width");
    WireframeCreating.copyCss(node,$table,"height");
    if (nodeOptions.position) {
        WireframeCreating.basePosition($table, node, nodeOptions);
        nodeOptions.positionLeftAdd = -$(node).offset().left;
        nodeOptions.positionTopAdd = -$(node).offset().top;
    }
    WireframeCreating.copyAttr(node,$table,"border");
    WireframeCreating.setWireframeContainer($table);
    return {walkChilds: true, nodeOptions: nodeOptions};
};

// tr
jQuery.expr[":"].isTableRow = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("tr"));
};

WireframeCreating.processTableRow = function (node, nodeOptions) {
    var $tr = $("<tr></tr>");
    WireframeCreating.copyCss(node,$tr,"width");
    WireframeCreating.copyCss(node,$tr,"height");
    WireframeCreating.setWireframeContainer($tr);
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

WireframeCreating.processTableCellInline = function (node, nodeOptions) {
    if($(node).is("th")){
        var $cell = $("<th></th>");
    }else{
        var $cell = $("<td></td>");
    }
    //if (nodeOptions.position) {
    //    WireframeCreating.basePosition($cell, node, nodeOptions);
    //}

    WireframeCreating.copyAttr(node,$cell,"colspan");
    WireframeCreating.copyAttr(node,$cell,"rowspan");
    WireframeCreating.copyCss(node,$cell,"width");
    WireframeCreating.copyCss(node,$cell,"height");
    var result = WireframeCreating.processOneLineText(node, $.extend({},nodeOptions, {position: false}));
    $cell.html(result.node);
    WireframeCreating.append($cell);
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

WireframeCreating.processTableCellChildrens = function (node, nodeOptions) {
    if($(node).is("th")){
        var $cell = $("<th></th>");
    }else{
        var $cell = $("<td></td>");
    }

    //if (nodeOptions.position) {
    //    WireframeCreating.basePosition($cell, node, nodeOptions);
    //}

    WireframeCreating.copyAttr(node,$cell,"colspan");
    WireframeCreating.copyAttr(node,$cell,"rowspan");
    WireframeCreating.copyCss(node,$cell,"width");
    WireframeCreating.copyCss(node,$cell,"height");
    WireframeCreating.setWireframeContainer($cell);

    //nodeOptions.positionLeftAdd = -$(node).offset().left;
    //nodeOptions.positionTopAdd = -$(node).offset().top;
    nodeOptions.position = false;
    return {walkChilds: true, nodeOptions: nodeOptions};
};