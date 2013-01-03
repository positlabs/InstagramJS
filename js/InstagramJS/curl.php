<?php


ini_set('display_errors', 'On');
error_reporting(E_ALL);

require_once ('PhpConsole.php');
PhpConsole::start(true, true, dirname(__FILE__));


$url = $_GET["url"];
$ch = curl_init();

//TODO - append method to the end of the url as a parameter, maybe get rid of CUSTOMREQUEST option if it works without it
if($_GET["_method"] == "delete"){
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
}

curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);


$params = array('client_secret' => '405b71c3fda94e57b31c3975aa5d1b38');

curl_setopt($ch, CURLOPT_POSTFIELDS, $params);

$rawOutput = curl_exec($ch);
curl_close($ch);

$output = $rawOutput;
debug($output);

echo $output;
?>