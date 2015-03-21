function copyCss(from,to,rule){
    to.css(rule,from.css(rule));
}

function dump(node){
    return;
    node = $(node);
    if(node.is("a")){
        console.log("a "+node.text());
    }
    else if(node.is("div")){
        console.log("div");
    }
    else if(node.is("p")){
        console.log("p");
    }
    else if(node.is("body")){
        console.log("body");
    }
    else if(node.is("script")){
        console.log("script");
    }
}