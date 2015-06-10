<?php
/**
 * Created by PhpStorm.
 * User: Honza
 * Date: 27. 1. 2015
 * Time: 13:28
 */

require "config.php";

$url = $_POST["url"];
$textMode = $_POST["textMode"];

if(!preg_match("/^https?/",$url)){
    $url = "http://" . $url;
}

$response = array();

if(filter_var($url,FILTER_VALIDATE_URL)){

    if(checkUrl($url)) {
        preg_match("/^https?:\/\/(.+\.)?(.+)\.(.+)/", $url, $match);

        $filename = "screens/".$match[2] . "_".time().".png";

        $exec = PHANTOM_PATH." ".APP_PATH."phantom.js $url ".APP_PATH."$filename ".APP_URL." $textMode";

        exec($exec);

        if(file_exists($filename)){
            $response["state"] = "success";
            $response["filename"] = $filename;
        }else{
            $response["state"] = "failed";
            $response["msg"] = "Wireframe se nepodařilo vytvořit.";
        }


    }else{
        // nedostupny web
        $response["state"] = "failed";
        $response["msg"] = "Web není dostupný.";
    }
}else{
    // neni zadana adresa
    $response["state"] = "failed";
    $response["msg"] = "Není zadána validní adresa.";
}
echo json_encode($response);
exit;

function checkUrl($url) {
    if (strpos($url, "http://") !== 0 && strpos($url, "https://") !== 0) {
        $url = "http://".$url;
    }

    $file_headers = @get_headers($url);

    if($file_headers == false || $file_headers[0] == 'HTTP/1.1 404 Not Found') {
        return false;
    }
    else {
        return true;
    }
}