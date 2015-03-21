(function($){
    $.fn.wireframe = function(options, fn) {
        var defaults = {
            srvUrl:""
        };
        var options = $.extend(defaults, options);

        var container = $(this);




        function walk(node) {
            var jq = $(node);
            var walkChilds = true;

            //console.log(jq.attr("id"));

            if(jq.is("script")){
                walkChilds = false;
            }
            else if(jq.is("iframe")){
                processIframe(jq, wireframeContainer);
                walkChilds = false;
            }
            else if(jq.is("select:isFormSelect")){
                processFormSelect(jq, wireframeContainer);
                walkChilds = false;
            }
            else if(jq.is("textarea:isFormTextarea")){
                processFormTextarea(jq, wireframeContainer);
                walkChilds = false;
            }
            else if(jq.is("input:isFormRadio")){
                processFormRadio(jq, wireframeContainer);
                walkChilds = false;
            }
            else if(jq.is("input:isFormCheckbox")){
                processFormCheckbox(jq, wireframeContainer);
                walkChilds = false;
            }
            else if(jq.is("input:isFormFile")){
                processFormFile(jq, wireframeContainer);
                walkChilds = false;
            }
            else if(jq.is("input:isFormButton")){
                processFormButton(jq, wireframeContainer);
                walkChilds = false;
            }
            else if(jq.is("input:isFormInput")){
                processFormInput(jq, wireframeContainer);
                walkChilds = false;
            }
            else if(jq.is(":isSlider")){
                console.log("slider vyhodnoceno "+jq.attr("id"));
                processSlider(jq, wireframeContainer);
                walkChilds = false;
            }
            else if(jq.is("img:visibleElement")){
                console.log("obrazek "+jq.attr("src"));
                processImg(jq, wireframeContainer);
                walkChilds = false;
            }
            // zpracuje jednoravkoe texty
            else if(jq.is("span:noChild") || jq.is("a:noChild") || jq.is("label")){
                processOneLineText(jq, wireframeContainer);
                walkChilds = true;
            }
            // etc

            if(walkChilds){
                var childrens = jq.children();
                childrens.each(function(i,v){
                    walk(v);
                });
            }


        }



        if(container.is(document)){
            //var webContainer = $("body");
            //
            var wireframeContainer = $("<div />").css("position","relative");

            walk(container.find("body"));


            container.find("html").css("background","none");
            container.find("html").css("background-color","white");

            container.find("body").replaceWith($("<body />"));

            container.find("body").append(wireframeContainer);

        }

        return container;
    };
})(jQuery);