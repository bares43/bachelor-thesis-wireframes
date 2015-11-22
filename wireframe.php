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

try {

    if (filter_var($url, FILTER_VALIDATE_URL)) {

        if (checkUrl($url)) {
            preg_match("/^https?:\/\/(.+\.)?(.+)\.(.+)/", $url, $match);

            $filename_wf = "screens/" . $match[2] . "_wf_" . time() . ".png";
            $filename = "screens/" . $match[2] . "_" . time() . ".png";

            $options_string = getOptions($options);

            $exec = PHANTOM_PATH . " " . APP_PATH . "phantom.js $url " . APP_PATH . "$filename_wf $filename " . APP_URL . " $options_string";

            exec($exec, $output);

            /** @var array $response_from_phantom */
            $response_from_phantom = json_decode($output[count($output)-1], true);

//        if(true){
            if (file_exists($filename_wf)) {
                $response["state"] = "success";
                $response["filename"] = $filename_wf;

                if (file_exists($filename)) {
//                echo $options["viewportWidth"];
//                echo min(2*$options["viewportHeight"],2000);

                    $width = min($options["viewportWidth"], 1280);
                    $height = min(2 * $options["viewportHeight"], 720);

                    $img = imagecreatetruecolor($width, $height);
                    $org_img = imagecreatefrompng($filename);
                    imagecopy($img, $org_img, 0, 0, 0, 0, $width, $height);
                    imagepng($img, $filename, 9);
                }

                $colors = color_analysis($filename, 5);

                $response["colors"] = json_encode($colors);

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