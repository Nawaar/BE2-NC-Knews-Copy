
exports.up = function (knex, Promise) {
  return knex.schema.createTable('articles', (articleTable) => {
    articleTable.increments('article_id').primary();
    articleTable.string('title');
    articleTable.text('body');
    articleTable.integer('votes').defaultTo(0);
    articleTable.string('topic').references('topics.slug').onDelete('CASCADE');
    articleTable.integer('user_id').references('users.user_id').onDelete('CASCADE');
    articleTable.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('articles');
};
