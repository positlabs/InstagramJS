<?php

  /*

    Retrieves Instagram access token.
    Requires code via query parameter (supplied by instagram)

    ini_set('display_errors', 'On');
  */


  $url = "https://api.instagram.com/oauth/access_token";

  $access_token_parameters = array(
    'client_id'		=>          $_GET["clientID"],
    'client_secret'		=>      '',
    'grant_type'		=>        'authorization_code',
    'redirect_uri'		=>      $_GET["redirectURI"],
    'code'			=>            $_GET["code"]
  );
  $curl = curl_init($url);
  curl_setopt($curl,CURLOPT_POST, true);
  curl_setopt($curl,CURLOPT_POSTFIELDS, $access_token_parameters);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

  $json_response = curl_exec($curl);
  curl_close($curl);

  $response = json_encode($json_response, true);

  echo $json_response;
?>