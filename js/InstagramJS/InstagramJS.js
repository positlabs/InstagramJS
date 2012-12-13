/*
 * 	Convenience wrapper for the Instagram API
 *
 * 	@see http://instagram.com/developer/clients/manage/ to set your redirect URI and get client ID and client secret
 * 	@see http://instagram.com/developer/endpoints/ for documentation
 *
 * 	@author positlabs
 * 	@param clientID - the client ID for your app
 * 	@param redirectURI - uri to send the user to after user logs in
 *
 */


var Instagram = function (clientID, redirectURI) {
	var jsonResponse;
	var loc = window.location.href;
	var authURL = 'https://api.instagram.com/oauth/authorize/?client_id=' + clientID + '&redirect_uri=' + redirectURI + '&response_type=code';

	var authCode = loc.split("code=")[1];

	// logged in already?, get access token
	if (authCode) {

		getAccessToken(authCode);

		//check for errors / denial
		var error = loc.split("error=")[1];
		if (error)error = error.split("=")[0];
		var error_reason = loc.split("error_reason=")[1];
		if (error_reason)error_reason = error_reason.split("=")[0];
		var error_description = loc.split("error_description=")[1];
		if (error_description) error_description = error_description.split("=")[0];
		var errorobj = {error:error, error_reason:error_reason, error_description:error_description};

		//TODO - test this!
		if (error) {
			console.log("error!", errorobj);
			return errorobj;
		}

	}

	function login(callback) {
		console.log(arguments.callee.name + "()", arguments);

		// request permission
		window.open(authURL, "_self");
		if (callback) callback(false);

	}

	/* call this after user logs in */
	function getAccessToken(authCode, callback) {
		console.log(arguments.callee.name + "()", arguments);

		var accessTokenRequestURL = "./getAccessToken.php?code=" + authCode + "&clientID=" + clientID + "&redirectURI=" + redirectURI;

		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function (event) {

			if (event.target.readyState == 4) {

				var json = JSON.parse(event.target.response);
				console.log('json', json);
				jsonResponse = json;
				Instagram.accessToken = json.access_token;

				if (callback) callback(event.target.response);
			}

		};

		xmlhttp.open("GET", accessTokenRequestURL, true);
		xmlhttp.send();
	}

	function currentUser() {
		return jsonResponse.user;
	}


	var user = (function () {

		function userID(id, callback) {
			Instagram.utils.getJSONP(Instagram.utils.buildURL("users/" + id), callback);
		}

		function feed(callback) {
			Instagram.utils.getJSONP(Instagram.utils.buildURL("users/self/feed"), callback);
		}

		function recent(id, callback) {
			Instagram.utils.getJSONP(Instagram.baseURL + "users/media/" + id + "/recent?access_token=" + Instagram.accessToken, callback);
		}

		function search(name, callback) {
			Instagram.utils.getJSONP(Instagram.utils.buildURL("users/search") + "&q=" + name, callback);
		}

		function liked(callback) {
			Instagram.utils.getJSONP(Instagram.utils.buildURL("users/self/media/liked"), callback);
		}

		return{
			userID:userID,
			feed:feed,
			recent:recent,
			search:search,
			liked:liked
		};
	})();

//	http://instagram.com/developer/endpoints/

	var relationship = (function () {
		var FOLLOW_ACTION = "follow";
		var UNFOLLOW_ACTION = "unfollow";
		var BLOCK_ACTION = "block";
		var UNBLOCK_ACTION = "unblock";
		var APPROVE_ACTION = "approve";
		var DENY_ACTION = "deny";

		function follows(id, callback) {
			Instagram.utils.getJSONP(Instagram.utils.buildURL("users/" + id + "/follows"), callback);
		}

		function followedBy(id, callback) {
			Instagram.utils.getJSONP(Instagram.utils.buildURL("users/" + id + "/followed-by"), callback);
		}

		function requestedBy(callback) {
			Instagram.utils.getJSONP(Instagram.utils.buildURL("users/requested-by"), callback);
		}

		function getRelationship(id, callback) {
			Instagram.utils.getJSONP(Instagram.utils.buildURL("users/" + id + "/relationship"), callback);
		}

		function postRelationship(id, action, callback) {
			//TODO - POST this
			Instagram.utils.buildURL("users/" + id + "/relationship") + "action=" + action;
		}

		return{
			follows:follows,
			followedBy:followedBy,
			requestedBy:requestedBy,
			getRelationship:getRelationship,
			postRelationship:postRelationship,
			FOLLOW_ACTION:FOLLOW_ACTION,
			UNFOLLOW_ACTION:UNFOLLOW_ACTION,
			BLOCK_ACTION:BLOCK_ACTION,
			UNBLOCK_ACTION:UNBLOCK_ACTION,
			APPROVE_ACTION:APPROVE_ACTION,
			DENY_ACTION:DENY_ACTION
		};
	})();

	var media = (function () {

		function info(mediaID, callback) {
			Instagram.utils.getJSONP(Instagram.utils.buildURL("media/" + mediaID), callback);
		}

		function search(params, callback) {
			Instagram.utils.getJSONP(Instagram.utils.buildURL("media/" + search) + params.toString(), callback);
		}

		function popular(callback) {
			Instagram.utils.getJSONP(Instagram.utils.buildURL("media/popular"), callback);
		}

		return{
			info:info,
			search:search,
			popular:popular
		};
	})();

	var comments = (function () {

		function getComments(mediaID, callback) {
			Instagram.utils.getJSONP(Instagram.utils.buildURL("media/" + mediaID + "/comments"), callback);
		}

		function postComment(mediaID, comment, callback) {
			//TODO - post comment with curl ...add callback to url?
//			curl -F 'access_token=261370252.f59def8.503d60cf8b114ee08898f1ca42c5f546' \
//    -F 'text=This+is+my+comment' \
//    https://api.instagram.com/v1/media/{media-id}/comments
			Instagram.utils.buildURL("media/" + mediaID + "/comments")
		}

		function removeComment(mediaID, commentID, callback) {
			//TODO - delete comment with curl
//			curl -X DELETE https://api.instagram.com/v1/media/{media-id}/comments?access_token=261370252
			Instagram.utils.buildURL("media/" + mediaID + "/comments/" + commentID);
		}

		return{
			getComments:getComments,
			postComment:postComment,
			removeComment:removeComment
		};
	})();

	var likes = (function () {

		function getLikes(mediaID, callback) {
			Instagram.utils.getJSONP(Instagram.utils.buildURL("media/" + mediaID + "/likes"), callback);
		}

		function postLike(mediaID, callback) {
			//TODO - post with curl
			Instagram.utils.buildURL("media/" + mediaID + "/likes");
//			curl -F 'access_token=261370252.f59def8.503d60cf8b114ee08898f1ca42c5f546' \
		}

		function removeLike(mediaID, callback) {
			//TODO - remove with curl
			Instagram.utils.buildURL("media/" + mediaID + "/likes");
//			curl -X DELETE https://api.instagram.com/v1/media/{media-id}/likes?access_token=26137025
		}

		return{
			getLikes:getLikes,
			postLike:postLike,
			removeLike:removeLike
		};
	})();

	var tag = (function () {

		function info(tag, callback) {
			Instagram.utils.getJSONP(Instagram.utils.buildURL("tags/" + tag), callback);
		}

		/* @param params is an Instagram.parameters object */
		function recent(tag, params, callback) {
			Instagram.utils.getJSONP(Instagram.utils.buildURL("tags/" + tag + "/media/recent") + params.toString(), callback);
		}

		function search(tag, callback) {
			Instagram.utils.getJSONP(Instagram.utils.buildURL("tags/" + tag) + "q=" + tag, callback);
		}

		return{
			info:info,
			recent:recent,
			search:search
		};

	})();

	var location = (function () {

		function info(locationID, callback) {
			Instagram.utils.getJSONP(Instagram.utils.buildURL("location/" + locationID), callback);
		}

		function recent(locationID, params, callback) {
			Instagram.utils.getJSONP(Instagram.utils.buildURL("location/" + locationID + "/media/recent") + params.toString(), callback);
		}

		/* @param parameters is an Instagram.parameters object */
		function search(params, callback) {
			Instagram.utils.getJSONP(Instagram.utils.buildURL("location/search") + params.toString(), callback);
		}

		return{
			info:info,
			recent:recent,
			search:search
		};

	})();

	var geography = (function () {

		function recent(geoID, callback){
			Instagram.utils.getJSONP(Instagram.utils.buildURL("geographies/" + geoID + "/media/recent"), callback);
		}

		return{recent:recent};
	})();


	return{
		baseURL:Instagram.baseURL,
		clientID:clientID,
		redirectURI:redirectURI,
		authURL:authURL,
		accessToken:Instagram.accessToken,
		login:login,
		currentUser:currentUser,
		user:user,
		relationship:relationship,
		media:media,
		comments:comments,
		likes:likes,
		tags:tag,
		location:location,
		geography:geography
	};

};


