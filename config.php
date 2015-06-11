<?php
// openshift
if(getenv("OPENSHIFT_PHP_IP")){
    define("APP_URL","http://wireframes-bares43.rhcloud.com/");
    define("APP_PATH",getenv("HOME")."/app-root/repo/");
    define("PHANTOM_PATH",getenv("HOME")."/phantomjs/usr/phantomjs --ssl-protocol=any");
}
// localhost windows
else{
    define("APP_URL","http://localhost/bt_wireframes/");
    define("APP_PATH","V:\\wamp\\www\\bt_wireframes\\");
    define("PHANTOM_PATH","V:\\phantomjs2\\bin\\phantomjs");
//    define("PHANTOM_PATH","V:\\phantom\\phantomjs");
}