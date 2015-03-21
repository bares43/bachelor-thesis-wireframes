// try do detect if element is a slider
jQuery.expr[":"].isSlider = function(elem) {
    elem = $(elem);
    var isSlider = false;
    if(elem.is("ul") || elem.is("ol")){
        $("li", elem).each(function(i,v){
            if(($(v).css("position") == "absolute" || $(v).css("float") == "left" || $(v).css("float") == "right") &&
                ($(v).find("img").length > 0 || $(v).find("div:block").length > 0/* || $(v).find("a:block").length > 0)*/)){
                isSlider = true;
            }
        });
    }else{
        isSlider = false;
    }
    return isSlider;
};

function processSlider(slider, wireframeContainer){
    var sliderWf = $("<div />");

    sliderWf.css("position","absolute");
    sliderWf.css("background-color","#d7d7d7");
    sliderWf.css("height",slider.find("li").height()+"px");
    sliderWf.css("width",slider.find("li").width()+"px");

    //var img = slider.find("img");
    //sliderWf.css("background-image","url('"+img.attr("src")+"')");

    sliderWf.css("top",slider.offset().top+"px");
    sliderWf.css("left",slider.offset().left+"px");

    sliderWf.appendTo(wireframeContainer);

}