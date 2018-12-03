
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
      const articleDataToInsert = articleData.map((dataObj) => {
        dataObj.user_id = usernameIdObject[dataObj.created_by];
        dataObj.created_at = new Date(dataObj.created_at);
        const {
          title, body, votes, topic, user_id, created_at,
        } = dataObj;
        return {
          title, body, votes, topic, user_id, created_at,
        };
      });
      return Promise.all([topicRows, userRows, usernameIdObject, knex('articles').insert(articleDataToInsert).returning('*')]);
    })
    .then(([topicRows, userRows, usernameIdObject, articleRows]) => {
      const articleTitleIdObject = articleNameWithId(articleRows);
      const commentDataToInsert = commentData.map((dataObj) => {
        dataObj.user_id = usernameIdObject[dataObj.created_by];
        dataObj.article_id = articleTitleIdObject[dataObj.belongs_to];
        dataObj.created_at = new Date(dataObj.created_at);
        const {
          body, votes, user_id, created_at, article_id,
        } = dataObj;
        return {
          body, votes, user_id, created_at, article_id,
        };
      });
      return Promise.all([topicRows, userRows, usernameIdObject, articleRows, articleTitleIdObject, knex('comments').insert(commentDataToInsert).returning('*')]);
    });
  // .then(([topicRows, userRows, usernameIdObject, articleRows,
  //  articleTitleIdObject, commentRows]) => {
  //   // console.log(topicRows);
  //   // console.log(userRows);
  //   // console.log(usernameIdObject);
  //   // console.log(articleRows);
  //   // console.log(articleTitleIdObject);
  //   // console.log(commentRows);
  // });
};
