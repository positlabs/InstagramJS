<?php

ini_set('display_errors', 'On');

$url = $_GET["url"];
$method = $_GET["method"];
$curl_method;

if($method == 'post') $curl_method = CURLOPT_POST;
else if($method == 'delete') $curl_method = CURLOPT_DELETE;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, true);

$params = array(
    'client_id'		=>          $_GET["clientID"],
    'client_secret'		=>      '405b71c3fda94e57b31c3975aa5d1b38',
    'grant_type'		=>        'authorization_code',
);

curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
$output = curl_exec($ch);
curl_close($ch);

echo $output;

?>