<?php
function color_analysis($filename){
    $resource = imagecreatefrompng($filename);
    $colors = array();

    $width = imagesx($resource);
    $height = imagesy($resource);

    for($x = 0; $x < $width; $x++) {
        for($y = 0; $y < $height; $y++) {
            // pixel color at (x, y)
            $rgb = imagecolorat($resource, $x, $y);

            $color = dechex($rgb);

            if(!array_key_exists($color, $colors)) $colors[$color] = 0;

            $colors[$color]++;
        }
    }

    arsort($colors);

    return $colors;
}