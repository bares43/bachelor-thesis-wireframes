// ol/ul
jQuery.expr[":"].isList = function (elem) {
    console.log("expression list");
    var r = ($(elem).is(":visibleElement") && ($(elem).is("ol") || $(elem).is("ul")));
    //console.log(r);
    return r;
};

Wireframe.processList = function (list, nodeOptions) {
    if (list.is("ul")) {
        var listWf = $("<ul></ul>");
        //console.log("procesuji ul");
    }
    else if (list.is("ol")) {
        var listWf = $("<ol></ol>");
        //console.log("procesuji ol");
    }
    console.log("procesuji list "+$(list).attr("id"));
    Wireframe.copyCss(list, listWf, "list-style-type");

    if (nodeOptions.position) {
        //Wireframe.basePosition(listWf, list);

    }
    Wireframe.wireframeContainer.push(listWf);
    Wireframe.popWireframeContainer.pop();
    Wireframe.popWireframeContainer.push(true);

    return {walkChilds: true, nodeOptions: nodeOptions};
};

// li inline
jQuery.expr[":"].isListItemInline = function (elem) {
    var isInline = true;
    if ($(elem).is(":visibleElement") && $(elem).is("li")) {
        var childrens = $(elem).children();
        console.log("id: "+$(elem).attr("id"));
        console.log("deti: "+childrens.length);
        if (childrens.length == 0) return isInline;
        childrens.each(function (i, v) {
            console.log($(v).attr("id"));
            if (!$(v).is(":isOneLineText")) {
                isInline = false;
            }
        });
        console.log("je inline");
        return isInline;
    }
    return false;
};

Wireframe.processListItemInline = function (listItem, nodeOptions) {
    console.log("inline li");
    var li = $("<li></li>");
    if (nodeOptions.position) {
        Wireframe.basePosition(li, listItem, nodeOptions);
    }
    var result = Wireframe.processOneLineText(listItem, $.extend({},nodeOptions, {position: false}));
    li.html(result.node);
    Wireframe.append(li);
    return {walkChilds: false, nodeOptions:nodeOptions };
};

// li with childrens
jQuery.expr[":"].isListItemChildrens = function (elem) {
    var r = true;
    if ($(elem).is(":visibleElement") && $(elem).is("li")) {
        var childrens = $(elem).children();
        if (childrens.length == 0) r = false;
        return r;
    }
    return false;
};

Wireframe.processListItemChildrens = function (listItem, nodeOptions) {
    console.log("li s potomky");
    var li = $("<li></li>");
    if (nodeOptions.position) {
        Wireframe.basePosition(li, listItem, nodeOptions);
    }
    Wireframe.setWireframeContainer(li);

    nodeOptions.positionLeftAdd = -$(listItem).offset().left;
    nodeOptions.positionTopAdd = -$(listItem).offset().top;
    console.log("odecitam top "+$(listItem).offset().top);
    console.log("top je "+nodeOptions.positionTopAdd);
    console.log("odecitam left "+$(listItem).offset().left);
    console.log("left je "+nodeOptions.positionLeftAdd);
    nodeOptions.position = true;
    return {walkChilds: true, nodeOptions: nodeOptions};
};