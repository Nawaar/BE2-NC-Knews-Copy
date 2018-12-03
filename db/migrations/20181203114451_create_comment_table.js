
exports.up = function (knex, Promise) {
  return knex.schema.createTable('comments', (commentTable) => {
    commentTable.increments('comment_id').primary();
    commentTable.integer('user_id').references('users.user_id');
    commentTable.integer('article_id').references('articles.article_id');
    commentTable.integer('votes').defaultTo(0);
    // const now = new Date();
    // const year = `${now.getFullYear()}`;
    // let month = `${now.getMonth() + 1}`;
    // let date = `${now.getDate()}`;
    // if (date.length === 1) { date = `0${date}`; }
    // if (month.length === 1) { month = `0${month}`; }
    // const psqlDate = `${year}-${month}-${date}`;
    // commentTable.date('created_at').defaultTo(psqlDate);
    commentTable.timestamp('created_at').defaultTo(knex.fn.now());
    commentTable.text('body');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('comments');
};
