
const {
  topicData, userData, articleData, commentData,
} = require('../data');

const {
  userameWithId, articleNameWithId,
} = require('../../utility/idData');

exports.seed = function (knex, Promise) {
  return Promise.all([knex('topics').del(), knex('users').del(), knex('articles').del(), knex('comments').del()])
    .then(() => knex('topics').insert(topicData).returning('*'))
    .then(topicRows => Promise.all([topicRows, knex('users').insert(userData).returning('*')]))
    .then(([topicRows, userRows]) => {
      const usernameIdObject = userameWithId(userRows);
      const articleDataToInsert = articleData.map(({ created_by, created_at, ...everythingElse }) => ({ ...everythingElse, user_id: usernameIdObject[created_by], created_at: new Date(created_at) }));
      return Promise.all([topicRows, userRows, usernameIdObject, knex('articles').insert(articleDataToInsert).returning('*')]);
    })
    .then(([topicRows, userRows, usernameIdObject, articleRows]) => {
      const articleTitleIdObject = articleNameWithId(articleRows);
      const commentDataToInsert = commentData.map(({
        created_by, belongs_to, created_at, ...everythingElse
      }) => ({
        ...everythingElse, user_id: usernameIdObject[created_by], article_id: articleTitleIdObject[belongs_to], created_at: new Date(created_at),
      }));
      return Promise.all([topicRows, userRows, usernameIdObject, articleRows, articleTitleIdObject, knex('comments').insert(commentDataToInsert).returning('*')]);
    });
  // .then(([topicRows, userRows, usernameIdObject, articleRows,
  //  articleTitleIdObject, commentRows]) => {});
};
