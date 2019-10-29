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
    });
    describe('/users', () => {
        describe('/:username', () => {
            it('GET: 200 - returns the specified user object', () => {
                return request(app)
                .get('/api/users/butter_bridge')
                .expect(200)
                .then(({body: {user}}) => {
                    expect(user).to.have.keys(['username', 'avatar_url', 'name']);
                    expect(user.username).to.equal('butter_bridge');
                    expect(user.name).to.equal('jonny');
                    expect(user.avatar_url).to.equal('https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg');
                });
            });
            describe('ERRORS', () => {
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
                it('PATCH: 201 - returns the article with the votes updated', () => {
                    return request(app)
                    .patch('/api/articles/2')
                    .send({inc_votes: 100})
                    .expect(201)
                    .then(({body: {article}}) => {
                        expect(article).to.have.keys(['article_id', 'body', 'title', 'votes', 'created_at', 'topic', 'author']);
                        expect(article.article_id).to.equal(2);
                        expect(article.votes).to.equal(100);
                    });
                });
                describe('ERRORS', () => {
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
                    it('PATCH: 400 - returns an error msg explaining inc_votes must be on the body', () => {
                        return request(app)
                        .patch('/api/articles/2')
                        .send({not_inc_votes: 100})
                        .expect(400)
                        .then(({body: {msg}}) => {
                            expect(msg).to.equal('"inc_votes" must be included on the body in order to update "votes"');
                        });
                    });
                    it('PATCH: 400 - returns an error msg explaining inc_votes must be the only thing on the body', () => {
                        return request(app)
                        .patch('/api/articles/2')
                        .send({inc_votes: 100, not_inc_votes: 100})
                        .expect(400)
                        .then(({body: {msg}}) => {
                            expect(msg).to.equal('"inc_votes" must be the only item on the body in order to update "votes"');
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
});

