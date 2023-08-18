'use strict';

//Request-Promise-Native. This package is similar to request-promise but uses native ES6+ promises.
//Instead of using Bluebird promises this library uses native ES6+ promises.
var request = require('request-promise-native');

module.exports = {
	getAllPosts: function() {
		let options = {
			url: 'https://jsonplaceholder.typicode.com/posts'
			//replace
		}
		return request.get(options);
	},
	getPost: function(postId) {
		console.log('PostService::getPost()' + postId);
		let options = {
			url: 'https://jsonplaceholder.typicode.com/posts/' + postId
			//replace; see  node-test-off-site/stubs/users.json
			//node-test-off-site/stubs/user.json
		}
		return request.get(options);
	}
}
