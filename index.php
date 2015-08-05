<?php include "./config.php";?>
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <link rel="stylesheet" href="layout.css"/>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
    <script src="web.js"></script>
    <title>Wireframe</title>
</head>
<body>
<h1><a href="?">Tvorba wireframu</a></h1>

<div style="float: left;">
    <h3>Příklady wireframů</h3>
    <ul>
        <li><a href="?url=novinky.cz">novinky.cz</a></li>
        <li><a href="?url=idnes.cz">idnes.cz</a></li>
        <li><a href="?url=youtube.com">youtube.com</a></li>
        <li><a href="?url=google.com">google.com</a></li>
        <li><a href="?url=seznam.cz">seznam.cz</a></li>
        <li><a href="?url=uhk.cz">uhk.cz</a></li>
    </ul>
</div>
<div style="float: left; margin-left: 15px;">
    <h3>Algortimus</h3>
    <label><input type="radio" name="algorithm" value="replacing" checked /> nahrazeni</label><br />
    <label><input type="radio" name="algorithm" value="creating" /> vytvoření</label>
</div>
<div style="float: left; margin-left: 15px;">
    <h3>Nastavení textů</h3>
    <label><input type="radio" name="textMode" value="lorem" checked /> lorem ipsum</label><br />
    <label><input type="radio" name="textMode" value="original" /> původní text</label><br />
    <label><input type="radio" name="textMode" value="box" /> šedý box</label>
</div>
<div style="float: left; margin-left: 15px;">
    <h3>Nastavení obrázků</h3>
    <label><input type="radio" name="imageMode" value="box" checked /> šedý box</label><br />
    <label><input type="radio" name="imageMode" value="original" /> původní obrázek</label><br />
    <label><input type="radio" name="imageMode" value="blur" /> rozmazání</label><br />
    <label><input type="radio" name="imageMode" value="remove" /> odstranit</label>
</div>
<div style="float: left; margin-left: 15px;">
    <h3>Rozlišení</h3>
    <label><input type="text" name="viewport_width" value="<?= RESOLUTION_WIDTH;?>" style="width: 50px;" /> šířka</label><br />
    <label><input type="text" name="viewport_height" value="<?= RESOLUTION_HEIGHT;?>" style="width: 50px;" /> výška</label>
</div>
<div style="float: left; margin-left: 15px;" id="color-analysis">
    <h3>Analýza barev</h3>
    <table>
        <thead>
            <tr>
                <th>Kód</th>
                <th>Barva</th>
                <th>Výskyt</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</div>
<div style="float: left; margin-left: 15px; width: 200px;">
    <a href="https://github.com/bares43/bachelors_thesis_wireframes" target="_blank">GitHub</a>
    <p>Zpracováno jako součást bakalářské práce na téma "<strong>Význam rozložení stránky pro identitu webu</strong>".</p>
    <a href="mailto:janbares43@gmail.com">Jan Bareš</a>, 2015
</div>
<form style="clear: both;">
    <label>Web: <input name="url"
                       style="width: 300px;"<?php if ($_GET["url"]): ?> value="<?php echo htmlspecialchars($_GET["url"]); ?>"<? endif; ?>></label>
    <input type="submit" id="create-wf" value="Generovat wireframe"/>
</form>
<div id="links">
    <?php if ($_GET["url"]): ?>
        <?php
        $url = $_GET["url"];
        if(!preg_match("/^https?/",$url)){
            $url = "http://".$url;
        }
        ?>
        <a class="web-links" href="<?php echo $url;?>" target="_blank">Link na web</a>
        <a class="web-links" href="?url=<?php echo $_GET["url"];?>" target="_blank">Link na wireframe</a>
    <?php endif;?>
</div>
<div id="status"></div>
<div id="wf-container"></div>
<?php if ($_GET["url"]): ?>
    <script type="text/javascript">
        $(document).ready(function () {
            load();
        });
    </script>
<?php endif; ?>
</body>
</html>