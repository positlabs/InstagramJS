<?php

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

$params = array('client_secret' => 'SECRET GOES HERE');

curl_setopt($ch, CURLOPT_POSTFIELDS, $params);

$rawOutput = curl_exec($ch);
curl_close($ch);

$output = $rawOutput;

echo $output;
?>