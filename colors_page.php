<?php
include "colors.php";
$name = $_GET["image"];

$colors = color_analysis($name);

?>
<table>
    <tr>
        <th>Kod</th>
        <th>Barva</th>
        <th>Vyskyt</th>
    </tr>
    <?php
    foreach($colors as $color=>$amount){
        ?>
        <tr>
            <td>#<?php echo $color;?></td>
            <td><span style="display: block; width: 50px; height: 20px; background-color: #<?php echo $color;?>"></span></td>
            <td><?php echo $amount;?></td>
        </tr>
        <?php
    }
    ?>
</table>