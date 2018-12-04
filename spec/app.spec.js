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

  it('GET - returns 404 if invalid URL', () => {
    const URL = '/api/rubbish';
    return request
      .get(URL)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal('Page not found');
      });
  });

  describe('/topics', () => {
    const route = '/api/topics';
    it('GET - status 200 and responds with an array of topic objects - each object should have a slug and description property.', () => request
      .get(route)
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).to.have.length(2);
        expect(body.topics[0]).to.have.all.keys(['slug', 'description']);
      }));
    it('POST - status 201 and accepts an object containing slug and description property, the slug must be unique and responds with the posted topic object', () => {
      const topic = { description: 'Code is love, code is life', slug: 'coding' };
      return request
        .post(route)
        .send(topic)
        .expect(201)
        .then(({ body }) => {
          expect(body.topic.description).to.equal(topic.description);
          expect(body.topic.slug).to.equal(topic.slug);
        });
    });
    it('POST - status 422 when slug is not unique and unique key violations occurs', () => {
      const topic = {
        description: 'Not dogs',
        slug: 'cats',
      };
      return request
        .post(route)
        .send(topic)
        .expect(422)
        .then(({ body }) => {
          expect(body.msg).to.equal('duplicate key value violates unique constraint');
        });
    });
    it('POST - status 400 when input in not in correct format', () => {
      const topic = {
        jhgfd: 'Not dogs',
        ljhkg: 'cats',
      };
      return request
        .post(route)
        .send(topic)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('invalid input');
        });
    });
    it('DELETE - status 405 when incorrect method request', () => {
      const topic = {
        description: 'Not dogs',
        slug: 'cats',
      };
      return request
        .delete(route)
        .send(topic)
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal('invalid method');
        });
    });
    describe('/:topic/articles', () => {
      it('GET - status 200 and responds with an array of article objects for a given topic', () => request
        .get(`${route}/mitch/articles`)
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(10);
          expect(body.articles[4]).to.have.all.keys(['author', 'title', 'article_id', 'votes', 'comment_count', 'created_at', 'topic']);
        }));
      it('GET - status 404 when topic does not exist', () => request
        .get(`${route}/cows/articles`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('Page does not exist');
        }));
      it('GET - status 200 and responds with defaulted queries', () => request
        .get(`${route}/mitch/articles`)
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(10);
          expect(body.articles[4]).to.eql({
            author: 'icellusedkars',
            title: 'A',
            article_id: 6,
            votes: 0,
            created_at: '1998-11-20T12:21:54.171Z',
            topic: 'mitch',
            comment_count: '1',
          });
        }));
      it('GET - status 200 and responds appropiately depending on queries', () => request
        .get(`${route}/mitch/articles?limit=3&sort_by=title&p=3&sort_ascending=true`)
        .then((res) => {
          expect(res.body.articles).to.have.length(3);
          expect(res.body.articles[1]).to.eql({
            author: 'icellusedkars',
            title: 'Sony Vaio; or, The Laptop',
            article_id: 2,
            votes: 0,
            created_at: '2014-11-16T12:21:54.171Z',
            topic: 'mitch',
            comment_count: null,
          });
        }));
      it('POST - status 201 and accepts an object containing a title , body and a user_id property and responds with the posted article', () => {
        const article = {
          title: 'Do cats eat?',
          body: 'Do you have a cat .... yayyyyyyy',
          user_id: 1,
        };
        return request
          .post(`${route}/cats/articles`)
          .send(article)
          .expect(201)
          .then(({ body }) => {
            expect(body.article).to.have.all.keys(['article_id', 'title', 'body', 'votes', 'topic', 'user_id', 'created_at']);
            expect(body.article.article_id).to.equal(13);
            expect(body.article.title).to.equal(article.title);
            expect(body.article.topic).to.equal('cats');
            expect(body.article.votes).to.equal(0);
          });
      });
      it('POST - status 404 when topic does not exist as violates foreign key constraint', () => {
        const article = {
          title: 'Do cats eat?',
          body: 'Do you have a cat .... yayyyyyyy',
          user_id: 1,
        };
        return request
          .post(`${route}/idontknow/articles`)
          .send(article)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Topic not found');
          });
      });
      it('POST - status 422 when user_id does not exist as violates foreign key constraint', () => {
        const article = {
          title: 'Do cats eat?',
          body: 'Do you have a cat .... yayyyyyyy',
          user_id: 10,
        };
        return request
          .post(`${route}/cats/articles`)
          .send(article)
          .expect(422)
          .then(({ body }) => {
            expect(body.msg).to.equal('violates foreign key constraint');
          });
      });
      it('POST - status 400 when user_id is not of correct format', () => {
        const article = {
          title: 'Do cats eat?',
          body: 'Do you have a cat .... yayyyyyyy',
          user_id: 'hello',
        };
        return request
          .post(`${route}/cats/articles`)
          .send(article)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('invalid input syntax');
          });
      });
      it('DELETE - status 405 when invalid method', () => {
        const article = {
          title: 'Do cats eat?',
          body: 'Do you have a cat .... yayyyyyyy',
          user_id: 'hello',
        };
        return request
          .delete(`${route}/cats/articles`)
          .send(article)
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('invalid method');
          });
      });
    });
  });
});
