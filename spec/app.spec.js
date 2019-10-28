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
});

