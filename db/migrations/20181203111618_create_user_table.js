
exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', (userTable) => {
    userTable.increments('user_id').primary();
    userTable.string('username');
    userTable.string('avatar_url');
    userTable.string('name');
    userTable.string('password');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users');
};
