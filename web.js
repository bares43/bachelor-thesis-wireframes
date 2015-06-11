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
});

function load(){
    var wfContainer = $("#wf-container");
    wfContainer.html("");
    $(".wireframe-download").remove();
    var img = $("<img />").attr("src","./ajax-loader.gif");
    wfContainer.append(img);
    wfContainer.show();

    $("#status").text("Generování může chvíli trvat.").removeClass("error");

    var url = $("input[name=url]").val();
    //var textMode = $("input:radio[name=textMode]:checked").val();
    //var imageMode = $("input:radio[name=imageMode]:checked").val();

    var options = {};
    options["textMode"] = $("input:radio[name=textMode]:checked").val();
    options["imageMode"] = $("input:radio[name=imageMode]:checked").val();
    options["viewport_width"] = $("input[name=viewport_width]").val();
    options["viewport_height"] = $("input[name=viewport_height]").val();

    $.post("wireframe.php",{url:url,options:options},function(response){
        var json = JSON.parse(response);

        wfContainer.html("");
        if(json.state === "success"){
            $("#status").text("");
            var img = $("<img />").attr("src","./"+json.filename);
            wfContainer.append(img);
            var link = $("<a></a>").text("Stáhnout wireframe").attr("href", "./"+json.filename).attr("target","_blank").addClass("wireframe-download").attr("download",json.filename);
            $("#links").append(link);
        }else if(json.state === "failed"){
            $("#status").text(json.msg).addClass("error");
        }
    });
}
