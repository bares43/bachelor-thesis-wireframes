<?php
if(getenv("OPENSHIFT_PHP_IP")){
    define("PHANTOM_PATH",getenv("HOME")."/phantomjs/usr/phantomjs --ssl-protocol=any");
}
else{
    define("PHANTOM_PATH","\"C:\\Program Files\\phantomjs-2.0.0-windows\\bin\\phantomjs\"");
}