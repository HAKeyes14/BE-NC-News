process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest');
const chai = require('chai');
const {expect} = require('chai');
const chaiSorted = require('chai-sorted');
const connection = require('../db/connection');
chai.use(chaiSorted);


describe('/api', () => {
    beforeEach(() => {
        return connection.seed.run();
    });
    after(() => connection.destroy());
    it('GET: 200 - returns a JSON describing all the available endpoints on the API', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body: {endpoints}}) => {
            expect(endpoints).to.eql(
                {
                    "GET /api": {
                    "description": "serves up a json representation of all the available endpoints of the api"
                    },
                    "GET /api/topics": {
                    "description": "serves an array of all topics",
                    "queries": [],
                    "exampleResponse": {
                        "topics": [{ "slug": "football", "description": "Footie!" }]
                    }
                    },
                    "GET /api/users/:username": {
                    "description": "serves the user with the username in the parameter",
                    "queries": [],
                    "exampleResponse": {
                        "topics": { "username": "aUsername", "avatar_url": "aURL", "name": "aName" }
                    }
                    },
                    "GET /api/articles": {
                    "description": "serves an array of all topics",
                    "queries": ["author", "topic", "sort_by", "order"],
                    "exampleResponse": {
                        "articles": [
                        {
                            "title": "Seafood substitutions are increasing",
                            "topic": "cooking",
                            "author": "weegembump",
                            "created_at": 1527695953341,
                            "votes": 0,
                            "comment_count": 4
                        }
                        ]
                    }
                    },
                    "GET /api/articles/:article_id": {
                    "description": "serves the article specified by the parameter",
                    "queries": [],
                    "exampleResponse": {
                        "article": {
                        "title": "Seafood substitutions are increasing",
                        "topic": "cooking",
                        "author": "weegembump",
                        "body": "Text from the article..",
                        "created_at": 1527695953341,
                        "votes": 0,
                        "comment_count": 3,
                        "article_id": 1
                        }
                    }
                    },
                    "PATCH /api/articles/:article_id": {
                    "description": "updates the votes of the article specified by the parameter by the amount specified in the body",
                    "queries": [],
                    "body": {"inc_votes": 5},
                    "exampleResponse": {
                        "article": {
                        "title": "Seafood substitutions are increasing",
                        "topic": "cooking",
                        "author": "weegembump",
                        "body": "Text from the article..",
                        "created_at": 1527695953341,
                        "votes": 5,
                        "article_id": 1
                        }
                    }
                    },
                    "POST /api/articles/:article_id/comments": {
                    "description": "adds the comment on the body to the comments table, with the article_id as specified by the parameter",
                    "queries": [],
                    "body": {"username": "aUsername", "body": "aBody"},
                    "exampleResponse": {
                        "comment": {
                        "comment_id": "cooking",
                        "author": "aUsername",
                        "body": "aBody",
                        "created_at": 1527695953341,
                        "votes": 5,
                        "article_id": 1
                        }
                    }
                    },
                    "GET /api/articles/:article_id/comments": {
                    "description": "serves an array of all comments with the article_id as specified by the parameter",
                    "queries": ["sort_by", "order"],
                    "exampleResponse": {
                        "comment": [{
                        "comment_id": "cooking",
                        "author": "aUsername",
                        "body": "aBody",
                        "created_at": 1527695953341,
                        "votes": 5,
                        "article_id": 1
                        }]
                    }
                    },
                    "PATCH /api/comments/:comment_id": {
                    "description": "updates the votes of the comment specified by the parameter by the amount specified on the body",
                    "queries": [],
                    "body": {"inc_votes": 5},
                    "exampleResponse": {
                        "comment": {
                        "comment_id": "cooking",
                        "author": "aUsername",
                        "body": "aBody",
                        "created_at": 1527695953341,
                        "votes": 10,
                        "article_id": 1
                        }
                    }
                    },
                    "DELETE /api/comments/:comment_id": {
                    "description": "deletes the comment specified by the parameter",
                    "queries": [],
                    "exampleResponse": {}
                    }
                }
            )
        });
    });
    describe('/topics', () => {
        it('GET: 200 - returns an array of all the topics', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body: {topics}}) => {
                expect(topics).to.have.lengthOf(3);
                topics.forEach(topic => {
                    expect(topic).to.have.keys(['slug', 'description']);
                });
            });
        });
        describe('ERRORS', () => {
            it('INVALID METHODS: 405', () => {
                const invalidMethods = ['patch', 'post', 'put', 'delete'];
                const methodPromises = invalidMethods.map((method) => {
                    return request(app)[method]('/api/topics')
                    .expect(405)
                    .then(({ body: { msg } }) => {
                        expect(msg).to.equal('method not allowed');
                    });
                });
                return Promise.all(methodPromises);
            });
        });
    });
    describe('/users', () => {
        describe('/:username', () => {
            it('GET: 200 - returns the specified user object', () => {
                return request(app)
                .get('/api/users/butter_bridge')
                .expect(200)
                .then(({body: {user}}) => {
                    expect(user).to.have.keys(['username', 'avatar_url', 'name', 'password']);
                    expect(user.username).to.equal('butter_bridge');
                    expect(user.name).to.equal('jonny');
                    expect(user.avatar_url).to.equal('https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg');
                });
            });
            describe('ERRORS', () => {
                it('INVALID METHODS: 405', () => {
                    const invalidMethods = ['patch', 'post', 'put', 'delete'];
                    const methodPromises = invalidMethods.map((method) => {
                        return request(app)[method]('/api/users/1')
                        .expect(405)
                        .then(({ body: { msg } }) => {
                            expect(msg).to.equal('method not allowed');
                        });
                    });
                    return Promise.all(methodPromises);
                });
                it('GET: 404 - returns an error message if the username is valid but does not exist', () => {
                    return request(app)
                    .get('/api/users/not-a-username')
                    .expect(404)
                    .then(({body: {msg}}) => {
                        expect(msg).to.equal('User with username: not-a-username does not exist.');
                    });
                });
                it('GET: 400 - returns an error message if the username is invalid', () => {
                    return request(app)
                    .get('/api/users/this-username-is-longer-than-twenty-characters')
                    .expect(400)
                    .then(({body: {msg}}) => {
                        expect(msg).to.equal('Username: this-username-is-longer-than-twenty-characters is not a valid username.');
                    });
                });
            });
        }); 
    });
    describe('/articles', () => {
        it('GET: 200 - returns an array of all articles and their comment counts', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body:{articles}}) => {
                articles.forEach(article => {
                    expect(article).to.have.keys(['article_id', 'title', 'votes', 'created_at', 'comment_count', 'topic', 'author']);
                });
            });
        });
        it('GET: 200 - returns an array of all articles and their comment counts sorted by descending date by default', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body:{articles}}) => {
                articles.forEach(article => {
                    expect(article).to.have.keys(['article_id', 'title', 'votes', 'created_at', 'comment_count', 'topic', 'author']);
                });
                expect(articles).to.be.descendingBy('created_at');
            });
        });
        it('GET: 200 - returns an array of all articles and their comment counts sorted as specified by the query', () => {
            return request(app)
            .get('/api/articles?sort_by=votes&order=asc')
            .expect(200)
            .then(({body:{articles}}) => {
                articles.forEach(article => {
                    expect(article).to.have.keys(['article_id', 'title', 'votes', 'created_at', 'comment_count', 'topic', 'author']);
                });
                expect(articles).to.be.ascendingBy('votes');
            });
        });
        it('GET: 200 - returns an array of all articles and their comment counts with the author specified by the query', () => {
            return request(app)
            .get('/api/articles?author=butter_bridge')
            .expect(200)
            .then(({body:{articles}}) => {
                articles.forEach(article => {
                    expect(article).to.have.keys(['article_id', 'title', 'votes', 'created_at', 'comment_count', 'topic', 'author']);
                    expect(article.author).to.equal('butter_bridge')
                });
                expect(articles).to.be.descendingBy('created_at');
            });
        });
        it('GET: 200 - returns an array of all articles and their comment counts with the topic specified by the query', () => {
            return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({body:{articles}}) => {
                articles.forEach(article => {
                    expect(article).to.have.keys(['article_id', 'title', 'votes', 'created_at', 'comment_count', 'topic', 'author']);
                    expect(article.topic).to.equal('mitch')
                });
                expect(articles).to.be.descendingBy('created_at');
            });
        });
        it('GET: 200 - takes a limit query which limits the number of results displayed', () => {
            return request(app)
            .get('/api/articles?limit=5')
            .expect(200)
            .then(({body:{articles}}) => {
                expect(articles).to.have.lengthOf(5);
                articles.forEach(article => {
                    expect(article).to.have.keys(['article_id', 'title', 'votes', 'created_at', 'comment_count', 'topic', 'author']);
                });
                expect(articles).to.be.descendingBy('created_at');
            });
        });
        it('GET: 200 - the limit defaults to 10', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body:{articles}}) => {
                expect(articles).to.have.lengthOf(10);
                articles.forEach(article => {
                    expect(article).to.have.keys(['article_id', 'title', 'votes', 'created_at', 'comment_count', 'topic', 'author']);
                });
                expect(articles).to.be.descendingBy('created_at');
            });
        });
        it('GET: 200 - takes a page query, p, which offsets the results', () => {
            return request(app)
            .get('/api/articles?sort_by=article_id&order=asc&limit=5&p=2')
            .expect(200)
            .then(({body:{articles}}) => {
                expect(articles).to.have.lengthOf(5);
                expect(articles[0].article_id).to.equal(6);
                expect(articles[4].article_id).to.equal(10);
                articles.forEach(article => {
                    expect(article).to.have.keys(['article_id', 'title', 'votes', 'created_at', 'comment_count', 'topic', 'author']);
                });
                expect(articles).to.be.ascendingBy('article_id');
            });
        });
        it('GET: 200 - p defaults to 1', () => {
            return request(app)
            .get('/api/articles?sort_by=article_id&order=asc&limit=5')
            .expect(200)
            .then(({body:{articles}}) => {
                expect(articles).to.have.lengthOf(5);
                expect(articles[0].article_id).to.equal(1);
                expect(articles[4].article_id).to.equal(5);
                articles.forEach(article => {
                    expect(article).to.have.keys(['article_id', 'title', 'votes', 'created_at', 'comment_count', 'topic', 'author']);
                });
                expect(articles).to.be.ascendingBy('article_id');
            });
        });
        it('GET: 200 - body contains a total_count with the total number of articles', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body:{articles ,total_count}}) => {
                expect(total_count).to.equal(12);
                expect(articles).to.have.lengthOf(10);
                articles.forEach(article => {
                    expect(article).to.have.keys(['article_id', 'title', 'votes', 'created_at', 'comment_count', 'topic', 'author']);
                });
            });
        });
        describe('ERRORS', () => {
            it('INVALID METHODS: 405', () => {
                const invalidMethods = ['patch', 'post', 'put', 'delete'];
                const methodPromises = invalidMethods.map((method) => {
                    return request(app)[method]('/api/articles')
                    .expect(405)
                    .then(({ body: { msg } }) => {
                        expect(msg).to.equal('method not allowed');
                    });
                });
                return Promise.all(methodPromises);
            });
            it('GET: 400 - returns an error msg explaining that sort_by column does not exist', () => {
                return request(app)
                .get('/api/articles?sort_by=not-a-column')
                .expect(400)
                .then(({body:{msg}}) => {
                    expect(msg).to.equal('column "not-a-column" does not exist');
                });
            });
            it('GET: 400 - returns an error msg explaining that order must be asc or desc', () => {
                return request(app)
                .get('/api/articles?order=invalid')
                .expect(400)
                .then(({body:{msg}}) => {
                    expect(msg).to.equal('Order: "invalid" is not allowed.');
                });
            });
            it('GET: 400 - returns an error msg explaining that author is not in the database', () => {
                return request(app)
                .get('/api/articles?author=not-an-author')
                .expect(404)
                .then(({body:{msg}}) => {
                    expect(msg).to.equal('Author: not-an-author does not exist.');
                });
            });
            it('GET: 400 - returns an error msg explaining that topic is not in the database', () => {
                return request(app)
                .get('/api/articles?topic=not-a-topic')
                .expect(404)
                .then(({body:{msg}}) => {
                    expect(msg).to.equal('Topic: not-a-topic does not exist.');
                });
            });
        });
        describe('/:article_id', () => {
            it('GET: 200 - returns the specified article and the comment count', () => {
                return request(app)
                    .get('/api/articles/1')
                    .expect(200)
                    .then(({body: {article}}) => {
                        expect(article).to.have.keys(['article_id', 'body', 'title', 'votes', 'created_at', 'comment_count', 'topic', 'author']);
                        expect(article.article_id).to.equal(1);
                        expect(article.votes).to.equal(100);
                        expect(article.topic).to.equal('mitch');
                        expect(article.body).to.equal('I find this existence challenging');
                        expect(article.author).to.equal('butter_bridge');
                        expect(article.created_at).to.equal('2018-11-15T12:21:54.171Z');
                        expect(article.title).to.equal('Living in the shadow of a great man');
                        expect(+article.comment_count).to.equal(13);
                    });
                });
                it('PATCH: 200 - returns the article with the votes updated', () => {
                    return request(app)
                    .patch('/api/articles/2')
                    .send({inc_votes: 100})
                    .expect(200)
                    .then(({body: {article}}) => {
                        expect(article).to.have.keys(['article_id', 'body', 'title', 'votes', 'created_at', 'topic', 'author']);
                        expect(article.article_id).to.equal(2);
                        expect(article.votes).to.equal(100);
                    });
                });
                it('PATCH: 200 - returns the unchanged article if inc_votes is not on the body', () => {
                    return request(app)
                    .patch('/api/articles/2')
                    .send({not_inc_votes: 100})
                    .expect(200)
                    .then(({body: {article}}) => {
                        expect(article).to.have.keys(['article_id', 'body', 'title', 'votes', 'created_at', 'topic', 'author']);
                        expect(article.article_id).to.equal(2);
                        expect(article.votes).to.equal(0);
                    });
                });
                it('DELETE: 204 - deletes the specified article', () => {
                    return request(app)
                    .delete('/api/articles/1')
                    .expect(204)
                });
                describe('ERRORS', () => {
                    it('INVALID METHODS: 405', () => {
                        const invalidMethods = ['post', 'put'];
                        const methodPromises = invalidMethods.map((method) => {
                            return request(app)[method]('/api/articles/1')
                            .expect(405)
                            .then(({ body: { msg } }) => {
                                expect(msg).to.equal('method not allowed');
                            });
                        });
                        return Promise.all(methodPromises);
                    });
                    it('GET: 400 - returns an error msg explaining the article_id is invalid', () => {
                        return request(app)
                        .get('/api/articles/hello')
                        .expect(400)
                        .then(({body: {msg}}) => {
                            expect(msg).to.equal('invalid input syntax for type integer: "hello"');
                        });
                    });
                    it('GET: 404 - returns an error msg explaining the article_id does not exist', () => {
                        return request(app)
                        .get('/api/articles/1000000')
                        .expect(404)
                        .then(({body: {msg}}) => {
                            expect(msg).to.equal('Article with article_id: 1000000 does not exist.');
                        });
                    });
                    it('PATCH: 400 - returns an error msg explaining inc_votes must be a number', () => {
                        return request(app)
                        .patch('/api/articles/2')
                        .send({inc_votes: 'not-a-number'})
                        .expect(400)
                        .then(({body: {msg}}) => {
                            expect(msg).to.equal('invalid input syntax for type integer: "NaN"');
                        });
                    });
                    it('PATCH: 404 - returns an error msg explaining the article_id does not exist', () => {
                        return request(app)
                        .patch('/api/articles/10000')
                        .send({inc_votes: 100})
                        .expect(404)
                        .then(({body: {msg}}) => {
                            expect(msg).to.equal('Article with article_id: 10000 does not exist.');
                        });
                    });
                    it('PATCH: 400 - returns an error msg explaining the article_id is invalid', () => {
                        return request(app)
                        .patch('/api/articles/not-a-number')
                        .send({inc_votes: 100})
                        .expect(400)
                        .then(({body: {msg}}) => {
                            expect(msg).to.equal('invalid input syntax for type integer: "not-a-number"');
                        });
                    });
                    it('DELETE: 404 - returns an error msg explaining the article_id does not exist', () => {
                        return request(app)
                        .delete('/api/articles/1000000')
                        .expect(404)
                        .then(({body: {msg}}) => {
                            expect(msg).to.equal('Article with article_id: 1000000 does not exist.')
                        })
                    });
                    it('DELETE: 400 - returns an error msg explaining the article_id is invalid', () => {
                        return request(app)
                        .delete('/api/articles/not-a-number')
                        .expect(400)
                        .then(({body: {msg}}) => {
                            expect(msg).to.equal('invalid input syntax for type integer: "not-a-number"')
                        })
                    });
                });
                describe('/comments', () => {
                    it('POST: 201 - returns the added comment', () => {
                        return request(app)
                        .post('/api/articles/1/comments')
                        .send({username: 'butter_bridge', body: 'hello, this is the body'})
                        .expect(201)
                        .then(({body: {comment}}) => {
                            expect(comment.body).to.equal('hello, this is the body');
                            expect(comment.author).to.equal('butter_bridge');
                            expect(comment.votes).to.equal(0);
                            expect(comment.article_id).to.equal(1);
                            expect(comment.comment_id).to.equal(19);
                            expect(comment).to.include.keys(['created_at']);
                        });
                    });
                    it('GET: 200 - returns an array of all comments for the specified article', () => {
                        return request(app)
                        .get('/api/articles/1/comments')
                        .expect(200)
                        .then(({body: {comments}}) => {
                            expect(comments).to.have.lengthOf(13);
                            comments.forEach(comment => {
                                expect(comment).to.have.keys(['body', 'author', 'votes', 'article_id', 'comment_id', 'created_at']);
                                expect(comment.article_id).to.equal(1);
                            });
                        });
                    });
                    it('GET: 200 - returns an array of all comments for the specified article sorted by descending and created at by default', () => {
                        return request(app)
                        .get('/api/articles/1/comments')
                        .expect(200)
                        .then(({body: {comments}}) => {
                            expect(comments).to.have.lengthOf(13);
                            comments.forEach(comment => {
                                expect(comment).to.have.keys(['body', 'author', 'votes', 'article_id', 'comment_id', 'created_at']);
                                expect(comment.article_id).to.equal(1);
                            });
                            expect(comments).to.be.descendingBy('created_at');
                        });
                    });
                    it('GET: 200 - returns an array of all comments for the specified article sorted as specified in the query', () => {
                        return request(app)
                        .get('/api/articles/1/comments?sort_by=comment_id&order=asc')
                        .expect(200)
                        .then(({body: {comments}}) => {
                            expect(comments).to.have.lengthOf(13);
                            comments.forEach(comment => {
                                expect(comment).to.have.keys(['body', 'author', 'votes', 'article_id', 'comment_id', 'created_at']);
                                expect(comment.article_id).to.equal(1);
                            });
                            expect(comments).to.be.ascendingBy('comment_id');
                        });
                    });
                    describe('ERRORS', () => {
                        it('INVALID METHODS: 405', () => {
                            const invalidMethods = ['delete', 'patch', 'put'];
                            const methodPromises = invalidMethods.map((method) => {
                                return request(app)[method]('/api/articles/1/comments')
                                .expect(405)
                                .then(({ body: { msg } }) => {
                                    expect(msg).to.equal('method not allowed');
                                });
                            });
                            return Promise.all(methodPromises);
                        });
                        it('POST: 400 - returns an error msg explaining the article_id is invalid', () => {
                            return request(app)
                            .post('/api/articles/not-a-number/comments')
                            .send({username: 'butter_bridge', body: 'hello, this is the body'})
                            .expect(400)
                            .then(({body: {msg}}) => {
                                expect(msg).to.equal('invalid input syntax for type integer: "not-a-number"');
                            });
                        });
                        it('POST: 404 - returns an error msg explaining the article_id does not exist', () => {
                            return request(app)
                            .post('/api/articles/100000/comments')
                            .send({username: 'butter_bridge', body: 'hello, this is the body'})
                            .expect(404)
                            .then(({body: {msg}}) => {
                                expect(msg).to.equal('insert or update on table "comments" violates foreign key constraint "comments_article_id_foreign"');
                            });
                        });
                        it('POST: 400 - returns an error msg explaining there is no body on the body', () => {
                            return request(app)
                            .post('/api/articles/1/comments')
                            .send({username: 'butter_bridge'})
                            .expect(400)
                            .then(({body: {msg}}) => {
                                expect(msg).to.equal('null value in column "body" violates not-null constraint');
                            });
                        });
                        it('POST: 400 - returns an error msg explaining there is no username on the body', () => {
                            return request(app)
                            .post('/api/articles/1/comments')
                            .send({body: 'this is the body'})
                            .expect(400)
                            .then(({body: {msg}}) => {
                                expect(msg).to.equal('null value in column "author" violates not-null constraint');
                            });
                        });
                        it('GET: 404 - returns an err msg if the article_id does not exist', () => {
                            return request(app)
                            .get('/api/articles/1000000/comments')
                            .expect(404)
                            .then(({body: {msg}}) => {
                                expect(msg).to.equal('Article with article_id: 1000000 does not exist.');
                            });
                        });
                        it('GET: 400 - returns an err msg if the article_id is invalid', () => {
                            return request(app)
                            .get('/api/articles/not-a-number/comments')
                            .expect(400)
                            .then(({body: {msg}}) => {
                                expect(msg).to.equal('invalid input syntax for type integer: "not-a-number"');
                            });
                        });
                        it('GET: 400 - returns an err msg if the sort_by column does not exist', () => {
                            return request(app)
                            .get('/api/articles/1/comments?sort_by=not-a-column')
                            .expect(400)
                            .then(({body: {msg}}) => {
                                expect(msg).to.equal('column "not-a-column" does not exist');
                            });
                        });
                        it('GET: 400 - returns an err msg if order is not asc or desc', () => {
                            return request(app)
                            .get('/api/articles/1/comments?order=invalid')
                            .expect(400)
                            .then(({body: {msg}}) => {
                                expect(msg).to.equal('Order: "invalid" is not allowed.');
                            });
                        });
                    });
                });
            });
        });
    describe('/comments', () => {
        describe('/:comment_id', () => {
            it('PATCH: 200 - returns a comment with the votes incremented by the amount on the body', () => {
                return request(app)
                .patch('/api/comments/1')
                .send({inc_votes: -1})
                .expect(200)
                .then(({body: {comment}}) => {
                    expect(comment.comment_id).to.equal(1);
                    expect(comment.votes).to.equal(15);
                });
            });
            it('PATCH: 200 - returns an unchanged comment if inc_votes is not on the body', () => {
                return request(app)
                .patch('/api/comments/1')
                .send({not_inc_votes: 20})
                .expect(200)
                .then(({body: {comment}}) => {
                    expect(comment.comment_id).to.equal(1);
                    expect(comment.votes).to.equal(16);
                });
            });
            it('DELETE: 204', () => {
                return request(app)
                .delete('/api/comments/1')
                .expect(204);
            });
            describe('ERRORS', () => {
                it('INVALID METHODS: 405', () => {
                    const invalidMethods = ['get', 'post', 'put'];
                    const methodPromises = invalidMethods.map((method) => {
                        return request(app)[method]('/api/comments/1')
                        .expect(405)
                        .then(({ body: { msg } }) => {
                            expect(msg).to.equal('method not allowed');
                        });
                    });
                    return Promise.all(methodPromises);
                });
                it('PATCH: 400 - returns an error msg explaining inc_votes must be a number', () => {
                    return request(app)
                    .patch('/api/comments/2')
                    .send({inc_votes: 'not-a-number'})
                    .expect(400)
                    .then(({body: {msg}}) => {
                        expect(msg).to.equal('invalid input syntax for type integer: "NaN"');
                    });
                });
                it('PATCH: 404 - returns an error msg explaining the comment_id does not exist', () => {
                    return request(app)
                    .patch('/api/comments/10000')
                    .send({inc_votes: 100})
                    .expect(404)
                    .then(({body: {msg}}) => {
                        expect(msg).to.equal('Comment with comment_id: 10000 does not exist.');
                    });
                });
                it('PATCH: 400 - returns an error msg explaining the comment_id is invalid', () => {
                    return request(app)
                    .patch('/api/comments/not-a-number')
                    .send({inc_votes: 100})
                    .expect(400)
                    .then(({body: {msg}}) => {
                        expect(msg).to.equal('invalid input syntax for type integer: "not-a-number"');
                    });
                });
                it('DELETE: 404 - returns an error msg explaining the comment_id does not exist', () => {
                    return request(app)
                    .delete('/api/comments/1000000')
                    .expect(404)
                    .then(({body: {msg}}) => {
                        expect(msg).to.equal('Comment with comment_id: 1000000 does not exist.')
                    })
                });
                it('DELETE: 400 - returns an error msg explaining the comment_id is invalid', () => {
                    return request(app)
                    .delete('/api/comments/not-a-number')
                    .expect(400)
                    .then(({body: {msg}}) => {
                        expect(msg).to.equal('invalid input syntax for type integer: "not-a-number"')
                    })
                });
            });
        });
    });
    describe('ERRORS', () => {
        it('INVALID METHODS: 405', () => {
            const invalidMethods = ['patch', 'post', 'put', 'delete'];
            const methodPromises = invalidMethods.map((method) => {
                return request(app)[method]('/api')
                .expect(405)
                .then(({ body: { msg } }) => {
                    expect(msg).to.equal('method not allowed');
                });
            });
            return Promise.all(methodPromises);
        });
        it('ROUTE NOT FOUND: 404 - returns an errer msg explaining the route was not found', () => {
            return request(app)
            .get('/api/rticles')
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).to.equal('Route "/api/rticles" not found');
            });
        });
    });
});

