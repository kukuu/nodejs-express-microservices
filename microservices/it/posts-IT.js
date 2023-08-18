'use strict'

var express = require('express');
var request = require('supertest');//Integration tests
var service = require('../services/PostsService');
var helper = require('../spec/helpers/common');

describe('GET /posts', function() {
//API tests
    it('should return 200', function(done) {
        request(require('../app'))
            .get('/api/posts')
            .expect(200)
            .end(function(err, res) {
                helper.end(err, res, done);
            });
    });

    it('/post should return 200', function(done) {
        request(require('../app'))
            .get('/api/posts/post?postId=1')//return post by query sting
            .expect(200)
            .end(function(err, res) {
                helper.end(err, res, done);
            });
    });

    it('/:postId should return 200', function(done) {
        request(require('../app'))
            .get('/api/posts/5') //returning post by param
            .expect(200)
            .end(function(err, res) {
                helper.end(err, res, done);
            });
    });
})
