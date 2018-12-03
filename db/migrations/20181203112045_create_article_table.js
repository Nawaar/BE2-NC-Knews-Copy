
exports.up = function (knex, Promise) {
  return knex.schema.createTable('articles', (articleTable) => {
    articleTable.increments('article_id').primary();
    articleTable.string('title');
    articleTable.text('body');
    articleTable.integer('votes').defaultTo(0);
    articleTable.string('topic').references('topics.slug');
    articleTable.integer('user_id').references('users.user_id');
    // const now = new Date();
    // const year = `${now.getFullYear()}`;
    // let month = `${now.getMonth() + 1}`;
    // let date = `${now.getDate()}`;
    // if (date.length === 1) { date = `0${date}`; }
    // if (month.length === 1) { month = `0${month}`; }
    // const psqlDate = `${year}-${month}-${date}`;
    // articleTable.date('created_at').defaultTo(new Date());
    articleTable.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('articles');
};
