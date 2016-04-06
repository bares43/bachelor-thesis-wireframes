<?php
/**
 * Created by PhpStorm.
 * User: Honza
 * Date: 27. 1. 2015
 * Time: 13:28
 */

if(file_exists("config.php")){
    require "config.php";
}

$url = $_POST["url"];
$textMode = $_POST["textMode"];
$imageMode = $_POST["imageMode"];
$options = $_POST["options"];

if(!preg_match("/^https?/",$url)){
    $url = "http://" . $url;
}

$response = array();

try {

    if (filter_var($url, FILTER_VALIDATE_URL)) {

        if (checkUrl($url)) {
            preg_match("/^https?:\/\/(.+\.)?(.+)\.(.+)/", $url, $match);

            $filename_wireframe = "/../screens/" . $match[2] . "_wf_" . time() . ".png";

            $options_string = getOptions($options);

            $phantom_path = "phantomjs";
            if(defined("PHANTOM_PATH")){
                $phantom_path = PHANTOM_PATH;
            }

            $exec = sprintf("%s --cookies-file=cookies --ssl-protocol=tlsv1 --ignore-ssl-errors=true \"%s\\phantom.js\" %s \"%s\" %s",$phantom_path,__DIR__."/../app/",$url,__DIR__.$filename_wireframe,$options_string);

            exec($exec, $output);

            /** @var array $response_from_phantom */
            $response_from_phantom = json_decode($output[count($output)-1], true);

            if (file_exists(__DIR__.$filename_wireframe)) {
                $response["state"] = "success";
                $response["filename"] = $filename_wireframe;
            } else {
                $response["state"] = "failed";
                $response["msg"] = "Wireframe se nepodařilo vytvořit.";
            }


            $response["output"] = $output;

        } else {
            // nedostupny web
            $response["state"] = "failed";
            $response["msg"] = "Web není dostupný.";
        }
    } else {
        // neni zadana adresa
        $response["state"] = "failed";
        $response["msg"] = "Není zadána validní adresa.";
    }
}catch(Exception $e) {
    $response["state"] = "failed";
    $response["msg"] = "exception";
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