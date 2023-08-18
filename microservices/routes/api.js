'use strict';

let express = require('express');
let postsEndpoint = require('./posts');
let repoEndpoint = require('./repo/repo');
let checkoutEndpoint = require('./checkout');

let router = express.Router();

//---------------------------------------------------------------
// API Route specification
//---------------------------------------------------------------
router.use('/posts', postsEndpoint);
router.use('/repo', repoEndpoint);
router.use('/checkout', checkoutEndpoint);

//---------------------------------------------------------------
// Swagger API Specification - swagger-jsdoc
//---------------------------------------------------------------
let swaggerJSDoc = require('swagger-jsdoc');

let options = {
	swaggerDefinition: {
		info: {
			title: 'NodeJS Microservices - ExpressJS API',
			description: 'Boilerplate API for ExpressJS based microservices',
			version: '0.0.1',
			contact: {
				email: 'aadusarkodie1@gmail.com',
				name: 'Alexander Adu-Sarkodie'
			},
			license: {
				name: '@UWA (Use with acknowledgement)',
				url: ''
			}
		},
		schemes: [
			'http',
			'https'
		],
		basePath: '/api',
		tags: [{
			name: 'Posts',
			description: 'Get details of posts'
		}, {
			name: 'Repo',
			description: 'Get details about repositories'
		}, {
			name: 'Images',
			description: 'Get details about images'
		}],
		externalDocs: {
			description: 'More information',
			url: 'https://github.com/kukuu?tab=repositories'
		}
	},
	apis: ['routes/api.js', 'routes/posts.js', 'routes/repo/repo.js', 'routes/repo/images.js'],
};

let swaggerSpec = swaggerJSDoc(options);

//---------------------------------------------------------------
// Expose swagger.json at /api/swagger.json
//---------------------------------------------------------------
router.get('/swagger.json', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpec);
});

module.exports = router;
