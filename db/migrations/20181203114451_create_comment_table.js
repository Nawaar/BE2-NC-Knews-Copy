
exports.up = function (knex, Promise) {
  return knex.schema.createTable('comments', (commentTable) => {
    commentTable.increments('comment_id').primary();
    commentTable.integer('user_id').references('users.user_id').onDelete('CASCADE');
    commentTable.integer('article_id').references('articles.article_id').onDelete('CASCADE');
    commentTable.integer('votes').defaultTo(0);
    commentTable.timestamp('created_at').defaultTo(knex.fn.now());
    commentTable.text('body');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('comments');
};
