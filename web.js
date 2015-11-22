$(document).ready(function(){
    $("#create-wf").click(function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        load();
    });

    $("input[name=url]").keyup(function(){
        var url = $(this).val();
        $("#links .web-links").remove();
        if(url) {
            var wfLink = $("<a></a>").text("Link na wireframe").attr("href", "?url=" + url).attr("target","_blank").addClass("web-links");
            if (!/^https?/.test(url)) {
                url = "http://" + url;
            }
            var link = $("<a></a>").text("Link na web").attr("href", url).attr("target","_blank").addClass("web-links");
            $("#links").prepend(wfLink).prepend(link);
        }
    });

    $("#show-output").click(function(){
        var $show = $(this);
        var $output = $("#output");
        if($show.is(".open")){
            $show.text("Zobrazit výstup");
            $show.removeClass("open");
            $output.hide();
        }else{
            $show.text("Skrýt výstup");
            $show.addClass("open");
            $output.show();
        }
    });
});

function load(){
    var wfContainer = $("#wf-container");
    wfContainer.html("");
    $(".wireframe-download").remove();
    var img = $("<img />").attr("src","./ajax-loader.gif");
    wfContainer.append(img);
    wfContainer.show();

    $("#color-analysis").hide();
    $("#color-analysis tbody").html("");
    $("#show-output, #output").hide();
    $("#output").html("");

    $("#status").text("Generování může chvíli trvat.").removeClass("error");

    var url = $("input[name=url]").val();
    //var textMode = $("input:radio[name=textMode]:checked").val();
    //var imageMode = $("input:radio[name=imageMode]:checked").val();

    var options = {};
    options["textMode"] = $("input:radio[name=textMode]:checked").val();
    options["imageMode"] = $("input:radio[name=imageMode]:checked").val();
    options["viewportWidth"] = $("input[name=viewport_width]").val();
    options["viewportHeight"] = $("input[name=viewport_height]").val();
    options["viewportHeight"] = $("input[name=viewport_height]").val();
    options["userAgent"] = $("select[name=userAgent] option:selected").val();
    options["customRules"] = $("select[name=customRules] option:selected").val();

    $.post("wireframe.php",{url:url,options:options},function(response){
        try {
            var json = JSON.parse(response);
        }catch(err){
            $("#status").text("Došlo k chybě").addClass("error");
        }
        wfContainer.html("");
        if(json.state === "success"){
            $("#status").text("");
            var img = $("<img />").attr("src","./"+json.filename);
            wfContainer.append(img);
            var link = $("<a></a>").text("Stáhnout wireframe").attr("href", "./"+json.filename).attr("target","_blank").addClass("wireframe-download").attr("download",json.filename);
            $("#links").append(link);

            var colors = JSON.parse(json.colors);
            $.each(colors,function(k,v){
               var tr = $("<tr></tr>");
               tr.append($("<td></td>").text("#"+k));
               var span = $("<span></span>").css("background-color","#"+k);
               tr.append($("<td></td>").append(span));
               tr.append($("<td></td>").text(v+"%"));

                $("#color-analysis tbody").append(tr);
            });
            $("#color-analysis").show();
        }else if(json.state === "failed"){
            $("#status").text(json.msg).addClass("error");
        }

        if(json.output !== undefined){
            var ol = $("<ol></ol>");
            $.each(json.output, function(i,v){
                if(v.length > 0){
                    $("<li></li>").text(v).appendTo(ol);
                }
            });
            if(ol.find("li").length > 0){
                $("#show-output").removeClass("open").text("Zobrazit výstup").show();
                $("#output").html(ol);
            }
        }
    });
}
