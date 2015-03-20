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
<h3>Příklady wireframů:</h3>
<ul>
    <li><a href="?url=novinky.cz">novinky.cz</a></li>
    <li><a href="?url=idnes.cz">idnes.cz</a></li>
    <li><a href="?url=youtube.com">youtube.com</a></li>
    <li><a href="?url=google.com">google.com</a></li>
    <li><a href="?url=seznam.cz">seznam.cz</a></li>
    <li><a href="?url=uhk.cz">uhk.cz</a></li>
</ul>
<form>
    <label>Web: <input name="url" style="width: 300px;"<?php if($_GET["url"]):?> value="<?php echo htmlspecialchars($_GET["url"]);?>"<?endif;?>></label>
    <input type="submit" id="create-wf" value="Generovat wireframe" />
</form>
<div id="status"></div>
<div id="wf-container"></div>
<?php if($_GET["url"]):?>
    <script type="text/javascript">
        $(document).ready(function(){
            load();
        });
    </script>
<?php endif;?>
</body>
</html>