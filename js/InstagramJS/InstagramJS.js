/*
 * 	Convenience wrapper for the Instagram API
 *
 * 	@see http://instagram.com/developer/clients/manage/ to set your redirect URI and get client ID and client secret
 * 	@see http://instagram.com/developer/endpoints/ for documentation
 *
 * 	@author positlabs
 * 	@param config - instance of Instagram.Config
 *
 */


var Instagram = function (config) {

	this.config = config;

	var me = this,
		loc = window.location.href,
		authCode = loc.split("code=")[1],
		currUser,
		authURL = 'https://api.instagram.com/oauth/authorize/?client_id=' + this.config.clientID + '&redirect_uri=' + this.config.redirectURI + '&response_type=code';

	// logged in already?, get access token
	if (authCode) {

		getAccessToken(authCode, Instagram.onlogin);

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

	/*
	 *      directs user to login screen on instagram.com
	 */
	function login() {
		if (me.config.debug) {
			console.log("\nInstagram.login()");
			console.log("\tscope: ", me.config.scope);
		}

		// log in, request permissions
		window.open(authURL + "&scope=" + me.config.scope.join("+"), "_self");

	}

	/* call this after user logs in */
	function getAccessToken(authCode, callback) {
		if (me.config.debug) console.log(arguments.callee.name + "()", arguments);

		var _accessTokenRequestURL = me.config.getAccessTokenURL + "?code=" + authCode + "&clientID=" + me.config.clientID + "&redirectURI=" + me.config.redirectURI;

		Instagram.utils.ajax(_accessTokenRequestURL, function (response) {
			if (me.debug) console.log('\n\nevent', response);

			currUser = response.user;

			Instagram.accessToken = response.access_token;

			if (callback) callback(response);

		});
	}

	var user = (function () {

		function userID(id, callback) {
			if (me.debug) console.log(arguments.callee.name + "()", arguments);

			var url = Instagram.utils.buildURL("users/" + id);
			Instagram.utils.getJSONP(url, callback);
		}

		function feed(callback) {
			if (me.debug) console.log(arguments.callee.name + "()", arguments);
			var url = Instagram.utils.buildURL("users/self/feed");
			Instagram.utils.getJSONP(url, callback);
		}

		function recent(id, callback) {
			var url = Instagram.utils.buildURL("users/" + id + "/media/recent");
			Instagram.utils.getJSONP(url, callback);
		}

		function search(name, callback) {
			var url = Instagram.utils.buildURL("users/search") + "&q=" + name;
			Instagram.utils.getJSONP(url, callback);
		}

		function liked(callback) {
			var url = Instagram.utils.buildURL("users/self/media/liked");
			Instagram.utils.getJSONP(url, callback);
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
		var FOLLOW_ACTION = "follow",
			UNFOLLOW_ACTION = "unfollow",
			BLOCK_ACTION = "block",
			UNBLOCK_ACTION = "unblock",
			APPROVE_ACTION = "approve",
			DENY_ACTION = "deny";

		function follows(id, callback) {
			var url = Instagram.utils.buildURL("users/" + id + "/follows");
			Instagram.utils.getJSONP(url, callback);
		}

		function followedBy(id, callback) {
			var url = Instagram.utils.buildURL("users/" + id + "/followed-by");
			Instagram.utils.getJSONP(url, callback);
		}

		function requestedBy(callback) {
			var url = Instagram.utils.buildURL("users/self/requested-by");
			Instagram.utils.getJSONP(url, callback);
		}

		function getRelationship(id, callback) {
			var url = Instagram.utils.buildURL("users/" + id + "/relationship");
			Instagram.utils.getJSONP(url, callback);
		}

		function postRelationship(id, action, callback) {
			var url = me.config.curlScript + Instagram.utils.buildURL("users/" + id + "/relationship", Instagram.POST) + "&action=" + action;
			Instagram.utils.ajax(url, callback, Instagram.POST);
		}

		return{
			follows:follows,
			followedBy:followedBy,
			requestedBy:requestedBy,
			get:getRelationship,
			post:postRelationship,
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
			var url = Instagram.utils.buildURL("media/" + mediaID);
			Instagram.utils.getJSONP(url, callback);
		}

		function search(params, callback) {
			var url = Instagram.utils.buildURL("media/" + search) + (params.parameterize());
			Instagram.utils.getJSONP(url, callback);
		}

		function popular(callback) {
			var url = Instagram.utils.buildURL("media/popular");
			Instagram.utils.getJSONP(url, callback);
		}

		return{
			info:info,
			search:search,
			popular:popular
		};
	})();


	var comments = (function () {

		function getComments(mediaID, callback) {
			var url = Instagram.utils.buildURL("media/" + mediaID + "/comments");
			Instagram.utils.getJSONP(url, callback);
		}

		// for this to work, you must request permission from Instagram admins
		function postComment(mediaID, comment, callback) {
			var url = me.config.curlScript + Instagram.utils.buildURL("media/" + mediaID + "/comments", Instagram.POST) + "&text=" + comment;
			Instagram.utils.ajax(url, callback, Instagram.POST);
		}

		function removeComment(mediaID, commentID, callback) {
			var url = me.config.curlScript + Instagram.utils.buildURL("media/" + mediaID + "/comments/" + commentID, Instagram.DELETE);
			Instagram.utils.ajax(url, callback, Instagram.POST);
		}

		return{
			get:getComments,
			post:postComment,
			delete:removeComment
		};
	})();


	var likes = (function () {

		function getLikes(mediaID, callback) {
			var url = Instagram.utils.buildURL("media/" + mediaID + "/likes");
			Instagram.utils.getJSONP(url, callback);
		}

		function postLike(mediaID, callback) {
			var url = me.config.curlScript + Instagram.utils.buildURL("media/" + mediaID + "/likes", Instagram.POST);
			Instagram.utils.ajax(url, callback, Instagram.POST);
		}

		function remove(mediaID, callback) {
			var url = me.config.curlScript + Instagram.utils.buildURL("media/" + mediaID + "/likes", Instagram.DELETE);
			Instagram.utils.ajax(url, callback, Instagram.POST);
		}

		return{
			get:getLikes,
			post:postLike,
			delete:remove
		};
	})();


	var tag = (function () {

		function info(tag, callback) {
			var url = Instagram.utils.buildURL("tags/" + tag);
			Instagram.utils.getJSONP(url, callback);
		}

		/*
		 *	    @param params is an Instagram.parameters object
		 * 	    Takes min_id and max_id
		 */
		function recent(tag, params, callback) {
			var url = Instagram.utils.buildURL("tags/" + tag + "/media/recent") + params.parameterize();
			Instagram.utils.getJSONP(url, callback);
		}

		function search(tag, callback) {
			var url = Instagram.utils.buildURL("tags/" + tag) + "&q=" + tag;
			Instagram.utils.getJSONP(url, callback);
		}

		return{
			info:info,
			recent:recent,
			search:search
		};

	})();


	var location = (function () {

		function info(locationID, callback) {
			var url = Instagram.utils.buildURL("location/" + locationID);
			Instagram.utils.getJSONP(url, callback);
		}

		/*
		 *		@param params is an Instagram.parameters object
		 * 		takes min_id, max_id, min_timestamp, max_timestamp
		 */
		function recent(locationID, params, callback) {
			var url = Instagram.utils.buildURL("location/" + locationID + "/media/recent", Instagram.GET) + params.parameterize();
			Instagram.utils.getJSONP(url, callback);
		}

		/*
		 *		@param params is an Instagram.parameters object
		 * 	takes lat, lng, distance, foursquare_v2_id, foursquare_id
		 */
		function search(params, callback) {
			var url = Instagram.utils.buildURL("location/search") + params.parameterize();
			Instagram.utils.getJSONP(url, callback);
		}

		return{
			info:info,
			recent:recent,
			search:search
		};

	})();


	var geography = (function () {

		function recent(geoID, callback) {
			var url = Instagram.utils.buildURL("geographies/" + geoID + "/media/recent");
			Instagram.utils.getJSONP(url, callback);
		}

		return{recent:recent};
	})();

	var getUser = function () {
		return currUser;
	};

	var loggedIn = function () {
		return authCode != undefined || Instagram.accessToken.length > 3;
	};


	return{
		config:me.config,
		baseURL:Instagram.baseURL,
		clientID:me.config.clientID,
		redirectURI:me.config.redirectURI,
		authURL:authURL,
		accessToken:Instagram.accessToken,
		login:login,
		currentUser:getUser,
		loggedIn:loggedIn,
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
Instagram.SCOPE_BASIC = "basic";
Instagram.SCOPE_COMMENTS = "comments";
Instagram.SCOPE_RELATIONSHIPS = "relationships";
Instagram.SCOPE_LIKES = "likes";
Instagram.SCOPE_ALL = "basic+comments+relationships+likes";


/*
 *
 * 		utilities
 *
 */

Instagram.utils = {};

Instagram.utils.ajax = function (url, callback, method) {
	if (Instagram.debug) console.log("ajax", url);

	method = method || Instagram.GET;

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function (event) {

		if (event.target.readyState == 4) {
			callback(JSON.parse(event.target.response));
		}

	};

	xmlhttp.open(method, url, true);
	xmlhttp.send();
};

var __loadCount = 0;
Instagram.utils.getJSONP = function (url, callback) {

	var script = document.createElement("script");
//	script.type = "application/json";

	if (callback != undefined) url += "&callback=__loaded" + __loadCount;
	script.src = url;

	if (Instagram.debug) console.log("getJSONP", url);

	document.body.appendChild(script);

	if (callback != undefined) {
		window["__loaded" + __loadCount] = function (response) {
			callback(response);
		};
		__loadCount++;
	}

};

Instagram.utils.buildURL = function (endpoint, method) {
	if (method == undefined) return Instagram.baseURL + endpoint + "?access_token=" + Instagram.accessToken;
	else return '_method=' + method + '&url=' + Instagram.baseURL + endpoint + "?access_token=" + Instagram.accessToken;
};

// callback for login success
Instagram.onlogin = function () {
};


/*
 *		config objects
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
	this.parameterize = function () {
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
 *		config object to instantiate Instagram with
 */
Instagram.Config = function () {

	return {
		getAccessTokenURL:"./js/InstagramJS/getAccessToken.php",
		curlScript:"./js/InstagramJS/curl.php?",
		scope:[Instagram.SCOPE_BASIC],
		clientID:"",
		redirectURI:"",
		debug:false
	};

};


