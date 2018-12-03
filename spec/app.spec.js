process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

const request = supertest(app);

describe('/api', () => {
  beforeEach(() => connection.migrate.rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));

  after(() => {
    connection.destroy();
  });

  describe('/topics', () => {
    const route = '/api/topics';
    it('GET - status 200 and responds with an array of topic objects - each object should have a slug and description property.', () => request
      .get(route)
      .expect(200)
      .then((res) => {
        expect(res.body.topics).to.have.length(2);
        expect(res.body.topics[0]).to.have.keys(['slug', 'description']);
      }));
    it('POST - status 201 and accepts an object containing slug and description property, the slug must be unique and responds with the posted topic object', () => {
      const topic = { description: 'Code is love, code is life', slug: 'coding' };
      return request
        .post(route)
        .send(topic)
        .expect(201)
        .then((res) => {
          expect(res.body.topic.description).to.equal(topic.description);
          expect(res.body.topic.slug).to.equal(topic.slug);
        });
    });
    describe('/:topic/articles', () => {
      it('GET - status 200 and responds with an array of article objects for a given topic', () => request
        .get(`${route}/mitch/articles`)
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.have.length(10);
          expect(res.body.articles[4]).to.have.keys(['author', 'title', 'article_id', 'votes', 'comment_count', 'created_at', 'topic']);
        }));
      it('GET - status 200 and responds with defaulted queries', () => request
        .get(`${route}/mitch/articles`)
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.have.length(10);
          expect(res.body.articles[4]).to.eql({
            author: 'icellusedkars',
            title: 'A',
            article_id: 6,
            votes: 0,
            created_at: '1998-11-20T12:21:54.171Z',
            topic: 'mitch',
            comment_count: '1',
          });
        }));
      // it('GET - status 200 and responds appropiately depending on queries', () => {
      //   return request
      //     .get(`${route}/mitch/articles?limit=3&sort_by=title&p=3&sort_ascending=true`)
      //     .then((res) => {
      //       expect(res.body.articles).to.have.length(3);
      //       expect(res.body.articles[1]).to.eql({

      //       });
      //     });
      // });
    });
  });
});
