function makeDemoButtons() {

	var user = [

		{
			'name':"user.userID",
			'function':instagram.user.userID,
			'parameters':['id']
		},
		{
			'name':"user.feed",
			'function':instagram.user.feed,
			'parameters':[]
		},
		{
			'name':"user.recent",
			'function':instagram.user.recent,
			'parameters':['id']
		},
		{
			'name':"user.search",
			'function':instagram.user.search,
			'parameters':['name']
		},
		{
			'name':"user.liked",
			'function':instagram.user.liked,
			'parameters':[]
		}

	];

	var relationship = [
		{
			'name':'relationship.follows',
			'function':instagram.relationship.follows,
			'parameters':['id']
		},{
			'name':'relationship.followedBy',
			'function':instagram.relationship.followedBy,
			'parameters':['id']
		},{
			'name':'relationship.requestedBy',
			'function':instagram.relationship.requestedBy,
			'parameters':[]
		},{
			'name':'relationship.get',
			'function':instagram.relationship.get,
			'parameters':['id']
		},{
			'name':'relationship.post',
			'function':instagram.relationship.post,
			'parameters':['id', 'action']
		}
	];

	var apiCategories = [user, relationship];
	var buttonBox = document.getElementById("buttons");

	// loop through all categories

	for (var icat = 0; icat < apiCategories.length; icat++) {

		var category = apiCategories[icat];

		var categoryDiv = document.createElement("div");
		categoryDiv.className = 'category';
		buttonBox.appendChild(categoryDiv);

		for (var iMethod = 0; iMethod < category.length; iMethod++) {

			var method = category[iMethod];
			var func = method.function;

			var methodDiv = document.createElement("div");
			methodDiv.className = "method";
			categoryDiv.appendChild(methodDiv);

			var button = document.createElement("button");
			button.innerHTML = method.name;
			methodDiv.appendChild(button);

			var fields = [];
			for (var a = 0; a < method.parameters.length; a++) {
				var arg = method.parameters[a];
				var field = document.createElement("input");
				field.type = 'text';
				field.title = field.placeholder = arg;

				methodDiv.appendChild(field);
				fields.push(field);

			}

			//click listener
			button.data = fields;
			button['data-f'] = func;
			button.addEventListener("click", function (e) {

				var args = [];
				var fields = e.target.data;
				for (var i = 0; i < fields.length; i++) {
					args.push(fields[i].value);
				}
				args.push(callback);

				e.target["data-f"].apply(null, args);
			});


		}

	}
}


function callback(response) {
	console.log(arguments.callee.name + "()", response);

	//TODO - show in output window
}