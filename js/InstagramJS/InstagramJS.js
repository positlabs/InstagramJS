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
	var currUser;
	var loc = window.location.href;
	var authURL = 'https://api.instagram.com/oauth/authorize/?client_id=' + clientID + '&redirect_uri=' + redirectURI + '&response_type=code';
	var getAccessTokenURL = "./js/InstagramJS/getAccessToken.php";

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

		if (error)
			return errorobj;

	}

	//TODO - add scope parameter object (basic, comments, relationships, likes)
	function login(callback) {
		console.log(arguments.callee.name + "()", arguments);

		// request permission
		window.open(authURL + "&scope=likes", "_self");
		if (callback) callback(false);

	}

	/* call this after user logs in */
	function getAccessToken(authCode, callback) {
		console.log(arguments.callee.name + "()", arguments);

		var _accessTokenRequestURL = getAccessTokenURL + "?code=" + authCode + "&clientID=" + clientID + "&redirectURI=" + redirectURI;

		Instagram.utils.getJSON(_accessTokenRequestURL, function (response) {
			console.log('\n\nevent', response);

			currUser = response.user;
			Instagram.accessToken = response.access_token;

			if (callback) callback(response);

		});
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
			Instagram.utils.getJSONP(Instagram.baseURL + "users/" + id + "/media/recent?access_token=" + Instagram.accessToken, callback);
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
			var url = Instagram.utils.buildURL("users/" + id + "/relationship") + "action=" + action;

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
			Instagram.utils.buildURL("media/" + mediaID + "/comments") + "&text=" + comment;
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

		function post(mediaID, callback) {
			//TODO - post with curl
			var url = Instagram.utils.buildURL("media/" + mediaID + "/likes");
//			Instagram.utils.rest(Instagram.POST, url, function (e) {
			Instagram.utils.getJSONP(url, function(e){
				console.log('e', e);
			});
//			curl -F 'access_token=261370252.f59def8.503d60cf8b114ee08898f1ca42c5f546' \
		}

		function remove(mediaID, callback) {
			//TODO - remove with curl
			Instagram.utils.buildURL("media/" + mediaID + "/likes");
//			curl -X DELETE https://api.instagram.com/v1/media/{media-id}/likes?access_token=26137025
		}

		return{
			get:getLikes,
			post:post,
			remove:remove
		};
	})();

	var tag = (function () {

		function info(tag, callback) {
			Instagram.utils.getJSONP(Instagram.utils.buildURL("tags/" + tag), callback);
		}

		/*
		 *		@param params is an Instagram.parameters object
		 * 	Takes min_id and max_id
		 */
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

		/*
		 *		@param params is an Instagram.parameters object
		 * 		takes min_id, max_id, min_timestamp, max_timestamp
		 */
		function recent(locationID, params, callback) {
			Instagram.utils.getJSONP(Instagram.utils.buildURL("location/" + locationID + "/media/recent") + params.toString(), callback);
		}

		/*
		 *		@param params is an Instagram.parameters object
		 * 	takes lat, lng, distance, foursquare_v2_id, foursquare_id
		 */
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

		function recent(geoID, callback) {
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
Instagram.GET = "get";
Instagram.POST = "post";
Instagram.DELETE = "delete";


/*
 *
 * 		utilities
 *
 */

Instagram.utils = {};

Instagram.utils.getJSON = function (url, callback) {
	console.log("getJSON", url);

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function (event) {

		if (event.target.readyState == 4) {
			callback(JSON.parse(event.target.response));
		}

	};

	xmlhttp.open("GET", url, true);
	xmlhttp.send();
};

//Instagram.utils.rest = function(method, path, params) {
//	var form = document.createElement("form");
//	form.setAttribute("method", method);
//	form.setAttribute("action", path + "&redirectURI=" + window.location.href);
//
//	for(var key in params) {
//		if(params.hasOwnProperty(key)) {
//			var hiddenField = document.createElement("input");
//			hiddenField.setAttribute("type", "hidden");
//			hiddenField.setAttribute("name", key);
//			hiddenField.setAttribute("value", params[key]);
//
//			form.appendChild(hiddenField);
//		}
//	}
//
//	document.body.appendChild(form);
//	form.submit();
//	document.body.removeChild(form);
//};


Instagram.utils.getJSONP = function (url, callback) {
	console.log("getJSONP", url);

	var script = document.createElement("script");
	script.type = "text/javascript";

	window.__loaded = function (response) {
		callback(response);
	};

	script.src = url + "&callback=__loaded";

	document.body.appendChild(script);

};

Instagram.utils.buildURL = function (endpoint) {
	return Instagram.baseURL + endpoint + "?access_token=" + Instagram.accessToken;
};


/*
 *		classes
 */

Instagram.Parameters = function () {

	this.count = undefined;
	this.text = undefined;
	this.lat = undefined;
	this.lng = undefined;
	this.min_timestamp = undefined;
	this.max_timestamp = undefined;
	this.distance = undefined;
	this.min_id = undefined;
	this.max_id = undefined;
	this.max_like_id = undefined;
	this.action = undefined;
	this.foursquare_id = undefined;
	this.foursquare_v2_id = undefined;

	/* @return a string of query parameters */
	this.toString = function () {
		var string = "";
		var params = this;

		for (var param in params) {
			if (params[param] !== undefined && typeof params[param] != "function")
				string += "&" + param + "=" + params[param];
		}

		return string;

	};

};


/*
 *		testing
 */

function hello(response) {
	console.log(arguments.callee.name + "()", arguments);
}