/*
 *
 * 		static members
 *
 */
Instagram.accessToken = {};
Instagram.baseURL = "https://api.instagram.com/v1/";

Instagram.utils = {};
Instagram.utils.getJSONP = function (url, callback) {
	console.log("getJSON", url, callback.name);

	var script = document.createElement("script");
	script.type = "text/javascript";
	if (callback.name != undefined)
		script.src = url + "&callback=" + callback.name;
	else script.src = url;

	document.body.appendChild(script);

};

Instagram.utils.buildURL = function (endpoint) {
	return Instagram.baseURL + endpoint + "?access_token=" + Instagram.accessToken;
};


/*
 *		classes
 */

Instagram.parameters = function () {

	/* @return a string of query parameters */
	function toString() {

		//TODO - test
		return JSON.stringify(this, stringReplace);

	}

	function stringReplace(key, value) {

		var string = "";
		if (typeof value !== 'function' && value !== undefined)
			string += "&" + key + "=" + value;
		return string;

	}

	return{
		"toString":toString,
		"count":undefined,
		"text":undefined,
		"lat":undefined,
		"lng":undefined,
		"min_timestamp":undefined,
		"max_timestamp":undefined,
		"distance":undefined,
		"min_id":undefined,
		"max_id":undefined,
		"max_like_id":undefined,
		"action":undefined,
		"foursquare_id":undefined,
		"foursquare_v2_id":undefined
	}
};


/*
 *		testing
 */

function hello(response) {
	console.log(arguments.callee.name + "()", arguments);
}
