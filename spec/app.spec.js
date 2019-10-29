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
                        expect(msg).to.equal('404 - User with username: not-a-username does not exist.');
                    });
                });
                it('GET: 400 - returns an error message if the username is invalid', () => {
                    return request(app)
                    .get('/api/users/this-username-is-longer-than-twenty-characters')
                    .expect(400)
                    .then(({body: {msg}}) => {
                        expect(msg).to.equal('400 - Username: this-username-is-longer-than-twenty-characters is not a valid username.');
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
                        expect(article.comment_count).to.equal(13);
                    });
                });
            });
        });
    });

