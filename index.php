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
<h1>Tvorba wireframu</h1>

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
    <h3>Nastavení textů</h3>
    <label><input type="radio" name="textMode" value="lorem" checked /> lorem ipsum</label><br />
    <label><input type="radio" name="textMode" value="original" /> původní text</label><br />
    <label><input type="radio" name="textMode" value="box" /> šedý box</label>
</div>
<div style="float: left; margin-left: 15px;">
    <h3>Nastavení obrázků</h3>
    <label><input type="radio" name="imageMode" value="box" checked /> šedý box</label><br />
    <label><input type="radio" name="imageMode" value="original" /> původní obrázek</label><br />
    <label><input type="radio" name="imageMode" value="blur" /> rozmazání (vyžaduje PhantomJS 2)</label>
</div>
<form style="clear: both;">
    <label>Web: <input name="url"
                       style="width: 300px;"<?php if ($_GET["url"]): ?> value="<?php echo htmlspecialchars($_GET["url"]); ?>"<? endif; ?>></label>
    <input type="submit" id="create-wf" value="Generovat wireframe"/>
</form>
<div id="links"></div>
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