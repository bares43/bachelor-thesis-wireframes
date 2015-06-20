<?php
/**
 * Created by PhpStorm.
 * User: Honza
 * Date: 27. 1. 2015
 * Time: 13:28
 */

require "config.php";
require "colors.php";

$url = $_POST["url"];
$textMode = $_POST["textMode"];
$imageMode = $_POST["imageMode"];
$options = $_POST["options"];

if(!preg_match("/^https?/",$url)){
    $url = "http://" . $url;
}

$response = array();

if(filter_var($url,FILTER_VALIDATE_URL)){

    if(checkUrl($url)) {
        preg_match("/^https?:\/\/(.+\.)?(.+)\.(.+)/", $url, $match);

        $filename_wf = "screens/".$match[2] . "_wf_".time().".png";
        $filename = "screens/".$match[2] . "_".time().".png";

        $options_string = getOptions($options);

        $exec = PHANTOM_PATH." ".APP_PATH."phantom.js $url ".APP_PATH."$filename_wf $filename ".APP_URL." $options_string";

        exec($exec);

//        if(true){
        if(file_exists($filename)){
            $response["state"] = "success";
            $response["filename"] = $filename_wf;

            $colors = color_analysis($filename, 5);

//            $colors = array("ffffff"=>1842125,"fff5d9"=>37377,"de0000"=>21702,"0"=>20502,"10103"=>14750);

            $frequently_colors = array();
            for($i = 0;$i<5;$i++){
                $frequently_colors[key($colors)] = current($colors);
                next($colors);
            }

            $response["colors"] = json_encode($frequently_colors);

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

function getOptions($options){
    $options_string = '';
    foreach($options as $k=>$v){
        if(is_bool($v) && $v){
            $options_string .= " -$k";
        }else {
            $options_string .= " -$k=$v";
        }
    }
    return $options_string;
}