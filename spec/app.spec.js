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
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(3);
          expect(body.articles[1]).to.eql({
            author: 'icellusedkars',
            title: 'Sony Vaio; or, The Laptop',
            article_id: 2,
            votes: 0,
            created_at: '2014-11-16T12:21:54.171Z',
            topic: 'mitch',
            comment_count: null,
          });
        }));
      it('GET - status 400 when something in query is not correct like sort_by in not column name', () => request
        .get(`${route}/mitch/articles?limit=100&sort_by=tle&p=3&sort_ascending=true`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('invalid input');
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
      it('POST - status 400 when input not in correct format', () => {
        const article = {
          jbhv: 'ljhkgcvhj',
        };
        return request
          .post(`${route}/cats/articles`)
          .send(article)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('invalid input');
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
  describe('/articles', () => {
    const articleURL = '/api/articles';
    it('GET - status 200 and responds with an array of article objects', () => request
      .get(articleURL)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(10);
        expect(body.articles[7]).to.have.all.keys(['author', 'title', 'article_id', 'votes', 'comment_count', 'created_at', 'topic']);
      }));
    it('GET - status 200 and responds with defaulted queries', () => request
      .get(articleURL)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(10);
        expect(body.articles[5]).to.eql({
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
      .get(`${articleURL}?limit=2&sort_by=body&p=2&sort_ascending=true`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(2);
        expect(body.articles[1]).to.eql({
          author: 'icellusedkars',
          title: 'A',
          article_id: 6,
          votes: 0,
          created_at: '1998-11-20T12:21:54.171Z',
          topic: 'mitch',
          comment_count: '1',
        });
      }));
    it('GET - status 400 when something in query is not correct like sort_by is not column name', () => request
      .get(`${articleURL}?limit=2&sort_by=bodkjbhky&p=2&sort_ascending=true`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.equal('invalid input');
      }));
    it('POST - status 405 when invalid method', () => request
      .post(articleURL)
      .expect(405)
      .then(({ body }) => {
        expect(body.msg).to.equal('invalid method');
      }));
    describe('/:article_id', () => {
      it('GET - status 200 and responds with an article object', () => request
        .get(`${articleURL}/1`)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.have.all.keys(['author', 'title', 'article_id', 'votes', 'comment_count', 'created_at', 'topic', 'body']);
          expect(body.article).to.eql({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2018-11-15T12:21:54.171Z',
            votes: 100,
            comment_count: '13',
          });
        }));
      it('GET - status 404 when article_id does not exist', () => request
        .get(`${articleURL}/98765`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('Page does not exist');
        }));
      it('GET - status 400 when article_id not in correct format', () => request
        .get(`${articleURL}/kjhvcgjk`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('invalid input syntax');
        }));
      it('PATCH - status 200 and accepts an object in form {inc_votes: newVote} and changes vote accordingly', () => {
        const insert = { inc_votes: -45 };
        return request
          .patch(`${articleURL}/1`)
          .send(insert)
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.eql({
              article_id: 1,
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              created_at: '2018-11-15T12:21:54.171Z',
              votes: 55,
              comment_count: '13',
            });
          });
      });
      it('PATCH - status 404 when article_id does not exist', () => {
        const insert = { inc_votes: 485 };
        return request
          .patch(`${articleURL}/108976`)
          .send(insert)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Page does not exist');
          });
      });
      it('PATCH - status 400 when article_id not in correct format', () => {
        const insert = { inc_votes: 485 };
        return request
          .patch(`${articleURL}/kjhvcgjk`)
          .send(insert)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('invalid input syntax');
          });
      });
      it('PATCH - status 400 when input not in correct format', () => {
        const insert = { intes: 485 };
        return request
          .patch(`${articleURL}/1`)
          .send(insert)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('invalid input');
          });
      });
      it('PATCH - status 400 when inc_votes is not of correct format', () => {
        const insert = { inc_votes: 'ghfkjh' };
        return request
          .patch(`${articleURL}/1`)
          .send(insert)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('invalid input syntax');
          });
      });
      it('DELETE - status 200 and should delete given article and respond with empty object', () => request
        .delete(`${articleURL}/1`)
        .expect(200)
        .then(({ body }) => {
          expect(body).to.eql({});
        }));
      it('DELETE - status 404 when article_id does not exist', () => request
        .delete(`${articleURL}/98765`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('Page does not exist');
        }));
      it('DELETE - status 400 when article_id not in correct format', () => request
        .delete(`${articleURL}/kjhvcgjk`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('invalid input syntax');
        }));
      it('POST - status 405 when invalid method', () => request
        .post(`${articleURL}/1`)
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal('invalid method');
        }));
      describe('/comments', () => {
        it('GET - status 200 and responds with an array of comments for given article_id', () => request
          .get(`${articleURL}/1/comments`)
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.have.length(10);
            expect(body.comments[2]).to.have.all.keys(['comment_id', 'votes', 'created_at', 'author', 'body']);
          }));
        it('GET - status 404 when article_id does not exist', () => request
          .get(`${articleURL}/198765/comments`)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Page does not exist');
          }));
        it('GET - status 400 when article_id not in correct format', () => request
          .get(`${articleURL}/ljkhgflj/comments`)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('invalid input syntax');
          }));
        it('GET - status 200 and responds with defaulted queries', () => request
          .get(`${articleURL}/1/comments`)
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.have.length(10);
            expect(body.comments[6]).to.eql({
              comment_id: 8,
              body: 'Delicious crackerbreads',
              author: 'icellusedkars',
              votes: 0,
              created_at: '2010-11-24T12:36:03.389Z',
            });
          }));
        it('GET - status 200 and responds appropiately depending on queries', () => request
          .get(`${articleURL}/1/comments?limit=1&sort_by=comment_id&p=4&sort_ascending=true`)
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.have.length(1);
            expect(body.comments[0]).to.eql({
              comment_id: 5,
              body: 'I hate streaming noses',
              author: 'icellusedkars',
              votes: 0,
              created_at: '2013-11-23T12:36:03.389Z',
            });
          }));
        it('GET - status 400 when something in query is not correct like sort_by in not column name', () => request
          .get(`${articleURL}/1/comments?limit=1&sort_by=cmentd&p=4&sort_ascending=true`)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('invalid input');
          }));
      });
    });
  });
});
