Author: Posit Labs
Site: http://positlabs.blogspot.com/

This is a convenience wrapper for the Instagram API

To get your client ID / secret, go to the manage clients page on instagram.com (http://instagram.com/developer/clients/manage/)

INSTRUCTIONS
------------------------------------------------------------------------------------------------------------------------

Make a new instagram object and pass it the clientID and redirectURL

Login flow:
- call instagram.login()
- user will be prompted with login fields
- after submitting login information, user will be redirected to the redirectURL
- when a new Instagram object is instantiated, it will look for the code query parameter.
  If it exists, it will get the access token via ajax GET from getAccessToken.php
- Now you can make calls the the Instagram API!

