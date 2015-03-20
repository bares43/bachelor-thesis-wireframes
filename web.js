$(document).ready(function(){
    $("#create-wf").click(function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        load();
    });
});

function load(){
    var wfContainer = $("#wf-container");
    wfContainer.html("");
    var img = $("<img />").attr("src","./ajax-loader.gif");
    wfContainer.append(img);
    wfContainer.show();

    $("#status").text("Generování může chvíli trvat.").removeClass("error");

    var url = $("input[name=url]").val();
    $.post("wireframe.php",{url:url},function(response){
        var json = JSON.parse(response);

        wfContainer.html("");
        if(json.state === "success"){
            $("#status").text("");
            var img = $("<img />").attr("src","./"+json.filename);
            wfContainer.append(img);
        }else if(json.state === "failed"){
            $("#status").text(json.msg).addClass("error");
        }
    });
}
