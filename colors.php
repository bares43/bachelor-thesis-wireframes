<?php
function color_analysis($filename, $count = 0){
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

    $pixels = $width * $height;

    if($count == 0 || $count < count($colors)) $count = count($colors);

    $frequently_colors = array();
    for($i = 0;$i<$count;$i++){
        $frequently_colors[key($colors)] = round((current($colors)/$pixels)*100,2);
        next($colors);
    }

    return $frequently_colors;
}