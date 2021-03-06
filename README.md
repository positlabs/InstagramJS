InstagramJS
------------------------------------------------------------------------------------------------------------------------
InstagramJS is a convenience wrapper for the Instagram API

Author: Posit Labs

josh@positlabs.com

http://pixel-fiend.positlabs.com/


BEFORE YOU START
------------------------------------------------------------------------------------------------------------------------

To get your client ID / secret, go to the manage clients page on instagram.com (http://instagram.com/developer/clients/manage/). Be sure to put your client secret into getAccessToken.php!

http://pixel-fiend.positlabs.com/2012/12/instagramjs.html


INSTRUCTIONS
------------------------------------------------------------------------------------------------------------------------

Make a new instagram object and pass it an Instagram.Config object
```javascript
var config = new Instagram.Config();
config.scope = [Instagram.SCOPE_BASIC, Instagram.SCOPE_LIKES];
config.debug = true;
config.clientID = "YOUR CLIENT ID";
config.redirectURI = "YOUR REDIRECT URI";
var instagram = new Instagram(config);
```
Login flow:
- call instagram.login()
- user will be prompted with login fields
- after submitting login information, user will be redirected to the redirectURL
- when a new Instagram object is instantiated, it will look for the code query parameter. If it exists, it will get the access token from getAccessToken.php
- Now you can make calls the the Instagram API!

If the user is already logged in when they press the login button, it will just ask for permissions. If they have already given permission to the app, it will go ahead and get the access token.

About the Instagram.parameters class:
This object was created to simplify passing parameters to certain API calls. Includes a parameterize() method that outputs the object members as a string of query parameters


LEGAL
------------------------------------------------------------------------------------------------------------------------

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


