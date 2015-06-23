<?php
function color_analysis($filename, $count = 0){
    $frequently_colors = array();

    if(file_exists($filename)){
        $resource = imagecreatefrompng($filename);
        $colors = array();

        $width = imagesx($resource);
        $height = imagesy($resource);

        $colorsCount = 0;

        for($x = 0; $x < $width-2; $x+=2) {
            for($y = 0; $y < $height-2; $y+=2) {

                $rgb = imagecolorat($resource, $x, $y);

                $color = dechex($rgb);

                if($colors[$color] == 0) {
                    $colorsCount++;
                }

                $colors[$color]++;


                if($colorsCount > 200){
                    $min = min($colors);
                    foreach($colors as $k=>$v){
                        if($v == $min) {
                            unset($colors[$k]);
                            --$colorsCount;
                        }
                    }
                }
            }
        }

        arsort($colors);

        $pixels = $width * $height;

        if($count == 0 || $count > count($colors)) $count = count($colors);
        $keys = array_slice(array_keys($colors),0,$count);
        $values = array_slice($colors,0,$count);
        $frequently_colors = array_combine($keys, $values);

        $frequently_colors = array_map(function($item) use ($pixels){
            return round(($item/$pixels) * 100,2);
        },$frequently_colors);
    }

    return $frequently_colors;
}