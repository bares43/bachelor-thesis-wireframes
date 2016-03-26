<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <link rel="stylesheet" href="./gui/css/layout.css"/>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
    <script src="./gui/js/web.js"></script>
    <title>Wireframe</title>
</head>
<body>
<h1><a href="?">Tvorba wireframu</a></h1>

<div style="float: left; margin-left: 15px;">
    <h3>Nastavení textů</h3>
    <label><input type="radio" name="textMode" value="text_lorem" checked /> lorem ipsum</label><br />
    <label><input type="radio" name="textMode" value="text_original" /> původní text</label><br />
    <label><input type="radio" name="textMode" value="text_box" /> šedý box</label>
</div>
<div style="float: left; margin-left: 15px;">
    <h3>Nastavení obrázků</h3>
    <label><input type="radio" name="imageMode" value="image_box" checked /> šedý box</label><br />
    <label><input type="radio" name="imageMode" value="image_original" /> původní obrázek</label><br />
    <label><input type="radio" name="imageMode" value="image_blur" /> rozmazání</label><br />
    <label><input type="radio" name="imageMode" value="image_remove" /> odstranit</label>
</div>
<div style="float: left; margin-left: 15px;">
    <h3>Rozlišení</h3>
    <label><input type="text" name="viewport_width" value="1280" style="width: 50px;" /> šířka</label><br />
    <label><input type="text" name="viewport_height" value="720" style="width: 50px;" /> výška</label>
    <h3>User agent</h3>
    <select name="userAgent">
        <option value="default">Default</option>
        <option value="win81_firefox">Win 8.1 Firefox</option>
        <option value="win81_chrome">Win 8.1 Chrome</option>
        <option value="win81_ie11">Win 8.1 IE 11</option>
        <option value="android">Android</option>
    </select>
</div>
<?php
if(file_exists(__DIR__."/custom")) {
    $files = scandir(__DIR__ . "/custom");
    ?>
<div style="float: left; margin-left: 15px;">
    <h3>Vlastní pravidla</h3>
    <select name="customRules">
        <option value="">&nbsp;</option>
        <?php
        foreach ($files as $file) {
            if ($file !== "." && $file !== "..") {
                $name = preg_replace("/.js$/", "", $file);
                ?>
                <option value="<?= $name; ?>"><?= $name; ?></option>
                <?php
            }
        }
        ?>
    </select>
</div>
<?php
}
?>
<div style="float: left; margin-left: 15px; width: 200px;">
    <a href="https://github.com/bares43/bachelors_thesis_wireframes" target="_blank">GitHub</a>
    <p>Zpracováno jako součást bakalářské práce na téma "<strong>Význam rozložení stránky pro identitu webu</strong>".</p>
    <a href="http://janbares.cz">Jan Bareš</a>, 2015-2016
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
<span id="show-output">Zobazit výstup</span>
<div id="output"></div>
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