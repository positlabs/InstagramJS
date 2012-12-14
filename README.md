InstagramJS
------------------------------------------------------------------------------------------------------------------------
InstagramJS is a convenience wrapper for the Instagram API

Author: Posit Labs

josh@positlabs.com

http://pixel-fiend.positlabs.com/



BEFORE YOU START
------------------------------------------------------------------------------------------------------------------------

To get your client ID / secret, go to the manage clients page on instagram.com (http://instagram.com/developer/clients/manage/)


INSTRUCTIONS
------------------------------------------------------------------------------------------------------------------------

Make a new instagram object and pass it the clientID and redirectURL

Login flow:
- call instagram.login()
- user will be prompted with login fields
- after submitting login information, user will be redirected to the redirectURL
- when a new Instagram object is instantiated, it will look for the code query parameter. If it exists, it will get the access token from getAccessToken.php
- Now you can make calls the the Instagram API!

About the Instagram.parameters class:
This object was created to simplify passing parameters to certain API calls.


LEGAL
------------------------------------------------------------------------------------------------------------------------

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


